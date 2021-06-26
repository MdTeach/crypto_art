import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import assert from 'assert';
import Web3Context from '../../contexts/Web3Context';
import {getTotalTokens} from '../../utils/TransferHistory';
import {MetaDataIndexed} from '../../utils/MetaData';
import {Link} from 'react-router-dom';
import Loading from '../helpers/loading';

import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CallMadeIcon from '@material-ui/icons/CallMade';
import InfoIcon from '@material-ui/icons/Info';
import {Fingerprint} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

type AllTokens = Array<number>;

function OwnedLayout() {
  const classes = useStyles();

  const [ownedTokens, setOwnedTokens] = useState<AllTokens>([]);
  const [data, setData] = useState<MetaDataIndexed[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const context = useContext(Web3Context);

  const loadMetaData = async (tokens: AllTokens) => {
    console.log('Abishek', tokens);

    try {
      const datas: MetaDataIndexed[] = await Promise.all(
        tokens.map((el) =>
          context.nftContract?.methods
            .tokenURI(el)
            .call()
            .then((url: string) => axios.get(url))
            .then((r: any) => r.data)
            .then((r: any) => ({...r, token_id: el})),
        ),
      );
      assert(datas.length > 0, 'Data empty');
      return [datas, null];
    } catch (err) {
      return [null, err];
    }
  };

  const getTokensIssued = async () => {
    if (context.nftContract) {
      const [data, err] = await getTotalTokens(context.nftContract);
      if (err) {
        console.log(err);
        return [];
      }
      return data;
    } else return [];
  };

  // get all tokens
  useEffect(() => {
    setIsFetching(true);
    (async () => {
      const tokens: AllTokens = await getTokensIssued();
      console.log('setting tokens', tokens);
      setOwnedTokens(tokens);
      setIsEmpty(tokens.length === 0);
    })();
  }, [context]);

  // get the meta data of tokens
  useEffect(() => {
    if (isEmpty) {
      setIsFetching(false);
      return;
    }
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
  }, [ownedTokens, isEmpty]);

  if (isFetching) {
    return <Loading />;
  }
  if (isEmpty) {
    return (
      <h1 style={{textAlign: 'center', marginTop: '2.5em', fontSize: '3em'}}>
        No Tokens were found :(
      </h1>
    );
  }
  return (
    <div style={{maxWidth: '95%', position: 'relative'}}>
      <h1 style={{textAlign: 'center', padding: '1em'}}>
        <u>All Tokens:</u>
      </h1>
      <Grid container className={classes.root} spacing={5}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={5}>
            {data.map((el) => (
              <Grid key={el.token_id} item>
                <div
                  style={{
                    textAlign: 'justify',
                    padding: '1em',
                    border: '2px solid #E5E8EB',
                    borderRadius: '10px',
                  }}>
                  <img
                    src={el.image}
                    alt={el.name}
                    style={{width: 150, height: 150, padding: '10px'}}
                  />
                  <Typography
                    style={{
                      fontSize: '1.1em',
                      marginBottom: '8px',
                      textAlign: 'center',
                    }}>
                    <InfoIcon style={{color: '#2081E2', marginRight: '8px'}} />
                    {el.name}
                  </Typography>
                  <Typography style={{fontSize: '1.1em', marginBottom: '8px'}}>
                    <Fingerprint
                      style={{color: '#2081E2', marginRight: '8px'}}
                    />
                    Token Id: {el.token_id}
                  </Typography>
                  <Typography style={{fontSize: '1.1em', marginBottom: '8px'}}>
                    <CallMadeIcon
                      style={{color: '#2081E2', marginRight: '8px'}}
                    />
                    <Link to={`/detail/${el.token_id}`}>View in detail</Link>
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default OwnedLayout;
