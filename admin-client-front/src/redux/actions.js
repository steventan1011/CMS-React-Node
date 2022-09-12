/*
  includes action creaters
  syncronous action: object {type: 'xxx', data: value}
  asyncronous action: function  dispatch => {}
 */
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'
import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

// syncronous action to set head title
export const setHeadTitle = (headTitle) => (
    {type: SET_HEAD_TITLE, data: headTitle}
)

// syncronous action to receive user
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

// syncronous action to show error message
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

// syncronous action to logout
export const logout = () => {
    storageUtils.removeUser()
    return {type: RESET_USER}
}

// asyncronous action to login
export const login = (username, password) => {
    return async dispatch => {
        // 1. asyncronous ajax request
        const result = await reqLogin(username, password) // {status: 0, data: user} {status: 1, msg: 'xxx'}
        // 2.1. if successful, dispatch a successful synchronous action
        if (result.status === 0) {
            const user = result.data
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        } else { // 2.2. if fails, dispatch the failed synchronous action
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }

    }
}
