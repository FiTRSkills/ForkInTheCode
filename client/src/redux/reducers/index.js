import { combineReducers } from "redux";
import authentication from "./Authentication";
import navigation from "./Navigation";
import searchResults from "./SearchResults";

export default combineReducers({
  authentication,
  navigation,
  searchResults,
});
