import {
    OPEN_MODAL,
    CLOSE_MODAL,
    SET_SELECTED_ITEM
} from '../actions/types';

const INITIAL_STATE = {
    isOpen: false,
    selectedItem: null
}

const modalReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return { ...prevState, isOpen: true };
        case CLOSE_MODAL:
            return { ...prevState, isOpen: false };
        case SET_SELECTED_ITEM:
            return { ...prevState, selectedItem: action.payload }
        default:
            return prevState;
    }
}

export default modalReducer;