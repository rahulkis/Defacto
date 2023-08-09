import React from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal, ModalHeader } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import IntlMessages from "util/IntlMessages";
import { fetchAllConnections, updateSelectedConnection } from "actions/index";
import { CONNECTIONS_URLS } from "constants/AppConst";

class RenameConnection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connectionName: "",
      isLoading: false,
    };
  }

  onSaveConnectionName = (connectionName, connection) => {
    try {
      let body = {
        id: connection.id,
        connectionName: connectionName,
      };

      this.setState({ isLoading: true });
      httpClient
        .post(CONNECTIONS_URLS.UPDATE_CONNECTION_NAME, body)
        .then((res) => {
          if (res.status === 200) {
            this.setState({ isLoading: false });
            const {
              cliType,
              fetchAllConnections,
              updateSelectedConnection,
              onClose,
            } = this.props;
            fetchAllConnections(cliType);
            updateSelectedConnection("");
            onClose();
          }
        })
        .catch((err) => {
          showErrorToaster(err);
          this.setState({ isLoading: false });
        });
    } catch (error) {
      showErrorToaster(error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { open, onClose, connection } = this.props;
    const { connectionName, isLoading } = this.state;

    return (
      <Modal className="modal-box" toggle={onClose} isOpen={open}>
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="connection.rename" />
          <IconButton className="text-white" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <div className="modal-box-content">
          <div className="row no-gutters">
            <div className="col-lg-12 d-flex flex-column order-lg-1">
              {isLoading && (
                <div id="profileLoader" className="loader-view">
                  <CircularProgress />
                </div>
              )}

              <TextField
                required
                id="required"
                fullWidth
                label={<IntlMessages id="appModule.name" />}
                onChange={(event) =>
                  this.setState({ connectionName: event.target.value })
                }
                defaultValue={connection ? connection.connectionName : ""}
                margin="none"
              />
            </div>
          </div>
        </div>

        <div className="modal-box-footer d-flex flex-row">
          <Button
            disabled={!connectionName.replace(/\s/g, "").length}
            variant="contained"
            color="primary"
            onClick={async () => {
              await this.onSaveConnectionName(connectionName, connection);
            }}
          >
            <IntlMessages id="echos.save" />
          </Button>
        </div>
      </Modal>
    );
  }
}

//export default RenameConnection;
const mapStateToProps = ({ connections }) => {
  const { connectionsList } = connections;
  return { connectionsList };
};

export default connect(mapStateToProps, {
  fetchAllConnections,
  updateSelectedConnection,
})(RenameConnection);
