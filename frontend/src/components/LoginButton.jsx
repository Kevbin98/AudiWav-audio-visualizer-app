// src/components/LoginButton.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";
import { Button } from "react-bootstrap";

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

  return (
    <Button onClick={handleLogin} variant='dark'>
      Sign in with Google
    </Button>
  );
};

export default LoginButton;
