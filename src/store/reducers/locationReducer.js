import _ from 'lodash';

import {
    LOADING_LOCATION,
    ERROR_LOCATION,
    CREATE_LOCATION,
    FETCH_LOCATION,
    FETCH_LOCATIONS,
    EDIT_LOCATION,
    DISABLE_LOCATION
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const locationReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_LOCATION:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_LOCATION:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_LOCATION:
            return { ...prevState, isLoading: null }
        case FETCH_LOCATION:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_LOCATIONS:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((location) => location.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case EDIT_LOCATION:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_LOCATION:
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

export default locationReducer;