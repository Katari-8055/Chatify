import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";



export const getAllUser = asynHandler(async (req, res)=>{
    try {
        const loogedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loogedInUserId}}).select("-password");

        return res.status(200)
        .json(new ApiResponse(200, filteredUsers, "Users fetched successfully"))
    } catch (error) {
        console.log("User not Fetched", error.message);
        return res.status(500)
        .json({message: "Internal Server Error"})
    
    }
})



export const getMessages = asynHandler(async (req, res)=>{
    try {
    const {id:userToChatId} = req.params;
    const myId = req.user._id;

    
    const message = await Message.find({
        $or:[
            {senderId: myId, receiverId: userToChatId},
            {senderId: userToChatId, receiverId: myId},
        ]
    })

    res.status(200)
    .json(new ApiResponse(200, message, "Messages fetched successfully"))

    } catch (error) {
        console.log("Error in GetMessage", error.message)
        res.status(500)
        .json({message: "Internal Server Error"})
    
    }
})


export const sendMessage = asynHandler(async (req, res)=>{
    // const {id} = req.params receverId
    const { id:receverId } = req.params;
    const senderId = req.user._id;
    const text = req.body.text || "";

    if(!text && !req.file){
        throw new ApiError(400, "Text or Image is required");
    }

    const image = req.file?.path;


    const imageUrl = await uploadToCloudinary(image);


    const newMessage = await Message.create({
        senderId,
        receiverId: receverId,
        text,
        image: imageUrl?.secure_url,
   })
   await newMessage.save();

   //Real Time Functionality

   res.status(200)
   .json(new ApiResponse(200, newMessage, "Message sent successfully"))


})