require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(
      "MongoDB connection error. Please ensure MONGODB_URI is valid in .env:",
      err.message,
    );
  });

module.exports = app; // Exporting for testing purposes
