import mongoose from "mongoose";
import userModel from "./UserModel.js";
import axios from "axios";
import moment from "moment-timezone";

const travelRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    distance: {
      type: Number,
      required: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startLocationName: {
      type: String,
      required: true,
    },
    endLocationName: {
      type: String,
      required: true,
    },
    travelTime: {
      type: Number,
      required: false,
    },
    Amount: {
      type: Number,
      required: false,
    },
    otherData: {
      startLat: Number,
      startLon: Number,
      endLat: Number,
      endLon: Number,
      fare: Number,
      openingReading: Number,
      closingReading: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

travelRecordSchema.pre("save", async function (next) {
  try {
    const headers = {
      Accept:
        "application/json, application/geo+json, application/gpx+xml, image/png; charset=utf-8",
    };
    const URL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.OSM_KEY}&start=${this.otherData.startLon},${this.otherData.startLat}&end=${this.otherData.endLon},${this.otherData.endLat}`;

    const response = await axios.get(URL, { headers });
    const resp = response.data;

    this.distance = Math.round(
      resp.features[0].properties.summary.distance / 1000
    );

    const istTimezone = "Asia/Kolkata";
    this.startDate = moment(this.startDate).tz(istTimezone);
    this.endDate = moment(this.endDate).tz(istTimezone);

    this.travelTime = (this.endDate - this.startDate) / (1000 * 60);
    this.Amount = this.distance * this.otherData.fare;

    next(); // Continue with the save operation after data calculations
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

const TravelRecord = mongoose.model("TravelRecord", travelRecordSchema);

export default TravelRecord;
