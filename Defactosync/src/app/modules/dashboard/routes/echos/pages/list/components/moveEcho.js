import React from "react";
import Select from "react-select";
import { Modal, ModalHeader } from "reactstrap";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import IntlMessages from "util/IntlMessages";


class MoveEcho extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      disable:true
    };
  }

  handleChange = (selectedOption) => {  
    this.setState({ selectedOption }) 
    if(selectedOption && this.props.echo.pocketIds.includes(selectedOption.value)){  
      this.setState({disable:true});
    }else{
      this.setState({disable:false});
    }
  };

  handleClose=()=>{
    this.setState({
      selectedOption: null,disable:true
    });
    this.props.onEchoMoveClose();
  }

  render() {
    const {
      open,
      onEchoMoveClose,
      echo,
      onSaveMoveEcho,
      allpockets,
    } = this.props;
    const { selectedOption,disable } = this.state;
    let options = [];
    if (allpockets && allpockets.length) {
      allpockets.map((pocket) => {
        let data = { value: pocket.id, label: pocket.title };
        options.push(data);
      });
    }

    return (
      <Modal className="modal-box"  isOpen={open}>
        <ModalHeader className="modal-box-header bg-primary text-white">
          <IntlMessages id="echos.moveToPocket" />
          <IconButton className="text-white" onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <div className="modal-box-content">
          <div className="row no-gutters">
            <div className="col-lg-9 d-flex flex-column order-lg-1">
              <Select
                value={selectedOption}
                onChange={this.handleChange}
                placeholder={
                  <div>
                    <i className="zmdi zmdi-search zmdi-hc-lg"></i>
                    &nbsp; Select Pocket
                  </div>
                }
                options={options}
              />
            </div>
          </div>
        </div>

        <div className="modal-box-footer d-flex flex-row">
          <Button
            disabled={disable}
            variant="contained"
            color="primary"
            onClick={() => {             
              onEchoMoveClose();
              onSaveMoveEcho({
                pocket: selectedOption,
                echo: echo,
              });

              this.setState({
                selectedOption: null,disable:true
              });
            }}
          >
            <IntlMessages id="echos.save" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default MoveEcho;
