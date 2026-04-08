const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const authRoutes         = require("./routes/authRoutes");

app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/auth",          authRoutes);

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose
  .connect("mongodb://127.0.0.1:27017/subscriptionDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));