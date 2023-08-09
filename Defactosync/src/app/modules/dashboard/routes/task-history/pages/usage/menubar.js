import React, { Component } from "react";
import { connect } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import {updateSelectedConnection } from "actions/index";

const options = [
    {
      name: "open in editor",
    },
    {
      name: "view echo details",
    },
    {
      name: "view echo runs",
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
     const { echo,openEditor,viewDetail,vIewEchoRun} = this.props;
    return (
      <div className="col-auto px-1 actions d-none d-sm-flex">
        <IconButton className="icon-btn p-2" onClick={this.handleClick}>
          <MoreHorizOutlinedIcon />
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
                if (option.name === "open in editor") {
                    openEditor(echo);
                }
                if (option.name === "view echo details") {
                    viewDetail(echo);
                }               
                if(option.name === "view echo runs"){                 
                    vIewEchoRun(echo)
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