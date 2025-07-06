import { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import shapeRegistry from "../Utils/shapes.js";

const VisualizerCanvas = ({ settings }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [analyserReady, setAnalyserReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = settings.audioRef?.current;
    if (!canvas || !audio) return;

    const waitUntilReady = () => {
      const parent = canvas.parentElement;
      if (!parent || parent.clientWidth === 0 || parent.clientHeight === 0) {
        requestAnimationFrame(waitUntilReady);
        return;
      }

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      setDimensions({ width, height });

      const app = new PIXI.Application({
        view: canvas,
        width,
        height,
        backgroundColor: 0x111111,
        antialias: true,
      });

      appRef.current = app;
      setReady(true);

      const initializeAudio = () => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }

        const audioCtx = audioCtxRef.current;
        audioCtx
          .resume()
          .catch((err) => console.warn("Could not resume audio context:", err));

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;

        try {
          const source = audioCtx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          analyserRef.current = analyser;
          setAnalyserReady(true);
        } catch (err) {
          console.warn("Audio source already connected. Skipping connection.");
        }

        window.removeEventListener("click", initializeAudio);
      };

      window.addEventListener("click", initializeAudio, { once: true });

      const handleResize = () => {
        const newWidth = parent.clientWidth;
        const newHeight = parent.clientHeight;
        app.renderer.resize(newWidth, newHeight);
        setDimensions({ width: newWidth, height: newHeight });
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("click", initializeAudio);
        app.destroy(true, { children: true, texture: true, baseTexture: true });
        if (audioCtxRef.current) {
          audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        setReady(false);
      };
    };

    waitUntilReady();
  }, [settings.audioRef]);

  // 🧠 Draw initial non-audio shape
  useEffect(() => {
    const app = appRef.current;
    if (!app || !ready) return;

    app.stage.removeChildren();

    const shapeType = settings.shape || "circle";
    const drawFn = shapeRegistry[shapeType];
    if (typeof drawFn !== "function") return;

    drawFn(app, {
      ...settings,
      canvasWidth: app.renderer.width,
      canvasHeight: app.renderer.height,
      analyser: null,
    });
  }, [settings.shape, dimensions, ready]);

  // 🔊 Draw audio shapes once analyser is ready
  useEffect(() => {
    if (!ready || !analyserReady) return;

    const app = appRef.current;
    if (!app) return;

    app.stage.removeChildren();

    const shapes = settings.shapes || [{ type: settings.shape || "circle" }];
    const cleanupFns = [];

    shapes.forEach((shapeConfig) => {
      const drawFn = shapeRegistry[shapeConfig.type];
      if (typeof drawFn !== "function") return;

      const mergedSettings = {
        ...settings,
        ...shapeConfig,
        canvasWidth: app.renderer.width,
        canvasHeight: app.renderer.height,
        analyser: analyserRef.current,
      };

      const cleanup = drawFn(app, mergedSettings);
      if (typeof cleanup === "function") cleanupFns.push(cleanup);
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [analyserReady, ready, settings.shapes, settings.shape, dimensions]);

  return <StyledCanvas ref={canvasRef} />;
};

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

export default VisualizerCanvas;
