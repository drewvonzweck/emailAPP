// code by Drew von Zweck
// Much of the baseline code is borrowed from professors
// given examples
// used Solution to hw6 extensively
// **see citations at the bottom**
import React from 'react';
import {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SharedContext from './SharedContext';
import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
import ComposeView from './ComposeView';
import SettingView from './SettingView';
import SearchView from './SearchView';
import MailView from './MailView';
import Hidden from '@material-ui/core/Hidden';
import MailViewDesktop from './MailViewDesktop';
import MailboxMaker from './MailboxMaker';
import SelectMailbox from './SelectMailbox';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));
/**
 * Simple component with no state.
 *
 * @param {function} setAllMail set the dummy state
  *
 */
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  // const [dummy, setDummy] = React.useState('');
  const [mailbox, setMailbox] = React.useState('Inbox');
  const [mailboxes, setMailboxes] = React.useState([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSetting, setOpenSetting] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openMail, setOpenMail] = React.useState(false);
  const [openMailboxMaker, setOpenMailboxMaker] = React.useState(false);
  const [openSelectMailbox, setOpenSelectMailbox] = React.useState(false);
  const [allMail, setAllMail] =
  React.useState([]);
  const [refresh, setRefresh] =
  React.useState(false);
  const [mailID, setMailID] = React.useState('');
  const [starred, setStarred] =
  React.useState(0);
  const [subject, setSubject] =
  React.useState('');
  const [to, setTo] =
  React.useState('');
  const [name, setName] =
  React.useState('');
  const [userMailboxes, setUserMailboxes] =
  React.useState([]);
  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });
  const toggleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleOpenCompose = () => {
    setOpen(!open);
  };
  const handleOpenSetting = () => {
    setOpenSetting(!openSetting);
  };
  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const handleOpenMail = () => {
    setOpenMail(!openMail);
  };
  const handleOpenMailboxMaker = () => {
    setOpenMailboxMaker(!openMailboxMaker);
  };
  const handleOpenSelectMailbox = () => {
    setOpenSelectMailbox(!openSelectMailbox);
  };
  const classes = useStyles();

  useEffect(async () => {
    let firstID;
    await fetch('http://localhost:3010/v0/mail?mailbox='+
       mailbox.toLowerCase())
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          firstID = json[0].mail[0].id;
          setAllMail(json);
        })
        .catch((error) => {
          setAllMail(error.toString());
        });
    await fetch('http://localhost:3010/v0/mail/'+firstID)
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
          setMailID('error');
        });
    await fetch('http://localhost:3010/v0/usermailboxes')
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setUserMailboxes(json);
        })
        .catch((error) => {
          setUserMailboxes(error.toString());
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
    await fetch('http://localhost:3010/v0/mailboxes')
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          setMailboxes(json);
        })
        .catch((error) => {
          setMailboxes([]);
        });
  }, [refresh]);
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        handleOpenCompose,
        toggleDrawerOpen, allMail, setAllMail,
        starred, setStarred, open, setOpen,
        openSetting, setOpenSetting, handleOpenSetting,
        openSearch, setOpenSearch, handleOpenSearch,
        openMail, setOpenMail, handleOpenMail,
        mailID, setMailID, refresh, setRefresh,
        subject, setSubject, to, name, setName,
        setTo, userMailboxes, setUserMailboxes,
        openMailboxMaker, setOpenMailboxMaker,
        handleOpenMailboxMaker, openSelectMailbox,
        setOpenSelectMailbox, handleOpenSelectMailbox,
        mailboxes, setMailboxes,
      }}
      >
        <MailboxDrawer/>
        <TitleBar/>
        <Content/>
        <Hidden smDown implementation="css">
          <MailViewDesktop />
        </Hidden>
        <ComposeView />
        <SettingView />
        <SearchView />
        <MailboxMaker />
        <SelectMailbox />
        <Hidden mdUp>
          <MailView />
        </Hidden>
      </SharedContext.Provider>
    </div>
  );
}

export default App;
// CITATIONS
// https://material-ui.com/api/hidden/
// https://material-ui.com/components/selects/
// https://stackoverflow.com/questions/42367236/why-am-i-getting-this-warning-no-duplicate-props-allowed-react-jsx-no-duplicate
// https://www.digitalocean.com/community/tutorials/react-axios-react
// https://www.w3schools.com/jsref/jsref_tolowercase.asp
// https://www.postgresqltutorial.com/postgresql-boolean/
// https://stackoverflow.com/questions/35762351/correct-way-to-handle-conditional-styling-in-react
// https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/
// https://stackoverflow.com/questions/62869090/need-to-call-multiple-api-in-serial-order-one-after-the-other-in-javascript
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// https://googlechrome.github.io/samples/fetch-api/fetch-post.html
// https://swagger.io/specification/
// https://www.w3.org/Protocols/HTTP/HTRESP.html

