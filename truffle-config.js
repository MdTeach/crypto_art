const path = require('path');
const {infura_endpoint, mnemonic} = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: path.join(
    __dirname,
    'client/src/contracts_deployed',
  ),
  networks: {
    development: {
      host: '127.0.0.1',
      port: '7545',
      network_id: '*',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura_endpoint),
      network_id: 4,
      gas: 8500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.8.0',
    },
  },
};
