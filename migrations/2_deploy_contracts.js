const ArtNFT = artifacts.require('ArtNFT');

module.exports = function (deployer) {
  deployer.deploy(ArtNFT);
};
