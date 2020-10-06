import { UPDATE_USER, LOG_OUT } from "../ActionTypes"

export const initialState = {};

let authentication = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            return { ...state, ...action.payload.user }
        case LOG_OUT:
            return {};
        default:
            return state;
    }
};

export default authentication;
