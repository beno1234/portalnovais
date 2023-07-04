import {
    LOADING_ME,
    ERROR_ME,
    SIGN_UP,
    USER_LOGIN,
    USER_LOGOFF,
    FETCH_ME,
    EDIT_ME,
    DISABLE_ME
} from '../actions/types'

const INITIAL_STATE = {
    isLoading: null,
    error: null,
    isSignedIn: false,
    user: null
    /* {
        "id": 2,
        "email": "anunciante@mail.com",
        "name": "Anunciante Pereira",
        "role": "advertiser",
        "active": true,
        "locationId": 1
    } */
}

const authReducer = (prevState = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_ME:
            return { ...prevState, isLoading: action.payload, error: null };
        case ERROR_ME:
            return { ...prevState, isLoading: null, error: action.payload };
        case SIGN_UP:
            return { ...prevState, isLoading: false, user: action.payload };
        case USER_LOGIN:
            if (action.payload.sub) {
                action.payload.id = action.payload.sub;
                delete action.payload.sub;
            }
            return { ...prevState, isLoading: false, isSignedIn: true, user: action.payload };
        case USER_LOGOFF:
            return { ...prevState, isSignedIn: false, user: null };
        case FETCH_ME:
            return { ...prevState, isLoading: false, user: action.payload };
        case EDIT_ME:
            return { ...prevState, isLoading: false, user: action.payload };
        case DISABLE_ME:
            return { ...prevState, isLoading: null };
        default:
            return prevState;
    }
}

export default authReducer;