const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const investmentTipsRouter = require("./routes/investmentTipsRouter");
const app = express();

// //!Connect to mongodb
mongoose
  .connect("mongodb+srv://nazarethhlana1:e7WWYmvSLvD0CGRL@cluster0.srqg0vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

// //! Cors config
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
};
app.use(cors());
// //!Middlewares
app.use(express.json()); //?Pass incoming json data

// app.get("/", (req, res) => {
//   res.send("API is working!");
// }); 
// //!Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);
app.use("/", investmentTipsRouter);
//! Error
app.use(errorHandler);

//!Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on this port... ${PORT} `)
);  
 

