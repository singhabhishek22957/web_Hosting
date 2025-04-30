import { Schema, model } from "mongoose";

// Define sub-schema for each food item
const foodItem = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  bestBeforeDate: {
    type: Date,
    required: true,
  },
  foodType: {
    type: String,
    required: true,
    enum: ["veg", "non-veg"],
  },
  bestFor: {
    type: [String], // e.g., ["lunch", "dinner"]
    required: true,
  },
});

const donationSchema = new Schema(
  {
    donnerName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    contact: {
      type: [String],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    pickupTime: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    foodDetails: {
      type: [foodItem],
      required: true,
    },
    selfDelivery: {
      type: Boolean,
      default: false,
    },
    pickUpAddress: {
      addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address",
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
    },
    packed: {
      type: Boolean,
      default: false,
    },
    packedType: {
      type: String,
      enum: ["For Single Person Pkt", "For Multiple Person Pkt"],
    },
    generatedBy: {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    acceptedBy: {
      charity: {
        type: Schema.Types.ObjectId,
        ref: "Charity",
      },
    },
  },
  { timestamps: true }
);

export const Donation_generated_by_user = model(
  "Donation_generated_by_user",
  donationSchema
);
