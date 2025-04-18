import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="text-center mt-5">
      <h1>Welcome!!</h1>
	  <h4>Make sure to sign up first if you're not already registered.</h4>
      <Link to="/signup">
        <button type="button" className="btn btn-danger m-2">Signup</button> 
      </Link>
      <Link to="/login">
        <button type="button" className="btn btn-success m-2">Login</button> 
      </Link>
    </div>
  );
};