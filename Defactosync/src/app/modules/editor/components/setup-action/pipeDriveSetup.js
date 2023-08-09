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
    PIPEDRIVE_AUTH_URLS
} from "constants/IntegrationConstant";
import { TextField } from "@material-ui/core";

class PipeDriveSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            stagesList: [],
            ownersList: [],
            organizationsList: [],
            personsList: [],
            currencyList: [],
            dealsList: [],
            typesList: [],
            activityList: [],
            labelsList: [],
            errorFound: false,
            statusList: [
                { value: "open", label: "Open" },
                { value: "won", label: "Won" },
                { value: "lost", label: "Lost" },
                { value: "deleted", label: "Deleted" },
            ],
            visibleToList: [
                { value: 1, label: "Owner & followers" },
                { value: 3, label: "Entire company" }
            ],
            isActiveList: [
                { value: 1, label: "Yes" },
                { value: 0, label: "No" }
            ]
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "stage") &&
                this.state.stagesList.length === 0
            )
                await this.getStages(connectionData);
            if (
                fields.find((field) => field.key === "owner") &&
                this.state.ownersList.length === 0
            )
                await this.getOwners(connectionData);
            if (
                fields.find((field) => field.key === "assign_to") &&
                this.state.ownersList.length === 0
            )
                await this.getOwners(connectionData);
            if (
                fields.find((field) => field.key === "organization") &&
                this.state.organizationsList.length === 0
            )
                await this.getOrganizations(connectionData);

            if (
                fields.find((field) => field.key === "person") &&
                this.state.personsList.length === 0
            )
                await this.getPersons(connectionData);
            if (
                fields.find((field) => field.key === "currency") &&
                this.state.currencyList.length === 0
            )
                await this.getCurrency(connectionData);
            if (
                fields.find((field) => field.key === "deal") &&
                this.state.dealsList.length === 0
            )
                await this.getDeals(connectionData);
            if (
                fields.find((field) => field.key === "type") &&
                this.state.typesList.length === 0
            )
                await this.getTypes(connectionData);
            if (
                fields.find((field) => field.key === "activity") &&
                this.state.activityList.length === 0
            )
                await this.getActivity(connectionData);
            if (
                fields.find((field) => field.key === "label") &&
                this.state.labelsList.length === 0
            )
                await this.getLabels(connectionData);
        }
    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "stage") &&
                this.state.stagesList.length === 0
            )
                await this.getStages(connectionData);
            if (
                fields.find((field) => field.key === "owner") &&
                this.state.ownersList.length === 0
            )
                await this.getOwners(connectionData);
            if (
                fields.find((field) => field.key === "assign_to") &&
                this.state.ownersList.length === 0
            )
                await this.getOwners(connectionData);
            if (
                fields.find((field) => field.key === "organization") &&
                this.state.organizationsList.length === 0
            )
                await this.getOrganizations(connectionData);
            if (
                fields.find((field) => field.key === "person") &&
                this.state.personsList.length === 0
            )
                await this.getPersons(connectionData);
            if (
                fields.find((field) => field.key === "currency") &&
                this.state.currencyList.length === 0
            )
                await this.getCurrency(connectionData);
            if (
                fields.find((field) => field.key === "deal") &&
                this.state.dealsList.length === 0
            )
                await this.getDeals(connectionData);
            if (
                fields.find((field) => field.key === "type") &&
                this.state.typesList.length === 0
            )
                await this.getTypes(connectionData);
            if (
                fields.find((field) => field.key === "activity") &&
                this.state.activityList.length === 0
            )
                await this.getActivity(connectionData);
            if (
                fields.find((field) => field.key === "label") &&
                this.state.labelsList.length === 0
            )
                await this.getLabels(connectionData);

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

    getStages = async (connection) => {
        console.log(connection, "connection")
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_STAGES.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const stagesData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name + " ( " + item.pipeline_name + " )",
                                    };
                                });
                                this.setState({
                                    stagesList: stagesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    stagesList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                stagesList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getOwners = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_USERS.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const usersData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    ownersList: usersData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    ownersList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                ownersList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getOrganizations = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_ORGANIZATIONS.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const organizationsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    organizationsList: organizationsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    organizationsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                organizationsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getPersons = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_PERSONS.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const personsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    personsList: personsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    personsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                personsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getCurrency = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_CURRENCY.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const currencyData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.code,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    currencyList: currencyData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    currencyList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                currencyList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getDeals = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_DEALS.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const dealsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.title,
                                    };
                                });
                                this.setState({
                                    dealsList: dealsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    dealsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                dealsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getTypes = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_TYPES.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const typesData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    typesList: typesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    typesList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                typesList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getActivity = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_ACTIVITY.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const activityData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.subject,
                                    };
                                });
                                this.setState({
                                    activityList: activityData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    activityList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                activityList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };


    getLabels = async (connection) => {
        let formdata = {
            headerValue: {
                "Api-Token": connection.token,
                Accept: "application/json",
            },
            APIUrl:
                connection.endPoint + PIPEDRIVE_AUTH_URLS.GET_LABELS.replace("{APITOKEN}", connection.token)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.data.length > 0) {
                                const labelsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name + " (" + item.color + ")",
                                    };
                                });
                                this.setState({
                                    labelsList: labelsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    labelsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                labelsList: [],
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
            organizationsList,
            personsList,
            stagesList,
            ownersList,
            statusList,
            currencyList,
            visibleToList,
            dealsList,
            isActiveList,
            typesList,
            activityList,
            labelsList
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

                            {field.key === "deal" && (
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
                                        options={dealsList}
                                        value={
                                            savedFields[field.key]
                                                ? dealsList.find(
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

                            {field.key === "activity" && (
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
                                        options={activityList}
                                        value={
                                            savedFields[field.key]
                                                ? activityList.find(
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


                            {(field.key === "title" || field.key === "creation_date" || field.key === "expected_close_date"
                                || field.key === "value" || field.key === "name" || field.key === "code" || field.key === "unit" || field.key === "tax_percentage"
                                || field.key === "price" || field.key === "cost" || field.key === "overhead_cost" || field.key === "subject" || field.key === "due_date_and_time"
                                || field.key === "duration" || field.key === "email" || field.key === "phone"
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
                                        options={statusList}
                                        value={
                                            savedFields[field.key]
                                                ? statusList.find(
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


                            {field.key === "stage" && (
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
                                        options={stagesList}
                                        value={
                                            savedFields[field.key]
                                                ? stagesList.find(
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

                            {(field.key === "owner" || field.key === "assign_to") && (
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
                                        options={ownersList}
                                        value={
                                            savedFields[field.key]
                                                ? ownersList.find(
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


                            {field.key === "organization" && (
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
                                        options={organizationsList}
                                        value={
                                            savedFields[field.key]
                                                ? organizationsList.find(
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


                            {field.key === "person" && (
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
                                        options={personsList}
                                        value={
                                            savedFields[field.key]
                                                ? personsList.find(
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

                            {field.key === "currency" && (
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
                                        options={currencyList}
                                        value={
                                            savedFields[field.key]
                                                ? currencyList.find(
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


                            {field.key === "visible_to" && (
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
                                        options={visibleToList}
                                        value={
                                            savedFields[field.key]
                                                ? visibleToList.find(
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

                            {(field.key === "is_active" || field.key === "is_done") && (
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
                                        options={isActiveList}
                                        value={
                                            savedFields[field.key]
                                                ? isActiveList.find(
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

                            {field.key === "type" && (
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
                                        options={typesList}
                                        value={
                                            savedFields[field.key]
                                                ? typesList.find(
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

                            {field.key === "note" && (
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

                            {field.key === "label" && (
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
                                        options={labelsList}
                                        value={
                                            savedFields[field.key]
                                                ? labelsList.find(
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

export default PipeDriveSetup;
