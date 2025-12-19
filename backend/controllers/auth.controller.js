import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponce.js";
import { deleteToCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";


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

export const login = asynHandler(async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(400, "Invalid email or password");
    }


    const isPasswordCorrect = await user.isPasswordMatched(password);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid email or password");
    }

    const accessToken = await generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, options);

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User logged in succesfully" ))
})

export const logout = asynHandler(async (req, res)=>{
    try {
        res.clearCookie("accessToken", options);
        
        return res
        .status(200)
        .json({message: "User logged out succesfully"})
    } catch (error) {
        throw new ApiError(400, "Unable to logout");
    }
})

export const profileUpdate = asynHandler(async (req, res) => {
    const LoggedUser = req.user;

    if (!req.file) {
        throw new ApiError(400, "Profile image is required");
    }

    const profileImagePath = req.file.path;

    const profileImage = await uploadToCloudinary(profileImagePath);

    if (LoggedUser.profilePicId) {
        await deleteToCloudinary(LoggedUser.profilePicId);
    }

    LoggedUser.profilePic = profileImage.secure_url;
    LoggedUser.profilePicId = profileImage.public_id;

    await LoggedUser.save();

    const safeUser = await User.findById(LoggedUser._id).select("-password");


    return res.status(200).json(
        new ApiResponse(200, safeUser, "Profile updated successfully")
    );
});

export const checkAuth = asynHandler(async (req, res, next)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check Auth Controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
})
