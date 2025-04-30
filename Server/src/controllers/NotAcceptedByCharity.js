
import { Donation_generated_by_user } from "../models/donation.models.js";
import { NotAcceptedBy } from "../models/NotAcceptedBy.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// This function will check donations that are older than 6 hours
const moveUnacceptedDonations = async () => {
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

  // Find donations older than 6 hours that have not been accepted
  const unacceptedDonations = await Donation_generated_by_user.find({
    acceptedBy: { $exists: false },
    date: { $lt: sixHoursAgo },
  });

  if (unacceptedDonations.length === 0) return;

  // Move those donations to NotAcceptedBy collection
  const donationsToMove = unacceptedDonations.map((donation) => ({
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
  }));

  // Insert into the NotAcceptedBy collection
  await NotAcceptedBy.insertMany(donationsToMove);

  // Delete from the original collection
  await Donation_generated_by_user.deleteMany({
    _id: { $in: unacceptedDonations.map((donation) => donation._id) },
  });

  console.log(`Moved ${unacceptedDonations.length} unaccepted donations to NotAcceptedBy`);
};

export { moveUnacceptedDonations };
