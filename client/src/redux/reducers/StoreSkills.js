import { STORE_SKILLS } from "../ActionTypes";

export const initialState = { results: [] };
let skills = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SKILLS:
      return {
        ...state,
        results: action.payload.content,
      };
    default:
      return state;
  }
};

export default skills;
