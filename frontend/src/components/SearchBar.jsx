import React from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  return (
    <>
      <div>
        <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
          <input
            type='text'
            placeholder='Search projects...'
            style={inputStyle}
            onFocus={(e) => e.target.classList.add("expanded")}
            onBlur={(e) => e.target.classList.remove("expanded")}
            className='custom-search'
          />
          <button type='submit' style={buttonStyle}>
            <IoSearchOutline />
          </button>
        </form>
      </div>
    </>
  );
};

const formStyle = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#1f1f1f",
  borderRadius: "20px",
  padding: "5px 10px",
  border: "1px solid #444",
};

const inputStyle = {
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#fff",
  fontSize: "14px",
  padding: "8px",
  transition: "width 0.3s ease",
  height: "30px",
};

const buttonStyle = {
  background: "none",
  border: "none",
  color: "#ccc",
  cursor: "pointer",
  fontSize: "16px",
};

export default SearchBar;
