import { CHANGE_CURRENT_PAGE } from "../ActionTypes"

export const changeCurrentPage = content => ({
    type: CHANGE_CURRENT_PAGE,
    payload: {
        content
    }
});