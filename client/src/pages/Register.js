import React from "react";
import { useState, useEffect } from "react";
import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  //local values
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  //global values from appcontext
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } =
    useAppContext();
  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    //key value pair, left side key is the param field, and right is the value entered
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    //register user
    const currentUser = { name, email, password };
    if (isMember) {
      loginUser(currentUser);
    } else {
      registerUser(currentUser);
    }
    //prints out user credentials
    // console.log(values);
  };
  //render on initial render, when user changes or navigate changes
  useEffect(() => {
    if (user) {
      setTimeout(() => {}, 3000);
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo></Logo>
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert></Alert>}
        {/*name input, only display if not member*/}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          ></FormRow>
        )}
        {/*Email input*/}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        ></FormRow>
        {/*Password input*/}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        ></FormRow>
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
