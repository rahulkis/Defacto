import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

import {
  AUTH_INTEGRATION,
  TRELLOAUTH_URLS,
} from "constants/IntegrationConstant";

class TrelloSetup extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      noFieldsAvailable: false,
      fieldsList: [],
      boards: [],
      boardList: [],
      cardList: [],
      labelList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      filterOptions: [
        { value: "open", label: "Open" },
        { value: "closed", label: "Closed" },
        { value: "all", label: "All" },
      ],
      statusOptions: [
        { value: "incomplete", label: "InComplete" },
        { value: "complete", label: "Complete" },
        { value: "all", label: "All" },
      ],
      timeOptions: [
        { value: "minutes", label: "Minutes" },
        { value: "hours", label: "Hours" },
        { value: "days", label: "Days" },
        { value: "weeks", label: "Weeks" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "board") {
            await this.getBoardLists(connectionData, fld.value);
            await this.getCardListsByBoardId(connectionData, fld.value);
            await this.getLabelsListsByBoardId(connectionData, fld.value);
          }
          if (fld.key === "list") {
            await this.getCardListsByListId(connectionData, fld.value);
          }
        });
      }

      if (
        fields.find((field) => field.key === "board") &&
        this.state.boards.length === 0
      )
        await this.getBoards(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;

    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "board") {
            await this.getBoardLists(connectionData, fld.value);
            await this.getCardListsByBoardId(connectionData, fld.value);
            await this.getLabelsListsByBoardId(connectionData, fld.value);
          }
          if (fld.key === "list") {
            await this.getCardListsByListId(connectionData, fld.value);
          }
        });
      }
      if (
        fields.find((field) => field.key === "board") &&
        this.state.boardList.length === 0
      )
        await this.getBoards(connectionData);
    }
  };
  
  handleChangeSelectValue = async (value, key) => {
    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);
    const { connectionData} = this.props;
    if (connectionData) {
      if (key === "board") {
        await this.getBoardLists(connectionData, value);
        await this.getCardListsByBoardId(connectionData, value);
        await this.getLabelsListsByBoardId(connectionData, value);
      }
      if (key === "list") {
        await this.getCardListsByListId(connectionData, value);
      }
    }
  };

  // get Boards
  getBoards = async (connection) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_BOARDS.replace(
        "{memberId}",
        connection.memberId
      )
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const boardsData = parsedResponse.map((board) => {
              return {
                ...board,
                value: board.id,
                label: board.name,
              };
            });
            this.setState({
              boards: boardsData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get Board Lists
  getBoardLists = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_BOARD_LISTS.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const boardListData = parsedResponse.map((boardList) => {
              return {
                ...boardList,
                value: boardList.id,
                label: boardList.name,
              };
            });
            this.setState({
              boardList: boardListData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get card Lists by board Id
  getCardListsByBoardId = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_BOARD_CARDS.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const cardListData = parsedResponse.map((card) => {
              return {
                ...card,
                value: card.id,
                label: card.name,
              };
            });
            this.setState({
              cardList: cardListData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get card Lists by list Id
  getCardListsByListId = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_CARDS_BY_LISTID.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const cardListData = parsedResponse.map((card) => {
              return {
                ...card,
                value: card.id,
                label: card.name,
              };
            });
            this.setState({
              cardList: cardListData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  // get label Lists by board Id
  getLabelsListsByBoardId = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_BOARD_LABELS.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const labelListData = parsedResponse.map((label) => {
              return {
                ...label,
                value: label.id,
                label:
                  label.name !== ""
                    ? label.name + label.color
                    : "label" + label.color,
              };
            });
            this.setState({
              labelList: labelListData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error);
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ isLoading: false });
      showErrorToaster(err);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  getFieldLabel(field) {
    if (field.label) {
      return field.label;
    } else {
      const splitKeys = field.key.split("_");
      let label = "";
      splitKeys.forEach((key, index) => {
        if (index === 0) {
          label = key;
        } else {
          label = label + " " + key;
        }
      });
      return label;
    }
  }

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;

    const {
      filterOptions,
      boardList,
      boards,
      cardList,
      labelList,
      isLoading,
      boolTypeListOptions,
      statusOptions,
      timeOptions,
    } = this.state;

    const savedFields = {};
    selectedNode.fields.forEach((fld) => {
      savedFields[fld.key] = { ...fld };
    });

    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key !== "filter" &&
                field.key !== "list" &&
                field.type !== "bool" &&
                field.key !== "time_unit" &&
                field.key !== "card" &&
                field.key !== "status" &&
                field.key !== "label_id" &&
                field.key !== "board" && (
                  <div className="row">
                    <div className="col-md-11 my-2 ml-3">
                      <div className="d-flex justify-content-between">
                        <label className="text-capitalize">
                          {this.getFieldLabel(field)}{" "}
                        </label>
                        {field.required && (
                          <span className="text-danger ml-1">(required)</span>
                        )}
                      </div>
                      <Input
                        className="w-100"
                        defaultValue={
                          savedFields[field.key]
                            ? savedFields[field.key].value
                            : ""
                        }
                        onBlur={(e) =>
                          this.handleChangeSelectValue(
                            e.target.value,
                            field.key
                          )
                        }
                      />
                      <span
                        className="text-light custome-fields-help-text"
                        dangerouslySetInnerHTML={{
                          __html: field.help_text_html,
                        }}
                      ></span>
                    </div>
                  </div>
                )}

              {field.type === "bool" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={boolTypeListOptions}
                    value={
                      savedFields[field.key]
                        ? boolTypeListOptions.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {field.key === "time_unit" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={timeOptions}
                    value={
                      savedFields[field.key]
                        ? timeOptions.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {field.key === "status" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={statusOptions}
                    value={
                      savedFields[field.key]
                        ? statusOptions.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {field.key === "filter" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={filterOptions}
                    value={
                      savedFields[field.key]
                        ? filterOptions.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{
                      __html: field.help_text_html,
                    }}
                  ></span>
                </div>
              )}

              {field.key === "board" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={boards}
                    value={
                      savedFields[field.key]
                        ? boards.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{
                      __html: field.help_text_html,
                    }}
                  ></span>
                </div>
              )}

              {field.key === "list" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={boardList}
                    value={
                      savedFields[field.key]
                        ? boardList.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{
                      __html: field.help_text_html,
                    }}
                  ></span>
                </div>
              )}

              {field.key === "card" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={cardList}
                    value={
                      savedFields[field.key]
                        ? cardList.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{
                      __html: field.help_text_html,
                    }}
                  ></span>
                </div>
              )}

              {field.key === "label_id" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <Select
                    className="w-100"
                    options={labelList}
                    value={
                      savedFields[field.key]
                        ? labelList.find(
                            (val) => val.value === savedFields[field.key].value
                          )
                        : ""
                    }
                    onChange={(e) =>
                      this.handleChangeSelectValue(e.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{
                      __html: field.help_text_html,
                    }}
                  ></span>
                </div>
              )}
            </>
          ))}
          {fields.length && (
            <>
              <Button
                variant="contained"
                color="primary"
                className="jr-btn jr-btn-sm my-2"
                onClick={(e) => this.handlelRefreshFields()}
              >
                <RefreshIcon className="mr-1" />
                {!isRefreshinFields && <span>Refresh fields</span>}
                {isRefreshinFields && <span>Refreshing fields...</span>}
              </Button>
            </>
          )}
          {isLoading && (
            <div className="loader-settings m-5">
              <CircularProgress />
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ echo }) => {
  const { loader, selectedEcho } = echo;
  return { loader, selectedEcho };
};

export default connect(mapStateToProps, {
  hideMessage,
  showAuthLoader,
  updateEchoData,
  onSelectEcho,
})(TrelloSetup);
