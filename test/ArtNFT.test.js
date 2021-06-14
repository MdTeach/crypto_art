const assert = require('assert');
const ArtNFT = artifacts.require('ArtNFT.sol');

contract('Token Deployment', async (accounts) => {
  const zero_address = '0x0000000000000000000000000000000000000000';
  let contract;

  before(async () => {
    contract = await ArtNFT.deployed();
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
});
