import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";

class ConnectedApp extends React.Component {
  constructor(prop) {
    super();
  }
  render() {
    let { nodesList } = this.props;
    nodesList = nodesList.filter((node) => {
      return Object.keys(node.meta).length !== 0;
    });

    console.log("nodeList",nodesList)   
    return (
      <div className="overview-connected-apps  mt-4">
        {nodesList.length ? (
          <div>
            {" "}
            <p className="heading">Connected Apps</p>
            {nodesList.map((node) => (
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-1">
                      <img
                        height="40"
                        width="40"
                        src={
                          APP_IMAGE_URL +
                          IMAGE_FOLDER.APP_IMAGES +
                          node.meta.cliType.toLowerCase() +
                          ".png"
                        }
                        alt="cli"
                      ></img>
                    </div>
                    <div className="col-md-9">
                      <h3 className="mb-0">
                        {node.meta.label}
                      </h3>
                      @{node.meta.email}
                      <span className="ml-2">- added</span>{" "}
                      {moment(
                        moment.unix(node.meta.createdAt).format("LLL")
                      ).fromNow()}
                    </div>                  
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { nodesList } = echo;
  return { nodesList };
};

export default connect(mapStateToProps, {})(ConnectedApp);
