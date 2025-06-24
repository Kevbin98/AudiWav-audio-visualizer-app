import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const TABS = [
  "General",
  "Audio",
  "Visualizer",
  "Background",
  "Text",
  "Lyrics",
  "Elements",
];

const Create = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <MainContainer>
      <TabsContainer>
        {TABS.map((tab) => (
          <StyledTabButton
            key={tab}
            onClick={() => setActiveTab(tab)}
            $active={activeTab === tab}
          >
            {tab}
          </StyledTabButton>
        ))}
      </TabsContainer>

      <VideoContainer>
        <StyledVideo controls>
          <source
            src='https://www.w3schools.com/html/mov_bbb.mp4'
            type='video/mp4'
          />
          Your browser does not support the video tag.
        </StyledVideo>
      </VideoContainer>

      <TabContent>
        <h3>{activeTab} Settings</h3>
        <p>This is the {activeTab.toLowerCase()} configuration panel.</p>
      </TabContent>
    </MainContainer>
  );
};

export default Create;

const MainContainer = styled.div`
  background-color: rgba(22, 22, 23, 0.9);
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  display: flex;
  padding: 10px;
  color: white;
  gap: 15px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const TabsContainer = styled.div`
  width: 10%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  background-color: #1a1a1a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    justify-content: center;
    padding-bottom: 10px;
  }
`;

const StyledTabButton = styled(Button)`
  background-color: ${({ $active }) => ($active ? "#dc3545" : "#333")};
  border: none;
  text-align: left;
  padding: 10px 15px;
  color: white;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  border-radius: 6px;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #dc3545;
  }

  @media (max-width: 900px) {
    width: auto;
    white-space: nowrap;
  }
`;

const VideoContainer = styled.div`
  width: 65%;
  border-radius: 10px;
  padding: 10px;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const TabContent = styled.div`
  width: 25%;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 900px) {
    width: 100%;
  }
`;
