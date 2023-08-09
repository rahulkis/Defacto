import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  hideMessage,
  showAuthLoader,
  onSelectEcho,
  updateEchoData,
} from "actions";
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
      organizations: [],
      boards: [],
      boardList: [],
      checkList: [],
      labelList: [],
      cardList: [],
      toBoards: [],
      toList: [],
      memberList: [],
      checkListItem: [],
      boardCheckList: [],
      errorFound: false,
      boolTypeListOptions: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      dueCompleteOptions: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      checkListPositionOptions: [
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
      ],
      permissionOptions: [
        { value: "private", label: "Private" },
        { value: "org", label: "Organization" },
        { value: "public", label: "Public" },
      ],
      colorOptions: [
        { value: "null", label: "Null" },
        { value: "green", label: "Green" },
        { value: "yellow", label: "Yellow" },
        { value: "orange", label: "Orange" },
        { value: "red", label: "Red" },
        { value: "purple", label: "Purple" },
        { value: "blue", label: "Blue" },
        { value: "sky", label: "Sky" },
        { value: "lime", label: "Lime" },
        { value: "pink", label: "Pink" },
        { value: "black", label: "Black" },
      ],
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "board") {
            await this.getBoardLists(connectionData, fld.value, "board");
            await this.getLabelsListsByBoardId(connectionData, fld.value);
            await this.getMembersByBoard(connectionData, fld.value);
            await this.getChecklistByBoard(connectionData, fld.value);
          }
          if (fld.key === "list") {
            await this.getCardListsByListId(connectionData, fld.value);
          }
          if (fld.key === "card") {
            await this.getChecklistByCard(connectionData, fld.value);
          }
          if (fld.key === "checklist") {
            await this.getCheckListItemByCheckList(connectionData, fld.value);
          }
          if (fld.key === "to_board") {
            await this.getBoardLists(connectionData, fld.value, "to_board");
          }
        });
      }

      if (
        fields.find((field) => field.key === "organization_id") &&
        this.state.organizations.length === 0
      )
        await this.getOrganizations(connectionData);
      if (
        fields.find((field) => field.key === "board") &&
        this.state.boards.length === 0
      )
        await this.getBoards(connectionData, "board");

      if (
        fields.find((field) => field.key === "to_board") &&
        this.state.toBoards.length === 0
      )
        await this.getBoards(connectionData, "to_board");
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields, selectedNode } = this.props;
    if (connectionData) {
      if (selectedNode.fields.length > 0) {
        selectedNode.fields.forEach(async (fld) => {
          if (fld.key === "board") {
            await this.getBoardLists(connectionData, fld.value, "board");
            await this.getLabelsListsByBoardId(connectionData, fld.value);
            await this.getMembersByBoard(connectionData, fld.value);
            await this.getChecklistByBoard(connectionData, fld.value);
          }
          if (fld.key === "list") {
            await this.getCardListsByListId(connectionData, fld.value);
          }
          if (fld.key === "card") {
            await this.getChecklistByCard(connectionData, fld.value);
          }
          if (fld.key === "checklist") {
            await this.getCheckListItemByCheckList(connectionData, fld.value);
          }
          if (fld.key === "to_board") {
            await this.getBoardLists(connectionData, fld.value, "to_board");
          }
        });
      }
      if (
        fields.find((field) => field.key === "organization_id") &&
        this.state.organizations.length === 0
      )
        await this.getOrganizations(connectionData);
      if (
        fields.find((field) => field.key === "board") &&
        this.state.boards.length === 0
      )
        await this.getBoards(connectionData, "board");

      if (
        fields.find((field) => field.key === "to_board") &&
        this.state.toBoards.length === 0
      )
        await this.getBoards(connectionData, "to_board");
    }
  };

  handleChangeSelectValue = async (value, key) => {
    const { connectionData, selectedNode } = this.props;

    //clear related fields on change
    if (key === "board") {
      selectedNode.fields = selectedNode.fields.filter(
        (x) => x.key !== "card" && x.key !== "list" && x.key !== "checklist"
      );
    }
    if (key === "list") {
      selectedNode.fields = selectedNode.fields.filter(
        (x) => x.key !== "card" && x.key !== "checklist"
      );
    }
    if (key === "card") {
      selectedNode.fields = selectedNode.fields.filter(
        (x) => x.key !== "checklist"
      );
    }

    this.props.onRefreshFields();
    this.props.onChangeValue(value, key);

    //get related fields on change particular field
    if (connectionData) {
      if (key === "board") {
        await this.getBoardLists(connectionData, value, "board");
        await this.getLabelsListsByBoardId(connectionData, value);
        await this.getMembersByBoard(connectionData, value);
        await this.getChecklistByBoard(connectionData, value);
      }
      if (key === "list") {
        await this.getCardListsByListId(connectionData, value);
      }
      if (key === "card") {
        await this.getChecklistByCard(connectionData, value);
      }
      if (key === "checklist") {
        await this.getCheckListItemByCheckList(connectionData, value);
      }
      if (key === "to_board") {
        await this.getBoardLists(connectionData, value, "to_board");
      }
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

  // get organizations
  getOrganizations = async (connection) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_ORGANIZATIONS_BY_MEMBERID.replace(
        "{id}",
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
            const orgsData = parsedResponse.map((org) => {
              return {
                ...org,
                value: org.id,
                label: org.name,
              };
            });
            this.setState({
              organizations: orgsData,
              //isLoading: false,
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

  // get Boards
  getBoards = async (connection, value) => {
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
            if (value === "board") {
              this.setState({
                boards: boardsData,
                isLoading: false,
              });
            } else {
              this.setState({
                toBoards: boardsData,
                isLoading: false,
              });
            }
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
                    ? label.name + "-" + label.color
                    : label.color,
              };
            });
            this.setState({
              labelList: labelListData,
              //isLoading: false,
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
  getBoardLists = async (connection, id, key) => {
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
            if (key === "board") {
              this.setState({
                boardList: boardListData,
                isLoading: false,
              });
            } else {
              this.setState({
                toList: boardListData,
                isLoading: false,
              });
            }
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

  // get members by board
  getMembersByBoard = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_MEMBERS_BY_BOARD_ID.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const memberListData = parsedResponse.map((member) => {
              return {
                ...member,
                value: member.id,
                label: member.fullName,
              };
            });
            this.setState({
              memberList: memberListData,
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

  // get checklist by card
  getChecklistByCard = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_CHECKLIST_BY_CARD.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const checkListData = parsedResponse.map((checklist) => {
              return {
                ...checklist,
                value: checklist.id,
                label: checklist.name,
              };
            });
            this.setState({
              checkList: checkListData,
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

  // get checklist by board
  getChecklistByBoard = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_CHECKLIST_BY_BOARD.replace("{id}", id)
        .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
        .replace("{yourAPIToken}", connection.token),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          const parsedResponse = JSON.parse(result.data.res);
          if (result.status === 200) {
            const checkListData = parsedResponse.map((checklist) => {
              return {
                ...checklist,
                value: checklist.id,
                label: checklist.name,
              };
            });
            this.setState({
              boardCheckList: checkListData,
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

  // get checklist Items by checklist
  getCheckListItemByCheckList = async (connection, id) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl: TRELLOAUTH_URLS.GET_CHECKLIST_ITEMS_BY_CHECKLIST.replace(
        "{id}",
        id
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
            const checkListItemData = parsedResponse.map((checkListItem) => {
              return {
                ...checkListItem,
                value: checkListItem.id,
                label: checkListItem.name,
              };
            });
            this.setState({
              checkListItem: checkListItemData,
              isLoading: false,
            });
          } else {
            this.setState({ isLoading: false });
            showErrorToaster(parsedResponse.error); 
          }
        });
    } catch (err) {
      // this.props.OnLoading();
      this.setState({ checkListItem: [], isLoading: false });
      //showErrorToaster(err);
    }
  };

  render() {
    const { selectedNode, fields, isRefreshinFields } = this.props;

    const {
      permissionOptions,
      boolTypeListOptions,
      organizations,   
      labelList,
      boards,
      colorOptions,
      checkListPositionOptions,
      boardList,
      cardList,
      checkList,
      checkListItem,
      memberList,
      boardCheckList,
      dueCompleteOptions,
      toBoards,
      toList,
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
              {field.key !== "prefs_permissionLevel" &&
                field.key !== "organization_id" &&
                field.key !== "board" &&
                field.key !== "label" &&
                field.type !== "bool" &&
                field.key !== "to_list" &&
                field.key !== "pos" &&
                field.key !== "to_board" &&
                field.key !== "checklist_item" &&
                field.key !== "checklist_pos" &&
                field.label !== "Comment Text" &&
                field.key !== "checklist_copy" &&
                field.key !== "card_pos" &&
                field.key !== "checklist" &&
                field.type !== "boolean" &&
                field.key !== "member" &&
                field.key !== "list" &&
                field.key !== "card" &&
                field.key !== "color" &&
                field.key !== "desc" && (
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
              {field.key === "prefs_permissionLevel" && (
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
                    options={permissionOptions}
                    value={
                      savedFields[field.key]
                        ? permissionOptions.find(
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

              {field.key === "organization_id" && (
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
                    options={organizations}
                    value={
                      savedFields[field.key]
                        ? organizations.find(
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

              {field.key === "to_board" && (
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
                    options={toBoards}
                    value={
                      savedFields[field.key]
                        ? toBoards.find(
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

              {field.key === "to_list" && (
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
                    options={toList}
                    value={
                      savedFields[field.key]
                        ? toList.find(
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

              {(field.key === "pos" ||
                field.key === "card_pos" ||
                field.key === "checklist_pos") && (
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
                    options={checkListPositionOptions}
                    value={
                      savedFields[field.key]
                        ? checkListPositionOptions.find(
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

              {field.key === "member" && (
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
                    options={memberList}
                    value={
                      savedFields[field.key]
                        ? memberList.find(
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
              {field.key === "checklist" && (
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
                    options={checkList}
                    value={
                      savedFields[field.key]
                        ? checkList.find(
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

              {field.key === "checklist_copy" && (
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
                    options={boardCheckList}
                    value={
                      savedFields[field.key]
                        ? boardCheckList.find(
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

              {field.key === "checklist_item" && (
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
                    options={checkListItem}
                    value={
                      savedFields[field.key]
                        ? checkListItem.find(
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

              {field.key === "label" && (
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

              {field.key === "color" && (
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
                    options={colorOptions}
                    value={
                      savedFields[field.key]
                        ? colorOptions.find(
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

              {field.key === "desc" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <TextField
                    multiline
                    fullWidth
                    rows="3"
                    defaultValue={
                      savedFields[field.key] ? savedFields[field.key].value : ""
                    }
                    onBlur={(e) =>
                      this.handleChangeSelectValue(e.target.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {field.key === "dueComplete" && (
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
                    options={dueCompleteOptions}
                    value={
                      savedFields[field.key]
                        ? dueCompleteOptions.find(
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

              {field.label === "Comment Text" && (
                <div className="col-md-12 my-2">
                  <div className="d-flex justify-content-between">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                  </div>
                  <TextField
                    multiline
                    fullWidth
                    rows="3"
                    defaultValue={
                      savedFields[field.key] ? savedFields[field.key].value : ""
                    }
                    onBlur={(e) =>
                      this.handleChangeSelectValue(e.target.value, field.key)
                    }
                  />
                  <span
                    className="text-light custome-fields-help-text"
                    dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                  ></span>
                </div>
              )}

              {(field.type === "bool" || field.type === "boolean") &&
                field.key !== "dueComplete" && (
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
                              (val) =>
                                val.value === savedFields[field.key].value
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

          {/* {isLoading && (
            <div className="loader-settings m-5">
              <CircularProgress />
            </div>
          )} */}
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
