import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import {updateSelectedConnection } from "actions/index";

const options = [
  {
    name: "View Echos",
  },
  // {
  //   name: "Test Conection",
  // },
  {
    name: "Reconnect",
  },
  {
    name: "Edit connection name",
  },
  {
    name: "Transfer ownership",
  },
  {
    name: "Delete",
  },
];

export class Menubar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }


  handleClick = (e) => {
    this.setState({ anchorEl: e.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
     const { connection, renameConnection,deleteConnection,transferOwnership,onReconnect,viewEchos} = this.props;
    return (
      <div className="col-auto px-1 actions d-none d-sm-flex">
        <IconButton className="icon-btn p-2" onClick={this.handleClick}>
          <MoreHorizOutlinedIcon/>
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          MenuListProps={{
            style: {
              width: 190,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.name}
              onClick={(e) => {
                this.handleClose();
                if (option.name === "Edit connection name") {
                  renameConnection(connection);
                }
                if (option.name === "Delete") {
                  deleteConnection(connection);
                }
                if(option.name === "Transfer ownership")
                {
                  transferOwnership(connection)
                }
                if(option.name === "Reconnect"){
                  onReconnect(connection)
                }
                if(option.name === "View Echos"){
                  this.props.updateSelectedConnection(connection)
                  viewEchos(1)
                }
              }}
            >
              <span>{option.name}</span>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}



export default connect(null, { 
  updateSelectedConnection
})(Menubar);