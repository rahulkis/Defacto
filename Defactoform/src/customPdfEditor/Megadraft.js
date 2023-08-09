import DraftJS from "draft-js";
import insertDataBlock from "./insertDataBlock";
import Media from "./components/Media";
import MegadraftEditor from "./components/MegadraftEditor";
import MegadraftIcons from "./icons";
import MegadraftMediaMessage from "./components/MediaMessage";
import * as MegadraftPlugin from "./components/plugin";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import * as utils from "./utils";

export const Megadraft = {
  DraftJS,
  insertDataBlock,
  Media,
  MegadraftEditor,
  MegadraftIcons,
  MegadraftMediaMessage,
  MegadraftPlugin,
  Sidebar,
  Toolbar,
  editorStateFromRaw: utils.editorStateFromRaw,
  editorStateToJSON: utils.editorStateToJSON,
  createTypeStrategy: utils.createTypeStrategy
};

export default Megadraft;
