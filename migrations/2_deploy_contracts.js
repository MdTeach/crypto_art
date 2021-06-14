const ArtNFT = artifacts.require('ArtNFT');
const TradeNFT = artifacts.require('TradeNFT');

module.exports = async function (deployer) {
  await deployer.deploy(ArtNFT);
  await deployer.deploy(TradeNFT, ArtNFT.address);
};
