export const types = {
    LOGIN: "@fitr-skills/app/login",
    LOGOUT: "@fitr-skills/app/logout",
    UPDATE_USER: "@fitr-skills/app/update_user",
};
export const initialState = {
    user: null,
};
export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_USER:
            return {
                ...state,
                user: action.user
            };
        case types.LOGOUT:
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
};
export const actions = {
    login: () => ({ type: types.LOGIN }),
    logout: () => ({ type: types.LOGOUT }),
    updateUser: user => ({ type: types.UPDATE_USER, user })
};
