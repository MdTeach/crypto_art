import {useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Web3Context from '../../contexts/Web3Context';
import useTokenInfo from '../../hooks/tokenInfo';
import Loading from '../helpers/loading';

// Material UI imports
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// import imageHolder from './empty_image.png';

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  media: {
    width: 250,
    height: 200,
  },
});

interface Props {
  token_id: string;
}

const ETHER = Math.pow(10, 18);

const SellLayout = ({token_id}: Props) => {
  const classes = useStyles();

  const [sellStatus, setSellStatus] = useState(false);
  const [sellMsg, setSellMsg] = useState('');

  const [price, setPrice] = useState(0.001);
  const context = useContext(Web3Context);
  const history = useHistory();

  const [open, setOpen] = useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const {metadata, isLoading} = useTokenInfo({
    token_id,
    context,
  });

  const handleCancel = () => {
    history.push(`/detail/${token_id}`);
  };

  const handleSale = async () => {
    if (isNaN(price) || price === 0) {
      alert('Invalid price range');
      return;
    }

    // show loading status
    setSellStatus(true);

    // approve to Token
    try {
      await context.nftContract?.methods
        .approve(context.tradeContractAddress, token_id)
        .send({from: context.account});
      setSellMsg('Contract allowed to auto sell the Token');
      setOpen(true);
    } catch (error) {
      setSellStatus(false);
      return;
    }

    // list token for sale
    const weiAMT = (price * ETHER).toString();
    try {
      await context.tradeContract?.methods
        .listForSale(token_id, weiAMT)
        .send({from: context.account});
    } catch (error) {
      console.log(error);
      setSellStatus(false);
      return;
    }
    setSellMsg('Token listed for sale, reidrecting...');
    setOpen(true);
    // redirect to the token detials
    setTimeout(() => {
      history.push(`/detail/${token_id}`);
    }, 2000);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              {sellMsg}
            </Alert>
          </Snackbar>

          {sellStatus ? (
            <>
              <Loading />
            </>
          ) : null}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '2em',
            }}>
            <div style={{textAlign: 'center'}}>
              <CardContent>
                <Typography gutterBottom variant="h4" component="h4">
                  <h1>List for Sale</h1>
                </Typography>
              </CardContent>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={metadata?.image}
                    title="Image"
                  />
                </CardActionArea>
                <CardContent>
                  <TextField
                    id="outlined-basic"
                    label="Price (Ether)"
                    variant="outlined"
                    name="price"
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                </CardContent>
                <CardActions>
                  <Button size="large" color="primary" onClick={handleSale}>
                    Confirm Sell
                  </Button>
                  <Button size="large" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </CardActions>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SellLayout;
