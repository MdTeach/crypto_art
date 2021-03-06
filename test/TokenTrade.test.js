const assert = require('assert');
const {expect} = require('chai');

const ArtNFT = artifacts.require('ArtNFT.sol');
const TradeNFT = artifacts.require('TradeNFT.sol');

const assertHelper = require('./utils/AssertHelper');

contract('NFT Token Trade', async (accounts) => {
  const ETHER = Math.pow(10, 18);
  const zero_address = '0x0000000000000000000000000000000000000000';
  const token_uri = 'ipfs://ipfs.io/ipfs/bafybeiy';

  let nftContract;
  let tradeContract;

  // helper function
  const nftMint = async (sender) => {
    const {logs} = await nftContract.createCollectible(token_uri, {
      from: sender,
    });
    tokenId = logs[0].args.tokenId.toNumber();
    return tokenId;
  };

  describe('Contract Deployment', () => {
    beforeEach(async () => {
      nftContract = await ArtNFT.new();
      tradeContract = await TradeNFT.new(nftContract.address);
    });

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

  describe('User can list the token for sale', async () => {
    beforeEach(async () => {
      nftContract = await ArtNFT.new();
      tradeContract = await TradeNFT.new(nftContract.address);
    });

    const [user1, seller] = accounts;

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
      assertHelper.ExpectRevert(async () => {
        await tradeContract.listForSale(token_id, selling_price, {
          from: user1,
        });
      });
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

    it('allows only owner to set token for sale', async () => {
      token_id = await nftMint(user1);
      selling_price = 0.0001 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId);

      // thows error when other user tries to listforsale
      try {
        await tradeContract.listForSale(token_id, selling_price, {
          from: seller,
        });
        assert.fail();
      } catch (err) {
        expect(err.message).to.match(
          /revert/,
          'Err:transaction was not reverted',
        );
      }

      // owner can safely list for sale
      await tradeContract.listForSale(token_id, selling_price, {
        from: user1,
      });
    });
  });

  describe('User can unlist the token from sale', async () => {
    const [seller, buyer] = accounts;

    beforeEach(async () => {
      nftContract = await ArtNFT.new();
      tradeContract = await TradeNFT.new(nftContract.address);
    });

    it('allows user to unlist from sale', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.001 * ETHER;

      // list for the sale
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // Unlist for sale
      await tradeContract.removeFromSale(tokenId, {from: seller});
      // after unilisting item is not for sale
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.getItemPrice(tokenId);
      });

      // can place sale again
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });
    });

    it('disallow user to unlist others token from sale', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.001 * ETHER;

      // list for the sale
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // canot list others tokens for sale
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.removeFromSale(tokenId, {from: buyer});
      });
    });
  });

  describe('User can buy the token listed for sale', async () => {
    beforeEach(async () => {
      nftContract = await ArtNFT.new();
      tradeContract = await TradeNFT.new(nftContract.address);
    });

    // seller mints and lists for sale
    // buyer purchases the token
    const [_, seller, buyer] = accounts;

    it('can buy item for sale', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.001 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      const seller_bal1 = await web3.eth.getBalance(seller);
      const buyer_bal1 = await web3.eth.getBalance(buyer);

      // buying nft transaction
      const {tx, receipt} = await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: selling_price,
      });

      // assert the balance of seller added
      let seller_bal2 = await web3.eth.getBalance(seller);
      assertHelper.AssertNearlyEqual(
        parseInt(seller_bal2),
        parseInt(seller_bal1) + selling_price,
      );

      // assert balance of receiver deducted
      const buyer_bal2 = await web3.eth.getBalance(buyer);
      const {gasUsed} = receipt;
      const {gasPrice} = await web3.eth.getTransaction(tx);
      const gasFee = gasUsed * gasPrice; //wei
      assertHelper.RemaningPriceAssert(
        buyer_bal1,
        buyer_bal2,
        selling_price,
        gasFee,
      );

      // check if ownership is transfered
      const newOwner = await nftContract.ownerOf(tokenId);
      assert.strictEqual(
        newOwner,
        buyer,
        'Err:ownership of token not transfered',
      );
    });

    it('can only buy existing token', async () => {
      const selling_price = 0.001 * ETHER;

      // canot buy unexisting nft
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.buyToken(0, {
          from: buyer,
          value: selling_price,
        });
      });

      const tokenId = await nftMint(seller);
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});

      // canot buy unlisted nft
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.buyToken(tokenId, {
          from: buyer,
          value: selling_price,
        });
      });
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // buying nft transaction
      await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: selling_price,
      });
    });

    it('can not buy NFT lower the listed price', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.002 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // can't buy at less
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.buyToken(tokenId, {
          from: buyer,
          value: selling_price / 2,
        });
      });

      // can buy at correct or higher
      await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: selling_price * 2,
      });
    });

    it('refunds the extra token back to the buyer', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.002 * ETHER;
      const sending_amt = 0.005 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // can buy at higher
      const buyer_bal1 = await web3.eth.getBalance(buyer).then(parseInt);
      const {tx, receipt} = await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: sending_amt,
      });

      const {gasUsed} = receipt;
      const {gasPrice} = await web3.eth.getTransaction(tx);
      const gasFee = gasUsed * gasPrice; //wei
      const buyer_bal2 = await web3.eth.getBalance(buyer).then(parseInt);

      const expected_remaning_bal = buyer_bal1 - selling_price - gasFee;
      assertHelper.AssertNearlyEqual(buyer_bal2, expected_remaning_bal);
    });

    it('logs the buy event', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.002 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // can buy at correct or higher
      const {logs} = await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: selling_price,
      });
      assert.strictEqual(logs.length, 1, 'Only one even shall be trigerred');
      assert.strictEqual('TokenSold', logs[0].event);
    });

    it('after selling the item is removed from sale', async () => {
      const tokenId = await nftMint(seller);
      const selling_price = 0.002 * ETHER;

      // approve the smart contract to sell NFT
      await nftContract.approve(tradeContract.address, tokenId, {from: seller});
      await tradeContract.listForSale(tokenId, selling_price, {
        from: seller,
      });

      // can buy at correct or higher
      txn = await tradeContract.buyToken(tokenId, {
        from: buyer,
        value: selling_price,
      });

      // after buying item is not for sale
      await assertHelper.ExpectRevert(async () => {
        await tradeContract.getItemPrice(tokenId);
      });
    });
  });
});
