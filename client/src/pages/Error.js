import React from "react";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";
const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt="not found" />
        <h3>page not found</h3>
        <p>The page you are looking for cannot be found</p>
        <Link to="/">back home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
