// src/layout/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHomeSharp, IoLogIn } from "react-icons/io5";
import { MdExplore, MdOutlineContactSupport } from "react-icons/md";
import { FaUserCircle, FaMusic } from "react-icons/fa";
import Avatar from "../assets/avatar.png";
import { UserContext } from "../context/UserContext";
import SkeletonLoader from "../components/SkeletonLoader";
import Logo from "../assets/logo.svg";

const MyNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, loading, logout } = useContext(UserContext);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const handleNavClick = () => setDropdownOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".hover-darken")
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <Navbar expand='lg' style={navbarStyle}>
        <Container fluid style={navbarFlex}>
          {/* left side */}
          <div>
            <Nav.Link as={NavLink} to='/' style={logoText}>
              {/* <h3 className='hover-darken'>Audio Visualiser App</h3> */}
              <img style={logo} className='hover-darken' src={Logo} alt='' />
            </Nav.Link>
          </div>
          {/* Right side  */}
          {loading ? (
            <div style={rightSide}>
              <div className='skeleton-user-info'>
                <div className='skeleton-line skeleton-name' />
              </div>
              <div className='skeleton-avatar' />
            </div>
          ) : (
            <div
              style={rightSide}
              onClick={toggleDropdown}
              className='hover-darken'
            >
              <span style={usernameStyle}>{user?.username || "Guest"}</span>
              <img
                src={user?.avatar || Avatar}
                alt='user Avatar'
                style={avatarStyle}
              />
            </div>
          )}
        </Container>
      </Navbar>

      <div
        ref={dropdownRef}
        className={`dropdown-container ${dropdownOpen ? "show" : ""}`}
        style={dropdown}
      >
        <Nav.Link
          as={NavLink}
          to='/'
          style={dropdownItem}
          onClick={handleNavClick}
          className='hover-darken'
        >
          Home
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to='/profile'
          style={dropdownItem}
          onClick={handleNavClick}
          className='hover-darken'
        >
          Profile
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to='/settings'
          style={dropdownItem}
          onClick={handleNavClick}
          className='hover-darken'
        >
          Settings
        </Nav.Link>

        {user ? (
          <Button
            variant='link'
            style={{
              ...dropdownItem,
              width: "100%",
            }}
            onClick={() => {
              logout();
              handleNavClick();
              navigate("/");
            }}
            className='hover-darken'
          >
            Logout
          </Button>
        ) : (
          <Nav.Link
            as={NavLink}
            to='/login'
            style={dropdownItem}
            onClick={handleNavClick}
            className='hover-darken'
          >
            Login
          </Nav.Link>
        )}

        {/* <Nav.Link
          as={NavLink}
          to='/login'
          style={dropdownItem}
          onClick={handleNavClick}
          className='hover-darken'
        >
          Login
        </Nav.Link> */}
      </div>
    </>
  );
};

const navbarStyle = {
  backgroundColor: " rgba(22, 22, 23, 0.9)",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
  padding: "10px",
  paddingTop: "15px",
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
  cursor: "pointer",
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

const logo = {
  height: "60px",
};

const dropdown = {
  position: "absolute",
  top: "80px",
  right: "5px",
  backgroundColor: " rgba(22, 22, 23, 0.9)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  borderRadius: "8px",
  padding: "10px",
  minWidth: "150px",
  maxWidth: "200px",
  textAlign: "center",
  zIndex: 10000,
};

const dropdownItem = {
  color: "#fff",
  padding: "8px 12px",
  textDecoration: "none",
  display: "block",
};

export default MyNavbar;
