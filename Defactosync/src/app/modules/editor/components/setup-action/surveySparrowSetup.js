import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    AUTH_INTEGRATION,
    SURVEYSPARROW_AUTH_URLS
  } from "constants/IntegrationConstant";
import { httpClient } from "appUtility/Api";
import { showErrorToaster } from "appUtility/commonFunction";

class SurveySparrowSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noFieldsAvailable: false,
            errorFound: false,
            surveyList: [],
            npsSurveyList: [],
            emailShareTemplatesList: [],
            npsEmailShareTemplatesList: []
        };
    }

    componentWillMount = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "survey") &&
                this.state.surveyList.length === 0
            )
                await this.getSurvey(connectionData);
            if (
                fields.find((field) => field.key === "nps_survey") &&
                this.state.npsSurveyList.length === 0
            )
                await this.getNPSSurvey(connectionData);
        }
    };

    componentWillReceiveProps = async () => {
        const { connectionData, fields } = this.props;
        if (connectionData) {
            if (
                fields.find((field) => field.key === "survey") &&
                this.state.surveyList.length === 0
            )
                await this.getSurvey(connectionData);
            if (
                fields.find((field) => field.key === "nps_survey") &&
                this.state.npsSurveyList.length === 0
            )
                await this.getNPSSurvey(connectionData);

        }
    };


    handlelRefreshFields() {
        this.props.onRefreshFields();
    }

    handleChangeSelectValue = async (value, key) => {
        const { connectionData } = this.props;
        this.props.onRefreshFields();
        if(key === "survey") {
            await this.getEmailShareTemplates(connectionData, value);
         }else if(key === "nps_survey") {
            await this.getNPSEmailShareTemplates(connectionData, value)
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

    getSurvey = async (connection) => {
        const { selectedNode, connectionData } = this.props;
        let formdata = {
          headerValue: {
            "Authorization": `Bearer ${connection.token}`,
            Accept: "application/json",
          },
          APIUrl: SURVEYSPARROW_AUTH_URLS.BASE_URL + SURVEYSPARROW_AUTH_URLS.GET_SURVEY
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
                  if (parsedResponse.surveys.length > 0) {
                    const surveysData = parsedResponse.surveys.filter(ele => {
                        if(! /nps/gi.test(ele.surveyType)) {
                            return ele
                        }
                    }).map((item) => {
                        if (Object.keys(savedFields).length > 0 && savedFields.survey.value === item.id) {
                            this.getEmailShareTemplates(connectionData, item.id);
                        }
                      return {
                        value: item.id,
                        label: item.name,
                      };
                    });
                    this.setState({
                      surveyList: surveysData,
                      isLoading: false,
                    });
                  } else {
                    this.setState({
                      surveyList: [],
                      isLoading: false,
                    });
                  }
                } else {
                  this.setState({
                    surveyList: [],
                    isLoading: false,
                  });
                }
              }
            });
        } catch (err) {
          showErrorToaster(err);
        }
      };

      getNPSSurvey = async (connection) => {
        const { selectedNode, connectionData } = this.props;
        let formdata = {
          headerValue: {
            "Authorization": `Bearer ${connection.token}`,
            Accept: "application/json",
          },
          APIUrl: SURVEYSPARROW_AUTH_URLS.BASE_URL + SURVEYSPARROW_AUTH_URLS.GET_SURVEY
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
                  if (parsedResponse.surveys.length > 0) {
                    const npsSurveysData = parsedResponse.surveys.filter(ele => {
                        if(/nps/gi.test(ele.surveyType)) {
                            return ele
                        }
                    }).map((item) => {
                        if (Object.keys(savedFields).length > 0 && savedFields.nps_survey.value === item.id) {
                            this.getNPSEmailShareTemplates(connectionData, item.id);
                        }
                      return {
                        value: item.id,
                        label: item.name,
                      };
                    });
                    this.setState({
                      npsSurveyList: npsSurveysData,
                      isLoading: false,
                    });
                  } else {
                    this.setState({
                      npsSurveyList: [],
                      isLoading: false,
                    });
                  }
                } else {
                  this.setState({
                    npsSurveyList: [],
                    isLoading: false,
                  });
                }
              }
            });
        } catch (err) {
          showErrorToaster(err);
        }
      };

      getEmailShareTemplates = async (connection, id) => {
        let formdata = {
            headerValue: {
                "Authorization": `Bearer ${connection.token}`,
                Accept: "application/json",
            },
            APIUrl: SURVEYSPARROW_AUTH_URLS.BASE_URL + SURVEYSPARROW_AUTH_URLS.GET_EMAIL_SHARE_TEMPLATE.replace("{survey_id}", id)
        };
        this.setState({ isLoading: true });
        try {
            await httpClient
                .post(AUTH_INTEGRATION.GET_API, formdata)
                .then((result) => {
                    if (result.status === 200) {
                        const parsedResponse = JSON.parse(result.data.res);
                        if (result.status === 200 && !parsedResponse.error) {
                                if (parsedResponse.shares.length > 0) {
                                    const emailShareTemplatesData = parsedResponse.shares.filter(ele => ele.type === "EMAIL" && ele)
                                    .map((item) => {
                                            return {
                                                value: item.id,
                                                label: item.name,
                                            };
                                        });
                                    this.setState({
                                        emailShareTemplatesList: emailShareTemplatesData,
                                        isLoading: false,
                                    });
                                } else {
                                    this.setState({
                                        emailShareTemplatesList: [],
                                        isLoading: false,
                                    });
                                }
                            } else {
                                this.setState({
                                    emailShareTemplatesList: [],
                                    isLoading: false,
                                });
                            }
                        }
                    });
        } catch (err) {
            showErrorToaster(err);
        }
    };


    getNPSEmailShareTemplates = async (connection, id) => {
      let formdata = {
          headerValue: {
              "Authorization": `Bearer ${connection.token}`,
              Accept: "application/json",
          },
          APIUrl: SURVEYSPARROW_AUTH_URLS.BASE_URL + SURVEYSPARROW_AUTH_URLS.GET_NPS_EMAIL_SHARE_TEMPLATE.replace("{survey_id}", id)
      };
      this.setState({ isLoading: true });
      try {
          await httpClient
              .post(AUTH_INTEGRATION.GET_API, formdata)
              .then((result) => {
                  if (result.status === 200) {
                      const parsedResponse = JSON.parse(result.data.res);
                      if (result.status === 200 && !parsedResponse.error) {
                              if (parsedResponse.shares.length > 0) {
                                  const npsEmailShareTemplatesData = parsedResponse.shares.filter(ele => ele.type === "EMAIL" && ele)
                                  .map((item) => {
                                          return {
                                              value: item.name,
                                              label: item.name,
                                          };
                                      });
                                  this.setState({
                                    npsEmailShareTemplatesList: npsEmailShareTemplatesData,
                                      isLoading: false,
                                  });
                              } else {
                                  this.setState({
                                      npsEmailShareTemplatesList: [],
                                      isLoading: false,
                                  });
                              }
                          } else {
                              this.setState({
                                  npsEmailShareTemplatesList: [],
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
            surveyList,
            emailShareTemplatesList,
            npsEmailShareTemplatesList,
            npsSurveyList
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
                            {(field.key === "email" || field.key === "name" || field.key === "mobile" || field.key === "recipient_email"
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


                            {field.key === "survey" && (
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
                                        options={surveyList}
                                        value={
                                            savedFields[field.key]
                                                ? surveyList.find(
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


                           {field.key === "nps_survey" && (
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
                                        options={npsSurveyList}
                                        value={
                                            savedFields[field.key]
                                                ? npsSurveyList.find(
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

                           {field.key === "email_share_template" && (
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
                                        options={emailShareTemplatesList}
                                        value={
                                            savedFields[field.key]
                                                ? emailShareTemplatesList.find(
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

                           {field.key === "email_share_templates" && (
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
                                        options={npsEmailShareTemplatesList}
                                        value={
                                            savedFields[field.key]
                                                ? npsEmailShareTemplatesList.find(
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

export default SurveySparrowSetup;
