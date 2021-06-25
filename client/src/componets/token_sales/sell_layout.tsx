import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Web3Context from '../../contexts/Web3Context';
import useTokenInfo from '../../hooks/tokenInfo';

import Loading from '../helpers/loading';
interface Props {
  token_id: string;
}

const ETHER = Math.pow(10, 18);

const SellLayout = ({token_id}: Props) => {
  const [sellStatus, setSellStatus] = useState(false);
  const [sellMsg, setSellMsg] = useState('');

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

    setSellMsg('Allow the contract to auto sell the Token on behalf of you');
    setSellStatus(true);

    const valueWei = price * ETHER;
    var txn = await context.nftContract?.methods
      .approve(context.tradeContractAddress, token_id)
      .send({from: context.account});

    console.log(txn);
    setSellMsg('Confirm listing with the price');

    var txn = await context.tradeContract?.methods
      .listForSale(token_id, valueWei)
      .send({from: context.account});

    console.log(txn);
    console.log('success');

    // redirect to the token detials
    history.push(`/detail/${token_id}`);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
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

          {sellStatus ? (
            <>
              <h3>Listing for sale....</h3>
              <h5>{sellMsg}</h5>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SellLayout;
