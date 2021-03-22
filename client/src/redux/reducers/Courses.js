import { SET_COURSE_TO_EDIT, SET_COURSE_SUCCESS_MESSAGE } from "../ActionTypes";

export const initialState = { courseToEdit: {}, successMessage : "" };

let courses = (state = initialState, action) => {
  switch (action.type) {
    case SET_COURSE_TO_EDIT:
      return {
        ...state,
        courseToEdit: action.payload.course,
      };
    case SET_COURSE_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload.message,
      };
    default:
      return state;
  }
};

export default courses;
