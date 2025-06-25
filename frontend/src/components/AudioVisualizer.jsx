import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { shapeRenderers } from "../utils/shapeRenderers";
import { getAudioSetup } from "../utils/audioContextSingleton";

const AudioVisualizer = ({ mediaElement, shape = "bars" }) => {
  const canvasRef = useRef(null);
  const sourceNodeRef = useRef(null); // prevent re-connecting

  useEffect(() => {
    if (!mediaElement || sourceNodeRef.current) return;

    const app = new PIXI.Application({
      resizeTo: mediaElement,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    });

    canvasRef.current.appendChild(app.view);

    const { audioContext, sourceNode } = getAudioSetup(mediaElement);
    sourceNodeRef.current = sourceNode;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    const shapes = [];
    for (let i = 0; i < bufferLength; i++) {
      const g = new PIXI.Graphics();
      app.stage.addChild(g);
      shapes.push(g);
    }

    app.ticker.add(() => {
      if (mediaElement.paused) return;

      analyser.getByteFrequencyData(dataArray);
      shapes.forEach((g, i) => {
        g.clear();
        const draw = shapeRenderers[shape];
        if (draw) draw(g, i, dataArray[i], app, dataArray);
      });
    });

    return () => {
      app.destroy(true, true);
      sourceNodeRef.current = null;
    };
  }, [mediaElement, shape]);

  return (
    <div
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        zIndex: 10,
      }}
    />
  );
};

export default AudioVisualizer;
