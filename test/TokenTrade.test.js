const assert = require('assert');
const {expect} = require('chai');

const ArtNFT = artifacts.require('ArtNFT.sol');
const TradeNFT = artifacts.require('TradeNFT.sol');

contract('NFT Token Trade', async (accounts) => {
  const ETHER = Math.pow(10, 18);
  const zero_address = '0x0000000000000000000000000000000000000000';
  const token_uri =
    'ipfs://ipfs.io/ipfs/bafybeieu5yrwl3agtl4tfinendjmpw4blsf4wps7g7knrwj22vr3xxagmy';

  let nftContract;
  let tradeContract;

  before(async () => {
    nftContract = await ArtNFT.deployed();
    tradeContract = await TradeNFT.deployed(nftContract.address);
    // tradeContract = await TradeNFT.deployed();
  });

  // helper function
  const nftMint = async (sender) => {
    const {logs} = await nftContract.createCollectible(token_uri, {
      from: sender,
    });
    tokenId = logs[0].args.tokenId.toNumber();
    return tokenId;
  };

  describe.skip('Contract Deployment', () => {
    it('is deployed', async () => {
      assert.notStrictEqual(
        nftContract.address,
        zero_address,
        'nft contract address is zero',
      );
      assert.notStrictEqual(
        tradeContract.address,
        zero_address,
        'trade contractaddress is zero',
      );
    });
  });

  describe.skip('User can list the token for sale', async () => {
    const [user1, user2] = accounts;

    it('can list token for sale', async () => {
      token_id = await nftMint(user1);
      selling_price = 0.001 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId);

      let {logs} = await tradeContract.listForSale(token_id, selling_price, {
        from: user1,
      });
      assert.strictEqual(
        logs[0].event,
        'ListedForSale',
        'ListedForSale Event not invoked',
      );

      // correct price and token is set
      const receivedPrice = await tradeContract.getItemPrice(token_id);
      assert.strictEqual(
        receivedPrice.toNumber(),
        selling_price,
        'Correct price was not set',
      );
    });

    it('cannot list the item for 0', async () => {
      token_id = await nftMint(user1);
      selling_price = 0 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId);

      try {
        await tradeContract.listForSale(token_id, selling_price, {
          from: user1,
        });
        assert.fail();
      } catch (err) {
        console.log('err was\n\n', err);
        expect(err.message).to.match(
          /revert/,
          'Err:transaction was not reverted',
        );
      }
    });

    it('cannot list the item which is already listed', async () => {
      token_id = await nftMint(user1);
      selling_price = 0.001 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId);
      await tradeContract.listForSale(token_id, selling_price, {
        from: user1,
      });

      try {
        await tradeContract.listForSale(token_id, selling_price, {
          from: user1,
        });
        assert.fail();
      } catch (err) {
        expect(err.message).to.match(
          /revert/,
          'Err:transaction was not reverted',
        );
      }
    });
  });

  describe.skip('User can buy the token for sale', async () => {
    // user2 mints and lists for sale
    // user3 purchases the token
    const [user1, user2, user3] = accounts;

    it('can buy item for sale', async () => {
      const tokenId = await nftMint(user1);
      const selling_price = 0.001 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId);
      await tradeContract.listForSale(tokenId, selling_price, {
        from: user1,
      });

      const {logs} = await tradeContract.buyToken(tokenId, {
        from: user2,
        value: selling_price,
      });
      console.log('Txn log abishek\n\n', logs);

      // assert the balance of seller added
      const user1_bal2 = await web3.eth.getBalance(user1);
      console.log('user1_bal2', user1_bal2);
      // assert.strictEqual;
      // assert balance of receiver deducted

      // check if ownership is transfered
      const newOwner = await nftContract.ownerOf(tokenId);
      assert.strictEqual(
        newOwner,
        user2,
        'Err:ownership of token not transfered',
      );
      assert.fail('All good');
    });

    // it('can only buy existing token', async () => {});
    // it('canot buy item which is not for sale', async () => {});
    // it('conont buy the items with less than listed price', async () => {});
    // it('refunds the extra token back to the buyer', async () => {});
  });
});
