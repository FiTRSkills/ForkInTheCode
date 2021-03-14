import { STORE_SKILLS } from "../ActionTypes";

export const initialState = { storedSkills: [] };
let storedSkills = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SKILLS:
      return {
        ...state,
        skills: action.payload.content,
      };
    default:
      return state;
  }
};

export default storedSkills;
