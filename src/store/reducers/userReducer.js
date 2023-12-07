import _ from 'lodash';

import {
    LOADING_USER,
    ERROR_USER,
    CREATE_USER,
    FETCH_USER,
    FETCH_USERS,
    EDIT_USER,
    DISABLE_USER
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const userReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_USER:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_USER:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_USER:
            // return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
            return { ...prevState, isLoading: null }
        case FETCH_USER:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_USERS:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((user) => user.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case EDIT_USER:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_USER:
            return {
                ...prevState,
                list: _.omit(prevState.list, action.payload),
                indexOrder: prevState.indexOrder.filter((index) => index !== action.payload),
                totalCount: prevState.totalCount - 1,
                isLoading: false
            }
        default:
            return prevState;
    }
}

export default userReducer;