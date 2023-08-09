import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Settings from "./Settings";
import Auth from "./auth";
import EchoReducer from "./EchoReducer";
import CommonReducer from "./CommonReducer";
import AppEventReducer from "./AppEventReducer";
import PocketReducer from "./PocketReducer";
import ConnectionReducer from "./ConnectionReducer";
import ErrorReducer from "./ErrorReducer";

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: Auth,
    echo: EchoReducer,
    common: CommonReducer,
    apps: AppEventReducer,
    pockets: PocketReducer,
    connections: ConnectionReducer,
    nodeError: ErrorReducer,
  });
