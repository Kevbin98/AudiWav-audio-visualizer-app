import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import SearchBar from "../components/SearchBar";
import styled, { keyframes } from "styled-components";
import useMobile from "../hooks/Mobile";
import { FaCog } from "react-icons/fa";
import EditProfile from "../components/EditProfile";
import AboutContent from "../Tabs/AboutContent";
import ProjectsContent from "../Tabs/ProjectContent";

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const isMobile = useMobile(450);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  return (
    <MainContainer>
      {loading ? (
        <>
          <CoverContainer>
            <div className='skeleton-cover'></div>
          </CoverContainer>
          <ProfileDetails>
            <div className='skeleton-avatar large' />
            <div className='skeleton-name' />
          </ProfileDetails>
        </>
      ) : (
        <>
          <CoverContainer>
            <CoverImage src={user.coverImage} alt='cover' />
          </CoverContainer>

          <ProfileDetails>
            <Avatar src={user.avatar} alt='avatar' $isMobile={isMobile} />
            <div>
              <h3>{user.username}</h3>
            </div>
          </ProfileDetails>

          <NavWrapper>
            <NavList>
              <li>
                <CogIcon onClick={() => setIsOpen(true)} />
              </li>
              <li>
                <h5
                  className='hover-darken'
                  onClick={() => setActiveTab("about")}
                >
                  About
                </h5>
              </li>
              <li>
                <h5
                  className='hover-darken'
                  onClick={() => setActiveTab("projects")}
                >
                  Projects
                </h5>
              </li>
              <li>
                <SearchBar />
              </li>
            </NavList>
          </NavWrapper>

          <TabContainer>
            {activeTab === "about" && <AboutContent />}
            {activeTab === "projects" && <ProjectsContent />}
          </TabContainer>

          {isOpen && (
            <PopupOverlay onClick={() => setIsOpen(false)}>
              <PopupContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
                <EditProfile />
              </PopupContent>
            </PopupOverlay>
          )}
        </>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background-color: rgba(22, 22, 23, 0.9);
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 100px;
`;

const CoverContainer = styled.div`
  height: 400px;
  width: 97%;
  margin: 20px auto;
  background-color: #333;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);

  @media (max-width: 450px) {
    height: 200px;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 30px;
  margin-top: -75px;
  margin-left: 10%;
  color: white;
  position: relative;
`;

const Avatar = styled.img.attrs(() => ({}))`
  width: ${(props) => (props.$isMobile ? "100px" : "150px")};
  height: ${(props) => (props.$isMobile ? "100px" : "150px")};
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  background-color: #222;
`;

const NavWrapper = styled.div`
  border-bottom: 2px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  width: 97%;
  position: relative;
  margin: 20px auto;
  padding: 10px;
  border-radius: 5px;
`;

const NavList = styled.ul`
  display: flex;
  gap: 20px;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  margin-left: 10%;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const CogIcon = styled(FaCog)`
  color: white;
  position: relative;
  right: 40px;
  bottom: 5px;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    animation: ${spin} 1s linear infinite;
  }
`;

const PopupOverlay = styled.div`
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

const PopupContent = styled.div`
  background: #1f1f1f;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 9999;
  color: white;
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

const TabContainer = styled.div`
  width: 97%;
  margin: 0 auto;
  padding-top: 20px;
`;

export default Profile;
