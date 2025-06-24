import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>x</CloseButton>
        {children}
      </Content>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background: #1f1f1f;
  padding: 30px 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 9999;
  color: white;

  @media (max-width: 500px) {
    width: 95%;
    margin-top: 50px;
    border-radius: 8px;
    padding: 20px 16px;
    max-height: 75vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

export default Modal;
