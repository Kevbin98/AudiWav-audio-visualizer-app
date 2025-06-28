import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlay, FaPause, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
import useToggle from "../hooks/useToggle";

const MusicPlayerDesktop = () => {
  const playerReady = useRef(false);
  const [collapsed, { toggle }] = useToggle(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Poll current time and duration
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (player && player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration());
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying((prev) => !prev);
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
        <Button variant='dark' onClick={toggle}>
          {collapsed ? <FaChevronUp /> : <FaChevronDown />}
        </Button>
      </div>

      <div
        style={{
          ...styles.mainContainer,
          transform: collapsed ? "translateY(100%)" : "translateY(0)",
        }}
      >
        {/* LEFT */}

        {/* CENTER */}
        <div style={styles.center}>
          <div style={styles.buttonRow}>
            <Button
              style={{
                border: "none",
              }}
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
              style={styles.progressBar}
            />
            <span style={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            onChange={(e) =>
              playerRef.current?.setVolume(parseFloat(e.target.value) * 100)
            }
            style={styles.volumeBar}
          />
        </div>
      </div>

      <div style={styles.videoWrapper}>
        <div id='yt-player' />
      </div>
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

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: "200px",
    color: "white",
  },

  img: {
    height: "60px",
    width: "60px",
    objectFit: "cover",
    borderRadius: "6px",
  },

  description: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    maxWidth: "250px",
  },

  title: {
    color: "white",
    margin: 0,
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },

  artist: {
    color: "#aaa",
    margin: 0,
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },

  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "12px",
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
    accentColor: "#00bfff",
  },

  volumeBar: {
    width: "100px",
    marginRight: "20px",
    height: "4px",
    accentColor: "#00bfff",
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
    right: 20,
    bottom: BAR_HEIGHT / 2 - TOGGLE_SIZE / 2,
    zIndex: 9999,
  },
  videoWrapper: {
    position: "fixed",
    bottom: BAR_HEIGHT + 10,
    left: 20,
    width: "300px",
    height: "170px",
    backgroundColor: "#000",
    borderRadius: "10px",
    overflow: "hidden",
    opacity: "0",
    zIndex: -1,
    transition: "transform 0.3s ease",
  },
};

export default MusicPlayerDesktop;
