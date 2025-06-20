import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose"; // ✅ Add this line

// Routes
import authRoutes from "./routes/authRoutes.js";
import groqRoute from "./routes/groqRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groq", groqRoute);

// Health check
app.get("/", (req, res) => {
  res.send("✅ AI Chatbot Backend is Running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
