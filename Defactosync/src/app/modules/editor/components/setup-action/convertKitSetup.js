import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
    AUTH_INTEGRATION,
    CONVERTKIT_AUTH_URLS,
} from "constants/IntegrationConstant";

class ConvertKitSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            fieldsList: [],
            tags: [],
            forms: [],
            courses: [],
            errorFound: false,
            boolTypeListOptions: [
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
            ],
            statusOptions: [
                { value: "paid", label: "Paid" }
            ],
            currencyOptions: [
                { value: "USD", label: "United States dollar" },
                { value: "EUR", label: "Euro" },
                { value: "JPY", label: "Japanese yen" },
                { value: "GBP", label: "Pound sterling" },
                { value: "AUD", label: "Australian dollar" },
                { value: "CAD", label: "Canadain dollar" },
                { value: "CHF", label: "Swiss franc" },
                { value: "CNY", label: "Renminbi" }
            ]
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "id") &&
                this.state.tags.length === 0
            )
                await this.getTags(connectionData);


            if (
                fields.find((field) => field.key === "form_id") &&
                this.state.forms.length === 0
            )
                await this.getForms(connectionData);


            if (
                fields.find((field) => field.key === "sequence_id") &&
                this.state.courses.length === 0
            )
                await this.getSequences(connectionData);

        }

    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {

            if (
                fields.find((field) => field.key === "id") &&
                this.state.tags.length === 0
            )
                await this.getTags(connectionData);


            if (
                fields.find((field) => field.key === "form_id") &&
                this.state.forms.length === 0
            )
                await this.getForms(connectionData);


            if (
                fields.find((field) => field.key === "sequence_id") &&
                this.state.courses.length === 0
            )
                await this.getSequences(connectionData);
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

    getTags = async (connection) => {
        let formdata = {
            APIUrl: CONVERTKIT_AUTH_URLS.BASE_URL + CONVERTKIT_AUTH_URLS.GET_TAGS.replace("{apiSecret}", connection.token),
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.tags.length > 0) {
                                const tagsData = parsedResponse.tags.map((tag) => {
                                    return {
                                        value: tag.id,
                                        label: tag.name,
                                    };
                                });
                                this.setState({
                                    tags: tagsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    tags: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                tags: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getForms = async (connection) => {        
        let formdata = {
            APIUrl: CONVERTKIT_AUTH_URLS.BASE_URL + CONVERTKIT_AUTH_URLS.GET_FORMS.replace("{apiSecret}", connection.token),
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {                   
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.forms.length > 0) {
                                const formsData = parsedResponse.forms.map((form) => {
                                    return {
                                        value: form.id,
                                        label: form.name,
                                    };
                                });
                                this.setState({
                                    forms: formsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    forms: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                forms: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getSequences = async (connection) => {
        let formdata = {
            APIUrl: CONVERTKIT_AUTH_URLS.BASE_URL + CONVERTKIT_AUTH_URLS.GET_SEQUENCES.replace("{apiSecret}", connection.token),
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.courses.length > 0) {
                                const coursesData = parsedResponse.courses.map((course) => {
                                    return {
                                        value: course.id,
                                        label: course.name,
                                    };
                                });
                                this.setState({
                                    courses: coursesData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    courses: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                courses: [],
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
        const { isLoading, tags, boolTypeListOptions, forms, courses, statusOptions, currencyOptions } = this.state;

        const savedFields = {};
        selectedNode.fields.forEach((fld) => {
            savedFields[fld.key] = { ...fld };
        });

        return (
            <>
                <div>
                    {fields.map((field) => (
                        <>
                            {(field.key === "emailAddress" || field.key === "email" ||
                                field.key === "transaction_id" ||
                                field.key === "email_address" ||
                                field.key === "subtotal" ||
                                field.key === "tax" ||
                                field.key === "shipping" ||
                                field.key === "discount" ||
                                field.key === "total" ||
                                field.key === "transaction_time" ||
                                field.key === "pid" ||
                                field.key === "sku" ||
                                field.key === "unit_price" ||
                                field.key === "quantity" ||
                                field.key === "name"
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

                            {field.key === "id" && (
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
                                        options={tags}
                                        value={
                                            savedFields[field.key]
                                                ? tags.find(
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

                            {field.key === "form_id" && (
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
                                        options={forms}
                                        value={
                                            savedFields[field.key]
                                                ? forms.find(
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

                            {field.key === "sequence_id" && (
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
                                        options={courses}
                                        value={
                                            savedFields[field.key]
                                                ? courses.find(
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
                                        options={currencyOptions}
                                        value={
                                            savedFields[field.key]
                                                ? currencyOptions.find(
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

                            {field.type === "boolean" && (
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

export default ConvertKitSetup;
