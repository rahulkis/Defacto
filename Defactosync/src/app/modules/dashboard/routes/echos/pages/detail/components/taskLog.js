import React from "react";
import Select from "react-select";
import Button from "@material-ui/core/Button";

const selectOptions = [
  { value: "Select All", label: "Select All" },
  { value: "Select Shown", label: "Select Shown" },
  { value: "Deselect All", label: "Deselect All" },
];


export default class TaskLog extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      title: "Status",
    };
  }

  render() {    
    return (
      <div className="row">
        Task log Content
        {/* <div className="col-md-3">
          <Select options={selectOptions} placeholder=""/>
        </div>
        <div className="col-md-6">
        <Select options={selectOptions} placeholder="Status"/>
        <MultipleSelect names={statusOptions} title={title} />
        </div>
        <div className="col-md-3 ">
          <Button
            className="btn  btn-sm"
            style={{ padding: "10px 47px" }}
            variant="contained"
            color="primary"
          >
            View in Task history
          </Button>
        </div> */}
     
      </div>
    );
  }
}
