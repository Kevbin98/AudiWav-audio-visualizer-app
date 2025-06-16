import React from "react";
import styled, { keyframes } from "styled-components";

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Wrapper = styled.div`
  //background: linear-gradient(-45deg, #f12711, #f5af19, #1e3c72, #2a5298);
  background: linear-gradient(-45deg, #ff0099, #493240, #00f2fe, #4facfe);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  will-change: background-position;
  z-index: -1;
  overflow: hidden;
  //position: relative
`;

const AnimatedBackground = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default AnimatedBackground;
