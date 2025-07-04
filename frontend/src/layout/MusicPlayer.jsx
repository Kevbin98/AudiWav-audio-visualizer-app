import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlay, FaPause, FaChevronDown, FaChevronUp } from "react-icons/fa";
import useToggle from "../hooks/useToggle";
import poison from "../assets/poison.mp3";
import useMobile from "../hooks/Mobile";

const MusicPlayerDesktop = ({ audioRef, audioUrl }) => {
  //const audioRef = useRef(null);
  const Mobile = useMobile(800);
  const [collapsed, { toggle }] = useToggle(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const RightMobile = {
    ...styles.right,
    display: Mobile ? "none" : "",
  };

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      setIsPlaying(false); // reset play state when new file loads
      setCurrentTime(0);
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = parseFloat(e.target.value);
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = parseFloat(e.target.value);
  };

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = String(Math.floor(t % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <div style={styles.toggleButton}>
        <div className='hover-darken' onClick={toggle}>
          {collapsed ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      <div
        style={{
          ...styles.mainContainer,
          transform: collapsed ? "translateY(100%)" : "translateY(0)",
        }}
      >
        {/* CENTER */}
        <div style={styles.center}>
          <div style={styles.buttonRow}>
            <Button
              style={{ border: "none" }}
              variant='outline-light'
              className='mx-2'
              onClick={togglePlay}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
          </div>

          <div style={styles.progressWrapper}>
            <span style={styles.time}>{formatTime(currentTime)}</span>
            <input
              type='range'
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              style={styles.progressBar}
            />
            <span style={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div style={RightMobile}>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            onChange={handleVolumeChange}
            style={styles.volumeBar}
          />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload='metadata' />
    </>
  );
};

const BAR_HEIGHT = 100;
const TOGGLE_SIZE = 32;

const styles = {
  mainContainer: {
    backgroundColor: "rgba(22, 22, 23)",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.9)",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: BAR_HEIGHT,
    padding: "10px 20px",
    paddingRight: "68px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 9998,
    boxSizing: "border-box",
    transition: "transform 0.3s ease",
  },
  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //paddingLeft: "12px",
    gap: "4px",
    width: "100%",
    maxWidth: "500px",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    maxWidth: "500px",
  },
  progressBar: {
    flex: 1,
    height: "4px",
    accentColor: "#dc3545",
  },
  volumeBar: {
    width: "100px",
    marginRight: "20px",
    height: "4px",
    accentColor: "#dc3545",
  },
  time: {
    color: "#ccc",
    fontSize: "0.75rem",
    minWidth: "40px",
    textAlign: "center",
  },
  right: {
    width: "150px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
  toggleButton: {
    position: "fixed",
    right: 10,
    bottom: BAR_HEIGHT / 1.2 - TOGGLE_SIZE / 1.2,
    zIndex: 9999,
  },
};

export default MusicPlayerDesktop;
