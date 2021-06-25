import {useContext} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';

import Web3Context from '../../contexts/Web3Context';
import useTokenInfo from '../../hooks/tokenInfo';
import {getTransactionHistory, TranferType} from '../../utils/TransferHistory';
import Loading from '../helpers/loading';

// Material UI imports
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        width: theme.spacing(16),
        height: theme.spacing(16),
      },
    },
  }),
);

const IsInValidId = (id: string) => isNaN(parseInt(id));
// const ETHER = Math.pow(10, 18);

interface RouteParams {
  token_id: string;
}

function TokenDetail() {
  const classes = useStyles();

  const history = useHistory();
  const context = useContext(Web3Context);
  const {token_id} = useParams<RouteParams>();

  const {metadata, sellingPrice, owner, isLoading} = useTokenInfo({
    token_id,
    context,
  });

  const [isBuying, setIsBuying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [transferHistory, setTransferHistory] = useState<TranferType[]>();
  const [loadingTransferHistory, setLoadingTransferHistory] = useState(true);

  const isOwner = () => context.account === owner;
  const isForSale = () => sellingPrice > 0;

  const handleBuy = async () => {
    setIsBuying(true);
    await context.tradeContract?.methods
      .buyToken(token_id)
      .send({from: context.account, value: sellingPrice})
      .catch(() => setIsBuying(false));

    if (isBuying) window.location.reload();
  };

  const handleSell = () => {
    history.push(`/sell/${token_id}`);
  };

  const handelCancelSell = async () => {
    setIsRemoving(true);

    await context.tradeContract?.methods
      .removeFromSale(token_id)
      .send({from: context.account})
      .catch(() => setIsRemoving(false));

    window.location.reload();
  };

  // get all the transaction
  useEffect(() => {
    (async () => {
      if (context.nftContract) {
        const [logs, err] = await getTransactionHistory(
          context.nftContract,
          token_id,
        );
        if (err) {
          console.log(err);
          return;
        }
        setTransferHistory(logs);
        setLoadingTransferHistory(false);
        console.log('Abishek', logs);
      }
    })();
  }, [context]);

  if (IsInValidId(token_id)) {
    return <h1>Token Id Not valid :(</h1>;
  }
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <h1
            style={{textAlign: 'left', marginTop: '1.5em', marginLeft: '10%'}}>
            Token INFO:
          </h1>
          <div
            style={{
              display: 'flex',
              padding: '2em 10%',
              textAlign: 'center',
            }}>
            <div
              style={{
                padding: '3em',
                marginRight: '40px',
                border: '2px solid #E5E8EB',
                borderRadius: '10px',
                flex: '1',
              }}>
              <img
                src={metadata?.image}
                alt={metadata?.name}
                style={{width: 150, height: 150}}
              />
            </div>
            <div
              style={{
                padding: '1.5em 3em',
                border: '2px solid #E5E8EB',
                borderRadius: '10px',
                textAlign: 'left',
                flex: 4,
              }}>
              <h2>{metadata?.name} Token</h2>
              <Typography style={{fontSize: '1.1em', marginBottom: '8px'}}>
                <AllInclusiveIcon
                  style={{color: '#2081E2', marginRight: '8px'}}
                />
                <Link
                  target="_blank"
                  to={{
                    pathname: `https://testnets.opensea.io/assets/${context.nftContractAddress}/${metadata?.token_id}`,
                  }}>
                  View on OpenSea
                </Link>
              </Typography>
              <Typography style={{fontSize: '1.1em'}}>
                <VerifiedUserIcon
                  style={{color: '#2081E2', marginRight: '8px'}}
                />
                <b>Owned by: </b>
                <Link
                  target="_blank"
                  to={{
                    pathname: `https://rinkeby.etherscan.io/address/${owner}`,
                  }}>
                  {owner === context.account ? 'me' : owner}
                </Link>
              </Typography>
              <hr />

              <div>
                <b>Token Id:</b> {metadata?.token_id}
              </div>
              <div>
                <b>Artist:</b> {metadata?.properties.artist}
              </div>

              <br />
              {!isOwner() && isForSale() ? (
                <Button variant="contained" color="primary" onClick={handleBuy}>
                  Buy For {sellingPrice} ETH
                </Button>
              ) : null}
              {isOwner() && !isForSale() ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSell}>
                  Place for sale
                </Button>
              ) : null}
              {isOwner() && isForSale() ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handelCancelSell}>
                  Remove from sale
                </Button>
              ) : null}

              <br />
              {isBuying ? <h3>Buying the token.....</h3> : null}
              {isRemoving ? <h3>Removing token from the sale.....</h3> : null}
            </div>
          </div>

          {loadingTransferHistory ? (
            <h3>Fetching transaction history</h3>
          ) : (
            <div>
              <h3
                style={{
                  textAlign: 'left',
                  marginTop: '1.5em',
                  marginLeft: '10%',
                }}>
                Transfer Histroy:
              </h3>
              <TableContainer
                style={{padding: '10px 15%', marginBottom: '3em'}}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableCell>Event</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Etherscan</TableCell>
                  </TableHead>
                  {transferHistory?.map((el, key) => (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography
                          style={{fontSize: '1.1em', marginBottom: '8px'}}>
                          <ImportExportIcon
                            style={{color: '#2081E2', marginRight: '8px'}}
                          />
                          Transfer
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Link
                          target="_blank"
                          to={{
                            pathname: `https://rinkeby.etherscan.io/address/${el.from}`,
                          }}>
                          {el.from}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          target="_blank"
                          to={{
                            pathname: `https://rinkeby.etherscan.io/address/${el.from}`,
                          }}>
                          {el.to}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Typography
                          style={{fontSize: '1.1em', marginBottom: '8px'}}>
                          <TransitEnterexitIcon
                            style={{color: '#2081E2', marginRight: '8px'}}
                          />
                          <Link
                            target="_blank"
                            to={{
                              pathname: `https://rinkeby.etherscan.io/tx/${el.txn}`,
                            }}>
                            check on Etherscan
                          </Link>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TokenDetail;
