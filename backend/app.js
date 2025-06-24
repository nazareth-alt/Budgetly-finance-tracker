const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const investmentTipsRouter = require("./routes/investmentTipsRouter");
const goalsRouter = require("./routes/goalRoutes"); 
const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

// DB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
app.use("/", investmentTipsRouter);
app.use("/api/v1/goals", goalsRouter);

app.get("/", (req, res) => {
  res.send("Budgetly Backend API is running");
});
// ✅ Mount the goals route

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT}`)
);


