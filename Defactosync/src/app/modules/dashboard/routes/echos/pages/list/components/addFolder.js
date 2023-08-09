import React from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import IntlMessages from 'util/IntlMessages';

class AddFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pocketTitle: '',
      pocketDescription: ''
    }
  }

  render() {
    const { onSaveFolder, onFolderClose, open, folder } = this.props;
    const { description, title } = folder;
    const { pocketDescription, pocketTitle } = this.state;   

    return (
      <Modal className="modal-box" toggle={onFolderClose} isOpen={open}>
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="echos.addPocket" />
          <IconButton className="text-white"
            onClick={onFolderClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <div className="modal-box-content">
          <div className="row no-gutters">
            <div className="col-lg-12 d-flex flex-column order-lg-1">
              <TextField
                required
                id="required"
                label={<IntlMessages id="appModule.name" />}
                onChange={(event) => this.setState({ pocketTitle: event.target.value })}
                defaultValue={title}
                margin="none" />
            </div>

            <div className="col-lg-9 d-flex flex-column order-lg-1 mt-2">
              <TextField
                //required
                multiline
                rows='4'
                label={<IntlMessages id="appModule.description" />}
                onChange={(event) => this.setState({ pocketDescription: event.target.value })}
                defaultValue={description}
                margin="none" />
            </div>
          </div>
        </div>

        <div className="modal-box-footer d-flex flex-row">

          <Button disabled={!pocketTitle.replace(/\s/g, "").length} variant="contained" color="primary" onClick={() => {
            onFolderClose();
            onSaveFolder(
              {
                'title': pocketTitle ? pocketTitle.trim() : title,
                'description': pocketDescription ? pocketDescription.trim() : description
              });

            this.setState({
              'pocketTitle': '',
              'pocketDescription': '',
            })

          }}><IntlMessages id="echos.save" /></Button>
        </div>
      </Modal>
    );
  }
}

export default AddFolder;