import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import SendIcon from '@material-ui/icons/Send';
import StarIcon from '@material-ui/icons/Star';
import DraftsIcon from '@material-ui/icons/Drafts';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import SharedContext from './SharedContext';

const boxes = [
  {name: 'Inbox', icon: <MailIcon/>},
  {name: 'Trash', icon: <DeleteIcon/>},
  {name: 'Sent', icon: <SendIcon/>},
];

/**
* Simple component with no state.
* calling to the API everytime a mailbox button is clicked
* @param {function} selectMailbox set the mailbox state
* @param {object} mailbox set the mailbox state
* @param {function} setRefresh set the mailbox state
* @param {object} refresh set the mailbox state
 */
function setMailbox(selectMailbox, mailbox, setRefresh, refresh) {
  console.log('calling API to GET '+mailbox);
  selectMailbox(mailbox);
  setRefresh(!refresh);
}
/**
 * @return {object} JSX
 */
function MailboxList() {
  const {mailbox, selectMailbox,
    userMailboxes, handleOpenSetting,
    handleOpenMailboxMaker} = React.useContext(SharedContext);
  const {starred} =
    React.useContext(SharedContext);
  const {setRefresh, refresh} =
    React.useContext(SharedContext);
  /**
  * Simple component with no state.
  *
  * @param {function} mailbox set the dummy state
  */
  // function onclick(mailbox) {
  //  selectMailbox(mailbox);
  //  const mail = mailbox.toLowerCase();
  //  getMailbox(setAllMail, mail);
  // }
  return (
    <div>
      <Toolbar />
      <List>
        {boxes.map((box) => (
          <ListItem button
            key={box.name}
            disabled={mailbox == box.name}
            onClick={(event) => {
              setMailbox(selectMailbox, box.name, setRefresh, refresh);
            }}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
          </ListItem>
        ))}
        <ListItem button
          key= 'Starred'
          disabled={mailbox == 'Starred'}
          onClick={(event) => {
            setMailbox(selectMailbox, 'starred', setRefresh, refresh);
          }}
        >
          <ListItemIcon>
            <StarIcon/>
          </ListItemIcon>
          <ListItemText primary='Starred' secondary={starred}/>
        </ListItem>
        <ListItem button
          key= 'Drafts'
          disabled={mailbox == 'Drafts'}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary='Drafts'/>
        </ListItem>
      </List>
      <Divider />
      <List>
        {userMailboxes.map((text, index) => (
          <ListItem button
            key={text}
            onClick={(event) => {
              setMailbox(selectMailbox, text, setRefresh, refresh);
            }}
          >
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <ListItemText primary={text}/>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button
          key='New Mailbox'
          onClick={handleOpenMailboxMaker}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary='New Mailbox' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button
          key='Settings'
          onClick={handleOpenSetting}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItem>
      </List>
    </div>
  );
}

export default MailboxList;
