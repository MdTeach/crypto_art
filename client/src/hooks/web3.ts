import {useState, useEffect} from 'react';
import Web3 from 'web3';
import getWeb3 from '../web3/getWeb3';

type state = {
  isLoading: boolean;
  web3: Web3 | null;
  account: string;
};

const Hooks = (): state => {
  const [state, setState] = useState<state>({
    isLoading: true,
    web3: null,
    account: '',
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3: Web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setState({
          ...state,
          isLoading: false,
          web3,
          account: accounts[0],
        });
      } catch {
        setState({
          ...state,
          isLoading: false,
        });
      }
    })();
  }, [state]);

  const {isLoading, web3, account} = state;
  return {isLoading, web3, account};
};
export default Hooks;
