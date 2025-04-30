

import { Donation_generated_by_user } from "../models/donation.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerDonation = asyncHandler(async (req, res) => {
  const {
    donnerName,
    eventType,
    contact,
    date,
    pickupTime,
    foodDetails,
    generatedBy,
    acceptedBy,
    selfDelivery = false,
    pickUpAddress,
    packed = false,
    packedType,
  } = req.body;

  // Manual Required Field Validation
  if (
    !donnerName ||
    !eventType ||
    !contact ||
    !date ||
    !pickupTime?.start ||
    !pickupTime?.end ||
    !foodDetails ||
    !Array.isArray(foodDetails) ||
    foodDetails.length === 0 ||
    !generatedBy 
  ){
    return res.status(400).json(
      new ApiResponse(400, "All required fields must be provided", {
        requiredFields: [
          "donnerName",
          "eventType",
          "contact",
          "date",
          "pickupTime.start",
          "pickupTime.end",
          "foodDetails (at least one item)",
        ],
      })
    );
  }

  // Validate food item structure
  for (let food of foodDetails) {
    if (
      !food.name ||
      !food.quantity ||
      !food.ingredients ||
      !food.bestBeforeDate ||
      !food.foodType ||
      !food.bestFor
    ) {
      return res.status(400).json(
        new ApiResponse(400, "Each food item must have all required fields", {
          missingFields: [
            "name",
            "quantity",
            "ingredients",
            "bestBeforeDate",
            "foodType",
            "bestFor",
          ],
        })
      );
    }
  }

  // Validate pickup time logic
  if (new Date(pickupTime.start) >= new Date(pickupTime.end)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Pickup end time must be after start time"));
  }

  // Create and save donation
  const newDonation = new Donation_generated_by_user({
    donnerName,
    eventType,
    contact,
    date,
    pickupTime,
    foodDetails,
    selfDelivery,
    pickUpAddress,
    packed,
    packedType,
    generatedBy: { user: generatedBy.user },
    acceptedBy: { charity: acceptedBy },
  });

  const savedDonation = await newDonation.save();

  return res.status(201).json(
    new ApiResponse(201, "Donation registered successfully", {
      donation: savedDonation,
    })
  );
});


const getAllDonations = asyncHandler(async (req, res) => {
    // Fetch all donations from the database
    const donations = await Donation_generated_by_user.find();
  
    // Check if donations are found
    if (donations.length === 0) {
      return res.status(404).json(
        new ApiResponse(404, "No donations found")
      );
    }
  
    return res.status(200).json(
      new ApiResponse(200, "Donations retrieved successfully", {
        donations,
      })
    );
  });

const getDonationById = asyncHandler(async (req, res) => {
    const { donationId } = req.body;
    console.log('REQ BODY', req.body);
    
  
    // Fetch donation by ID from the database
    const donation = await Donation_generated_by_user.findById(donationId);
  
    // Check if donation is found
    if (!donation) {
      return res.status(404).json(
        new ApiResponse(404, "Donation not found")
      );
    }
  
    return res.status(200).json(
      new ApiResponse(200, "Donation retrieved successfully", {
        donation,
      })
    );
  });

export { registerDonation,
    getAllDonations,
    getDonationById,

};
