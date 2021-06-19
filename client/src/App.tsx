import {useEffect, useState, createContext} from 'react';
import useWeb3 from './hooks/web3';

import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';

import GenerateLayout from './componets/GenerateArt';

import {getContractAddress} from './utils/ContractDeployHelper';
import ArtTokenContractJSON from './contracts_deployed/ArtNFT.json';
import TradeContractJSON from './contracts_deployed/TradeNFT.json';
import Web3Context from './contexts/Web3Context';

function App() {
  const {isLoading, web3, account} = useWeb3();
  const [nftContract, setNftContract] = useState<Contract>();
  const [nftContractAddress, setNftContractAddress] = useState('');
  const [tradeContract, setTradeContract] = useState<Contract>();
  const [tradeContractAddress, setTradeContractAddress] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    (async () => {
      if (web3 !== null) {
        const _networkId = await web3.eth.net.getId().then((e) => e.toString());
        const art_nft_abi = ArtTokenContractJSON.abi as AbiItem[];
        const art_nft_address = getContractAddress(
          ArtTokenContractJSON,
          _networkId,
        );
        const art_nft_contract_instance = new web3.eth.Contract(
          art_nft_abi,
          art_nft_address,
        );

        const trade_nft_abi = TradeContractJSON.abi as AbiItem[];
        const trade_nft_address = getContractAddress(
          TradeContractJSON,
          _networkId,
        );
        const trade_nft_contract_instance = new web3.eth.Contract(
          trade_nft_abi,
          trade_nft_address,
        );

        setNftContract(art_nft_contract_instance);
        setNftContractAddress(art_nft_address);
        setTradeContract(trade_nft_contract_instance);
        setTradeContractAddress(trade_nft_address);
        setIsConfigured(true);
      }
    })();
  }, [web3]);

  if (isLoading && !isConfigured) {
    return <h1>Loading ..</h1>;
  }

  return (
    <div className="App">
      <Web3Context.Provider
        value={{
          web3,
          nftContract,
          tradeContract,
          account,
          nftContractAddress,
          tradeContractAddress,
        }}>
        <GenerateLayout />
      </Web3Context.Provider>

      {/* <button
        onClick={() => {
          console.log('nid:', networkId);
        }}>
        TIme Pass
      </button> */}
    </div>
  );
}

export default App;
