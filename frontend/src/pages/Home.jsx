import React from "react";
import styled from "styled-components";
import FeaturedCarousel from "../layout/FeaturedCarousel";

const Home = () => {
  return (
    <MainContainer>
      <HeroSection>
        <Left>
          <FeaturedCarousel />
        </Left>
        <Right>
          <h1>Bring Your Music to Life</h1>
          <p>Visualize. Export. Share. Connect.</p>
        </Right>
      </HeroSection>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background: linear-gradient(135deg, #4e00c2, #8e2de2, #a770ef);
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 4rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const Left = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Right = styled.div`
  flex: 1;
  color: white;
  max-width: 500px;
  padding: 1rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
      text-align: center;
    }
  }

  p {
    font-size: 1.25rem;

    @media (max-width: 768px) {
      text-align: center;
    }
  }
`;

export default Home;
