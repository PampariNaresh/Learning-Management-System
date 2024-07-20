import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosinstance";

const initialState = {
    courseList: []
}

// function to handle signup
export const getAllCourses = createAsyncThunk("/course/getAllCourses", async (data) => {
    try {
        let response = axiosInstance.get("courses", data);

        toast.promise(response, {
            loading: "Wait! Fetching All Courses",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to Load Courses",
        });

        // getting response resolved here
        return (await response).data.courses;

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

export const createNewCourse = () => {

}


const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if (action?.payload) {
                state.courseList = [...action.payload]
            }
        })

    },
});

// eslint-disable-next-line no-empty-pattern
export const { } = courseSlice.actions;
export default courseSlice.reducer;
