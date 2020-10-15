import { CHANGE_CURRENT_PAGE } from "../ActionTypes"

export const initialState = { currentPage: "" };

let navigation = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.payload.content
            };
        default:
            return state;
    }
};

export default navigation;
