import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const StartProjectModal = ({ onClose, onChooseTemplate, onCreateScratch }) => {
  const [activeTab, setActiveTab] = useState("template");

  return (
    <Wrapper>
      <Header>
        <h2>Create New Video</h2>
      </Header>

      <TabHeader>
        <Tab
          active={activeTab === "template"}
          onClick={() => setActiveTab("template")}
        >
          Use a Template
        </Tab>
        <Tab
          active={activeTab === "scratch"}
          onClick={() => setActiveTab("scratch")}
        >
          Create from Scratch
        </Tab>
      </TabHeader>

      <ContentArea>
        {activeTab === "template" ? (
          <TemplateView>
            <p>Choose from a selection of ready-made templates to customize.</p>
            <Button variant='outline-danger' onClick={onChooseTemplate}>
              Browse Templates
            </Button>
          </TemplateView>
        ) : (
          <ScratchView>
            <p>Start with a blank canvas and customize every detail.</p>
            <Button variant='outline-danger' onClick={onCreateScratch}>
              Start from Scratch
            </Button>
          </ScratchView>
        )}
      </ContentArea>
    </Wrapper>
  );
};

export default StartProjectModal;

// Styled Components
const Wrapper = styled.div`
  background: #1f1f1f;
  color: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
`;

const Header = styled.div`
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
  text-align: center;
`;

const TabHeader = styled.div`
  display: flex;
  margin: 20px 0;
  border-bottom: 1px solid #444;
`;

const Tab = styled.div`
  flex: 1;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? "3px solid red" : "none")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
`;

const ContentArea = styled.div`
  padding-top: 10px;
`;

const TemplateView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScratchView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
