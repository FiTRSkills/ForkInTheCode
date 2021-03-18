import { SET_COURSE_TO_EDIT } from "../ActionTypes";

export const setCourseToEdit = (course) => ({
  type: SET_COURSE_TO_EDIT,
  payload: {
    course,
  },
});
