import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const VisualizerTest = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1e1e1e,
      antialias: true,
    });

    // 🔥 v7 uses .view, not .canvas!
    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view);
    }

    // Create a red circle
    /*
    const circle = new PIXI.Graphics();
    circle.beginFill(0xff0000);
    circle.drawCircle(0, 0, 50);
    circle.endFill();

    circle.x = app.screen.width / 2;
    circle.y = app.screen.height / 2;

    app.stage.addChild(circle);
    */

    const line = new PIXI.Graphics();
    line.lineStyle(4, 0xff0000); // 4px thick, red
    line.moveTo(0, 200); // Start at top-left
    line.lineTo(app.screen.width, 200); // End at center
    app.stage.addChild(line);

    return () => {
      app.destroy(true, true);
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default VisualizerTest;
