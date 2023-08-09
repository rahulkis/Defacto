import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
const options = [
  {
    name: "Rename",
    icon: <ArtTrackIcon />,
  },
  {
    name: "Delete",
    icon: <DeleteIcon />,
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
  };

  render() {
    const { pocket, onAddFolder, onDeleteFolder } = this.props;
    return (
      <div className="col-auto px-1 actions d-none d-sm-flex">
        <IconButton className="icon-btn p-2" onClick={this.handleClick}>
          <i className="zmdi zmdi-more-vert" />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          MenuListProps={{
            style: {
              width: 170,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.name}
              onClick={(e) => {
                this.handleClose();
                if (option.name === "Rename") {
                  onAddFolder(pocket);
                }
                if (option.name === "Delete") {
                  onDeleteFolder(pocket);
                }
              }}
            >
              {option.icon}
              <span className="ml-2">{option.name}</span>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default Menubar;
