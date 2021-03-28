import { SET_COURSE_TO_EDIT, SET_COURSE_SUCCESS_MESSAGE } from "../ActionTypes";

export const setCourseToEdit = (course) => ({
  type: SET_COURSE_TO_EDIT,
  payload: {
    course,
  },
});

export const setCourseSuccessMessage = (message) => ({
  type: SET_COURSE_SUCCESS_MESSAGE,
  payload: {
    message,
  },
});
