import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SharedContext from './SharedContext';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  root: {
    position: 'relative',
    zIndex: '2000 !important',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  contentInput: {
    width: '100%',
  },
}));
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {function} handleClose close the view
* @param {object} mailboxName pass to API
* @param {function} setMailboxName clear value
* @param {object} refresh refresh page
* @param {function} setRefresh refreshPage
*/
function postMailbox(handleClose, mailboxName,
    setMailboxName, refresh, setRefresh) {
  console.log('CallingAPI to make new mailbox');
  handleClose();
  axios.post('http://localhost:3010/v0/mail?mailbox='+
    mailboxName.toLowerCase(), {
    to: {name: '', email: ''},
    content: '',
    subject: 'This Mailbox is Empty',
  })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  setMailboxName('');
  setRefresh(!refresh);
}
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function ComposeView() {
  const {openMailboxMaker, setOpenMailboxMaker, refresh, setRefresh} =
    React.useContext(SharedContext);
  const [mailboxName, setMailboxName] =
  React.useState('');
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpenMailboxMaker(false);
  };
  const handleChange = (event) => {
    setMailboxName(event.target.value);
  };
  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={openMailboxMaker}
        onClose={handleClose}
        className={classes.root}
        fullWidth={true}
        maxWidth='sm'
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Add Mailbox
            </Typography>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='Make'
              onClick= {(event) => {
                postMailbox(handleClose, mailboxName,
                    setMailboxName, refresh, setRefresh);
              }}
            >
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <Typography>
              Name:
            </Typography>
            <TextField
              value={mailboxName}
              onChange={handleChange}
              className={classes.contentInput}
              InputProps={{disableUnderline: true}}
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
