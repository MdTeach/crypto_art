import {useEffect, useState, useContext} from 'react';
import axios from 'axios';

import Web3Context from '../contexts/Web3Context';

import {uploadToIPFS, publishMetaData} from '../utils/IpfsUtils';
import MetaDataType from '../utils/MetaData';

interface ImageRes {
  image: string;
}

function GenerateArtLayout() {
  const {account} = useContext(Web3Context);

  const [image, setImage] = useState('');
  const [name, setName] = useState('Davinci');
  const [description, setDesc] = useState('Description');

  const fetchImage = async () => {
    const response = await axios.get('http://127.0.0.1:5000/');
    const imageData: ImageRes = response.data;
    setImage(imageData.image);
  };

  const generateNFT = async () => {
    console.log('generating for', account);

    // publish into the infura image
    const [imagePath, err] = await uploadToIPFS(image);
    if (err) {
      console.log(err.message);
      return;
    }

    // nft meta data
    const metaData: MetaDataType = {
      name,
      description,
      image: imagePath,
      properties: {
        artist: 'Davinci',
        inferenceTime: '10ms',
      },
    };

    const [nftPath, err1] = await publishMetaData(metaData);
    if (err1) {
      console.log(err1.message);
      return;
    }

    console.log(nftPath);

    // mint from the contract
  };

  // useEffect(() => {
  //   console.log('Effect call');
  //   fetchImage();
  // }, []);

  return (
    <div style={{textAlign: 'center'}}>
      <h2>Crypto Art</h2>
      {image !== '' ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="generator"
          style={{width: '175px', height: '175px'}}
        />
      ) : null}
      <br />
      <button onClick={fetchImage}>Generate Another</button>
      <br />
      <br />
      <button onClick={generateNFT}>Publish NFT</button>
    </div>
  );
}

export default GenerateArtLayout;
