import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} from "../errors/index.js";
import checkPermission from "../utils/checkPermission.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }
  //connect the job created to user
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  checkPermission(req.user, job.createdBy);

  await Job.findOneAndDelete({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: "Success! Job has been removed." });
};

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  //before frontend setup, display all job
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  //searching for items that is contained in search, without case sensitivity using
  //$options: "i"
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  //No await to get queryObject, as await return the find in DB
  let result = Job.find(queryObject);
  //chaining queries, similar to promise chain
  if (sort === "latest") {
    result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result.sort("createdAt");
  }
  if (sort === "a-z") {
    result.sort("position");
  }
  if (sort === "z-a") {
    result.sort("-position");
  }

  //pagination setup/limit amt of job per page
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  //skipping pages already displayed
  const skip = (page - 1) * limit;
  result.skip(skip).limit(limit);

  const jobs = await result;
  //count amt of job and page based on user query
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJobs = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job found with id: ${jobId}`);
  }
  //check permission if the user logged in have access to the curr job
  checkPermission(req.user, job.createdBy);
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedJob });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    {
      //have to convert the id to mongoose objectid for comparsion
      $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) },
    },
    // grouping the jobs by status
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);
  //reducing the array of object down to three items, with status
  //being the key
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    if (!acc[title]) {
      acc[title] = count;
    }

    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  //createdAt is ISO format, group year and month from created at
  let monthlyApplications = await Job.aggregate([
    {
      $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      //$sort: { _id:-1}, alternatively
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    { $limit: 6 },
  ]);
  //display the lastest 6 months in reverse, after sorting
  monthlyApplications = monthlyApplications
    .map((curr, idx) => {
      const {
        _id: { year, month },
        count,
      } = curr;

      let date = moment()
        .month(month - 1)
        .year(year);
      date = date.format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJobs, showStats };
