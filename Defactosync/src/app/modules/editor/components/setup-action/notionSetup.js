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
    NOTION_AUTH_URLS,
} from "constants/IntegrationConstant";
import { TextField } from "@material-ui/core";


class NotionSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            parentPagesList: [],
            databasesList: [],
            itemsList: [],
            errorFound: false,
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "parent_page") &&
                this.state.parentPagesList.length === 0
            )
                await this.getParentPages(connectionData);
            if (
                fields.find((field) => field.key === "database") &&
                this.state.databasesList.length === 0
            )
                await this.getDatabases(connectionData);
        }
    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "parent_page") &&
                this.state.parentPagesList.length === 0
            )
                await this.getParentPages(connectionData);
        }
        if (
            fields.find((field) => field.key === "database") &&
            this.state.databasesList.length === 0
        )
            await this.getDatabases(connectionData);

    };

    handlelRefreshFields() {
        this.props.onRefreshFields();
    }

    handleChangeSelectValue = async (value, key) => {
        const { connectionData } = this.props;
        this.props.onRefreshFields();
        if(key === "database") {
            await this.getItems(connectionData, value);
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

    getParentPages = async (connection) => {
        let formdata = {
            headerValue: {
                "Authorization": `Bearer ${connection.token}`,
                Accept: "application/json",
                "Notion-Version": "2022-02-22"
            },
            method: "POST",
            APIUrl:
                NOTION_AUTH_URLS.BASE_URL + NOTION_AUTH_URLS.GET_PAGES
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = result.data.res;
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.results.length > 0) {
                                const pagesData = parsedResponse.results.filter(data => data.object === "page").filter(ele => (ele.parent.type === "page_id" || ele.parent.type === "workspace"))
                                    .map((item) => {
                                        let label = item.properties.title.title[0].plain_text
                                        return {
                                            value: item.id,
                                            label: label,
                                        };
                                    });
                                this.setState({
                                    parentPagesList: pagesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    parentPagesList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                parentPagesList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getDatabases = async (connection) => {
        const { selectedNode, connectionData } = this.props;
        let formdata = {
            headerValue: {
                "Authorization": `Bearer ${connection.token}`,
                Accept: "application/json",
                "Notion-Version": "2022-02-22"
            },
            method: "POST",
            APIUrl:
                NOTION_AUTH_URLS.BASE_URL + NOTION_AUTH_URLS.GET_PAGES
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = result.data.res;
                        if (result.status === 200 && !parsedResponse.error) {
                            const savedFields = {};
                            selectedNode.fields.forEach((fld) => {
                                savedFields[fld.key] = { ...fld };
                            });
                            if (parsedResponse.results.length > 0) {
                                const databasesData = parsedResponse.results.filter(data => data.object === "database")
                                    .map((item) => {
                                        if (Object.keys(savedFields).length > 0 && savedFields.database.value === item.id) {
                                            this.getItems(connectionData, item.id);
                                        }
                                        let label = item.title[0].plain_text
                                        return {
                                            value: item.id,
                                            label: label,
                                        };
                                    });
                                this.setState({
                                    databasesList: databasesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    databasesList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                databasesList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getItems = async (connection, id) => {
        let formdata = {
            headerValue: {
                "Authorization": `Bearer ${connection.token}`,
                Accept: "application/json",
                "Notion-Version": "2022-02-22"
            },
            method: "POST",
            APIUrl:
                NOTION_AUTH_URLS.BASE_URL + NOTION_AUTH_URLS.GET_PAGES
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.POST_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = result.data.res;
                        if (result.status === 200 && !parsedResponse.error) {
                                if (parsedResponse.results.length > 0) {
                                    const itemsData = parsedResponse.results.filter(data => data.object === "page").filter(ele => ele.parent.database_id === id)
                                        .map((item) => {
                                            let label = item.properties.Name.title.length >= 1 ? item.properties.Name.title[0].plain_text : "Untitled Page"
                                            return {
                                                value: item.id,
                                                label: label,
                                            };
                                        });
                                    this.setState({
                                        itemsList: itemsData,
                                        isLoading: false,
                                    });
                                } else {
                                    this.setState({
                                        itemsList: [],
                                        isLoading: false,
                                    });
                                }
                            } else {
                                this.setState({
                                    itemsList: [],
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
            parentPagesList,
            databasesList,
            itemsList
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
                            {field.key === "parent_page" && (
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
                                        options={parentPagesList}
                                        value={
                                            savedFields[field.key]
                                                ? parentPagesList.find(
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


                            {(field.key === "title" || field.key === "name"
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


                            {(field.key === "content") && (
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

                            {field.key === "database" && (
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
                                        options={databasesList}
                                        value={
                                            savedFields[field.key]
                                                ? databasesList.find(
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

                           {field.key === "item" && (
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
                                        options={itemsList}
                                        value={
                                            savedFields[field.key]
                                                ? itemsList.find(
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

export default NotionSetup;
