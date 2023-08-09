import React from "react";

class TemplateCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "" };
  }
  showTemplatesByCategory = (e, catId, catName) => {
    e.preventDefault();
    this.props.showTemplatesByCategory(catId, catName);
  };
  showTemplatesbyName = (e) => {
    if (e.charCode === 13) {
      this.props.showTemplatesbyName(this.state.searchText);
    }
  };
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (!nextProps.showTempBySearch) this.setState({ searchText: "" });
  }
  render() {
    return (
      <div className="templates-module--filters">
        <div className="templates-module--filtersInner">
          <input
            class="templates-module--search"
            placeholder="Search..."
            value={this.state.searchText}
            onChange={(e) => this.setState({ searchText: e.target.value })}
            onKeyPress={(e) => this.showTemplatesbyName(e)}
          />
          <a
            class="templates-module--templateFilter"
            href="/category/all"
            onClick={(e) => this.showTemplatesByCategory(e, 0, "ALL Template")}
          >
            All Templates
          </a>
          {this.props.categoryList.map((cat, key) => (
            <a
              class="templates-module--templateFilter"
              href="#pablo"
              onClick={(e) =>
                this.showTemplatesByCategory(e, cat.CatId, cat.CategoryName)
              }
            >
              {cat.CategoryName}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default TemplateCategory;
