import React from "react";
import TagsInput from "react-tagsinput";
import { FORM_URLS } from "../../util/constants";
import { UpdateData } from "../../stores/requests";

class TagsMultiInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tags: props.Tags ? props.Tags : [] };
  }
  handleChange(e) {
    this.setState({ tags: e });
    // Save Code write here
    let json = JSON.stringify(e);
    json = JSON.parse(json);
    let model = {
      FormId: this.props.FormId,
      Tags: json,
      UpdatedAt: Date.now(),
    };
    try {
      UpdateData(FORM_URLS.UPDATE_TAGS_URL, model).then((result) => {});
    } catch (err) {
      console.log(FORM_URLS.UPDATE_TAGS_URL, err);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.StaticFilterValue !== 1 &&
      this.props.StaticFilterValue !== 0
    ) {
      this.setState({ tags: nextProps.Tags });
    }
  }

  render() {
    return (
      <TagsInput
        value={this.state.tags}
        onChange={(event) => this.handleChange(event)}
      />
    );
  }
}
export default TagsMultiInput;
