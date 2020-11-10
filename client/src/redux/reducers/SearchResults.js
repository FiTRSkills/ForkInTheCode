import { UPDATE_RESULTS } from "../ActionTypes"

export const initialState = {results: []};
let searchResults = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RESULTS:
      return {
        ...state,
        results: action.payload.content
      };
    default:
      return state;
  }
};

export default searchResults;
