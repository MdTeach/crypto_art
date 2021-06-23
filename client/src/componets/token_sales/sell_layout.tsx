import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';
import {Link, useParams, useHistory} from 'react-router-dom';
import {MetaDataIndexed} from '../../utils/MetaData';

interface Props {
  token: string;
}

const SellLayout = ({token}: Props) => {
  return (
    <div>
      <h1>Sellling...</h1>
    </div>
  );
};

export default SellLayout;
