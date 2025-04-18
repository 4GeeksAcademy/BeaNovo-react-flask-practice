import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/"); 
    };

    return (
        <nav className="navbar navbar-light bg-light px-3">
            <div className="container-fluid">
      
                <button 
                    className="btn btn-outline-primary me-2" 
                    onClick={() => navigate("/")}
                >
                    <i className="fas fa-home me-2"></i> Home
                </button>
                
                
                {store.logged && (
                    <button 
                        className="btn btn-danger ms-auto"
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt me-2"></i> Cerrar sesión
                    </button>
                )}
            </div>
        </nav>
    );
};