import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import {deepPurple} from '@material-ui/core/colors';
import StarIcon from '@material-ui/icons/Star';
import SharedContext from './SharedContext';
// https://material-ui.com/components/avatars/

const useStyles = makeStyles((theme) => ({
  paper: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  name: {
    fontSize: '15px',
    // fontWeight: 'bold',
  },
  subject: {
    textDecoration: 'underline',
  },
  content: {
    opacity: '0.5',
  },
}));
/**
* Simple component with no state.
* calling to the to get the ID that was clicked and set the state variable
* @param {function} setMailID set the ID state
* @param {function} handleOpenMail set the open mail view
* @param {string} id to set
* @param {string} mailbox
* @param {function} setAllMail u know
* @param {boolean} read if the email is read or not
*/
async function handleClick(setMailID,
    handleOpenMail, id, mailbox, setAllMail, read) {
  console.log('calling API to GET '+id);
  handleOpenMail();
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
  if (!read) {
    console.log('calling API to mark email as read');
    await fetch('http://localhost:3010/v0/read/'+id, {method: 'PUT'})
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response;
        })
        .then((json) => {
          console.log('marked as read');
        })
        .catch((error) => {
          console.log('error');
        });
    console.log('calling API to get updated emails');
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
}
/**
* Simple component with no state.
* calling to the to get the ID that was clicked and set the state variable
* @param {object} mailID set it
* @param {function} setMailID set the ID state
* @param {function} handleOpenMail set the open mail view
* @param {string} id to set
* @param {string} mailbox
* @param {function} setAllMail u know
* @param {object} starred if the email is read or not
* @param {object} setStarred set it
*/
async function handleStar(mailID, setMailID,
    handleOpenMail, id, mailbox, setAllMail, starred, setStarred) {
  event.stopPropagation();
  console.log('calling API to mark email as starred');
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
  await fetch('http://localhost:3010/v0/mail/'+mailID.id)
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
}

/**
 * @return {object} JSX
 */
function Content() {
  const {mailbox} =
    React.useContext(SharedContext);
  const {allMail, setAllMail} =
    React.useContext(SharedContext);
  const {setMailID, mailID} =
    React.useContext(SharedContext);
  const {handleOpenMail, starred, setStarred} =
    React.useContext(SharedContext);
  const classes = useStyles();
  if (allMail.length==0) {
    console.log('first try at rendering');
    return null;
  } else {
    if (allMail[0].mail == undefined) {
      console.log('empty mailbox');
      return null;
    }
    const mail = allMail[0].mail;
    return (
      <Paper className={classes.paper}>
        <Hidden implementation="css">
          <h3>{mailbox}</h3>
          <div>
            <table>
              <tbody>
                <tr><td className ={classes.name}>{mailbox}</td></tr>
                {mail.map((email) => (
                  <tr
                    onClick={(event) => {
                      handleClick(setMailID,
                          handleOpenMail, email.id, mailbox,
                          setAllMail, email.read);
                    }}
                    id={email.id}
                    key={email.id}>
                    <td>
                      <Avatar
                        className={classes.purple}>{email.from.name.charAt(0)}
                      </Avatar>
                    </td>
                    <td>
                      <div
                        className ={classes.name}
                        style={{
                          fontWeight: email.read ? 'normal' : 'bold',
                        }}
                      >
                        {email.from.name}
                      </div>
                      <div
                        className ={classes.subject}
                        style={{
                          fontWeight: email.read ? 'normal' : 'bold',
                        }}
                      >
                        {email.subject}
                      </div>
                      <div className ={classes.content}>
                        {email.content}
                      </div>
                    </td>
                    <td>
                      <div>{email.toShow}</div>
                      <div><StarIcon
                        style={{
                          color: email.starred ? 'gold' : 'grey',
                        }}
                        onClickCapture={() => {
                          handleStar(mailID, setMailID,
                              handleOpenMail, email.id, mailbox,
                              setAllMail, starred, setStarred);
                        }}
                      />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Hidden>
      </Paper>
    );
  }
}

export default Content;
