import {useState, useEffect} from 'react';
import axios from 'axios';
import Web3ContextType from '../types/web3context';
import {MetaDataIndexed} from '../utils/MetaData';

interface state {
  isLoading: boolean;
  metadata: MetaDataIndexed | null;
  sellingPrice: number;
  owner: string;
}

interface Param {
  token_id: string;
  context: Web3ContextType;
}

const Hooks = ({token_id, context}: Param): state => {
  const [state, setState] = useState<state>({
    isLoading: true,
    metadata: null,
    sellingPrice: 0,
    owner: '',
  });

  useEffect(() => {
    (async () => {
      const _data = await context.nftContract?.methods
        .tokenURI(token_id)
        .call()
        .then((url: string) => axios.get(url))
        .then((r: any) => r.data)
        .then((r: any) => ({...r, token_id}));

      const _owner = await context.nftContract?.methods
        .ownerOf(token_id)
        .call();

      const _sellingPrice = await context.tradeContract?.methods
        .tokensForSale(token_id)
        .call()
        .then(parseInt);

      setState({
        metadata: _data,
        owner: _owner,
        sellingPrice: _sellingPrice,
        isLoading: false,
      });
    })();
  }, [context]);

  const {metadata, sellingPrice, owner, isLoading} = state;
  return {metadata, sellingPrice, owner, isLoading};
};
export default Hooks;
