import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {Link, useParams, useHistory} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

import useTokenInfo from '../../hooks/tokenInfo';

interface Props {
  token_id: string;
}

const SellLayout = ({token_id}: Props) => {
  const context = useContext(Web3Context);

  const {metadata, sellingPrice, owner, isLoading} = useTokenInfo({
    token_id,
    context,
  });

  if (isLoading) {
    console.log('Loading....');
  } else {
    console.log(metadata);
    console.log(owner);
  }
  return <div>{isLoading ? <h3>Loading...</h3> : <h1>Token for sale</h1>}</div>;
};

export default SellLayout;
