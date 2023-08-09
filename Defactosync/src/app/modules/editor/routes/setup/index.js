import React from "react";
import { connect } from "react-redux";
import { showErrorToaster, sortArrayWithKey } from "appUtility/commonFunction";

import Header from "../../components/header";
import EditorBody from "./editorBody";

import {
  hideMessage,
  onSelectEcho,
  updateEchoData,
  fetchStart,
  fetchSuccess,
  updateNodesList,
  nodeError
} from "actions/index";
import { ECHO_URLS } from "../../../../../constants/AppConst";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "../../../../../appUtility/Api";

import SettingsPanel from "../../components/sidebar";

class Setup extends React.Component {
  constructor() {
    super();
    this.state = {
      echoId: null,
    };
  }

  componentWillMount() {
    document.title = "FormSync - SetupEcho";
    this.props.fetchStart();
    if (this.props.match.params && this.props.match.params.echoId) {
      const id = this.props.match.params.echoId;
      this.setState({
        echoId: id,
      });
      this.getEchoDetailsFromEchoId(id);
    } else {
      this.props.history.push("/");
    }
  }

  getEchoDetailsFromEchoId(id) {
    console.log("sss");
    try {
      httpClient
        .get(ECHO_URLS.GET_ECHO_BY_ID + id)
        .then((res) => {
          if (res.status === 200 && res.data.data.echo) {
            const echoData = res.data.data.echo;
            const nodesData = res.data.data.nodes.length
              ? sortArrayWithKey(res.data.data.nodes, "sortIndex")
              : [];
            this.props.nodeError({ echoNodeError: "" });
            this.props.updateEchoData(echoData);
            this.props.updateNodesList(nodesData);
            this.props.fetchSuccess();
          } else {
            this.props.history.push("/app/echos/");
          }
        })
        .catch((err) => {
          showErrorToaster(err);
        });
    } catch (error) {
      showErrorToaster(error);
    }
  }

  render() {
    const { loading } = this.props;
    return (
      <>
        {!loading && (
          <>
            <div className="dashboard animated slideInUpTiny animation-duration-3">
              <Header />
              <div className="echo-editor-body">
                <EditorBody echoId={this.state.echoId} />
              </div>
            </div>
            <SettingsPanel />
          </>
        )}
        {loading && (
          <div className="loader-view">
            <h3>Loading Echo editor. Please wait</h3>
            <CircularProgress />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ echo, common }) => {
  const { selectedEcho } = echo;
  const { loading } = common;
  return { loading, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  fetchStart,
  fetchSuccess,
  updateEchoData,
  updateNodesList,
  onSelectEcho,
  nodeError
})(Setup);
