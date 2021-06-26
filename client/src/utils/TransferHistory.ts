import {Contract} from 'web3-eth-contract';

const zero_address = '0x0000000000000000000000000000000000000000';

export interface TranferType {
  to: string;
  from: string;
  txn: string;
}

const getTransactionHistory = async (contract: Contract, tokenId: string) => {
  try {
    const datas = await contract.getPastEvents('Transfer', {
      filter: {tokenId: tokenId},
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

const getTotalTokens = async (contract: Contract) => {
  try {
    const res = await contract.getPastEvents('Transfer', {
      filter: {from: zero_address},
      fromBlock: 0,
      toBlock: 'latest',
    });

    const datas = res.map((el) => el.returnValues.tokenId);
    return [datas, null];
  } catch (error) {
    return [null, error];
  }
};

export {getTransactionHistory, getTotalTokens};
