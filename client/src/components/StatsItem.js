import React from "react";
import Wrapper from "../assets/wrappers/StatItem";

const StatsItem = (curr, stats) => {
  const { count, title, icon, color, bcg } = curr;

  return (
    //passing props to styled components
    <Wrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{count}</span>
        <div className="icon">{icon}</div>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};

export default StatsItem;
