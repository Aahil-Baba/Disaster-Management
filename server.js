const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.js");
const reportRoutes = require("./routes/reportRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const  {apiLimiter }= require("./middleware/rateLimitMiddleware");
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors({ origin: '*' })); // Allows frontend to communicate seamlessly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send({ status: "OK", message: "Disaster Backend API is running" });
});
app.use("/api/reports", reportRoutes);

app.use("/api/users/auth", userRouter);      
app.use("/api", apiLimiter);           
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
