import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice.js";
import courseReducer from "./Slices/courseSlice.js"
const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer
    }
    ,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),

    devTools: true,
})
export default store;