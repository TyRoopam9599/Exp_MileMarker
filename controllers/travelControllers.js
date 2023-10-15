import { TravelRecord } from "../models/TravelModel.js";

export const registerTravel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const travelRecordData = {
      userId,
      ...req.body,
    };
    const travelRecord = new TravelRecord(travelRecordData);
    await travelRecord.save();
    res.status(201).json(travelRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next();
  }
};

export const getTravels = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const travelRecords = await TravelRecord.find({ userId });
    res.status(200).json(travelRecords); // Change status to 200
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    next();
  }
};

export const getOneTravel = async (req, res, next) => {
  try {
    const travelRecord = await TravelRecord.findById(req.params.id);
    if (!travelRecord) {
      return res.status(404).json({ error: "Travel record not found" });
    }
    res.json(travelRecord);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTravel = async (req, res, next) => {
  try {
    const travelRecord = await TravelRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!travelRecord) {
      return res.status(404).json({ error: "Travel record not found" });
    }
    res.json(travelRecord);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTravel = async (req, res, next) => {
  try {
    const travelRecord = await TravelRecord.findByIdAndDelete(req.params.id);
    if (!travelRecord) {
      return res.status(404).json({ error: "Travel record not found" });
    }
    res.json({ message: "Travel record deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchTravel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const locationName = req.query.locationName;

    const travelRecords = await TravelRecord.find({
      userId,
      $or: [
        { startLocationName: { $regex: locationName, $options: "i" } },
        { endLocationName: { $regex: locationName, $options: "i" } },
      ],
    });
    res.status(200).json(travelRecords); // Change status to 200
  } catch (error) {
    res.status(500).json({ error: `Internal server error, ${error}` });
  }
};
