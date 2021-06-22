import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {Link, useParams} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

const IsInValidId = (id: string) => isNaN(parseInt(id));

interface RouteParams {
  token_id: string;
}

function TokenDetail() {
  const [data, setData] = useState<MetaDataIndexed>();
  const [owner, setOwner] = useState('0x0');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const context = useContext(Web3Context);
  let {token_id} = useParams<RouteParams>();

  const isOwner = () => context.account === owner;
  const isForSale = () => sellingPrice > 0;

  useEffect(() => {
    if (IsInValidId(token_id)) return;
    // TODO: check if token exists

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
        .call();

      setData(_data);
      setOwner(_owner);
      setSellingPrice(_sellingPrice);
      setLoading(false);
    })();
  }, [token_id]);

  if (IsInValidId(token_id)) {
    return <h1>Token Id Not valid :(</h1>;
  }
  return (
    <div style={{textAlign: 'center'}}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Token Detail</h1>
          <img
            src={data?.image}
            alt={data?.name}
            style={{width: 150, height: 150}}
          />
          <div>Name: {data?.name}</div>
          <div>Token Id: {data?.token_id}</div>
          <div>Desc: {data?.description}</div>
          <div>Artist: {data?.properties.artist}</div>
          <h3>
            Owner:
            <br /> {owner} {owner === context.account ? '(mine)' : <></>}
          </h3>

          {!isOwner() && isForSale() ? <button>Buy It</button> : null}
          {isOwner() && !isForSale() ? <button>Place for sale</button> : null}
          {isOwner() && isForSale() ? <button>Remove from sale</button> : null}

          <br />
          <Link
            target="_blank"
            to={{
              pathname: `https://testnets.opensea.io/assets/${context.nftContractAddress}/${data?.token_id}`,
            }}>
            View On Open Sea
          </Link>
        </div>
      )}
    </div>
  );
}

export default TokenDetail;
