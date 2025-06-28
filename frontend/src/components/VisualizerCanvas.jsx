// components/VisualizerCanvas.jsx
import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import styled from "styled-components";

const VisualizerCanvas = ({ settings }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Wait for layout to complete
    const raf = requestAnimationFrame(() => {
      const parent = canvas.parentElement;

      const width = parent?.clientWidth || 800;
      const height = parent?.clientHeight || 600;

      const app = new PIXI.Application({
        view: canvas,
        width,
        height,
        backgroundColor: 0x000000,
        antialias: true,
      });

      appRef.current = app;

      // Optional: handle window resize
      const handleResize = () => {
        if (parent && app) {
          app.renderer.resize(parent.clientWidth, parent.clientHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
      }
    };
  }, []);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    // Clear stage
    app.stage.removeChildren();

    // Defensive defaults
    const color =
      typeof settings.color === "number" ? settings.color : 0xffffff;
    const radius =
      typeof settings.radius === "number" && settings.radius > 0
        ? settings.radius
        : 50;

    // Draw example shape
    const shape = new PIXI.Graphics();
    shape.beginFill(color);
    shape.drawCircle(200, 200, radius);
    shape.endFill();

    app.stage.addChild(shape);
  }, [settings]);

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
