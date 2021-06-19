import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';

interface Web3ContextType {
  web3?: Web3 | null;
  nftContract?: Contract | undefined;
  tradeContract?: Contract | undefined;
  account?: String | undefined;
}

export default Web3ContextType;
