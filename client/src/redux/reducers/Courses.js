import { SET_COURSE_TO_EDIT } from "../ActionTypes";

export const initialState = { course: {} };

let courses = (state = initialState, action) => {
  switch (action.type) {
    case SET_COURSE_TO_EDIT:
      return {
        ...state,
        courseToEdit: action.payload.course,
      };
    default:
      return state;
  }
};

export default courses;
