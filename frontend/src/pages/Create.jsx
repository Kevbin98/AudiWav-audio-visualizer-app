import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { MdOutlineSettingsInputComponent } from "react-icons/md";
import {
  FaMusic,
  FaWaveSquare,
  FaImage,
  FaFont,
  FaClosedCaptioning,
  FaShapes,
} from "react-icons/fa";
import GeneralTab from "../Tabs/GeneralTab";
import AudioTab from "../tabs/AudioTab";
import VisualizerTab from "../tabs/VisualizerTab";
import BackgroundTab from "../Tabs/BackgroundTab";
import TextTab from "../Tabs/TextTab";
import LyricsTab from "../Tabs/LyricsTab";
import ElementsTab from "../Tabs/ElementsTab";
import VisualizerCanvas from "../components/VisualizerCanvas";
import MusicPlayerDesktop from "../layout/MusicPlayer";

const TABS = [
  { name: "General", icon: <MdOutlineSettingsInputComponent /> },
  { name: "Audio", icon: <FaMusic /> },
  { name: "Visualizer", icon: <FaWaveSquare /> },
  { name: "Background", icon: <FaImage /> },
  { name: "Text", icon: <FaFont /> },
  { name: "Lyrics", icon: <FaClosedCaptioning /> },
  { name: "Elements", icon: <FaShapes /> },
];

const Create = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [ready, setReady] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const audioRef = useRef(null);

  const videoRef = useRef(null);

  const handleAudioSelected = (file, url) => {
    setAudioFile(file);
    setAudioUrl(url);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      setReady(true);
    }
  }, []);

  return (
    <MainContainer>
      <TabsContainer>
        {TABS.map(({ name, icon }) => (
          <StyledTabButton
            key={name}
            onClick={() => setActiveTab(name)}
            $active={activeTab === name}
          >
            <IconWrapper>{icon}</IconWrapper>
            {name}
          </StyledTabButton>
        ))}
      </TabsContainer>

      <VideoContainer>
        <CanvasWrapper>
          <VisualizerCanvas
            settings={{
              shape: "bassCircleWave",
              color: 0xff4444,
              radius: 70,
              audioRef: audioRef,
            }}
          />
        </CanvasWrapper>
      </VideoContainer>

      <TabContent>
        {activeTab === "General" && <GeneralTab />}
        {activeTab === "Audio" && (
          <AudioTab onAudioSelected={handleAudioSelected} fileInfo={fileInfo} />
        )}
        {activeTab === "Visualizer" && <VisualizerTab />}
        {activeTab === "Background" && <BackgroundTab />}
        {activeTab === "Text" && <TextTab />}
        {activeTab === "Lyrics" && <LyricsTab />}
        {activeTab === "Elements" && <ElementsTab />}
      </TabContent>
      <MusicPlayerDesktop audioRef={audioRef} audioUrl={audioUrl} />
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

const IconWrapper = styled.span`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabsContainer = styled.div`
  width: 12%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  background-color: #1a1a1a;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  gap: 10px;
  border-radius: 10px;

  @media (max-width: 900px) {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 10px;

    padding-left: 10px;
    scroll-padding-left: 10px;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #444;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
`;

const StyledTabButton = styled.button`
  background-color: ${({ $active }) => ($active ? "#dc3545" : "#333")};
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 10px;
  gap: 6px;
  color: white;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  border-radius: 8px;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #dc3545;
  }

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap; /* allow wrapping */
    width: auto;
    flex: 1 1 100px;
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
  height: auto;
  background-color: #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  border-radius: 10px;
  overflow: hidden;
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;
