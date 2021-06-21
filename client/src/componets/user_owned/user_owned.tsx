import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import assert from 'assert';
import Web3Context from '../../contexts/Web3Context';
import {MetaDataIndexed} from '../../utils/MetaData';
import {Link} from 'react-router-dom';

type UserTokens = Array<string>;

function OwnedLayout() {
  const [ownedTokens, setOwnedTokens] = useState<UserTokens>([]);
  const [data, setData] = useState<MetaDataIndexed[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  const context = useContext(Web3Context);

  const loadMetaData = async (tokens: UserTokens) => {
    try {
      const datas: MetaDataIndexed[] = await Promise.all(
        tokens.map((el, token_id) =>
          context.nftContract?.methods
            .tokenURI(el)
            .call()
            .then((url: string) => axios.get(url))
            .then((r: any) => r.data)
            .then((r: any) => ({...r, token_id})),
        ),
      );
      assert(datas.length > 0, 'Data empty');
      return [datas, null];
    } catch (err) {
      return [null, err];
    }
  };

  // get all tokens associated with account
  useEffect(() => {
    setIsFetching(true);
    (async () => {
      const tokens: UserTokens = await context.nftContract?.methods
        .tokensOfOwner(context.account)
        .call();
      setOwnedTokens(tokens);
      setIsEmpty(tokens.length === 0);
    })();
  }, [context]);

  // get the meta data of tokens
  useEffect(() => {
    if (isEmpty) return;
    (async () => {
      const [datas, err] = await loadMetaData(ownedTokens);
      if (err) {
        console.log(err);
        return;
      }
      setData(datas);
      console.log('Datas', data);
      setIsFetching(false);
    })();
    // console.log('Owned tokens changed', ownedTokens);
  }, [ownedTokens, isEmpty]);

  if (isEmpty) {
    return <h1>Empty</h1>;
  }
  if (isFetching) {
    return <h1>Fetching...</h1>;
  }
  return (
    <div style={{textAlign: 'center'}}>
      <h1>Your nfts</h1>
      {data.map((el) => (
        <div key={el.image}>
          <img src={el.image} alt={el.name} style={{width: 150, height: 150}} />
          <div>Name: {el.name}</div>
          <div>Token Id: {el.token_id}</div>
          <div>Desc: {el.description}</div>
          <div>Artist: {el.properties.artist}</div>
          <Link to={`/detail/${el.token_id}`}>View in detail</Link>
          <br />
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}

export default OwnedLayout;
