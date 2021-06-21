import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {useParams} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

const IsInValidId = (id: string) => isNaN(parseInt(id));

interface RouteParams {
  token_id: string;
}

function TokenDetail() {
  const [data, setData] = useState<MetaDataIndexed>();
  const [loading, setLoading] = useState(true);

  const context = useContext(Web3Context);
  let {token_id} = useParams<RouteParams>();

  useEffect(() => {
    if (IsInValidId(token_id)) return;

    (async () => {
      const _data = await context.nftContract?.methods
        .tokenURI(token_id)
        .call()
        .then((url: string) => axios.get(url))
        .then((r: any) => r.data)
        .then((r: any) => ({...r, token_id}));

      setData(_data);
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
        </div>
      )}
    </div>
  );
}

export default TokenDetail;
