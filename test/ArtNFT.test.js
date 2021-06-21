const assert = require('assert');
const ArtNFT = artifacts.require('ArtNFT.sol');

contract('Token Deployment', async (accounts) => {
  const zero_address = '0x0000000000000000000000000000000000000000';
  let contract;

  beforeEach(async () => {
    contract = await ArtNFT.new();
  });

  describe('Token Deployment', () => {
    it('has correct name & token', async () => {
      const [expectedName, expectedToken] = ['CryptoArt', 'CART'];
      const tokenName = await contract.name();
      const tokenSymbol = await contract.symbol();
      assert.strictEqual(tokenName, expectedName, 'Token name not matching');
      assert.strictEqual(
        tokenSymbol,
        expectedToken,
        'Token symbol not matching',
      );
    });
  });

  describe('Token Minting', () => {
    it('can be minted', async () => {
      const tokenURI =
        'ipfs://ipfs.io/ipfs/bafybeieu5yrwl3agtl4tfinendjmpw4blsf4wps7g7knrwj22vr3xxagmy';
      const {logs} = await contract.createCollectible(tokenURI);
      const {from, to, tokenId} = logs[0].args;
      assert.strictEqual(
        logs[0].event,
        'Transfer',
        'Tansfer Event not invoked',
      );
      assert.strictEqual(from, zero_address, 'Origin must from zero address');
      assert.strictEqual(to, accounts[0]);
      assert.strictEqual(tokenId.toNumber(), 0, 'First token is zero');
    });
  });

  describe('List tokens owned by the user', async () => {
    const [user1] = accounts;
    it('gives returns empty array when no token onwned', async () => {
      const res = await contract.tokensOfOwner.call(user1);
      assert.strictEqual(res.length, 0, 'Empty array not returned');
    });

    it('gives the all token minted', async () => {
      const tokenURI = 'ipfs://ipfs.io/ipfs/bafybei....';

      await contract.createCollectible(tokenURI);
      let res = await contract.tokensOfOwner.call(user1);
      assert.strictEqual(res.length, 1, 'User holds one item');

      await contract.createCollectible(tokenURI);
      res = await contract.tokensOfOwner.call(user1);
      assert.strictEqual(res.length, 2, 'User holds two item');
    });
  });
});
