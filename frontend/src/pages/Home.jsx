import React from "react";
import styled, { keyframes } from "styled-components";

const Home = () => {
  return (
    <MainContainer>
      <HeroSection></HeroSection>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background: linear-gradient(135deg, #4e00c2, #8e2de2, #a770ef);
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 100px;
`;

const HeroSection = styled.div``;

export default Home;
