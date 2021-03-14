import { combineReducers } from "redux";
import authentication from "./Authentication";
import navigation from "./Navigation";
import searchResults from "./SearchResults";
import storedSkills from "./StoreSkills";

export default combineReducers({
  authentication,
  navigation,
  searchResults,
  storedSkills,
});
