import { SET_JOBPOSTING_SUCCESS_MESSAGE } from "../ActionTypes";

export const setJobPostingSuccessMessage = (message) => ({
  type: SET_JOBPOSTING_SUCCESS_MESSAGE,
  payload: {
    message,
  },
});
