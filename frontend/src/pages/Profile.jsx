import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";
import EditProfile from "../components/EditProfile";
import SkeletonLoader from "../components/SkeletonLoader";

const Profile = () => {
  const { user, loading, logout } = useContext(UserContext);

  return (
    <div style={mainContainer}>
      {loading ? (
        <div style={coverContainer}>
          <div className='skeleton-cover'></div>
        </div>
      ) : (
        <div style={coverContainer}>
          <img style={coverImage} src={user.coverImage} alt='cover' />
        </div>
      )}
    </div>
  );
};

const mainContainer = {
  backgroundColor: " rgba(22, 22, 23, 0.9)",
  height: "100vh",
  width: "100%",
  overflowY: "auto",
};

const coverContainer = {
  height: "400px",
  width: "97%",
  margin: "20px auto",
  backgroundColor: "#333",
  position: "relative",
  borderRadius: "10px",
  overflow: "hidden",
};

const coverImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: "10px",
};

export default Profile;
