import {
    OPEN_MODAL,
    CLOSE_MODAL,
    SET_SELECTED_ITEM
} from '../types';

export const openModal = () => {
    return {
        type: OPEN_MODAL
    }
}

export const closeModal = () => {
    return {
        type: CLOSE_MODAL
    }
}

export const setSelectedItem = (item) => {
    return {
        type: SET_SELECTED_ITEM,
        payload: item
    }
}