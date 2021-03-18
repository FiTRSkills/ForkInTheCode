import { STORE_SKILLS } from "../ActionTypes";

export const storeSkills = (content) => ({
  type: STORE_SKILLS,
  payload: {
    content,
  },
});
