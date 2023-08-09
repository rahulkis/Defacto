import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

class AlertDialog extends Component {
  
  handleRequestClose = () => {
    this.setState({open: false});
  };

  render() {
     const {data,open,close,confirm,title}= this.props;
    return (
      <div>      
        <Dialog open={open} onClose={close}>         
          <DialogContent>
            <DialogContentText>
            {title}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="secondary">
              No
            </Button>
            <Button onClick={() => {
              close();
              confirm(data)
                       
            }} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;