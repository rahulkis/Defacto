import React from "react";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import RefreshIcon from "@material-ui/icons/Refresh";

class AsanaSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
    const { fields, isRefreshingFields } = this.props;
    console.log(fields);
    return (
      <>
        <div>
          {fields.map((field) => (
            <>
              {field.key === "workspace" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {(field.key === "task_id" || field.key === "id") && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "completed" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "_zap_search_success_on_miss" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "project" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "task" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "section" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "text" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      multiline
                      fullWidth
                      rows="3"
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {(field.key === "name" || field.key === "email") && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      fullWidth
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "notes" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      multiline
                      fullWidth
                      rows="3"
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "due_on" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      fullWidth
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "due_at" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      fullWidth
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "file" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <TextField
                      fullWidth
                      //   defaultValue={
                      //     savedFields[field.key]
                      //       ? savedFields[field.key].value
                      //       : ""
                      //   }
                      //   onBlur={(e) =>
                      //     this.handleChangeSelectValue(e.target.value, field.key)
                      //   }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "assignee" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "assignee_status" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "followers" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "hearted" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
                </div>
              )}
              {field.key === "tag" && (
                <div className="row" key={field.id}>
                  <div className="col-md-11 my-2 ml-3">
                    <label className="text-capitalize">
                      {this.getFieldLabel(field)}{" "}
                    </label>
                    {field.required && (
                      <span className="text-danger ml-1">(required)</span>
                    )}
                    <Select
                      className="w-100"
                      // options={boolTypeListOptions}
                      // value={
                      //   savedFields[field.key]
                      //     ? boolTypeListOptions.find(
                      //         (val) => val.value === savedFields[field.key].value
                      //       )
                      //     : ""
                      // }
                      // onChange={(e) =>
                      //   this.handleChangeSelectValue(e.value, field.key)
                      // }
                    />
                    <span
                      className="text-light custome-fields-help-text"
                      dangerouslySetInnerHTML={{ __html: field.help_text_html }}
                    ></span>
                  </div>
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
        </div>
      </>
    );
  }
}

export default AsanaSetup;
