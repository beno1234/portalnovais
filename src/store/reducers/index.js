import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./authReducer";
import menuReducer from './menuReducer';
import modalReducer from "./modalReducer";
import userReducer from "./userReducer";
import advertisementReducer from "./advertisementReducer";
import categoryReducer from "./categoryReducer";
import locationReducer from "./locationReducer";
import quotationReducer from "./quotationReducer";
import articleReducer from "./articleReducer";
import bannerReducer from "./bannerReducer";

export default combineReducers({
    auth: authReducer,
    menu: menuReducer,
    modal: modalReducer,
    user: userReducer,
    advertisement: advertisementReducer,
    category: categoryReducer,
    location: locationReducer,
    quotation: quotationReducer,
    article: articleReducer,
    banner: bannerReducer
});