import React from "react";

import { editorStateFromRaw } from "megadraft";
import MegadraftEditor from "../../MegaEditor/components/MegadraftEditor";
import "draft-js-focus-plugin/lib/plugin.css";
import "../../assets/custom/question_control.css";
import { Card, CardBody, Row, Col } from "reactstrap";

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === "leftAlign") {
    localStorage.setItem("alignClass", "text-left");
    return "text-left";
  } else if (type === "rightAlign") {
    localStorage.setItem("alignClass", "text-right");
    return "text-right";
  } else if (type === "centerAlign") {
    localStorage.setItem("alignClass", "text-center");
    return "text-center";
  }

  if (localStorage.getItem("alignClass") !== undefined) {
    return localStorage.getItem("alignClass");
  } else {
    return "text-center";
  }
}
export default class AfterSubmissionPage extends React.Component {
  constructor(props) {
    super(props);
    this.currentFormId = localStorage.CurrentFormId;
    try {
      this.state = {
        editorState: this.props.editorState
          ? editorStateFromRaw(this.props.editorState)
          : editorStateFromRaw(null),
      };
    } catch (err) {
      this.state = {
        editorState: editorStateFromRaw(null),
      };
    }
  }
  render() {
    return (
      <Card>
        <CardBody>
          <Row>
            <Col className="mt-8" md="12">
              <MegadraftEditor
                editorState={this.state.editorState}
                readOnly={true}
                editable={false}
                blockStyleFn={myBlockStyleFn}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
