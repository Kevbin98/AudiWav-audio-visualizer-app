import * as PIXI from "pixi.js";

const shapeRegistry = {
  circle: (app, settings) => {
    const shape = new PIXI.Graphics();
    shape.beginFill(settings.color || 0xffffff);

    // Center the circle
    const x = settings.x ?? settings.canvasWidth / 2;
    const y = settings.y ?? settings.canvasHeight / 2;
    const radius = settings.radius || 50;

    shape.drawCircle(x, y, radius);
    shape.endFill();
    app.stage.addChild(shape);
  },

  line: (app, settings) => {
    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const length = settings.length || 200;

    const x1 = settings.x1 ?? centerX - length / 2;
    const y1 = settings.y1 ?? centerY;
    const x2 = settings.x2 ?? centerX + length / 2;
    const y2 = settings.y2 ?? centerY;

    const shape = new PIXI.Graphics();
    shape.lineStyle(settings.thickness || 2, settings.color || 0xffffff);
    shape.moveTo(x1, y1);
    shape.lineTo(x2, y2);
    app.stage.addChild(shape);
  },

  dottedLine: (app, settings) => {
    const spacing = settings.spacing || 10;
    const length = settings.length || 200;
    const dotRadius = settings.dotRadius || 3;
    const color = settings.color || 0xffffff;

    const startX = settings.x ?? (settings.canvasWidth - length) / 2;
    const y = settings.y ?? settings.canvasHeight / 2;

    for (let i = 0; i < length; i += spacing) {
      const dot = new PIXI.Graphics();
      dot.beginFill(color);
      dot.drawCircle(startX + i, y, dotRadius);
      dot.endFill();
      app.stage.addChild(dot);
    }
  },

  rectangle: (app, settings) => {
    const shape = new PIXI.Graphics();
    const width = settings.width || 100;
    const height = settings.height || 50;

    const x = settings.x ?? (settings.canvasWidth - width) / 2;
    const y = settings.y ?? (settings.canvasHeight - height) / 2;

    shape.beginFill(settings.color || 0xffffff);
    shape.drawRect(x, y, width, height);
    shape.endFill();
    app.stage.addChild(shape);
  },
};

export default shapeRegistry;
