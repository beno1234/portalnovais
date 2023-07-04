import _ from 'lodash';

import {
    LOADING_ARTICLE,
    ERROR_ARTICLE,
    CREATE_ARTICLE,
    FETCH_ARTICLE,
    FETCH_ARTICLES,
    FETCH_SIMILAR_ARTICLES,
    EDIT_ARTICLE,
    DISABLE_ARTICLE
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    similarList: {},
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const articleReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_ARTICLE:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_ARTICLE:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_ARTICLE:
            // return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
            return { ...prevState, isLoading: null }
        case FETCH_ARTICLE:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_ARTICLES:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((article) => article.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case FETCH_SIMILAR_ARTICLES:
            return {
                ...prevState,
                similarList: _.mapKeys(action.payload.data, 'id')
            };
        case EDIT_ARTICLE:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_ARTICLE:
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

export default articleReducer;