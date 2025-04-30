import mongoose from "mongoose";

const notAcceptedBySchema = mongoose.Schema(
  {
    donnerName: String,
    eventType: String,
    contact: String,
    date: Date,
    pickupTime: Object,
    foodDetails: Array,
    selfDelivery: Boolean,
    pickUpAddress: String,
    packed: Boolean,
    packedType: String,
    generatedBy: Object,
    acceptedBy: Object,
  },
  { timestamps: true }
);

const NotAcceptedBy = mongoose.model("NotAcceptedBy", notAcceptedBySchema);

export { NotAcceptedBy };
