import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { shapeRenderers } from "../utils/shapeRenderers"; // Make sure this file exists
import testAudio from "../assets/test.mp3";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState("bars");

  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    });

    canvasRef.current.appendChild(app.view);

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audio = new Audio(testAudio);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.play().catch(() => {
      console.log("Autoplay blocked. Waiting for user interaction...");
      window.addEventListener(
        "click",
        () => {
          audio.play();
          console.log("User clicked, playing audio");
        },
        { once: true }
      );
    });

    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const shapes = [];

    for (let i = 0; i < bufferLength; i++) {
      const g = new PIXI.Graphics();
      app.stage.addChild(g);
      shapes.push(g);
    }

    app.ticker.add(() => {
      analyser.getByteFrequencyData(dataArray);

      shapes.forEach((g, i) => {
        g.clear();
        const draw = shapeRenderers[shape];
        if (draw) draw(g, i, dataArray[i], app, dataArray);
      });
    });

    return () => {
      audio.pause();
      audioContext.close();
      app.destroy(true, true);
    };
  }, [shape]);

  return (
    <>
      <div style={{ position: "absolute", top: 100, left: 10, zIndex: 10 }}>
        <button onClick={() => setShape("bars")}>Bars</button>
        <button onClick={() => setShape("circles")}>Circles</button>
        <button onClick={() => setShape("lines")}>Lines</button>
      </div>
      <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  );
};

export default AudioVisualizer;
