const express = require("express");
const Face = require("../models/Face");
const { findBestMatch } = require("../utils/faceUtils");

const router = express.Router();

// Helper function to validate faceData structure
const isValidFaceData = (faceData) => {
  return Array.isArray(faceData) && faceData.every(point => Array.isArray(point) && point.length === 2);
};

// Register a new face
router.post("/register", async (req, res) => {
  const { name, roll, faceData, profileImage, dateTime, status } = req.body;
  console.log("Received face data:", req.body);

  // Validate required fields
  if (!name || !roll || !faceData || !profileImage || !dateTime) {
    return res.status(400).json({ message: "Name, roll number, profileImage, dateTime, and faceData are required." });
  }

  if (!isValidFaceData(faceData)) {
    return res.status(400).json({ message: "Invalid faceData format." });
  }

  try {
    // Set default status if not provided
    const finalStatus = status || { present: false, date: new Date() };

    // Check if the roll number is already registered
    const existingFace = await Face.findOne({ roll });
    if (existingFace) {
      return res.status(400).json({ message: `Roll number ${roll} already registered.` });
    }

    // Save the new face
    const newFace = new Face({ name, roll, faceData, profileImage, dateTime, status: finalStatus });
    await newFace.save();

    res.status(201).json({ message: "Face registered successfully!" });
  } catch (error) {
    console.error("Error registering face:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



// Recognize a face
router.post("/recognize", async (req, res) => {
  const { faceData } = req.body;

  if (!faceData) {
    return res.status(400).json({ message: "faceData is required." });
  }

  try {
    const faces = await Face.find(); // Fetch all registered faces from the database
    console.log("Faces in DB:", faces); // Log faces from the database

    // Find the best match for the incoming faceData
    const matchedFace = findBestMatch(faceData, faces);

    if (matchedFace) {
      const { _id, name, roll, status } = matchedFace;

      // Check if the student is already marked as present today
      const todayDate = new Date().toLocaleDateString('en-GB'); // Get the current date in format dd-mm-yyyy

      // Check if the status already exists for today, if not, create it
      if (status.date === todayDate) {
        return res.status(200).json({ message: `Match found: ${name}, already marked as present today.` });
      }

      // Update the status to present for the current date
      matchedFace.status = {
        present: true,
        date: todayDate,
      };

      // Save the updated face data back to the database
      await matchedFace.save();

      return res.status(200).json({ message: `Match found: ${name}, marked as present for today.` });
    } else {
      return res.status(404).json({ message: "No match found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in face recognition." });
  }
});

// Assuming you're using Express and Mongoose

// Get all present students for the current day
router.get("/present", async (req, res) => {
  try {
    // Find all students whose status is 'present' for today
    const allStudent = await Face.find()

    // Send back the list of present students
    res.status(200).json(allStudent);
  } catch (error) {
    console.error("Error fetching present students:", error);
    res.status(500).json({ message: "Error fetching present students." });
  }
});


module.exports = router;
