import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import MyNavbar from "./layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignupForm from "./pages/Signup";
import { LoaderProvider } from "./context/LoaderContext";
import TopLoader from "./components/TopLoader";
import RouteChangeHandler from "./components/RouteChangeHandler";

function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <RouteChangeHandler />
        <TopLoader />
        <MyNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
