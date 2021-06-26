import {useState, useContext} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import Web3Context from '../../contexts/Web3Context';
import {uploadToIPFS, publishMetaData} from '../../utils/IpfsUtils';
import MetaDataType from '../../utils/MetaData';

import Loading from '../helpers/loading';
// Material UI imports
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import imageHolder from './empty_image.png';

const DATA_END_POINT = 'https://crypto-art-backend.herokuapp.com/';
// const DATA_END_POINT ='http://127.0.0.1:5000/'

interface ImageRes {
  image: string;
}

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  media: {
    width: 250,
    height: 200,
  },
});

function GenerateArtLayout() {
  const classes = useStyles();
  const context = useContext(Web3Context);
  const history = useHistory();

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [minting, setIsMinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchImage = async () => {
    setIsGenerating(true);
    const response = await axios.get(DATA_END_POINT);
    const imageData: ImageRes = response.data;
    setIsGenerating(false);
    setImage(imageData.image);
  };

  const getTokenId = (txn: any) => {
    try {
      return txn.events.CollectibleMinted.returnValues[0];
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const getTokenURI = async () => {
    // publish into the infura image
    const [imagePath, err] = await uploadToIPFS(image);
    if (err) {
      console.log(err.message);
      return;
    }

    // nft meta data
    const metaData: MetaDataType = {
      name,
      image: `https://ipfs.io/ipfs/${imagePath}`,
      properties: {
        artist: 'AI Model',
        inferenceTime: '10ms',
      },
    };
    console.log(metaData.image);

    const [nftPath, err1] = await publishMetaData(metaData);
    if (err1) {
      console.log(err1.message);
      return;
    }
    return nftPath;
  };

  const generateNFT = async () => {
    if (name.trim() === '' || image === '') {
      alert('Token must have name and image');
      return;
    }
    setIsMinting(true);
    const tokenURI = await getTokenURI();
    const txn = await context.nftContract?.methods
      .createCollectible(tokenURI)
      .send({
        from: context.account,
      })
      .catch((e: any) => {
        if (e.code === 4001) setIsMinting(false);
      });

    if (txn && txn.status) {
      const tokenId = getTokenId(txn);
      console.log(
        `https://testnets.opensea.io/assets/${context.nftContractAddress}/${tokenId}`,
      );
      console.log(`https://ipfs.io/ipfs/${tokenURI}`);
      // redirect
      history.push(`/detail/${tokenId}`);
    }
  };

  return (
    <>
      {minting ? <Loading /> : null}
      {isGenerating ? <Loading /> : null}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '2em',
        }}>
        <div style={{textAlign: 'center'}}>
          <CardContent>
            <Typography gutterBottom variant="h4" component="h4">
              <h1>Generate NFT</h1>
            </Typography>
          </CardContent>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={
                  image !== '' ? `data:image/jpeg;base64,${image}` : imageHolder
                }
                title="Image"
              />
            </CardActionArea>
            <CardContent>
              <TextField
                id="outlined-basic"
                label="Art Name"
                variant="outlined"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </CardContent>
            <CardActions>
              <Button size="large" color="primary" onClick={generateNFT}>
                Mint
              </Button>
              <Button size="large" color="secondary" onClick={fetchImage}>
                Get another one
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </>
  );
}

export default GenerateArtLayout;
