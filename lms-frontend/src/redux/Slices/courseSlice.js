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

export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title)
        formData.append("description", data?.description)
        formData.append("category", data?.category)
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);

        let response = axiosInstance.post("/courses", formData);

        toast.promise(response, {
            loading: "Wait! Creating New Course",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to Create Course",
        });

        // getting response resolved here
        return (await response).data;

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});


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
