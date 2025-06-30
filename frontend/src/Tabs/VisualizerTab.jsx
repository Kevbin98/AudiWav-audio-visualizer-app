import React, { useState } from "react";
import styled from "styled-components";
import { FaPlus, FaRegCircle } from "react-icons/fa";

const VisualizerTab = () => {
  const [activeTab, setActiveTab] = useState("Layers");

  const tabs = ["Layers", "Shape", "Motion", "Effects"];

  return (
    <Container>
      <Header>
        <Title>Visualizer</Title>
        {/* <SelectMediaButton>Select Media</SelectMediaButton>
         */}
        <button className='dark-button'>Select Media</button>
      </Header>

      <TabNav>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            $active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Tab>
        ))}
      </TabNav>

      <TabContent>
        {activeTab === "Layers" && (
          <>
            <LayerCard>
              <LayerHeader>
                <FaRegCircle size={14} />
                <LayerName>Wave Layer 1</LayerName>
              </LayerHeader>
              <LayerOptions>
                <FaPlus size={12} />
              </LayerOptions>
            </LayerCard>
            <AddLayerButton>
              <FaPlus style={{ marginRight: "6px" }} />
              Add Layer
            </AddLayerButton>
          </>
        )}

        {activeTab === "Shape" && <div>Shape settings go here.</div>}
        {activeTab === "Motion" && <div>Motion settings go here.</div>}
        {activeTab === "Effects" && <div>Effects settings go here.</div>}
      </TabContent>
    </Container>
  );
};

export default VisualizerTab;

const Container = styled.div`
  padding: 16px;
  color: white;
  font-family: inherit;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const SelectMediaButton = styled.button`
  background-color: #2e2e2e;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #444;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #444;
  }
`;

const TabNav = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background-color: ${({ $active }) => ($active ? "#dc3545" : "#222")};
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #dc3545;
  }
`;

const TabContent = styled.div`
  margin-top: 10px;
`;

const LayerCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const LayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LayerName = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const LayerOptions = styled.div`
  cursor: pointer;
`;

const AddLayerButton = styled.button`
  background-color: transparent;
  border: none;
  color: #bbb;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;
