import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Home = () => {
  const { store } = useContext(Context);

  if (store?.logged === true) {
    return (
      <div className="text-center mt-5">
      <img 
        src="https://img-comment-fun.9cache.com/media/amBZOO2/aexgVxVd_700w_0.jpg" 
        alt="Welcome image"
        className="img-fluid rounded"
        style={{ maxHeight: "300px" }}
      />
    </div>
    );
  }

  return (
    <div className="text-center mt-5 ">
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

