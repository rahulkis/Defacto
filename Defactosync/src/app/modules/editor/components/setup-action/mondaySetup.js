import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  MONDAY_AUTH_URLS,
} from "constants/IntegrationConstant";

class MondaySetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      noFieldsAvailable: false,
      boardsList: [],
      groupsList: [],
      errorFound: false,
      columnType: [
          {value: "auto_number", label: "auto_number"},
          {value: "checkbox", label: "checkbox"},
          {value: "country", label: "country"},
          {value: "color_picker", label: "color_picker"},
          {value: "creation_log", label: "creation_log"},
          {value: "date", label: "date"},
          {value: "dropdown", label: "dropdown"},
          {value: "email", label: "email"},
          {value: "hour", label: "hour"},
          {value: "item_id", label: "item_id"},
          {value: "last_updated", label: "last_updated"},
          {value: "link", label: "link"},
          {value: "location", label: "location"},
          {value: "long_text", label: "long_text"},
          {value: "numbers", label: "numbers"},
          {value: "people", label: "people"},
          {value: "phone", label: "phone"},
          {value: "progress", label: "progress"},
          {value: "rating", label: "rating"},
          {value: "status", label: "status"},
          {value: "team", label: "team"},
          {value: "tags", label: "tags"},
          {value: "text", label: "text"},
          {value: "timeline", label: "timeline"},
          {value: "time_tracking", label: "time_tracking"},
          {value: "vote", label: "vote"},
          {value: "week", label: "week"},
          {value: "world_clock", label: "world_clock"}
      ],
      boardKind: [
          {value: "public", label: "Main"},
          {value: "private", label: "Private"},
          {value: "share", label: "sharable"}
      ],
      duplicateType: [
          {value: "duplicate_board_with_structure", label: "Duplicate board with structure"},
          {value: "duplicate_board_with_pulses", label: "Duplicate board with pulses"}
      ],
      addToTop: [
          {value: "true", label: "True"},
          {value: "false", label: "False"}
      ]
    };
  }

  componentWillMount = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "board_id") &&
        this.state.boardsList.length === 0
      )
        await this.getBoards(connectionData);
    }
  };

  componentWillReceiveProps = async () => {
    const { connectionData, fields } = this.props;
    if (connectionData) {
      if (
        fields.find((field) => field.key === "board_id") &&
        this.state.boardsList.length === 0
      )
        await this.getBoards(connectionData);
    }
  };

  handlelRefreshFields() {
    this.props.onRefreshFields();
  }

  handleChangeSelectValue = async (value, key) => {
    const { connectionData } = this.props;
    this.props.onRefreshFields();
    if(key === "board_id") {
       await this.getGroups(connectionData, value);
    }
    this.props.onChangeValue(value, key);
  };

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

  getBoards = async (connection) => {
    const { selectedNode, connectionData } = this.props;
    let formdata = {
      headerValue: {
        "Authorization": connection.token,
        Accept: "application/json",
      },
      APIUrl:
      MONDAY_AUTH_URLS.BASE_URL + "/v2" + MONDAY_AUTH_URLS.GET_BOARDS
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
                const savedFields = {};
                selectedNode.fields.forEach((fld) => {
                  savedFields[fld.key] = { ...fld };
                });
              if (parsedResponse.data.boards.length > 0) {
                const boardsData = parsedResponse.data.boards.map((item) => {
                    if(Object.keys(savedFields).length > 0 && savedFields.board_id.value === item.id) {
                         this.getGroups(connectionData, item.id);
                    }
                  return {
                    value: item.id,
                    label: item.name,
                  };
                });
                this.setState({
                  boardsList: boardsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  boardsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                boardsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };

  getGroups = async (connection, value) => {
    let formdata = {
      headerValue: {
        "Authorization": connection.token,
        Accept: "application/json",
      },
      APIUrl:
      MONDAY_AUTH_URLS.BASE_URL + "/v2" + MONDAY_AUTH_URLS.GET_GROUPS.replace("{BOARD_ID}", value)
    };
    this.setState({ isLoading: true });
    try {
      await httpClient
        .post(AUTH_INTEGRATION.GET_API, formdata)
        .then((result) => {
          if (result.status === 200) {
            const parsedResponse = JSON.parse(result.data.res);
            if (result.status === 200 && !parsedResponse.error) {
              if (parsedResponse.data.boards.length > 0) {
                const groupsData = parsedResponse.data.boards[0].groups.map((item) => {
                  return {
                    value: item.id,
                    label: item.title,
                  };
                });
                this.setState({
                  groupsList: groupsData,
                  isLoading: false,
                });
              } else {
                this.setState({
                  groupsList: [],
                  isLoading: false,
                });
              }
            } else {
              this.setState({
                groupsList: [],
                isLoading: false,
              });
            }
          }
        });
    } catch (err) {
      showErrorToaster(err);
    }
  };



  render() {
    const { fields, isRefreshingFields, selectedNode } = this.props;
    const {
      isLoading,
      boardsList,
      groupsList,
      columnType,
      boardKind,
      duplicateType,
      addToTop
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
            {field.key === "board_id" && (
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
                    options={boardsList}
                    value={
                      savedFields[field.key]
                        ? boardsList.find(
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

            {field.key === "group_id" && (
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
                    options={groupsList}
                    value={
                      savedFields[field.key]
                        ? groupsList.find(
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

              {(field.key === "item_name" || field.key === "column_title" || field.key === "board_name" || field.key === "group_name"
              || field.key === "body" || field.key === "name" || field.key === "description" || field.key === "new_group_title"
              ) && (
                  <div className="col-md-12 my-2">
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



            {field.key === "column_type" && (
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
                    options={columnType}
                    value={
                      savedFields[field.key]
                        ? columnType.find(
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


            {field.key === "board_kind" && (
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
                    options={boardKind}
                    value={
                      savedFields[field.key]
                        ? boardKind.find(
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

            {field.key === "duplicate_type" && (
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
                    options={duplicateType}
                    value={
                      savedFields[field.key]
                        ? duplicateType.find(
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

            {field.key === "should_add_group_to_top" && (
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
                    options={addToTop}
                    value={
                      savedFields[field.key]
                        ? addToTop.find(
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
                {!isRefreshingFields && <span>Refresh fields</span>}
                {isRefreshingFields && <span>Refreshing fields...</span>}
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

export default MondaySetup;
