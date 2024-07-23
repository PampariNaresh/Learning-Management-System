// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";

// import axiosInstance from "../../config/axiosinstance";


// const initialState = {
//     key: "",
//     subsrciption_id: " ",
//     isPaymentVerified: false,
//     allPayments: {},
//     finalMonths: {},
//     monthlySalesRecord: []
// };

// export const getRazorPayid = createAsyncThunk("/razorpay/getId", async () => {
//     try {
//         const response = await axiosInstance.get("/payments/razorpay-key");
//         return response?.data;

//     } catch (error) {
//         toast.error("Failed to load Data");
//     }
// })


// export const purchaseCourseBundle = createAsyncThunk("/purchasecourse", async () => {
//     try {
//         const response = await axiosInstance.post("/payments/subscirbe");
//         return response?.data;

//     } catch (error) {
//         toast.error(error?.response?.data?.message);
//     }
// })


// export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
//     try {
//         const response = await axiosInstance.post("/payments/verify", {
//             razorpay_payment_id: data.razorpay_payment_id,
//             razorpay_subscription_id: data.razorpay_subscription_id,
//             razorpay_sigf6nature: data.razorpay_signature
//         });
//         return response?.data;

//     } catch (error) {
//         toast.error(error?.response?.data?.message);
//     }
// })

// export const cancelCourseBudle = createAsyncThunk("/payments/cancel", async () => {
//     try {
//         const response = axiosInstance.post("/payments/unsubscribe")
//         toast.promise(response, {
//             loading: "Unsubscribing the Bundle",
//             success: (data) => {
//                 return data?.data?.message
//             },
//             error: "Failed To Unsubscribe"
//         })
//         return (await response)?.data;

//     } catch (error) {
//         toast.error(error?.response?.data?.message);
//     }
// })


// export const getPaymentRecord = createAsyncThunk("/payment/record", async () => {
//     try {
//         const response = axiosInstance.get("/payments?count=100");
//         toast.promise(response, {
//             loading: "Getting the Payment record",
//             success: (data) => {
//                 return data?.data?.message
//             },
//             error: "Failed to Get the Payment Details"
//         })
//         return (await response)?.data;

//     } catch (error) {
//         toast.error("Operation Failed ");
//     }
// })


// const razorPaySlice = createSlice({
//     name: "razorpay",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder.addCase(getRazorPayid.fulfilled, (state, action) => {
//             state.key = action?.payload?.key
//         })
//             .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
//                 state.subsrciption_id = action?.payload?.subsrciption_id
//             })
//             .addCase(verifyUserPayment.fulfilled, (state, action) => {
//                 toast.success(action?.payload?.message);
//                 state.isPaymentVerified = action?.payload?.success
//             })
//             .addCase(verifyUserPayment.failed, (state, action) => {
//                 toast.success(action?.payload?.message);
//                 state.isPaymentVerified = action?.payload?.success
//             })
//             .addCase(getPaymentRecord.fulfilled, (state, action) => {
//                 state.allPayments = action?.payload?.allPayments;
//                 state.finalMonths = action?.payload?.finalMonths;
//                 state.monthlySalesRecord = action?.payload?.monthlySalesRecord
//             })
//     }
// })



// export default razorPaySlice.reducer;