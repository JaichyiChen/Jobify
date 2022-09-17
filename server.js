import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
//middleware for async errors, eliminates the need for try/catch and next()
import "express-async-errors";
import morgan from "morgan";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
//db
import connectDB from "./db/connect.js";
//Router
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobRoutes.js";

// //cors
// import cors from "cors";
// app.use(cors());
if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan("dev"));
}

app.use(express.json());
//this default route is going to return us an error because on the front end, static server returns index.html with React APP
// app.get("/", (req, res) => {
//   res.json({ msg: "hello" });
// });

app.get("/api/v1", (req, res) => {
  res.json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);
//middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
