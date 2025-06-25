import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { shapeRenderers } from "../utils/shapeRenderers"; // make sure this exists

const AudioVisualizer = ({ mediaElement, shape = "bars" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!mediaElement) return;

    // 👇 AudioContext setup
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(mediaElement);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // 👇 PIXI setup
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    });

    canvasRef.current.appendChild(app.view);

    // 👇 Create graphics elements for bars/lines/circles
    const shapes = [];
    for (let i = 0; i < bufferLength; i++) {
      const g = new PIXI.Graphics();
      app.stage.addChild(g);
      shapes.push(g);
    }

    // 👇 Ticker update loop
    app.ticker.add(() => {
      analyser.getByteFrequencyData(dataArray);

      shapes.forEach((g, i) => {
        g.clear();
        const draw = shapeRenderers[shape];
        if (draw) draw(g, i, dataArray[i], app, dataArray);
      });
    });

    // 👇 Cleanup
    return () => {
      app.destroy(true, true);
      audioContext.close();
    };
  }, [mediaElement, shape]);

  return <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default AudioVisualizer;
