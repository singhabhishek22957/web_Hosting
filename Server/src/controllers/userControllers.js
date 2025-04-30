import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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
  const {
    name,
    email,
    password,
    phoneNumber,
    addressId,
    addressType,
    landmark,
    addressLine1,
    addressLine2,
    flatNumber,
  } = req.body;

  // try {
  console.log("register User Details: ", req.body);

  // details validation

  if (
    [
      name,
      email,
      password,
      phoneNumber,
      addressId,
      addressLine1,
    ].some((value) => !value || value?.trim() === "")
  ) {
    // throw new ApiError(400, "All fields are required");
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  // if user exist
  const userExist = await User.findOne({
    email: email,
  });

  if (userExist) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "User already exist", {
          success: false,
          message: "User already exist",
          successCode: 400,
          data: userExist,
        })
      );
  }

  // avatar upload
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  console.log("avatarLocalFilePath: ", avatarLocalFilePath);

  // upload avatar on cloudinary
  const avatarUpload = await uploadOnCloudinary(avatarLocalFilePath);
  console.log("avatarUpload: ", avatarUpload?.url);

  const user = await User.create({
    email,
    name,
    password,
    phoneNumber,
    avatarUrl: avatarUpload?.url,
    address: {
      addressId,
      addressType,
      landmark,
      addressLine1,
      addressLine2,
      flatNumber,
    },
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
  // } catch (error) {
  //   console.log("Error to register user: ", error);
  //   return res.status(500).json({
  //     success: false,
  //     message: "Error to register user",
  //     successCode: 500,
  //     data: {},
  //   });
  // }
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

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Details: ", email, password);

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    // throw new ApiError(404,"User not found");
    return res.status(404).json(new ApiResponse(404, "User not found"));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    // throw new ApiError(401,"Invalid Password");
    return res.status(401).json(new ApiResponse(401, "Invalid Password"));
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const userDetails = await User.findById({
    _id: user._id,
  }).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: false,
    sameSite:'Lax'
  };
  
  return res
  .status(200)
  .cookie("refreshToken", refreshToken, options)
  .cookie("accessToken", accessToken, options)
  .json(
    new ApiResponse(200, "Login Successfully", {
      accessToken,
      refreshToken,
      user: userDetails,
    })
  );
});

const logout = asyncHandler(async (req, res) => {
  User.findOneAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", "", options)
    .cookie("accessToken", "", options)
    .json(
      new ApiResponse(200, "Logout Successfully", {
        message: "Logout Successfully",
        statusCode: 200,
        success: true,
      })
    );
});

const getUser = asyncHandler(async (req, res) => {
  console.log("User Details: ", req.user);

  const user = req.user;
  if (!user) {
    // throw new ApiError(401,"User not found: Unauthorized Request");
    return res
      .status(401)
      .json(new ApiResponse(401, "User not found: Unauthorized Request"));
  }

  return res.status(200).json(
    new ApiResponse(200, "User Found", {
      message: "User Found",
      statusCode: 200,
      success: true,
      user: user,
    })
  );
});

export { registerUser, testing, login, getUser, logout };
