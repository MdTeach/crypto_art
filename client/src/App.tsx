import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Contract} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';

import useWeb3 from './hooks/web3';
import {getContractAddress} from './utils/ContractDeployHelper';
import ArtTokenContractJSON from './contracts_deployed/ArtNFT.json';
import TradeContractJSON from './contracts_deployed/TradeNFT.json';
import Web3Context from './contexts/Web3Context';

import Nav from './componets/nav/Navigation';
import GenerateLayout from './componets/GenerateArt';
import ExploreLayout from './componets/explore_layout/explore_layout';
import OwnedLayout from './componets/user_owned/user_owned';
import TokenDetail from './componets/token_details/token_details';

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

  if (isLoading || !isConfigured) {
    return <h1>Loading ..</h1>;
  }

  return (
    <BrowserRouter>
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
          <Nav />
          <Switch>
            <Route exact path="/">
              <OwnedLayout />
            </Route>
            <Route exact path="/create">
              <GenerateLayout />
            </Route>
            <Route exact path="/explore">
              <ExploreLayout />
            </Route>
            <Route path="/detail/:token_id">
              <TokenDetail />
            </Route>
          </Switch>
        </Web3Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
