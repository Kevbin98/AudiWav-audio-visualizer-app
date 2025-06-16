// src/components/SignupForm.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Form, Button, Alert } from "react-bootstrap";
import AnimatedBackground from "../components/AnimatedBackground";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", result.user);
      setSuccessMsg("Account created! You can now log in.");
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <AnimatedBackground>
        <Form
          onSubmit={handleSignup}
          className='signup-form'
          style={background}
        >
          <h3 className='mb-4' style={{ textAlign: "center" }}>
            Sign Up
          </h3>

          {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}
          {successMsg && <Alert variant='success'>{successMsg}</Alert>}

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
            <Form.Label>Password : (min 6 characters)</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='outline-light' className='w-100'>
            Create Account
          </Button>
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

export default SignupForm;
