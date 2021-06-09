import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import {deepPurple} from '@material-ui/core/colors';
// import InputBase from '@material-ui/core/InputBase';

import SharedContext from './SharedContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer +300,
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  menuButton: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  searchIcon: {
    marginTop: '5px',
    color: 'black',
  },
  search: {
    marginLeft: '10px',
    backgroundColor: 'white',
    width: '50%',
    height: '90%',
  },
  buttons: {
    marginLeft: '20px',
  },
}));

/**
 * @return {oject} JSX
 */
function TitleBar() {
  const {mailbox, toggleDrawerOpen,
    handleOpenCompose, handleOpenSetting,
    handleOpenSearch} = React.useContext(SharedContext);

  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawerOpen}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant="h6" noWrap>
          Mail - {mailbox}
        </Typography>
        <div onClick={handleOpenSearch} className={classes.search}>
          <SearchIcon className={classes.searchIcon}/>
        </div>
        <IconButton
          className={classes.buttons}
          onClick={handleOpenCompose} color="inherit">
          <Badge color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton
          className={classes.buttons}
          onClick={handleOpenSetting} color="inherit">
          <Badge color="secondary">
            <Avatar
              className={classes.purple}
            >
              C
            </Avatar>
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
