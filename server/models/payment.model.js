import { Schema, model } from "mongoose"
const paymentSchema = new Schema({
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_subscription_id: {
        tyep: String,
        required: true
    },
    razorpay_signture: {
        type: String,
        required: true,

    }

});
const Payment = model("Payment", paymentSchema);
export default Payment;