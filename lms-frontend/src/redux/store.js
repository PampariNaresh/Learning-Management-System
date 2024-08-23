import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice.js";
import courseReducer from "./Slices/courseSlice.js"
import lectureReducer from "./Slices/lectureSlice.js";
import razorpayReducer from "./Slices/razorPaySlice.js";
const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        razorpay: razorpayReducer,
        lecture: lectureReducer
    }
    ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),

    devTools: true,
})
export default store;