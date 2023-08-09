import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import IntlMessages from "util/IntlMessages";

class RenameEcho extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      echoTitle: "",
    };
  }

  render() {
    const { open, onEchoClose,echo,onSaveEchoName} = this.props;
    const { echoTitle } = this.state;

    return (
      <Modal className="modal-box"  isOpen={open}>
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="echos.rename"/>
          <IconButton className="text-white" onClick={onEchoClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <div className="modal-box-content">
          <div className="row no-gutters">
            <div className="col-lg-12 d-flex flex-column order-lg-1">
              <TextField
                required
                id="required"
                fullWidth
                label={<IntlMessages id="appModule.name" />}
                onChange={(event) =>
                  this.setState({ echoTitle: event.target.value })
                }
                defaultValue={echo.title}
                margin="none"
              />
            </div>
          </div>
        </div>

        <div className="modal-box-footer d-flex flex-row">
          <Button
            disabled={!echoTitle.replace(/\s/g, "").length}
            variant="contained"
            color="primary"
            onClick={() => {
              onEchoClose();
              onSaveEchoName(
                {
                  'title': echoTitle ? echoTitle.trim() : echo.title,
                  'echo': echo
                });

              this.setState({
                'echoTitle': '',               
              })
            }}
          >
            <IntlMessages id="echos.save" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default RenameEcho;
