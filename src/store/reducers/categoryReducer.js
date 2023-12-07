import _ from 'lodash';

import {
    LOADING_CATEGORY,
    ERROR_CATEGORY,
    CREATE_CATEGORY,
    FETCH_CATEGORY,
    FETCH_CATEGORIES,
    EDIT_CATEGORY,
    DISABLE_CATEGORY,

    FETCH_SUBCATEGORY,
    CREATE_SUBCATEGORY,
    EDIT_SUBCATEGORY,
} from '../actions/types';

const INITIAL_STATE = {
    list: {},
    selectedSubCategory: null,
    indexOrder: [],
    totalCount: 0,
    isLoading: null,
    error: null
}

const categoryReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_CATEGORY:
            return { ...prevState, isLoading: action.payload, error: null }
        case ERROR_CATEGORY:
            return { ...prevState, isLoading: null, error: action.payload }
        case CREATE_CATEGORY:
            return { ...prevState, isLoading: null }
        case CREATE_SUBCATEGORY:
            // list: null para dar refresh nas categorias e buscar a nova subcategoria cadastrada
            return { ...prevState, /* list: null, */ isLoading: null }
        case FETCH_CATEGORY:
            return { ...prevState, selectedSubCategory: null, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case FETCH_SUBCATEGORY:
            return { ...prevState, selectedSubCategory: action.payload, isLoading: null }
        case FETCH_CATEGORIES:
            return {
                ...prevState,
                selectedSubCategory: null,
                list: _.mapKeys(action.payload.data, 'id'),
                indexOrder: action.payload.data.map((category) => category.id),
                totalCount: action.payload.totalCount,
                isLoading: false
            };
        case EDIT_CATEGORY:
            return { ...prevState, list: { ...prevState.list, [action.payload.id]: action.payload }, isLoading: null }
        case EDIT_SUBCATEGORY:
            return { ...prevState, list: null, isLoading: null }
        case DISABLE_CATEGORY:
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

export default categoryReducer;