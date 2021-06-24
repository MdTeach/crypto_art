import {Contract} from 'web3-eth-contract';

export interface TranferType {
  to: string;
  from: string;
  txn: string;
}

const getTransactionHistory = async (contract: Contract, tokenId: string) => {
  try {
    const datas = await contract.getPastEvents('Transfer', {
      filter: {tokenId: '0'},
      fromBlock: 0,
      toBlock: 'latest',
    });
    console.log(datas);

    const history: TranferType[] = datas.map((el) => ({
      from: el.returnValues[0],
      to: el.returnValues[1],
      txn: el.transactionHash,
    }));

    return [history, null];
  } catch (error) {
    return [null, error];
  }
};

export {getTransactionHistory};
