import {useEffect, useState, useContext} from 'react';

import Web3Context from '../../contexts/Web3Context';
import {useParams, Redirect} from 'react-router-dom';
import SellLayout from './sell_layout';

interface RouteParams {
  token_id: string;
}

function TokenDetail() {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [hasErr, setHasErr] = useState(false);

  const context = useContext(Web3Context);
  let {token_id} = useParams<RouteParams>();

  useEffect(() => {
    (async () => {
      const _owner = await context.nftContract?.methods
        .ownerOf(token_id)
        .call()
        .catch((err: any) => {
          console.log(err);
          setHasErr(true);
        });

      const _sellingPrice = await context.tradeContract?.methods
        .tokensForSale(token_id)
        .call()
        .then(parseInt)
        .catch((err: any) => {
          console.log(err);
          setHasErr(true);
        });

      setIsValid(_owner === context.account && _sellingPrice === 0);
      setLoading(false);

      console.log('done');
    })();
  }, [token_id, context]);

  return (
    <>
      {loading ? (
        <p>redirecting</p>
      ) : (
        <>
          {!isValid || hasErr ? (
            <Redirect to="/" />
          ) : (
            <SellLayout token_id={token_id} />
          )}
        </>
      )}
    </>
  );
}
export default TokenDetail;
