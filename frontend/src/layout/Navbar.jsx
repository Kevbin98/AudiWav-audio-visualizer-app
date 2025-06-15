// src/layout/Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHomeSharp, IoLogIn } from "react-icons/io5";
import { MdExplore, MdOutlineContactSupport } from "react-icons/md";
import { FaUserCircle, FaMusic } from "react-icons/fa";
import Dropdown from "./Dropdown";
import Avatar from "../assets/avatar.png";

const MyNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔐 Replace with Firebase user later
  const user = { username: "Guest", avatar: Avatar };

  return (
    <>
      <Navbar expand='lg' style={navbarStyle}>
        <Container fluid style={navbarFlex}>
          {/* left side */}
          <div>
            <Nav.Link as={NavLink} to='/' style={logoText}>
              <h3>Audio Visualiser App</h3>
            </Nav.Link>
          </div>
          {/* Right side  */}
          <div style={rightSide}>
            <span>{user.username}</span>
            <img src={user.avatar} alt='user Avatar' style={avatarStyle} />
          </div>
        </Container>
      </Navbar>
    </>
  );
};

const navbarStyle = {
  backgroundColor: " rgba(22, 22, 23, 0.9)",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
  padding: "10px",
  zIndex: 9999,
};

const navbarFlex = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rightSide = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
};

const usernameStyle = {
  color: "#fff",
  fontWeight: "500",
};

const logoText = {
  color: "#fff",
  textDecoration: "none",
};

export default MyNavbar;
