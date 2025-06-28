import React from "react";
import { Button } from "react-bootstrap";
import styled from "styled-components";

const BackgroundTab = () => {
  return (
    <AudioContainer>
      <Card>
        <Title>Background</Title>
        <Description>Upload or choose a background image or video</Description>
        <UploadButton variant='outline-light'>Select Media</UploadButton>
        <FileInfo>(No file selected)</FileInfo>
      </Card>
    </AudioContainer>
  );
};

export default BackgroundTab;

const AudioContainer = styled.div`
  display: flex;
  justify-content: center;
  //align-items: center;
  height: 100%;
`;

const Card = styled.div`
  //background-color: #222;
  border-radius: 12px;
  padding: 30px 25px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  //box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 600px) {
    padding: 20px 15px;
  }
`;

const Title = styled.h3`
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 15px;
`;

const Description = styled.p`
  color: #ccc;
  font-size: 0.95rem;
  margin-bottom: 25px;
`;

const UploadButton = styled(Button)`
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  transition: 0.2s ease;
  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const FileInfo = styled.p`
  color: #999;
  font-size: 0.85rem;
  margin-top: 15px;
  font-style: italic;
`;
