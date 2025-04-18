import React from "react";
import { SignupForm } from "../component/signupForm"; 
import "../../styles/home.css";

export const Signup = () => {
  return (
    <div className="text-center ml-5"> 
      <h1>Signup</h1>
      <SignupForm />
    </div>
  );
};