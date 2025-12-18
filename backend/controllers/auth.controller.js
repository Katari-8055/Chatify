import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponce.js";


const options = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "development",
}

const generateAccessToken = async (id) =>{
    try {
        const user = await User.findById(id);
        const accessToken = user.generateToken();
        return {accessToken};
    } catch (error) {
        throw new ApiError(400, "Unable To Generate Token")
    }
}

export const signUp = asynHandler(async (req, res)=>{
    const {email, fullName, password} = req.body;
    if(!email || !fullName || !password){
        throw new ApiError(400, "All fields are required");
    }

    if(password.length < 6){
        throw new ApiError(400, "Password must be at least 6");
    }

    const user = await User.findOne({email});

    if(user){
        throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({
        email,
        fullName,
        password,
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(400, "User not created");
    }

    const {accessToken} = await generateAccessToken(createdUser._id);

    res.cookie("accessToken", accessToken, options);

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created succesfully" ))
    
})