import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { showErrorToaster } from 'appUtility/commonFunction';
import CircularProgress from '@material-ui/core/CircularProgress';

import { hideMessage, showAuthLoader, updateEchoData, fetchStart, fetchSuccess } from 'actions/index';
import { httpClient } from 'appUtility/Api';
import { ECHO_URLS } from 'constants/AppConst';
import Echo from 'appUtility/models/Echo';

class NewEcho extends React.Component {
  constructor() {
    super();
    this.state = {
      echoId: null,
      redirectToEditor: false,
    };

    console.log(new Echo());
  }

  componentWillMount() {
    this.createNewEcho();
  }

  async createNewEcho() {
    const pocketIds=this.props.selectedPocket?[this.props.selectedPocket.id]:[];
    this.props.fetchStart();
    const formData = new Echo();
    console.log("formData",formData);
    formData.pocketIds=pocketIds;
    const newEchoId = formData.id;
    try {
      await httpClient
        .post(ECHO_URLS.ADD_UPDATE_ECHO, formData)
        .then(async (res) => {
          console.log(res);
          if (res.status === 200) {
            this.setState({
              echoId: newEchoId,
              redirectToEditor: true,
            });
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      showErrorToaster(error);
    }
  }

  render() {
    const { loading } = this.props;
    const { echoId, redirectToEditor } = this.state;

    if (redirectToEditor) {
      return <Redirect to={'/editor/setup/' + echoId} />;
    }

    return (
      <>
        {loading && (
          <div className="loader-view">
            <h3>Setting up your new echo. Please Wait..</h3>
            <CircularProgress />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ echo, common,pockets }) => {
  const { selectedEcho } = echo;
  const {selectedPocket } = pockets;
  const { loading } = common;
  return { loading, selectedEcho ,selectedPocket};
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  fetchStart,
  fetchSuccess,
})(NewEcho);
