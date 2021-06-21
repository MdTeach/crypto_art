import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../../contexts/Web3Context';

function ExploreLayout() {
  const context = useContext(Web3Context);
  return (
    <div style={{textAlign: 'center'}}>
      <h1>Explore here</h1>
    </div>
  );
}

export default ExploreLayout;
