import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Redirect } from "react-router-dom";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { APP_IMAGE_URL, IMAGE_FOLDER } from "constants/AppConst";

class appsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCLI: "",
    };
  }

  handleToggle = (event, value) => {
    this.setState({ selectedCLI: value });
  };

  addDefaultSrc(e) {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/150x150";
  }
  render() {
    const { countList } = this.props;
    console.log("countList",countList)
    const { selectedCLI } = this.state;
    if (selectedCLI) {
      return <Redirect to={"/app/connections/cli/" + selectedCLI} />;
    }
    return (
      <div className="jr-card p-0">
        {countList.length ? (
          countList.map((app, index) => (
            <List key={index}>
              <ListItem
                button
                key={app.cliType}
                onClick={(event) => this.handleToggle(event, app.cliType)}
              >
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-1">
                      <img
                        className="header-app-icon"
                        alt={app.apiName}
                        src={
                          APP_IMAGE_URL +
                          IMAGE_FOLDER.APP_IMAGES +
                          app.cliType.toLowerCase() +
                          ".png"
                        }
                        onError={this.addDefaultSrc}
                      />
                    </div>
                    <div className="col-md-4" style={{ paddingTop: "10px" }}>
                      <b>{app.apiName}</b>
                    </div>
                  </div>
                </div>

                <div className="col-md-2 text-right">
                  <b>{app.connections} </b>
                  {" Connections"}
                </div>
                <div className="col-md-2 text-right">
                  <b>{app.echoCount} </b>
                  {" Echoes"}
                </div>
                <div className="col-md-2 text-right">
                  <ArrowForwardIosIcon />
                </div>
              </ListItem>
            </List>
          ))
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "35px" }}
          >
            "No Result found"
          </div>
        )}
      </div>
    );
  }
}

export default appsList;
