import React from 'react';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import Slide from '@material-ui/core/Slide';
import SharedContext from './SharedContext';
import StarIcon from '@material-ui/icons/Star';
import Avatar from '@material-ui/core/Avatar';
import {deepPurple} from '@material-ui/core/colors';
import ReplyIcon from '@material-ui/icons/Reply';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  button: {
    fontSize: '15px',
    pointerEvents: 'none',
    width: '85px',
    height: '35px',
    marginLeft: '20px',
    borderStyle: 'none',
  },
  from: {
    display: 'block',
    marginLeft: '10px',
  },
  reply: {
    fontSize: '35px',
    marginLeft: '35px',
  },
  toShow: {
    marginLeft: '25px',
    fontSize: '15px',
  },
  p: {
    margin: 0,
    fontSize: '15px',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
    marginLeft: '20px',
  },
  star: {
    position: 'fixed',
    marginLeft: '80%',
    fontSize: '40px',
    color: 'grey',
  },
  root: {
    position: 'relative',
    zIndex: '2000 !important',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {function} setRefresh refresh the whole page
* @param {object} refresh use to set
* @param {function} handleClose close the dialog
* @param {string} id to move to trash
*/
function deleteEmail(setRefresh, refresh, handleClose, id) {
  console.log('CallingAPI to move email to trash '+id);
  handleClose();
  fetch('http://localhost:3010/v0/mail/'+id+
     '?mailbox=trash', {method: 'PUT'})
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log('error');
      });
  setRefresh(!refresh);
}
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {function} setRefresh refresh the whole page
* @param {object} refresh use to set
* @param {function} handleClose close the dialog
* @param {string} id to move to trash
*/
function markUnread(setRefresh, refresh, handleClose, id) {
  console.log('CallingAPI to mark as unRead');
  handleClose();
  fetch('http://localhost:3010/v0/read/'+id, {method: 'PUT'})
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((json) => {
        console.log('marked as unread');
      })
      .catch((error) => {
        console.log('error');
      });
  setRefresh(!refresh);
}
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {string} id to move to trash
* @param {function} setMailID refresh the whole page
* @param {object} mailbox refresh the whole page
* @param {function} setAllMail refresh the whole page
*/
async function markStarred(id, setMailID,
    mailbox, setAllMail) {
  console.log('CallingAPI to mark as starred');
  await fetch('http://localhost:3010/v0/starred/'+id, {method: 'PUT'})
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((json) => {
        console.log('marked as starred');
      })
      .catch((error) => {
        console.log('error');
      });
  await fetch('http://localhost:3010/v0/mail/'+id)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setMailID(json);
      })
      .catch((error) => {
        setMailID(error.toString());
      });
  console.log('calling API to refresh page');
  await fetch('http://localhost:3010/v0/mail?mailbox='+
    mailbox.toLowerCase())
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setAllMail(json);
      })
      .catch((error) => {
        setAllMail(error.toString());
      });
}
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function MailView() {
  const {openMail, setOpenMail, mailID, setMailID, mailbox, handleOpenCompose,
    setRefresh, refresh, setTo, setSubject, setName, setAllMail,
    handleOpenSelectMailbox} =
    React.useContext(SharedContext);
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpenMail(false);
  };
  const reply = () => {
    setOpenMail(false);
    setTo(mailID.from.email);
    setName(mailID.from.name);
    setSubject(mailID.subject);
    handleOpenCompose();
  };
  if (mailID == 0) {
    return null;
  } else {
    if (mailID=='error') {
      return null;
    }
    return (
      <div className={classes.root}>
        <Dialog
          fullScreen={fullScreen}
          open={openMail}
          onClose={handleClose}
          className={classes.root}
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
              </Typography>
              <IconButton
                edge='start'
                color='inherit'
                onClick={(event) => {
                  markUnread(setRefresh, refresh, handleClose, mailID.id);
                }}
                aria-label='mark as unread'
              >
                <MailOutlineIcon />
              </IconButton>
              <IconButton
                edge='start'
                color='inherit'
                onClick={handleOpenSelectMailbox}
                aria-label='move'
              >
                <SaveAltIcon />
              </IconButton>
              <IconButton
                edge='start'
                color='inherit'
                onClick={(event) => {
                  deleteEmail(setRefresh, refresh, handleClose, mailID.id);
                }}
                aria-label='delete'
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem>
              <Typography variant='h6' className={classes.title}>
                {mailID.subject}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem>
              <button className={classes.button}>
                {mailbox}
              </button>
              <StarIcon
                style={{color: mailID.starred ? 'gold' : 'grey'}}
                onClick={(event) => {
                  markStarred(mailID.id, setMailID, mailbox, setAllMail);
                }}
              />
            </ListItem>
            <ListItem>
              <Avatar className={classes.purple}>
                {mailID.from.name.charAt(0)}
              </Avatar>
              <div className={classes.from}>
                <p className={classes.p}>{mailID.from.name}</p>
                <p className={classes.p}>{mailID.from.email}</p>
              </div>
              <div className={classes.toShow}>
                <p>{mailID.toShow}</p>
              </div>
              <IconButton
                color='inherit'
                onClick={reply}
              >
                <ReplyIcon className={classes.reply}/>
              </IconButton>
            </ListItem>
            <ListItem>
              <ListItemText primary={mailID.content}>
              </ListItemText>
            </ListItem>
          </List>
        </Dialog>
      </div>
    );
  }
}
