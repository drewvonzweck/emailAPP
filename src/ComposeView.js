import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SharedContext from './SharedContext';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
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
* @param {object} name set the name of the body
* @param {object} to set the email address of the body
* @param {object} subject set the subjec of the body
* @param {string} content set the content of the body
* @param {function} handleClose close the view
* @param {function} setContent close the view
* @param {function} setSubject close the view
* @param {function} setTo close the view
* @param {function} setName close the view
*/
function postEmail(name, to, subject, content, handleClose,
    setContent, setSubject, setTo, setName) {
  console.log('CallingAPI to send email');
  handleClose();
  axios.post('http://localhost:3010/v0/mail', {
    to: {name: name, email: to},
    content: content,
    subject: subject,
  })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  setContent('');
  setSubject('');
  setTo('');
  setName('');
}
// const Transition = React.forwardRef(function Transition(props, ref) {
//  return <Slide direction="up" ref={ref} {...props} />;
// });
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function ComposeView() {
  const {open, setOpen, to, setTo, subject, setSubject,
    name, setName} =
    React.useContext(SharedContext);
  const [content, setContent] =
  React.useState('');
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpen(false);
    setContent('');
    setSubject('');
    setTo('');
    setName('');
  };
  const handleChange = (event) => {
    setContent(event.target.value);
  };
  const handleChangeS = (event) => {
    setSubject(event.target.value);
  };
  const handleChangeT = (event) => {
    setTo(event.target.value);
  };
  const handleChangeN = (event) => {
    setName(event.target.value);
  };
  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={open}
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
              Compose
            </Typography>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='send'
              onClick= {(event) => {
                postEmail(name, to, subject, content,
                    handleClose, setContent, setSubject, setTo, setName);
              }}
            >
              <SendIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <Typography>
              To:
            </Typography>
            <TextField
              value={to}
              onChange={handleChangeT}
              className={classes.contentInput}
              InputProps={{disableUnderline: true}}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <Typography>
              Name:
            </Typography>
            <TextField
              value={name}
              onChange={handleChangeN}
              className={classes.contentInput}
              InputProps={{disableUnderline: true}}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <Typography>
              Subject:
            </Typography>
            <TextField
              value={subject}
              onChange={handleChangeS}
              className={classes.contentInput}
              InputProps={{disableUnderline: true}}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <TextField
              multiline
              value={content}
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
