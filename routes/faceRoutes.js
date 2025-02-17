const express = require("express");
const Face = require("../models/Face");
const { findBestMatch } = require("../utils/faceUtils");

const router = express.Router();

// Register a new face
router.post("/register", async (req, res) => {
  const { name, roll, faceEmbedding,  dateTime } = req.body;

  if (!name || !roll || !Array.isArray(faceEmbedding) || faceEmbedding.length !== 128 || !dateTime) {
    return res.status(400).json({ message: "Invalid input. Ensure all required fields are correct." });
  }

  if (!Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
    return res.status(400).json({ message: "Invalid face embedding format." });
  }

  try {
    const existingFace = await Face.findOne({ roll });
    if (existingFace) {
      return res.status(400).json({ message: `Roll number ${roll} already registered.` });
    }

    const newFace = new Face({ name, roll, faceEmbedding, dateTime });
    await newFace.save();

    res.status(201).json({ message: "Face registered successfully!" });
  } catch (error) {
    console.error("Error registering face:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// router.post("/recognize", async (req, res) => {
//   const { faceEmbedding } = req.body;

//   // Validate the face embedding data
//   if (!faceEmbedding || !Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
//     return res.status(400).json({ message: "Valid face embedding is required." });
//   }

//   try {
//     const faces = await Face.find(); // Fetch all registered faces

//     // Compare the embedding with stored faces
//     const matchedFace = findBestMatch(faceEmbedding, faces);

//     if (matchedFace) {
//       const { name } = matchedFace;
//       const todayDate = new Date().toLocaleDateString("en-GB");

//       // Check if already marked present today
//       if (matchedFace.status && matchedFace.status.date === todayDate) {
//         return res.status(200).json({
//           isRecognized: true,
//           student: name,
//           message: `${name} already marked present today.`,
//         });
//       }

//       // Mark the student as present
//       matchedFace.status = { present: true, date: todayDate };
//       await matchedFace.save();

//       return res.status(200).json({
//         isRecognized: true,
//         student: name,
//         message: `${name} marked as present for today.`,
//       });
//     } else {
//       return res.status(200).json({
//         isRecognized: false,
//         student: "Unknown",
//         message: "No match found.",
//       });
//     }
//   } catch (error) {
//     console.error("Error in face recognition:", error);
//     res.status(500).json({ message: "Error in face recognition." });
//   }
// });


router.post("/recognize", async (req, res) => {
  const { faceEmbeddings } = req.body; // Note the plural key

  // Validate that faceEmbeddings is an array and each embedding is an array of 128 numbers
  if (
    !faceEmbeddings ||
    !Array.isArray(faceEmbeddings) ||
    faceEmbeddings.some(embedding => !Array.isArray(embedding) || embedding.length !== 128)
  ) {
    return res.status(400).json({ message: "Valid face embeddings are required." });
  }

  try {
    const faces = await Face.find(); // Fetch all registered faces
    let recognizedFaces = [];

    // Loop through each face embedding received
    for (const embedding of faceEmbeddings) {
      const matchedFace = findBestMatch(embedding, faces);
      if (matchedFace) {
        const { name } = matchedFace;
        const todayDate = new Date().toLocaleDateString("en-GB");

        // Mark as present if not already marked today
        if (!(matchedFace.status && matchedFace.status.date === todayDate)) {
          matchedFace.status = { present: true, date: todayDate };
          await matchedFace.save();
        }
        recognizedFaces.push({ name });
      } else {
        recognizedFaces.push({ name: "Unknown" });
      }
    }

    return res.status(200).json({ recognizedFaces });
  } catch (error) {
    console.error("Error in face recognition:", error);
    res.status(500).json({ message: "Error in face recognition." });
  }
});


// Get all present students for the current day
router.get("/present", async (req, res) => {
  try {
    const allStudents = await Face.find();
    res.status(200).json(allStudents);
  } catch (error) {
    console.error("Error fetching present students:", error);
    res.status(500).json({ message: "Error fetching present students." });
  }
});

module.exports = router;
