import _ from 'lodash';

import {
    LOADING_BANNER,
    ERROR_BANNER,
    CREATE_BANNER,
    FETCH_BANNER,
    FETCH_BANNERS,
    FETCH_BANNERS_IN_REVIEW,
    EDIT_BANNER,
    DISABLE_BANNER,
    REVIEW_BANNER
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    inReviewList: [],
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const bannerReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_BANNER:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_BANNER:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_BANNER:
            // return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
            return { ...prevState, isLoading: null }
        case FETCH_BANNER:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_BANNERS:
            return {
                ...prevState,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((banner) => banner.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case FETCH_BANNERS_IN_REVIEW:
            return {
                ...prevState,
                inReviewList: action.payload.data,
                isLoading: false
            };
        case REVIEW_BANNER:
            return {
                ...prevState,
                list: { ...prevState.list, [action.payload.id]: action.payload },
                inReviewList: Object.values(prevState.inReviewList).filter((ad) => ad.id !== action.payload.id),
                isLoading: false
            };
        case EDIT_BANNER:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case DISABLE_BANNER:
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

export default bannerReducer;