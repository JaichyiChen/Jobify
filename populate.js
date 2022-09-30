import { readFile } from "fs/promises";
//helper method to populate the DB with mock data
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";
import Job from "./models/Job.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    const product = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    await Job.create(product);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
