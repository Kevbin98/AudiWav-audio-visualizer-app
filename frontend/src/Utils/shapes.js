import * as PIXI from "pixi.js";

const shapeRegistry = {
  circle: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const baseRadius = settings.radius || 50;
    const color = settings.color || 0xffffff;

    // Fallback mode if no analyser

    const analyser = settings.analyser;
    const bufferLength = analyser?.frequencyBinCount || 0;
    const dataArray = bufferLength > 0 ? new Uint8Array(bufferLength) : null;

    app.ticker.add(() => {
      let radius = baseRadius;

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const bass = dataArray[1];
        const scale = bass / 255;
        radius += scale * 100;
      }

      shape.clear();
      shape.beginFill(color);
      shape.drawCircle(centerX, centerY, radius);
      shape.endFill();
    });
  },

  line: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const length = settings.length || 200;
    const color = settings.color || 0xffffff;
    const thickness = settings.thickness || 2;

    const x1 = settings.x1 ?? centerX - length / 2;
    const y1 = settings.y1 ?? centerY;
    const x2 = settings.x2 ?? centerX + length / 2;
    const y2 = settings.y2 ?? centerY;

    app.ticker.add(() => {
      shape.clear();
      shape.lineStyle(thickness, color);

      // Optional animation: vertical jiggle with low frequencies
      let yOffset = 0;
      if (settings.analyser) {
        const data = new Uint8Array(settings.analyser.frequencyBinCount);
        settings.analyser.getByteFrequencyData(data);
        yOffset = data[0] / 10;
      }

      shape.moveTo(x1, y1 - yOffset);
      shape.lineTo(x2, y2 - yOffset);
    });
  },

  dottedLine: (app, settings) => {
    const spacing = settings.spacing || 10;
    const length = settings.length || 200;
    const dotRadius = settings.dotRadius || 3;
    const color = settings.color || 0xffffff;

    const startX = settings.x ?? (settings.canvasWidth - length) / 2;
    const y = settings.y ?? settings.canvasHeight / 2;

    const dots = Array.from({ length: Math.floor(length / spacing) }).map(
      (_, i) => {
        const dot = new PIXI.Graphics();
        app.stage.addChild(dot);
        return dot;
      }
    );

    app.ticker.add(() => {
      const yOffset = (() => {
        if (!settings.analyser) return 0;
        const data = new Uint8Array(settings.analyser.frequencyBinCount);
        settings.analyser.getByteFrequencyData(data);
        return data[2] / 15; // animate slight bobbing
      })();

      dots.forEach((dot, i) => {
        dot.clear();
        dot.beginFill(color);
        dot.drawCircle(startX + i * spacing, y - yOffset, dotRadius);
        dot.endFill();
      });
    });
  },

  rectangle: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const baseWidth = settings.width || 100;
    const baseHeight = settings.height || 50;
    const color = settings.color || 0xffffff;

    const x = settings.x ?? (settings.canvasWidth - baseWidth) / 2;
    const y = settings.y ?? (settings.canvasHeight - baseHeight) / 2;

    app.ticker.add(() => {
      let height = baseHeight;

      if (settings.analyser) {
        const data = new Uint8Array(settings.analyser.frequencyBinCount);
        settings.analyser.getByteFrequencyData(data);
        height += data[3];
      }

      shape.clear();
      shape.beginFill(color);
      shape.drawRect(x, y, baseWidth, height);
      shape.endFill();
    });
  },

  bars: (app, settings) => {
    const analyser = settings.analyser;
    const bufferLength = analyser?.frequencyBinCount || 32;
    const dataArray = analyser ? new Uint8Array(bufferLength) : null;

    const barWidth = settings.canvasWidth / bufferLength;
    const barColor = settings.color || 0xffffff;

    const bars = Array.from({ length: bufferLength }).map(() => {
      const bar = new PIXI.Graphics();
      app.stage.addChild(bar);
      return bar;
    });

    app.ticker.add(() => {
      if (!dataArray) {
        // fallback static bars
        bars.forEach((bar, i) => {
          bar.clear();
          bar.beginFill(barColor);
          bar.drawRect(
            i * barWidth,
            settings.canvasHeight - 30,
            barWidth - 2,
            30
          );
          bar.endFill();
        });
        return;
      }

      analyser.getByteFrequencyData(dataArray);
      bars.forEach((bar, i) => {
        const barHeight = dataArray[i];
        bar.clear();
        bar.beginFill(barColor);
        bar.drawRect(
          i * barWidth,
          settings.canvasHeight - barHeight,
          barWidth - 2,
          barHeight
        );
        bar.endFill();
      });
    });
  },
};

export default shapeRegistry;
