import React from "react";
import { connect } from "react-redux";
import { showErrorToaster } from "appUtility/commonFunction";
import { ECHO_URLS } from "constants/AppConst";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import {fetchAllPockets,updateEchoData, fetchSuccess, updateNodesList} from "actions/index";
import Content from "./components/content";
import Header from "./components/header";
import Auxiliary from "../../../../../../../appUtility/Auxiliary";
import { sortArrayWithKey } from "appUtility/commonFunction";

class Detail extends React.Component {
  constructor(prop) {
    super();
    this.state = {   
      isLoading: true
    };
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.echoId) {     
      const id = this.props.match.params.echoId;
      const { fetchAllPockets } = this.props;
      fetchAllPockets();
      this.getEchoDetailsFromEchoId(id);
    } else {
      this.props.history.push("/");
    }
  }

  getEchoDetailsFromEchoId(id) {
    try {
      httpClient
        .get(ECHO_URLS.GET_ECHO_BY_ID + id)
        .then((res) => {
          if (res.status === 200) {          
            const echoData = res.data.data.echo;
            const nodesData = res.data.data.nodes.length ? sortArrayWithKey(res.data.data.nodes, 'sortIndex') : [];
            this.props.updateEchoData(echoData);
            this.props.updateNodesList(nodesData);
            this.props.fetchSuccess();
            this.setState({             
              isLoading: false,
            });
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
    const {isLoading} = this.state;
    return (
      <div className="echos-detail-page">
        {!isLoading && (
          <Auxiliary>         
            <Header/>
            <div className="jr-profile-content">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-12">
               <Content/> 
                </div>
              </div>
            </div>
          </Auxiliary>
        )}
        {isLoading && (
          <div id="profileLoader" className="loader-view">
            <CircularProgress />
          </div>
        )}

      </div>
    );
  }
}

const mapStateToProps = ({ pockets }) => {
    const { allPockets} = pockets;
   return {allPockets}
};



export default connect(mapStateToProps, {
  fetchAllPockets,
  updateEchoData,
  updateNodesList,
  fetchSuccess
})(Detail);
