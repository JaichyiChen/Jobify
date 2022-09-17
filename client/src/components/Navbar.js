import React, { useState } from "react";
import Wrapper from "../assets/wrappers/Navbar";
import { FaHome, FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useAppContext } from "../context/appContext";
import Logo from "./Logo";
const Navbar = () => {
  const { toggleSidebar, user, logoutUser } = useAppContext();
  const [showLogout, setshowLogout] = useState(false);
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft></FaAlignLeft>
        </button>
        <div>
          {/* display logo or text based on screen size */}
          <Logo></Logo>
          <h3 className="logo-text">dashboard</h3>
        </div>
        <div className="btn-container">
          <button
            className="btn"
            type="button"
            onClick={() => setshowLogout(!showLogout)}
          >
            <FaUserCircle></FaUserCircle>
            {user.name}
            <FaCaretDown></FaCaretDown>
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button type="button" className="dropdown-btn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
