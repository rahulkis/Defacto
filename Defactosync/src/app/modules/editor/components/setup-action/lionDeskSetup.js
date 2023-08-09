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
    LIONDESK_AUTH_URLS,
} from "constants/IntegrationConstant";

class LionDeskSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            compaignsList: [],
            tagsList: [],
            contactsList: [],
            hotnessList: [],
            contactSourcesList: [],
            typeAddressList: [
                {label: "Home", value: "Home"},
                {label: "Main Office", value: "Main Office"},
                {label: "Branch Office", value: "Branch Office"},
                {label: "Second Office", value: "Second Office"},
                {label: "Investment", value: "Investment"},
                {label: "Mailing", value: "Mailing"}
            ],
            errorFound: false,
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "compaign") &&
                this.state.compaignsList.length === 0
            )
                await this.getCompaigns(connectionData);
            if (
                fields.find((field) => field.key === "tag") || 
                fields.find((field) => field.key === "contact_tags") &&
                this.state.tagsList.length === 0
            )
                await this.getTags(connectionData);
            if (
                fields.find((field) => field.key === "contact_lionDesk") &&
                this.state.contactsList.length === 0
            )
                await this.getContacts(connectionData);
            if (
                fields.find((field) => field.key === "hotness") || 
                fields.find((field) => field.key === "contact_hotness") &&
                this.state.hotnessList.length === 0
            )
                await this.getHotness(connectionData);
            if (
                fields.find((field) => field.key === "contact_source") &&
                this.state.contactSourcesList.length === 0
            )
                await this.getContactSources(connectionData);
        }
    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "compaign") &&
                this.state.compaignsList.length === 0
            )
                await this.getCompaigns(connectionData);
            if (
                fields.find((field) => field.key === "tag") || 
                fields.find((field) => field.key === "contact_tags") &&
                this.state.tagsList.length === 0
            )
                await this.getTags(connectionData);
            if (
                fields.find((field) => field.key === "contact_lionDesk") &&
                this.state.contactsList.length === 0
            )
                await this.getContacts(connectionData);
            if (
                fields.find((field) => field.key === "hotness") || 
                fields.find((field) => field.key === "contact_hotness") &&
                this.state.hotnessList.length === 0
            )
                await this.getHotness(connectionData);
            if (
                fields.find((field) => field.key === "contact_source") &&
                this.state.contactSourcesList.length === 0
            )
                await this.getContactSources(connectionData);
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

    getCompaigns = async (connection) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connection.tokenInfo.access_token,
                Accept: "application/json",
            },
            APIUrl:
                LIONDESK_AUTH_URLS.BASE_URL + LIONDESK_AUTH_URLS.GET_COMPAIGN
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
                                const compaignsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    compaignsList: compaignsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    compaignsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                compaignsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getTags = async (connection) => {
        const { fields } = this.props;
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connection.tokenInfo.access_token,
                Accept: "application/json",
            },
            APIUrl:
                LIONDESK_AUTH_URLS.BASE_URL + LIONDESK_AUTH_URLS.GET_TAG
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
                                const tagsData = parsedResponse.data.map((item) => {
                                    if(fields.find((field) => field.key === "tag")) {
                                        return {
                                            value: item.id,
                                            label: item.content,
                                        };
                                    } else {
                                        return {
                                            value: item.content,
                                            label: item.content,
                                        };
                                    }
                                    
                                });
                                this.setState({
                                    tagsList: tagsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    tagsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                tagsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getContacts = async (connection) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connection.tokenInfo.access_token,
                Accept: "application/json",
            },
            APIUrl:
                LIONDESK_AUTH_URLS.BASE_URL + LIONDESK_AUTH_URLS.GET_CONTACT
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
                                const contactsData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.first_name + " " + item.last_name,
                                    };
                                });
                                this.setState({
                                    contactsList: contactsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    contactsList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                contactsList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };


    getHotness = async (connection) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connection.tokenInfo.access_token,
                Accept: "application/json",
            },
            APIUrl:
                LIONDESK_AUTH_URLS.BASE_URL + LIONDESK_AUTH_URLS.GET_HOTNESS
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
                                const hotnessData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    hotnessList: hotnessData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    hotnessList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                hotnessList: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };


    getContactSources = async (connection) => {
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connection.tokenInfo.access_token,
                Accept: "application/json",
            },
            APIUrl:
                LIONDESK_AUTH_URLS.BASE_URL + LIONDESK_AUTH_URLS.GET_CONTACT_SOURCE
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
                                const contactSorucesData = parsedResponse.data.map((item) => {
                                    return {
                                        value: item.id,
                                        label: item.name,
                                    };
                                });
                                this.setState({
                                    contactSourcesList: contactSorucesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    contactSourcesList: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                contactSourcesList: [],
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
            hotnessList,
            tagsList,
            compaignsList,
            contactsList,
            contactSourcesList,
            typeAddressList
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
                            {(field.key === "compaign_name" || field.key === "tag_name" || field.key === "tags"
                            || field.key === "first_name" || field.key === "last_name" || field.key === "primary_email" 
                            || field.key === "mobile_phone" || field.key === "home_phone" || field.key === "office_phone" 
                            || field.key === "company" || field.key === "birthday" 
                            || field.key === "address_1" || field.key === "address_2" || field.key === "city"
                            || field.key === "state" || field.key === "zip_code" 
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


                            {field.key === "compaign" && (
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
                                        options={compaignsList}
                                        value={
                                            savedFields[field.key]
                                                ? compaignsList.find(
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


                            {(field.key === "tag" || field.key === "contact_tags") && (
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
                                        options={tagsList}
                                        value={
                                            savedFields[field.key]
                                                ? tagsList.find(
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



                            {field.key === "contact_lionDesk" && (
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
                                        options={contactsList}
                                        value={
                                            savedFields[field.key]
                                                ? contactsList.find(
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

                            {(field.key === "hotness" || field.key === "contact_hotness") && (
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
                                        options={hotnessList}
                                        value={
                                            savedFields[field.key]
                                                ? hotnessList.find(
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

                            {field.key === "contact_source" && (
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
                                        options={contactSourcesList}
                                        value={
                                            savedFields[field.key]
                                                ? contactSourcesList.find(
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


                            {field.key === "type_of_address" && (
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
                                        options={typeAddressList}
                                        value={
                                            savedFields[field.key]
                                                ? typeAddressList.find(
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

export default LionDeskSetup;
