import { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import shapeRegistry from "../Utils/shapes.js";

const VisualizerCanvas = ({ settings }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const waitUntilReady = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth;
      const height = parent?.clientHeight;

      if (!width || !height) {
        // Retry until parent has size
        requestAnimationFrame(waitUntilReady);
        return;
      }

      const app = new PIXI.Application({
        view: canvas,
        width,
        height,
        backgroundColor: 0x111111,
        antialias: true,
      });

      appRef.current = app;
      setReady(true);

      const handleResize = () => {
        app.renderer.resize(parent.clientWidth, parent.clientHeight);
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        app.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
        setReady(false);
      };
    };

    waitUntilReady();
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !ready) return;

    app.stage.removeChildren();

    const shapeType = settings.shape || "circle";
    const drawFn = shapeRegistry[shapeType];

    if (typeof drawFn === "function") {
      drawFn(app, settings);
    } else {
      console.warn(`Unknown shape type: ${shapeType}`);
    }
  }, [settings, ready]);

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
