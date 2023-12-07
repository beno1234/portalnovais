import _ from 'lodash';

import {
    LOADING_ADVERTISEMENT,
    ERROR_ADVERTISEMENT,
    CREATE_ADVERTISEMENT,
    FETCH_ADVERTISEMENT,
    FETCH_ADVERTISEMENTS,
    FETCH_ADVERTISEMENTS_IN_REVIEW,
    FETCH_FEATURED_ADVERTISEMENTS,
    FETCH_IN_REGION_SALE_ADVERTISEMENTS,
    EDIT_ADVERTISEMENT,
    DISABLE_ADVERTISEMENT,
    REVIEW_ADVERTISEMENT
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    inReviewList: [],
    featuredList: [],
    inSaleList: [],
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const advertisementReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_ADVERTISEMENT:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_ADVERTISEMENT:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_ADVERTISEMENT:
            // return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
            return { ...prevState, isLoading: null }
        case FETCH_ADVERTISEMENT:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_ADVERTISEMENTS:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((advertisement) => advertisement.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case FETCH_ADVERTISEMENTS_IN_REVIEW:
            return {
                ...prevState,
                inReviewList: _.mapKeys(action.payload.data, 'id'),
                isLoading: false
            };
        case FETCH_FEATURED_ADVERTISEMENTS:
            return {
                ...prevState,
                featuredList: _.mapKeys(action.payload.data, 'id'),
                isLoading: false
            };
        case FETCH_IN_REGION_SALE_ADVERTISEMENTS:
            return {
                ...prevState,
                inSaleList: _.mapKeys(action.payload.data, 'id'),
                isLoading: false
            };
        case REVIEW_ADVERTISEMENT:
            return {
                ...prevState,
                list: { ...prevState.list, [action.payload.id]: action.payload },
                inReviewList: Object.values(prevState.inReviewList).filter((ad) => ad.id !== action.payload.id),
                isLoading: false
            };
        case EDIT_ADVERTISEMENT:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_ADVERTISEMENT:
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

export default advertisementReducer;