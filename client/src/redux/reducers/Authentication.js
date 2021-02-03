import { UPDATE_USER, LOG_OUT } from "../ActionTypes";
import { logOut } from "../../services/AuthService";

export const initialState = {};

let authentication = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, ...action.payload.user };
    case LOG_OUT:
      logOut();
      return {};
    default:
      return state;
  }
};

export default authentication;
