import React from "react";
import Wrapper from "../assets/wrappers/JobsContainer";
import Job from "./Job";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const {
    getJobs,
    isLoading,
    jobs,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
  } = useAppContext();
  useEffect(() => {
    getJobs();
  }, [search, searchStatus, searchType, sort, page]);
  if (isLoading) {
    return <Loading center></Loading>;
  }
  if (jobs.length === 0) {
    return (
      <Wrapper>
        {" "}
        <h2> No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} job={job}></Job>;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer></PageBtnContainer>}
    </Wrapper>
  );
};

export default JobsContainer;
