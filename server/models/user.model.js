import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"
//const emailvalidator = require('email-validator')
const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Email is required"],
        minLength: [5, "Name must be atleast 5 charcter"],
        maxLength: [50, "Namr must be less than 50 characters"],
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
        ], // Matches email against regex
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minLength: [8, "Password must be atleast 8 Characters"],
        select: false,

    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
    ,
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: String
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);

})

userSchema.methods = {
    comparePassword: async function (plaintextpassword) {
        return await bcrypt.compare(plaintextpassword, this.password);
    }

    ////////////////////////////////////////////////////////////////////////Here Continue 
    , generateJWTToken: async function () {
        return await jwt.sign(
            {
                id: this._id, role: this.role, subscription: this.subscription

            },

            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
    }
    , generatePasswordToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }
}


const User = model('User', userSchema);
export default User;