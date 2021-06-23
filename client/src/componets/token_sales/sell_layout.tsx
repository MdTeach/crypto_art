import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {Link, useParams, useHistory} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

import useTokenInfo from '../../hooks/tokenInfo';

interface Props {
  token_id: string;
}

const ETHER = Math.pow(10, 18);

const SellLayout = ({token_id}: Props) => {
  const [price, setPrice] = useState(0.001);
  const context = useContext(Web3Context);
  const history = useHistory();

  const {metadata, isLoading} = useTokenInfo({
    token_id,
    context,
  });

  const handleCancel = () => {
    history.push(`/detail/${token_id}`);
  };

  const handleSale = async () => {
    if (price === 0) {
      alert('Cannot sale for zeor price');
      return;
    }
    const valueWei = price * ETHER;
    var txn = await context.nftContract?.methods
      .approve(context.tradeContractAddress, token_id)
      .send({from: context.account});

    console.log(txn);

    var txn = await context.tradeContract?.methods
      .listForSale(token_id, valueWei)
      .send({from: context.account});

    console.log(txn);
    console.log('success');
  };

  if (isLoading) {
    console.log('Loading....');
  } else {
    console.log(metadata);
  }
  return (
    <div>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {/* <h4>Sell</h4>
          <ul>
            <li>Approve the contract to sale</li>
            <li>Place the token for sale</li>
          </ul> */}
          <div style={{display: 'flex', padding: '1em'}}>
            <img
              alt={metadata?.name}
              src={metadata?.image}
              style={{width: 70, height: 70}}
            />
            <p>Token Id: {metadata?.token_id}</p>
            <p>{metadata?.name}</p>
          </div>
          <input
            type="number"
            value={price}
            name="price"
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
          <label>Ether</label>
          <br />
          <br />
          <button onClick={handleSale}>List on sale</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default SellLayout;
