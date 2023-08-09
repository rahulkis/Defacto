import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { updateEchoData, showHideNodeSelector, nodeError } from "actions/index";
import { httpClient } from "appUtility/Api";
import { ECHO_URLS } from "constants/AppConst";
import { showErrorToaster } from "appUtility/commonFunction";
import NodeSelector from "../../components/nodeSelector";
import SelectorDialog from "../../components/selectorDialog";
import TriggerNode from "../../components/triggerNode";
import ActionNode from "../../components/actionNode";

class EditorBody extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isNewActionNode: false,
    };
  }

  componentWillMount() {}

  componentDidUpdate() {
    const errors = [];
    const { nodesList, selectedNode } = this.props;
    for (let i = 0; i < nodesList.length; i++) {
      if (
        Object.values(nodesList[i].meta).length > 0 &&
        !nodesList[i].isConnectionTested
      ) {
        if (
          selectedNode &&
          nodesList[i].sortIndex !== selectedNode.sortIndex
        ) {
          let obj = {};
          obj["error"] = `There is an issue in step ${nodesList[i].sortIndex}`;
          obj["id"] = nodesList[i].id;
          obj["title"] = nodesList[i].title;
          obj["selectedCLI"] = nodesList[i].selectedCLI;
          errors.push(obj);
        }
      }
      this.props.nodeError({
        echoNodeError: errors,
      });
    }
  }


  handleStateChange =  () => {
    const echoData = this.props.selectedEcho;   
   if(echoData.state==="on") {
      try {
      let body = {
        id: echoData.id,
        state: "off",
      };

      httpClient
        .post(ECHO_URLS.UPDATE_ECHO_STATE, body)
        .then((res) => {         
          if (res.data.statusCode === 200) {
            this.props.updateEchoData({
              ...echoData,
              state: "off",
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
  };

  addNewActionNode(nodeIndex) {  
    this.handleStateChange();
    this.props.showHideNodeSelector({ show: true, nodeIndex: nodeIndex });   
  }

  render() {
    const {
      nodesList,
      echoId,
      nodeSelector,
      showHideNodeSelector,
    } = this.props;
    // console.log("updated", nodesList);
    const triggerNodeItem = nodesList.find((node) => node.typeOf === "trigger");
    const actionNodeItems = nodesList.filter(
      (node) => node.typeOf === "action"
    );
    return (
      <>
        <div className="pb-3" id="echo-wrapper">
          {nodesList.length === 0 && (
            <>
              <NodeSelector
                key={"newNode0"}
                type="trigger"
                echoId={echoId}
                nodeIndex={1}
              />
            </>
          )}
          {triggerNodeItem && (
            <>
              <div id={"nodeItem" + triggerNodeItem.id}>
                <TriggerNode item={triggerNodeItem} />
              </div>
            </>
          )}
          {nodesList.length > 0 &&
            actionNodeItems.map((nodeItem, index) => {
              return (
                <div key={index}>
                  <div className="text-center d-flex flex-column mb-3 align-items-center">
                    <span className="verticle-line-icon"></span>
                    <Fab
                      color="primary"
                      className="jr-fab-btn  mr-0 add-node-button"
                      aria-label="add"
                      onClick={() =>
                        this.addNewActionNode(Number(index) + Number(2))
                      }
                    >
                      <AddIcon />
                    </Fab>
                    <ArrowDownwardIcon />
                  </div>
                  <div  id={"nodeItem" + nodeItem.id}>
                    <ActionNode item={nodeItem} itemIndex={index + 1} />
                  </div>
                </div>
              );
            })}
          {nodesList.length > 0 && (
            <div className="mt-3 mb-5 p-2 text-center d-flex flex-column  align-items-center">
              <ArrowDownwardIcon />
              <Fab
                color="primary"
                className="jr-fab-btn add-node-button mb-4"
                aria-label="add"
                onClick={() =>
                  this.addNewActionNode(Number(nodesList.length) + Number(1))
                }
              >
                <AddIcon />
              </Fab>
            </div>
          )}
        </div>
        <SelectorDialog
          nodeIndex={nodeSelector.nodeIndex}
          echoId={echoId}
          open={nodeSelector.show}
          onCloseDialog={() =>
            showHideNodeSelector({ show: false, nodeIndex: null })
          }
        />
      </>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { selectedEcho, nodesList, nodeSelector, selectedNode } = echo;
  return { selectedEcho, nodesList, nodeSelector, selectedNode };
};

export default withRouter(
  connect(mapStateToProps, { updateEchoData, showHideNodeSelector, nodeError })(
    EditorBody
  )
);
