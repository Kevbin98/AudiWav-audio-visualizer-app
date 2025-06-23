import React from "react";
import styled from "styled-components";

const ProjectsContent = () => {
  return (
    <Container>
      <h3>Projects</h3>
      <p>No projects yet. Start creating your first visualizer!</p>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  color: white;
`;

export default ProjectsContent;
