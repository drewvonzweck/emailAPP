import React from 'react';
import Button from '@material-ui/core/Button';
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
import CloseIcon from '@material-ui/icons/Close';
// import Slide from '@material-ui/core/Slide';
import SharedContext from './SharedContext';

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
}));
// const Transition = React.forwardRef(function Transition(props, ref) {
//  return <Slide direction="up" ref={ref} {...props} />;
// });
/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
export default function SearchView() {
  const {openSearch, setOpenSearch} =
    React.useContext(SharedContext);
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpenSearch(false);
  };
  return (
    <div className={classes.root}>
      <Dialog
        fullScreen={fullScreen}
        open={openSearch}
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
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Search View
            </Typography>
            <Button autoFocus color='inherit' onClick={handleClose}>
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button onClick={handleClose}>
            <ListItemText primary='This View Has
             Not Been Implemented' secondary='' />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleClose}>
            <ListItemText
              primary=''
              secondary=''
            />
          </ListItem>
          <ListItem button onClick={handleClose}>
            <ListItemText primary='' secondary='' />
          </ListItem>
          <ListItem button onClick={handleClose}>
            <ListItemText primary='' secondary='' />
          </ListItem>
          <ListItem button onClick={handleClose}>
            <ListItemText primary='' secondary='' />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
