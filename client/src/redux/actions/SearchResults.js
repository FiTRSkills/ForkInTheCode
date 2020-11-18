import { UPDATE_RESULTS } from "../ActionTypes";

export const updateResults = (content) => ({
  type: UPDATE_RESULTS,
  payload: {
    content,
  },
});
