import { UPDATE_USER, CHANGE_CURRENT_PAGE, LOG_OUT } from "./ActionTypes"

export const updateUser = user => ({
    type: UPDATE_USER,
    payload: {
        user
    }
});

export const changeCurrentPage = content => ({
    type: CHANGE_CURRENT_PAGE,
    payload: {
        content
    }
});

export const logOut = content => ({
    type: LOG_OUT,
    payload: {
        content
    }
});