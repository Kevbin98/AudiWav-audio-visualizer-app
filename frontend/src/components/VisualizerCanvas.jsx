import { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";
import shapeRegistry from "../Utils/shapes.js";

const VisualizerCanvas = ({ settings }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

      /*
      const handleResize = () => {
        app.renderer.resize(parent.clientWidth, parent.clientHeight);
      };
      */

      const handleResize = () => {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        app.renderer.resize(width, height);
        setDimensions({ width, height }); // 👈 trigger redraw with new size
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
      // Pass in canvas dimensions
      drawFn(app, {
        ...settings,
        canvasWidth: app.renderer.width,
        canvasHeight: app.renderer.height,
      });
    }
  }, [settings, ready, dimensions]);

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
