import { Charity } from "../models/charity.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (charityId) => {
  try {
    console.log("I am Enter to generate access and refresh token by taking charityID:",
    charityId);
    
    const charity = await Charity.findById({
      _id: charityId,
    });

    if (!charity) {
      throw new ApiError(400, "Invalid Charity Details");
    }
    console.log("Charity Found Successfully: ", charity);
    
    const accessToken = charity.generateAccessToken();
    const refreshToken = charity.generateRefreshToken();

    console.log(
      "Refresh TOken: ",
      refreshToken,
      "\n Access Token:",
      accessToken
    );

    charity.refreshToken = refreshToken;
    await charity.save({
      validateBeforeSave: false,
    });
    
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error to generate access and refresh token ", error);
    throw new ApiError(
      400,
      "Error found to generate access token and refresh token"
    );
  }
};

const registerCharity = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    password,
    mission,
    vision,
    addressId,
    addressType,
    landmark,
    addressLine1,
    addressLine2,
    flatNumber,
    founderName,
    establishedDate,
    registerNGO,
    registrationNumber,
    panNumber,
    email,
    phoneNumber,
    website,
    facebookLink,
    twitterLink,
    instagramLink,
    linkedinLink,
    youtubeLink,
  } = req.body;

  if (
    [
      name,
      description,
      password,
      addressId,
      addressType,
      establishedDate,
      email,
      phoneNumber,
    ].some((value) => !value || String(value).trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  const charityExist = await Charity.findOne({
    email: email,
  });

  if (charityExist) {
    // throw new ApiError(400, "Charity already exist");
    return res.status(400).json(new ApiResponse(400, "Charity already exist"));
  }

  const logoLocalFilePath = req.files?.logoImage[0]?.path;
  const coverImageFilePath = req.files?.coverImage[0]?.path;

  const logoUpload = await uploadOnCloudinary(logoLocalFilePath);
  const coverImageUpload = await uploadOnCloudinary(coverImageFilePath);
  console.log(
    "logUrl:",
    logoUpload?.url,
    "\n coverImageUrl:",
    coverImageUpload?.url
  );

  const charity = await Charity.create({
    name,
    description,
    password,
    mission,
    vision,
    address: {
      addressId,
      addressType,
      landmark,
      addressLine1,
      addressLine2,
      flatNumber,
    },
    logoUrl: logoUpload?.url,
    coverImage: coverImageUpload?.url,
    founderName,
    establishedDate,
    registerNGO,
    registrationNumber,
    panNumber,
    email,
    phoneNumber,
    website,
    socialLinks: {
      facebook: facebookLink,
      twitter: twitterLink,
      instagram: instagramLink,
      linkedin: linkedinLink,
      youtube: youtubeLink,
    },
  });

  const charityCreated = await Charity.findOne({
    email: email,
  }).select("-password -refreshToken");

  if (charityCreated) {
    return res.status(200).json(
      new ApiResponse(200, "Charity Register Successfully", {
        message: "Charity Register",
        statusCode: 200,
        success: true,
        charity: charityCreated,
      })
    );
  } else {
    // throw new ApiError(400, "Charity Not register");
    return res.status(400).json(new ApiResponse(400, "Charity Not register"));
  }
});

const loginCharity = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // throw new ApiError(400, " All field are required");
    return res
      .status(400)
      .json(new ApiResponse(400, " All field are required"));
  }

  const charity = await Charity.findOne({
    email: email,
  });

  if (!charity) {
    // throw new ApiError(400, "Charity Not found");
    return res.status(400).json(new ApiResponse(400, "Charity Not found"));
  }

  const isPasswordMatch = await charity.comparePassword(password);

  if (!isPasswordMatch) {
    // throw new ApiError(401, " Password Not matched");
    return res.status(401).json(new ApiResponse(401, " Password Not matched"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    charity._id
  );

  console.log("access token in login: ", accessToken);
  console.log("refresh token in login: ", refreshToken);

  

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  };

  const charityDetails = await Charity.findById({
    _id: charity._id,
  }).select("-password  -refreshToken");

  return res
  .status(200)
  .cookie("refreshToken", refreshToken, options)
  .cookie("accessToken", accessToken, options)
  .json(
    new ApiResponse(200, "Login Successful", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      charity: charityDetails,
    })
  );
});

const getCharity = asyncHandler(async (req, res) => {
  console.log("req.charity: ", req.charity);
  const charity = req.charity;

  if (!charity) {
    // throw new ApiError(400, "Unauthorized Access");
    return res.status(400).json(new ApiResponse(400, "Unauthorized Access"));
  }

  return res.status(200).json(
    new ApiResponse(200, "Data Fetch Successfully", {
      charity: charity,
      message: "Data Fetch Successfully",
      statusCode: 200,
      success: true,
    })
  );
});



const logout = asyncHandler(async (req, res) => {
  Charity.findOneAndUpdate(
    req.charity._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", null, cookieOptions)
    .cookie("accessToken", null, cookieOptions)
    .json(
      new ApiResponse(200, "Logout Successfully", {
        message: "Logout Successfully",
        statusCode: 200,
        success: true,
      })
    );
});

export { registerCharity, loginCharity, getCharity, logout };
