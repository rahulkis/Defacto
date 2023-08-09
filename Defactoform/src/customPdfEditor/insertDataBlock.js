import Immutable from "immutable";
import { editorStateFromRaw, editorStateToJSON, DraftJS } from "megadraft";


import {
  genKey,
  EditorState,
  ContentBlock,
  Modifier,
  BlockMapBuilder,
} from "draft-js";

const { List, Map } = Immutable;

function insertDataBlock(editorState, data) {
  // EditorState.moveFocusToEnd(editorState)
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const afterRemoval = Modifier.removeRange(
    contentState,
    selectionState,
    "forward"
  );

  const targetSelection = afterRemoval.getSelectionAfter();
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  const insertionTarget = afterSplit.getSelectionAfter();

  const asAtomicBlock = Modifier.setBlockType(
    afterSplit,
    insertionTarget,
    "atomic"
  );

  const block = new ContentBlock({
    key: genKey(),
    type: "atomic",
    text: "",
    characterList: List(),
    data: new Map(data),
  });

  
  let fragmentArray = [
    block,
    new ContentBlock({
      key: genKey(),
      type: "unstyled",
      text: "",
      characterList: List(),
    }),
  ];

  const preData = JSON.parse(editorStateToJSON(editorState));
  
  if(preData.blocks.length == 1){
    fragmentArray.unshift(
      new ContentBlock({
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        text: "Here are your results",
        type: "unstyled"}))
  } else {
    fragmentArray.unshift(
      new ContentBlock({
        key: genKey(),
        type: "unstyled",
        text: "",
        characterList: List(),
      }))
  }

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);
  const withAtomicBlock = Modifier.replaceWithFragment(
    asAtomicBlock,
    insertionTarget,
    fragment
  );

  const newContent = withAtomicBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withAtomicBlock.getSelectionAfter().set("hasFocus", true),
  });
  return EditorState.push(editorState, newContent, "insert-fragment");
}

export default insertDataBlock;
