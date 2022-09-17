import React from "react";
import main from "../assets/images/main-alternative.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo></Logo>
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            Job <span>tracking</span> app
          </h1>
          <p>
            I'm baby irony ugh prism farm-to-table butcher scenester kinfolk.
            Yuccie hoodie bruh mustache, irony selvage enamel pin live-edge.
            Portland austin fashion axe pabst yes plz, selfies seitan
          </p>
          <Link to="/register" className="btn btn-hero">
            Register/Login
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
