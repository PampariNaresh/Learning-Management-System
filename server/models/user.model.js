const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
            , "Please fill in a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minLength: [8, "Password must be atleast 8 Characters"],
        select: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
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
    if (this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);

})

userSchema.methods = {
    comparePassword: async function (plaintext) {
        return await bcrypt.compare(plaintext, this.password);
    }

    ////////////////////////////////////////////////////////////////////////Here Continue 
    , generateJWTToken: function () {
        return jwt.sign({
            id: this._id, role: this.role, email: this.email, subs
        })
    }
}


const User = model('User', userSchema);
module.exports = User;