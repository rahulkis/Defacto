import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster} from "appUtility/commonFunction";
import {
    AUTH_INTEGRATION,
    CLICKUP_AUTH_URLS,
} from "constants/IntegrationConstant";

class ClickUpSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            fieldsList: [],
            spaces: [],
            tasks: [],
            lists: [],
            errorFound: false,
            boolTypeListOptions: [
                { value: "true", label: "True" },
                { value: "false", label: "False" },
            ],
            priorityListOptions: [
                { value: "1", label: "Urgent" },
                { value: "2", label: "High" },
                { value: "3", label: "Normal" },
                { value: "4", label: "Low" },
            ]
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {

            if (
                fields.find((field) => field.key === "workspace") &&
                this.state.spaces.length === 0
            )
                await this.getSpaces(connectionData);
            if (
                fields.find((field) => (field.key === "task" || field.key === "parent_task")) &&
                this.state.tasks.length === 0
            )
                await this.getTasks(connectionData);

            if (
                fields.find((field) => field.key === "list") &&
                this.state.lists.length === 0
            )
                await this.getLists(connectionData);
        }
    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {


            if (
                fields.find((field) => field.key === "workspace") &&
                this.state.spaces.length === 0
            )
                await this.getSpaces(connectionData);

            if (
                fields.find((field) => (field.key === "task" || field.key === "parent_task")) &&
                this.state.tasks.length === 0
            )
                await this.getTasks(connectionData);

            if (
                fields.find((field) => field.key === "list") &&
                this.state.lists.length === 0
            )
                await this.getLists(connectionData);
        }

    };

    //get spaces by teams
    getSpaces = async (connection) => {
        this.setState({
            isLoading: true,
        });
        let formdata = {
            headerValue: {
                Authorization: connection.token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_TEAMS
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        let teams = JSON.parse(result.data.res).teams;
                        let spacesData = [];
                        if (teams.length) {

                            await Promise.all(
                                teams.map((team) =>
                                    this.getSpacesData(connection.token, team.id, spacesData)
                                )
                            )

                            this.setState({
                                spaces: spacesData[0],
                                isLoading: false,
                            });
                        } else {
                            this.setState({
                                spaces: [],
                                isLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            spaces: [],
                            isLoading: false,
                        });
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    //get spaces data
    getSpacesData = async (token, id, spacesData) => {
        let formdata = {
            headerValue: {
                Authorization: token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_SPACES.replace("{id}", id)
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.spaces.length > 0) {
                                const spaceData = parsedResponse.spaces.map((space) => {
                                    return {
                                        value: space.id,
                                        label: space.name,
                                    };
                                });
                                spacesData.push(spaceData);
                            }
                        }
                    }

                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    //get tasks by teams
    getTasks = async (connection) => {
        this.setState({
            isLoading: true,
        });
        let formdata = {
            headerValue: {
                Authorization: connection.token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_TEAMS
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        let teams = JSON.parse(result.data.res).teams;
                        let tasksData = [];
                        if (teams.length) {
                            await Promise.all(
                                teams.map((team) =>
                                    this.getTasksData(connection.token, team.id, tasksData)
                                )
                            )
                            this.setState({
                                tasks: tasksData[0],
                                isLoading: false,
                            });
                        } else {
                            this.setState({
                                tasks: [],
                                isLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            tasks: [],
                            isLoading: false,
                        });
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    //get tasks data
    getTasksData = async (token, id, tasksData) => {
        let formdata = {
            headerValue: {
                Authorization: token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_TASKS.replace("{id}", id)
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.tasks.length > 0) {
                                const taskData = parsedResponse.tasks.map((task) => {
                                    return {
                                        value: task.id,
                                        label: task.name,
                                    };
                                });
                                tasksData.push(taskData);
                            }
                        }
                    }

                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    //get Lists
    getLists = async (connection) => {
        this.setState({
            isLoading: true,
        });
        let formdata = {
            headerValue: {
                Authorization: connection.token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_TEAMS
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        let teams = JSON.parse(result.data.res).teams;
                        let spacesData = [];
                        let listsData = [];
                        if (teams.length) {
                            await Promise.all(
                                teams.map((team) =>
                                    this.getSpacesData(connection.token, team.id, spacesData)
                                )
                            )
                            await Promise.all(
                                spacesData[0].map((space) =>
                                    this.getListsData(connection.token, space.value, listsData)
                                )
                            )
                            let mergedLists = [].concat.apply([], listsData);
                            this.setState({
                                lists: mergedLists,
                                isLoading: false,
                            });
                        } else {
                            this.setState({
                                lists: [],
                                isLoading: false,
                            });
                        }
                    } else {
                        this.setState({
                            lists: [],
                            isLoading: false,
                        });
                    }
                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    //get lists data
    getListsData = async (token, id, listsData) => {
        let formdata = {
            headerValue: {
                Authorization: token,
                Accept: "application/json"
            },
            APIUrl: CLICKUP_AUTH_URLS.BASE_URL + CLICKUP_AUTH_URLS.GET_LISTS.replace("{id}", id)
        };
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata).then(async (result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.lists.length > 0) {
                                const listData = parsedResponse.lists.map((list) => {
                                    return {
                                        value: list.id,
                                        label: list.name,
                                    };
                                });
                                listsData.push(listData);
                            }
                        }
                    }

                });
        } catch (err) {
            this.setState({ isLoading: false });
            showErrorToaster(err);
        }
    };

    handlelRefreshFields() {
        this.props.onRefreshFields();
    }

    handleChangeSelectValue = async (value, key) => {
        this.props.onRefreshFields();
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



    render() {
        const { fields, isRefreshingFields, selectedNode } = this.props;
        const { isLoading, boolTypeListOptions, priorityListOptions, spaces, tasks, lists } = this.state;

        const savedFields = {};
        selectedNode.fields.forEach((fld) => {
            savedFields[fld.key] = { ...fld };
        });

        return (
            <>
                <div>
                    {fields.map((field) => (
                        <>
                            {(field.key === "task_name" || field.key === "list_name" || field.key === "folder_name" ||
                                field.key === "checklist_name" || field.key === "checklist_item" || field.key === "comment" ||
                                field.key === "assignee_emails" || field.key === "start" || field.key === "end" ||
                                field.key === "due_date" ||
                                field.key === "start_date") && (
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

                            {(field.key === "task_desc" || field.key === "list_info") && (
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



                            {field.type === "bool"
                                && (
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

                            {
                                field.key === "workspace" && (
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
                                            options={spaces}
                                            value={
                                                savedFields[field.key]
                                                    ? spaces.find(
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

                            {
                                (field.key === "task" || field.key === "parent_task") && (
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
                                            options={tasks}
                                            value={
                                                savedFields[field.key]
                                                    ? tasks.find(
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

                            {
                                field.key === "list" && (
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
                                            options={lists}
                                            value={
                                                savedFields[field.key]
                                                    ? lists.find(
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


                            {
                                field.key === "priority" && (
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
                                            options={priorityListOptions}
                                            value={
                                                savedFields[field.key]
                                                    ? priorityListOptions.find(
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

export default ClickUpSetup;
