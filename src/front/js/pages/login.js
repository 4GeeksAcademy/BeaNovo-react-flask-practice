import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import {LoginForm} from "../component/loginForm";
import "../../styles/home.css";

export const Login = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center ml-5">
            <h1>Login</h1>
            <LoginForm/>
        </div>

    );

};


