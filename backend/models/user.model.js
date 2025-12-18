import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function (){
   if (!this.isModified("password")) return;
   this.password = await bcryptjs.hash(this.password, 10);
})

userSchema.methods.isPasswordMatched = async function(password){
  return await bcryptjs.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
  return jwt.sign({
     _id: this._id,
      email: this.email,
      fullname: this.fullname,
  },
  process.env.JWT_SECRET_KEY,
  {expiresIn: "7d"}
)
}

const User = mongoose.model("User", userSchema);

export default User;