import _ from 'lodash';

import {
    LOADING_QUOTATION,
    ERROR_QUOTATION,
    CREATE_QUOTATION,
    FETCH_QUOTATION,
    FETCH_QUOTATIONS,
    EDIT_QUOTATION,
    DISABLE_QUOTATION
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const quotationReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_QUOTATION:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_QUOTATION:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_QUOTATION:
            return { ...prevState, isLoading: null }
        case FETCH_QUOTATION:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_QUOTATIONS:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((quotation) => quotation.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case EDIT_QUOTATION:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_QUOTATION:
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

export default quotationReducer;