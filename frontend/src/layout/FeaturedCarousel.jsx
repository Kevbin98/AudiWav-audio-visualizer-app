import React, { useState, useEffect } from "react";
import styled from "styled-components";

import gif1 from "../assets/gif1.gif";
import gif2 from "../assets/gif2.gif";
import gif3 from "../assets/gif3.gif";

const slides = [{ img: gif1 }, { img: gif2 }, { img: gif3 }];

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <Hero style={{ backgroundImage: `url(${slides[currentIndex].img})` }}>
        <Overlay />
        <Dots>
          {slides.map((_, idx) => (
            <Dot
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              $active={currentIndex === idx}
            />
          ))}
        </Dots>
      </Hero>
    </Wrapper>
  );
};

export default FeaturedCarousel;

// Styled Components
const Wrapper = styled.div`
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 200px;
  }
`;

const Hero = styled.div`
  height: 30vh;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: background-image 0.5s ease-in-out;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    height: 30vh;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
`;

const Dots = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: opacity 0.3s;
`;
