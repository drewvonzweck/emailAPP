import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SharedContext from './SharedContext';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    position: 'relative',
    zIndex: '2000 !important',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
/**
* Simple component with no state.
* calling to the to get the ID that was clicked and set the state variable
* @param {object} mailID set the ID state
* @param {function} handleClose set the open mail view
* @param {string} mailboxtogo
* @param {function} setAllMail set the open mail view
* @param {function} setMailbox set the open mail view
*/
async function handleClick(mailID,
    handleClose, mailboxtogo, setAllMail, setMailbox) {
  console.log('calling API to GET '+mailID.id);
  handleClose();
  setMailbox(mailboxtogo.charAt(0).toUpperCase() +
    mailboxtogo.slice(1));
  await fetch('http://localhost:3010/v0/mail/'+
      mailID.id+'?mailbox='+mailboxtogo, {method: 'PUT'})
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response;
      })
      .then((json) => {
        console.log('moved email'+mailbox);
      })
      .catch((error) => {
        console.log('error');
      });
  console.log('calling API to refresh page');
  await fetch('http://localhost:3010/v0/mail?mailbox='+
    mailboxtogo.toLowerCase())
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
export default function SelectMailbox() {
  const classes = useStyles();
  const {openSelectMailbox,
    setOpenSelectMailbox, mailboxes, mailID, setAllMail, setMailbox} =
    React.useContext(SharedContext);
  const [mailboxtogo, setMailboxtogo] = React.useState('');

  const handleChange = (event) => {
    setMailboxtogo(event.target.value) || '';
  };

  const handleClose = () => {
    setOpenSelectMailbox(false);
  };

  return (
    <div>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openSelectMailbox}
        onClose={handleClose}
        className={classes.root}
      >
        <DialogTitle>Select a Mailbox</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-dialog-native">Mailboxes</InputLabel>
              <Select
                native
                value={mailboxtogo}
                onChange={handleChange}
                input={<Input id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                {mailboxes.map((mailbox) => (
                  <option key = {mailbox.name}
                    value={mailbox.name}
                  >
                    {mailbox.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              handleClick(mailID,
                  handleClose, mailboxtogo, setAllMail, setMailbox);
            }}
            color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
