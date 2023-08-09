import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import IntlMessages from "util/IntlMessages";

const options = [
    { value: 'owner1', label: 'owner1' },
    { value: 'owner2', label: 'owner2' }     
  ];

class TransferOwnership extends React.Component {
  constructor(props) {
    super(props);

    this.state = {    
      selectedOption:null
    };
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  render() {
    const { open, onClose,onSaveTransferOwnership,connection} = this.props;
    const {selectedOption } = this.state;

    return (
      <Modal className="modal-box" toggle={onClose} isOpen={open}>
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="connection.ownership"/>
          <IconButton className="text-white" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <div className="modal-box-content">
          <div className="row no-gutters">
            <div className="col-lg-12 d-flex flex-column order-lg-1">
            <Select
                value={selectedOption}
                onChange={this.handleChange}
                placeholder={
                  <div>
                    <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                    &nbsp; Select Owner
                  </div>
                }
                options={options}
              />
            </div>
          </div>
        </div>

        <div className="modal-box-footer d-flex flex-row">
          <Button
            disabled={selectedOption === null}
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
             onClose();
             onSaveTransferOwnership(
                {
                  'selectedOption': selectedOption,
                  'connection': connection
                });

              this.setState({
                'connectionName': '',               
              })
            }
        }
          >
            <IntlMessages id="echos.save" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default TransferOwnership;
