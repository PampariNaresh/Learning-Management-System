import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../config/axiosinstance";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {}
}

// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        let res = axiosInstance.post("user/register", data);

        toast.promise(res, {
            loading: "Wait! Creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account",
        });

        // getting response resolved here
        return await res;

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// function to handle login

export const login = createAsyncThunk("/auth/signin", async (data) => {
    try {
        const response = axiosInstance.post("user/login", data);
        toast.promise(response, {
            loading: 'Wait! authenticating your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to authenticate your account'
        });
        return await response;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})


// function to handle logout
export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const response = axiosInstance.get("user/logout");
        toast.promise(response, {
            loading: 'Wait! logging out your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to logout your account'
        });
        return await response;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})


// function to fetch user data
export const getUserData = createAsyncThunk("/auth/getData", async () => {
    try {
        const res = await axiosInstance.get("/user/me");
        return res;
    } catch (error) {
        toast.error(error?.message);
    }
});

// function to change user password
export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (userPassword) => {
        try {
            let res = axiosInstance.post("/user/change-password", userPassword);

            await toast.promise(res, {
                loading: "Loading...",
                success: (data) => {
                    return data?.data?.message;
                },
                error: "Failed to change password",
            });

            // getting response resolved here
            res = await res;
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
    "auth/forgetPassword",
    async (email) => {
        try {
            let res = axiosInstance.post("/user/reset", { email });

            await toast.promise(res, {
                loading: "Loading...",
                success: (data) => {
                    return data?.data?.message;
                },
                error: "Failed to send verification email",
            });

            // getting response resolved here
            res = await res;
            return res.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
);

// function to update user profile
export const updateProfile = createAsyncThunk("/user/updateProfile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
    try {
        let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
            password: data.password,
        });

        toast.promise(res, {
            loading: "Resetting...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to reset password",
        });
        // getting response resolved here
        res = await res;
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // for user login
            .addCase(login.fulfilled, (state, action) => {

                localStorage.setItem("data", JSON.stringify(action?.payload?.data));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.data?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.data;
                state.role = action?.payload?.data?.user?.role;
            })
            // for user logout
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.isLoggedIn = false;
                state.role = ""
                state.data = {};
            })
            // .addCase(updateProfile.fulfilled, (state, action) => {
            //     console.log(action.payload)
            //     if (action?.payload?.data) {
            //         state.data.user.avatar = action?.payload?.data?.user?.avatar;
            //         state.data.user.avatar.secure_url = action?.payload?.data?.user?.avatar?.secure_url;
            //         state.data.user.avatar.public_url = action?.payload?.data?.user?.avatar?.public_url;
            //         state.data.user.fullName = action?.payload?.data?.user?.fullName;
            //     }
            // })

            .addCase(getUserData.fulfilled, (state, action) => {
                console.log(action.payload)
                if (!action?.payload?.data) return;

                localStorage.setItem("data", JSON.stringify(action?.payload?.data));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.data?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.data;
                state.role = action?.payload?.data?.user?.role;
            });
    },
});

// eslint-disable-next-line no-empty-pattern
export const { } = authSlice.actions;
export default authSlice.reducer;
