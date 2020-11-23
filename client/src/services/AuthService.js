import axios from "axios";
import store from "../redux/Store";
import { updateUser } from "../redux/actions";

const endpoints = {
  GET_USER_TYPE: "/profile/usertype",
};

export async function checkAndUpdateAuth(userType) {
  if (userType !== undefined && userType.length > 0) {
    return userType;
  }
  let response = await axios.get(
    process.env.REACT_APP_SERVER_URL + endpoints.GET_USER_TYPE,
    {
      withCredentials: true,
    }
  );
  if (response.status === 200) {
    if (response.data === undefined || response.data.length < 1) {
      return undefined;
    }
    store.dispatch(updateUser({ type: response.data }));
    return response.data;
  } else {
    return undefined;
  }
}
