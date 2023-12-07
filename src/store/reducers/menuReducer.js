import {
    OPEN_MENU,
    CLOSE_MENU
} from '../actions/types';

const INITIAL_STATE = {
    isSideBarOpen: false
}

const menuReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case OPEN_MENU:
            return { ...prevState, isSideBarOpen: true };
        case CLOSE_MENU:
            return { ...prevState, isSideBarOpen: false };
        default:
            return prevState;
    }
}

export default menuReducer;