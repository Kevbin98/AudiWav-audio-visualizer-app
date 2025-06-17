import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth, provider } from "../firebase/firebaseConfig";
import { Form, Button, Alert } from "react-bootstrap";
import AnimatedBackground from "../components/AnimatedBackground";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(
        "Logged in as:",
        result.user.displayName || result.user.email
      );
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Logged in with Google:", result.user.displayName);
      toast.success("Login Successful!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  return (
    <>
      <AnimatedBackground>
        <Form onSubmit={handleLogin} style={background}>
          <h3 style={{ textAlign: "center" }} className='mb-4'>
            Log In
          </h3>

          <Form.Group className='mb-3'>
            <Form.Label>Email :</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-4'>
            <Form.Label>Password :</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='light' className='w-100 mb-2'>
            Log In
          </Button>

          <Button
            type='button'
            variant='dark'
            className='w-100'
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
          <div style={toRegister}>
            <p>Not a member?</p>
            <Link to='/signup'>Create Account</Link>
          </div>
        </Form>
      </AnimatedBackground>
    </>
  );
};

const background = {
  backgroundColor: " rgba(22, 22, 23, 0.5)",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
  padding: "30px",
  paddingTop: "15px",
  maxWidth: "400px",
  margin: "auto",
  borderRadius: "10px",
};

const toRegister = {
  borderTop: "1px solid white",
  marginTop: "10px",
  paddingTop: "10px",
  textAlign: "center",
};

export default Login;
