const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    enrollmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    avatar: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bycrpt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrpt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        _id: this._id,
        enrollmentNumber: this.enrollmentNumber,
        fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}
module.exports = mongoose.model('User', userSchema);