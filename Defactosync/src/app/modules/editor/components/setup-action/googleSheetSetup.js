import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import XMLParser from 'react-xml-parser';
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import { httpClient } from "appUtility/Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showErrorToaster } from "appUtility/commonFunction";
import {
    updateNodesList,
    onChangeNodeApp
} from "actions/index";
import {
    AUTH_INTEGRATION,
    GOOGLE_SHEET_AUTH_URLS,
} from "constants/IntegrationConstant";

class GoogleSheetSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            fieldsList: [],
            spreadSheets: [],
            workSheets: [],
            errorFound: false,
            boolTypeListOptions: [
                { value: "true", label: "True" },
                { value: "false", label: "False" },
            ],
            driveListOptions: [
                { value: "googledrive", label: "My Google Drive" }

            ]

        };
    }

    componentWillMount = async () => {

        const { connectionData, fields, selectedNode } = this.props;
        console.log("connectionData", connectionData);
        if (connectionData) {
            if (selectedNode.fields.length > 0) {
                selectedNode.fields.forEach(async (fld) => {

                    if (fld.key === "spreadsheet") {
                        await this.getWorksheets(connectionData, fld.value);
                    }
                });
            }
            if (
                fields.find((field) => field.key === "spreadsheet" || field.key === "spreadsheet_selected" || field.key === "copy_to" || field.key === "spreadsheet_to_update" || field.key === "spreadsheet_to_get" || field.key === "spreadsheet_to_delete" || field.key === "spreadsheet_to_copy") &&
                this.state.spreadSheets.length === 0
            )

                await this.getSpreadSheets(connectionData);
        }

    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields, selectedNode } = this.props;
        if (connectionData) {
            if (selectedNode.fields.length > 0) {
                selectedNode.fields.forEach(async (fld) => {

                    if (fld.key === "spreadsheet") {
                        await this.getWorksheets(connectionData, fld.value);
                    }
                });
            }
            if (
                fields.find((field) => field.key === "spreadsheet" || field.key === "spreadsheet_selected" || field.key === "copy_to" || field.key === "spreadsheet_to_update" || field.key === "spreadsheet_to_get" || field.key === "spreadsheet_to_delete" || field.key === "spreadsheet_to_copy") &&
                this.state.spreadSheets.length === 0
            )
               
            await this.getSpreadSheets(connectionData);
        }
    };

    handlelRefreshFields() {
        this.props.onRefreshFields();
    }

    handleChangeSelectValue = async (value, key) => {
        const { connectionData, selectedNode, nodesList } = this.props;       
        if (
            (key === "spreadsheet")
        ) {
            const nodeIndex = nodesList.findIndex((node) => node.id === selectedNode.id);
            const newNodeObj = {
                ...selectedNode,
                fields: []
            };
            nodesList[nodeIndex] = newNodeObj;
            await this.updateFields(nodesList, newNodeObj);
        }
        this.props.onRefreshFields();
        this.props.onChangeValue(value, key);

        if (key === "spreadsheet") {
            await this.getWorksheets(connectionData, value);
        }
    };

    // update fields
    updateFields = async (nodesList, newNodeObj) => {

        let _self = this.props
        return new Promise(async function (resolve, reject) {

            _self.updateNodesList(nodesList);
            _self.onChangeNodeApp(newNodeObj);
            resolve(true);

        });
    };

    getSpreadSheets = async (connectionData) => {        
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connectionData.tokenInfo.access_token
            },
            APIUrl: GOOGLE_SHEET_AUTH_URLS.GET_SPREADSHEETS,
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {                        
                        const parsedResponse = new XMLParser().parseFromString(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.name !== "HTML") {
                                const spreadSheetData = parsedResponse.children.filter(x => x.name === "entry").map((y) => y.children.filter(z => z.name === 'id' || z.name === 'title')).map(g => { return { label: g[1].value, value: g[0].value.split('full/')[1] } })

                                this.setState({
                                    spreadSheets: spreadSheetData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    spreadSheets: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                spreadSheets: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
    };

    getWorksheets = async (connectionData, id) => { 
        let formdata = {
            headerValue: {
                Authorization: "Bearer " + connectionData.tokenInfo.access_token
            },
            APIUrl: GOOGLE_SHEET_AUTH_URLS.BASE_URL + GOOGLE_SHEET_AUTH_URLS.GET_WORKSHEETS.replace("{spreadsheetId}", id),
        };
        //this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {                      
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                            if (parsedResponse.sheets.length > 0) {
                                const workSheetsData = parsedResponse.sheets.map((sheet) => {
                                    return {
                                        value: (sheet.properties.sheetId).toString(),
                                        label: sheet.properties.title
                                    };
                                });

                                this.setState({
                                    workSheets: workSheetsData,
                                    isLoading: false,
                                });
                            } else {
                                this.setState({
                                    workSheets: [],
                                    isLoading: false,
                                });
                            }
                        } else {
                            this.setState({
                                workSheets: [],
                                isLoading: false,
                            });
                        }
                    }
                });
        } catch (err) {
            showErrorToaster(err);
        }
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
        const {
            isLoading,
            driveListOptions,
            spreadSheets, workSheets
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


                            {field.key === "drive" && (
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
                                        options={driveListOptions}
                                        value={
                                            savedFields[field.key]
                                                ? driveListOptions.find(
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
                            {(field.key === "spreadsheet" || field.key === "copy_to" || field.key === "spreadsheet_selected" || field.key === "spreadsheet_to_update" || field.key === "spreadsheet_to_copy" || field.key === "spreadsheet_to_get" || field.key === "spreadsheet_to_delete") && (
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
                                        options={spreadSheets}
                                        value={
                                            savedFields[field.key]
                                                ? spreadSheets.find(
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

                            {field.key === "worksheet" && (
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
                                        options={workSheets}
                                        value={
                                            savedFields[field.key]
                                                ? workSheets.find(
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

                            {(field.key === "title" || field.key === "range" || field.key === "value" || field.key === "start_index" || field.key === "end_index" ||
                                field.key === "headers") && (
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

//export default GoogleSheetSetup;

const mapStateToProps = ({ echo }) => {
    const { nodesList } = echo;
    return { nodesList };
};

export default connect(mapStateToProps, {
    updateNodesList,
    onChangeNodeApp
})(GoogleSheetSetup);
