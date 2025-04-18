import React, { useContext, useEffect, useState } from "react"; // ¡IMPORTANTE!
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [fireworks, setFireworks] = useState([]);

  // Efecto de fuegos artificiales al cargar
  useEffect(() => {
    if (!store.logged) navigate("/login");
    
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];
    const interval = setInterval(() => {
      setFireworks(prev => [
        ...prev.slice(-10), // Mantiene máximo 10 fuegos
        {
          id: Date.now(),
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5
        }
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (!store.user) return <div className="spinner-border text-primary"></div>;

  return (
    <div className="container mt-5 position-relative" style={{ minHeight: "100vh" }}>
      {/* Fuegos artificiales */}
      {fireworks.map(fw => (
        <div 
          key={fw.id}
          style={{
            position: "absolute",
            left: `${fw.left}%`,
            top: "0",
            width: `${fw.size}px`,
            height: `${fw.size}px`,
            backgroundColor: fw.color,
            borderRadius: "50%",
            animation: `firework 2s ease-out forwards`,
            opacity: 0
          }}
        />
      ))}

      {/* Contenido del perfil */}
      <div className="card p-4 bg-dark text-white mx-auto" style={{ maxWidth: "500px", position: "relative", zIndex: 1 }}>
        <h1 className="text-center">🎉 ¡Welcome! 🎉</h1>
        <p className="h5 mt-5"><strong>Email:</strong> {store.user.email}</p>
      </div>

      {/* Animación CSS inline */}
      <style>{`
        @keyframes firework {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
