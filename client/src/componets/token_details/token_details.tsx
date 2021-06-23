import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {Link, useParams, useHistory} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

import useTokenInfo from '../../hooks/tokenInfo';

const IsInValidId = (id: string) => isNaN(parseInt(id));

interface RouteParams {
  token_id: string;
}

function TokenDetail() {
  const history = useHistory();
  const context = useContext(Web3Context);
  const {token_id} = useParams<RouteParams>();

  const {metadata, sellingPrice, owner, isLoading} = useTokenInfo({
    token_id,
    context,
  });

  const isOwner = () => context.account === owner;
  const isForSale = () => sellingPrice > 0;

  const handleBuy = async () => {};

  const handleSell = () => {
    history.push(`/sell/${token_id}`);
  };
  const handelCancelSell = async () => {};

  if (IsInValidId(token_id)) {
    return <h1>Token Id Not valid :(</h1>;
  }
  return (
    <div style={{textAlign: 'center'}}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Token Detail</h1>
          <img
            src={metadata?.image}
            alt={metadata?.name}
            style={{width: 150, height: 150}}
          />
          <div>Name: {metadata?.name}</div>
          <div>Token Id: {metadata?.token_id}</div>
          <div>Desc: {metadata?.description}</div>
          <div>Artist: {metadata?.properties.artist}</div>
          <h3>
            Owner:
            <br /> {owner} {owner === context.account ? '(mine)' : <></>}
          </h3>

          {!isOwner() && isForSale() ? <button>Buy It</button> : null}
          {isOwner() && !isForSale() ? (
            <button onClick={handleSell}>Place for sale</button>
          ) : null}
          {isOwner() && isForSale() ? <button>Remove from sale</button> : null}

          <br />
          <Link
            target="_blank"
            to={{
              pathname: `https://testnets.opensea.io/assets/${context.nftContractAddress}/${metadata?.token_id}`,
            }}>
            View On Open Sea
          </Link>
        </div>
      )}
    </div>
  );
}

export default TokenDetail;
