import { UPDATE_USER, LOG_OUT } from "../ActionTypes"

export const updateUser = user => ({
    type: UPDATE_USER,
    payload: {
        user
    }
});

export const logOut = content => ({
    type: LOG_OUT,
    payload: {
        content
    }
});