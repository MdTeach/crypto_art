const assert = require('assert');
const ArtNFT = artifacts.require('ArtNFT.sol');

contract('Token Deployment', async (accounts) => {
  let contract;

  before(async () => {
    contract = await ArtNFT.deployed();
  });

  it('Token Deployment', async () => {
    const [expectedName, expectedToken] = ['CryptoArt', 'CART'];
    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    assert.strictEqual(tokenName, expectedName, 'Token name not matching');
    assert.strictEqual(tokenSymbol, expectedToken, 'Token symbol not matching');
  });
});
