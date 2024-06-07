const { verify } = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {
    try {
        const accessToken = req?.cookies?.accessToken;
        if (!accessToken) throw new ApiError(401, "Unauthorized Access");

        const decodedTokenInfo = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken");

        if (!user) throw new ApiError(401, "Invalid access Token");
        req.user = user;

        next();
    } catch (error) {
        console.log("Error Verifying AccessToken", error);
        throw new ApiError(401, error.message || "Invalid Access Token");
    }

}
module.exports = verifyJWT;