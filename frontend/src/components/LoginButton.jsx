// src/components/LoginButton.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in as:", user.displayName);
      // You can now use user info (like name, email, photoURL)
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
};

export default LoginButton;
