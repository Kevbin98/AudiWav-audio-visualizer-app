import * as PIXI from "pixi.js";

const shapeRegistry = {
  circle: (app, settings) => {
    console.log("Drawing circle with settings:", settings);
    const shape = new PIXI.Graphics();
    shape.beginFill(settings.color || 0xffffff);
    shape.drawCircle(
      settings.x || 200,
      settings.y || 200,
      settings.radius || 50
    );
    shape.endFill();
    app.stage.addChild(shape);
  },

  line: (app, settings) => {
    const shape = new PIXI.Graphics();
    shape.lineStyle(settings.thickness || 2, settings.color || 0xffffff);
    shape.moveTo(settings.x1 || 100, settings.y1 || 100);
    shape.lineTo(settings.x2 || 300, settings.y2 || 100);
    app.stage.addChild(shape);
  },

  dottedLine: (app, settings) => {
    const spacing = settings.spacing || 10;
    const length = settings.length || 200;
    const dotRadius = settings.dotRadius || 3;
    const x = settings.x || 100;
    const y = settings.y || 100;
    const color = settings.color || 0xffffff;

    for (let i = 0; i < length; i += spacing) {
      const dot = new PIXI.Graphics();
      dot.beginFill(color);
      dot.drawCircle(x + i, y, dotRadius);
      dot.endFill();
      app.stage.addChild(dot);
    }
  },

  rectangle: (app, settings) => {
    const shape = new PIXI.Graphics();
    shape.beginFill(settings.color || 0xffffff);
    shape.drawRect(
      settings.x || 100,
      settings.y || 100,
      settings.width || 100,
      settings.height || 50
    );
    shape.endFill();
    app.stage.addChild(shape);
  },
};

export default shapeRegistry;
