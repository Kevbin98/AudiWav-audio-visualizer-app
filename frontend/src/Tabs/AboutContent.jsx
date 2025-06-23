import React from "react";
import styled from "styled-components";

const AboutContent = () => {
  return (
    <Container>
      <h3>About</h3>
      <p>This user hasn't written a bio yet.</p>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  color: white;
`;

export default AboutContent;
