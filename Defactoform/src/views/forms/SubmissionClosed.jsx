import React from "react";

import { editorStateFromRaw } from "megadraft";
import MegadraftEditor from "../../MegaEditor/components/MegadraftEditor";
import "draft-js-focus-plugin/lib/plugin.css";
import "../../assets/custom/question_control.css";
import { Card, CardBody, Row, Col } from "reactstrap";


export default class SubmissionClosed extends React.Component {
  constructor(props) {
    super(props);
    this.currentFormId = localStorage.CurrentFormId;
    this.CustomCloseSubmissionPage=localStorage.CustomCloseSubmissionPage;
    this.SubmissionPageData=localStorage.SubmissionPageData;
    if(this.CustomCloseSubmissionPage)
    {
      try{
        this.state = {
          editorState:localStorage.SubmissionPageData?editorStateFromRaw(JSON.parse(localStorage.SubmissionPageData)):editorStateFromRaw(null)
        }
      }catch(err){
        this.state = {
          editorState:editorStateFromRaw(null)
        }
      }
    }
    else
    {
    let title = "Submission Closed";
          let description = "Submission are closed.";
          const myContent = {
            entityMap: {},
            blocks: [
              {
                key: "ag6qs",
                text: title,
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [
                  { offset: 0, length: title.length, style: "center" }
                ],
                entityRanges: [],
                data: {}
              },
              {
                key: "tysw2",
                text: description,
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [
                  { offset: 0, length: description.length, style: "RIGHT" }
                ],
                entityRanges: [],
                data: {}
              }
            ]
          };
    try{
      this.state = {
        editorState:myContent?editorStateFromRaw(myContent):editorStateFromRaw(null)
      }
    }catch(err){
      this.state = {
        editorState:editorStateFromRaw(null)
      }
    }
  }
    
  }
  componentWillMount=()=>
  {

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
                editable ={false}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
