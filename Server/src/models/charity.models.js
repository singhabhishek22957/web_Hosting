import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const charitySchema = new Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mission: {
      type: String,
    },
    vision: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    // Founding & Legal
    founderName: {
      type: String,
    },
    establishedDate: {
      type: Number,
    },
    registeredNGO: {
      type: Boolean,
      default: false,
      required: true,
    },
    registrationNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    // Contact Information
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumbers: {
      type: [String],
      required: true,
    },
    website: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },
    // Address (linked to separate Address collection)
    address: {
      addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      addressType: {
        type: String,
        enum: ["office", "branch", "other"],
        default: "office",
      },
      landmark: {
        type: String,
      },
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
      },
      flatNumber: {
        type: String,
      },
    },
    // Media
    logoUrl: {
      type: String,
    },
    coverImage: {
      type: String, // URLs of images
    },
    // Payment Info (Optional for online donations)
    upiId: {
      type: String,
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branch: String,
    },
  },

  { timestamps: true }
);

// generate access token

charitySchema.methods.generateAccessToken= function(){
  return jwt.sign(
    {
      _id:this._id,
      name:this.name,
      email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

// generate refresh token 
charitySchema.methods.generateRefreshToken = function () {
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
// password encryption
charitySchema.pre('save', async function(next){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password,10);
    next();
})

// compare Password
charitySchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}



export const Charity = model("Charity", charitySchema);
