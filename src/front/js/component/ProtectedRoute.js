import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { store } = useContext(Context);
  
  // Si no está loggeado, redirige a /login
  if (!store.logged) return <Navigate to="/login" replace />;
  
  // Si está loggeado, muestra la ruta protegida
  return <Outlet />; // Esto renderizará el componente hijo
};

export default ProtectedRoute;