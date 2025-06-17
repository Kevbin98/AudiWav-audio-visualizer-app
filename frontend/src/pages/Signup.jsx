import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { Form, Button, Alert } from "react-bootstrap";
import AnimatedBackground from "../components/AnimatedBackground";
import Avatar from "../assets/avatar.png";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          username: "",
          avatar: result.user.photoURL || Avatar,
          createdAt: Timestamp.now(),
        }).catch((err) => console.error("Firestore write error:", err));
      } else {
        console.log("User doc already exists, skipping Firestore write.");
      }

      setSuccessMsg("Account created! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);

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

          <Form.Group className='mb-4'>
            <Form.Label>Confirm Password :</Form.Label>
            <Form.Control
              type='password'
              placeholder='Re-enter password'
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
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
