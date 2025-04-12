import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(
      "Error while generating access token and refresh token: ",
      error
    );
    throw new ApiError(
      500,
      "Error while generating access token and refresh token"
    );
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("register User Details: ", name, email, password);

    // details validation

    if ([name, email, password].some((value) => value?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        successCode: 400,
        data: {},
      });
    }

    // if user exist
    const userExist = await User.findOne({
      email: email,
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
        successCode: 400,
        data: userExist,
      });
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    const userCreate = await User.findOne({
      email: email,
    }).select("-password");

    if (userCreate) {
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        successCode: 200,
        data: userCreate,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User not created",
        successCode: 400,
        data: userCreate,
      });
    }
  } catch (error) {
    console.log("Error to register user: ", error);
    return res.status(500).json({
      success: false,
      message: "Error to register user",
      successCode: 500,
      data: {},
    });
  }
};

const testing = async (req, res) => {
  console.log("This user testing page");

  return res.status(200).json({
    success: true,
    message: "This user testing page",
    successCode: 200,
    data: {
      name: "Abhishek",
      email: "abhishek@gmail",
    },
  });
};


const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    console.log("Login Details: ", email, password);

    const user = await User.findOne({
        email:email
    })

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        throw new ApiError(401,"Invalid Password");
    }

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
    
    const userDetails = await User.findById({
        _id:user._id
    }).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200,"Login Successfully",{
            accessToken,
            refreshToken,
            user:userDetails
        })
    )
    
})

export { registerUser, testing, login };
