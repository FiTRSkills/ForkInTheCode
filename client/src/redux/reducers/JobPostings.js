import { SET_JOBPOSTING_SUCCESS_MESSAGE } from "../ActionTypes";

export const initialState = { successMessage: "" };

let jobPostings = (state = initialState, action) => {
  switch (action.type) {
    case SET_JOBPOSTING_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload.message,
      };
    default:
      return state;
  }
};

export default jobPostings;
