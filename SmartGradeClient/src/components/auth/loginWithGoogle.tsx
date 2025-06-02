// src/components/LoginWithGoogle.tsx
import React from "react";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";


const LoginWithGoogle: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      // console.log("Signed in user:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default LoginWithGoogle;
