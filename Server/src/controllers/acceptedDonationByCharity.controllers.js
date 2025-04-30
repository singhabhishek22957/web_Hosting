import mongoose from "mongoose";
import { AcceptedDonation } from "../models/acceptedDonationByCharity.models.js";
import { Donation_generated_by_user } from "../models/donation.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Function to accept the donation and move to Accepted Donations collection
const acceptDonation = async (req, res) => {
  const { donationId, charityId } = req.body; // Donation ID and the charity accepting the donation
  console.log("req body", req.body);
  

  // Find the donation to accept
  const donation = await Donation_generated_by_user.findById(donationId);

  if (!donation) {
    return res.status(404).json(
      new ApiResponse(404, "Donation not found")
    );
  }

  // Set the acceptedBy field with the charity ID
  donation.acceptedBy = { charity: charityId };

  // Save the donation with the acceptedBy field updated
  await donation.save();

  // Move the donation to the AcceptedDonation collection
  const acceptedDonation = new AcceptedDonation({
    donnerName: donation.donnerName,
    eventType: donation.eventType,
    contact: donation.contact,
    date: donation.date,
    pickupTime: donation.pickupTime,
    foodDetails: donation.foodDetails,
    selfDelivery: donation.selfDelivery,
    pickUpAddress: donation.pickUpAddress,
    packed: donation.packed,
    packedType: donation.packedType,
    generatedBy: donation.generatedBy,
    acceptedBy: donation.acceptedBy,
  });

  // Save the donation in the AcceptedDonation collection
  await acceptedDonation.save();

  // Delete the donation from the original collection (move operation)
  await Donation_generated_by_user.findByIdAndDelete(donationId);

  return res.status(200).json(
    new ApiResponse(200, "Donation accepted and moved to Accepted Donations", {
      donation: acceptedDonation,
    })
  );
};

const userDonationHistory = async(req,res)=>{
  const { userId } = req.body; // Donation ID and the charity accepting the donation
  console.log("req body", req.body);

  const donations = await Donation_generated_by_user.find({"generatedBy.user":new mongoose.Types.ObjectId(userId)});

  if(!donations){
    return res.status(404).json(
      new ApiResponse(404, "Donation not found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "Donation accepted and moved to Accepted Donations", {
      donations: donations,
      totalDonations: donations.length
    })
  );
}

const charityDonationHistory = async (req, res) => {
  const { charityId } = req.body; // Charity ID to filter donations by
  console.log("req body", req.body);
 console.log("charityId", charityId);
 
  const donations = await AcceptedDonation.find({ "acceptedBy.charity": new mongoose.Types.ObjectId(charityId) });

  if (donations.length === 0) {
    return res.status(404).json(
      new ApiResponse(404, "No donations found for this charity")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "Donation history fetched successfully", {
      donations: donations,
      totalDonations: donations.length
    })
  );
};


export { acceptDonation,
         userDonationHistory,
         charityDonationHistory
 };
