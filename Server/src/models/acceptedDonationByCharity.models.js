import mongoose from "mongoose";

const acceptedDonationSchema = mongoose.Schema(
  {
    donnerName: String,
    eventType: String,
    contact: [String],
    date: Date,
    pickupTime: Object,
    foodDetails: Array,
    selfDelivery: Boolean,
    pickUpAddress: String,
    packed: Boolean,
    packedType: String,
    generatedBy: Object,
    acceptedBy: Object, // Charity that accepted the donation
  },
  { timestamps: true }
);

export const AcceptedDonation = mongoose.model("AcceptedDonation", acceptedDonationSchema);


