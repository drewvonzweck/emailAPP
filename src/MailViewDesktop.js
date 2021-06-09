import React from 'react';
// import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
// import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@material-ui/icons/Close';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import Slide from '@material-ui/core/Slide';
import SharedContext from './SharedContext';
import StarIcon from '@material-ui/icons/Star';
import Avatar from '@material-ui/core/Avatar';
import {deepPurple} from '@material-ui/core/colors';
import ReplyIcon from '@material-ui/icons/Reply';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';

const drawerWidth = 600;
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
  content: {
    padding: '10px',
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
    color: 'grey',
    marginLeft: '400px',
    fontSize: '30px',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  drawer: {
    flexShrink: 1,
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {function} setRefresh refresh the whole page
* @param {object} refresh use to set
* @param {string} id to move to trash
*/
function deleteEmail(setRefresh, refresh, id) {
  console.log('CallingAPI to move email to trash '+id);
  fetch('http://localhost:3010/v0/mail/'+id+
     '?mailbox=trash', {method: 'PUT'})
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((json) => {
        console.log('deleted');
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
* @param {object} starred refresh the whole page
* @param {function} setStarred refresh the whole page
* @param {function} setRefresh refresh the whole page
* @param {object} refresh refresh the whole page
*/
async function markStarred(id, setMailID,
    mailbox, setAllMail, starred, setStarred, setRefresh, refresh) {
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
  await fetch('http://localhost:3010/v0/starred')
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setStarred(json);
      })
      .catch((error) => {
        setStarred(error.toString());
      });
  setRefresh(!refresh);
}
/**
* Simple component with no state.
* function to delete email-->move to trash
* @param {function} setRefresh refresh the whole page
* @param {object} refresh use to set
* @param {string} id to move to trash
*/
function markUnread(setRefresh, refresh, id) {
  console.log('CallingAPI to mark as unRead');
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
 *
 * @return {object} JSX
 */
export default function MailViewDesktop() {
  const {setMailID, mailID, mailbox, handleOpenCompose, setRefresh, refresh,
    setTo, setSubject, setName, setAllMail, starred, setStarred,
    handleOpenSelectMailbox} =
    React.useContext(SharedContext);
  const classes = useStyles();
  const reply = () => {
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
      <Drawer
        className={classes.drawer}
        variant='permanent'
        anchor='right'
        classes={{paper: classes.drawerPaper}}
      >
        <Paper className={classes.paper}>
          <Toolbar/>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant='h6' className={classes.title}>
              </Typography>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='mark as unread'
                onClick={(event) => {
                  markUnread(setRefresh, refresh, mailID.id);
                }}
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
                aria-label='delete'
                onClick={(event) => {
                  deleteEmail(setRefresh, refresh, mailID.id);
                }}
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
                  markStarred(mailID.id, setMailID, mailbox, setAllMail,
                      starred, setStarred, setRefresh, refresh);
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
            <div className= {classes.content}>
              {mailID.content}
            </div>
          </List>
        </Paper>
      </Drawer>
    );
  }
}
