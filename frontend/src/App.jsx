import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import MyNavbar from "./layout/Navbar";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes></Routes>
    </BrowserRouter>
  );
}

export default App;
