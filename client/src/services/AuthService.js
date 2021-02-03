import axios from "axios";
import store from "../redux/Store";
import { updateUser } from "../redux/actions";

const endpoints = {
  GET_USER_TYPE: "/profile/usertype",
  LOGOUT: "/logout",
};

export async function checkAndUpdateAuth(userType) {
  if (userType !== undefined && userType.length > 0) {
    return userType;
  }
  let result = await axios
    .get(process.env.REACT_APP_SERVER_URL + endpoints.GET_USER_TYPE, {
      withCredentials: true,
    })
    .then((response) => {
      if (response.data === undefined || response.data.length < 1) {
        return undefined;
      }
      store.dispatch(updateUser({ type: response.data }));
      return response.data;
    })
    .catch((error) => {
      return undefined;
    });
  return result;
}

export function logOut() {
  axios.get(process.env.REACT_APP_SERVER_URL + endpoints.LOGOUT, {
    withCredentials: true,
  });
}
