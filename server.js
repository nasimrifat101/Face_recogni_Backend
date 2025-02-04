require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const faceRoutes = require("./routes/faceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default route to handle root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Face Recognition Backend API");
});

// Routes
app.use("/api", faceRoutes);

// MongoDB connection using Mongoose
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://FaceRecogni:SuzanMahmud@cluster0.nilhs.mongodb.net/FaceRecognation?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the app in case of a database connection error
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
