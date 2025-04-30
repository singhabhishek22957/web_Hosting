import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl:{
      type:String

    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    phoneNumber: {
      type: [String],
      required: true,
    },
    address: {
      addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      addressType:{
        type:String,
        enum:['work','home','other'],
        default:'home'
      },
      landmark:{
        type:String
      },
      addressLine1:{
        type:String
      },
      addressLine2:{
        type:String
      },
      flatNumber:{
        type:String
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
      },
      occupation: {
        type: String,
      },
      socialLinks: {
        type: [String],
      },

    },  
  },
  { timestamps: true }
);

// generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare Password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const User = mongoose.model("User", userSchema);
