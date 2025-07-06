import * as PIXI from "pixi.js";
import { GlowFilter } from "@pixi/filter-glow";
import { BlurFilter } from "@pixi/filter-blur";
import gsap from "gsap";

const shapeRegistry = {
  waveCircle: (
    app,
    {
      analyser,
      color = 0xff3377,
      radius = 100,
      thickness = 2,
      canvasWidth,
      canvasHeight,
    }
  ) => {
    if (!analyser || !analyser.frequencyBinCount) return;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const fftData = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = new Float32Array(360).fill(radius);

    const mainCircle = new PIXI.Graphics();
    mainCircle.x = centerX;
    mainCircle.y = centerY;

    mainCircle.filters = [
      new GlowFilter({
        color,
        distance: 20,
        outerStrength: 2,
        innerStrength: 0.5,
      }),
      new BlurFilter(1),
    ];

    app.stage.addChild(mainCircle);

    const ripples = [];

    const createRipple = (points) => {
      const ripple = new PIXI.Graphics();
      ripple.x = centerX;
      ripple.y = centerY;
      ripple.alpha = 0.5;
      ripple.points = points.map((p) => ({ x: p.x, y: p.y }));
      ripple.scaleAmount = 1;

      ripple.filters = [
        new GlowFilter({
          color,
          distance: 15,
          outerStrength: 1.5,
          innerStrength: 0.3,
        }),
      ];

      app.stage.addChild(ripple);
      ripples.push(ripple);

      // Animate ripple
      gsap.to(ripple, {
        scaleAmount: 1.5,
        alpha: 0,
        duration: 1.5,
        ease: "sine.out",
        onComplete: () => {
          app.stage.removeChild(ripple);
          const index = ripples.indexOf(ripple);
          if (index > -1) ripples.splice(index, 1);
        },
      });
    };

    app.ticker.add(() => {
      analyser.getByteFrequencyData(fftData);
      mainCircle.clear();

      const avg = fftData.reduce((sum, val) => sum + val, 0) / fftData.length;

      mainCircle.lineStyle(thickness + avg / 80, color);

      const points = [];

      for (let i = 0; i < 360; i++) {
        const angle = (i / 360) * Math.PI * 2;
        const index = Math.floor((i / 360) * fftData.length);
        const amplitude = fftData[index] || 0;
        const norm = amplitude / 255;
        const targetRadius = radius + norm * 40;

        // Smooth using GSAP
        gsap.to(smoothed, {
          [i]: targetRadius,
          duration: 0.2,
          ease: "power3.out",
        });

        const x = Math.cos(angle) * smoothed[i];
        const y = Math.sin(angle) * smoothed[i];
        points.push({ x, y });
      }

      // Draw the main circle
      mainCircle.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        mainCircle.lineTo(points[i].x, points[i].y);
      }
      mainCircle.closePath();

      // Create ripple every ~10 frames
      if (app.ticker.lastTime % 10 < 1) {
        createRipple(points);
      }

      // Update ripples manually (scale drawing)
      for (const ripple of ripples) {
        ripple.clear();
        ripple.lineStyle(1, color, ripple.alpha);

        ripple.moveTo(
          ripple.points[0].x * ripple.scaleAmount,
          ripple.points[0].y * ripple.scaleAmount
        );
        for (let j = 1; j < ripple.points.length; j++) {
          ripple.lineTo(
            ripple.points[j].x * ripple.scaleAmount,
            ripple.points[j].y * ripple.scaleAmount
          );
        }
        ripple.closePath();
      }
    });
  },

  circle: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const baseRadius = settings.radius || 50;
    const color = settings.color || 0xffffff;

    const analyser = settings.analyser;
    const bufferLength = analyser?.frequencyBinCount || 0;
    const dataArray = analyser ? new Uint8Array(bufferLength) : null;

    let currentRadius = baseRadius;

    const lerp = (a, b, t) => a + (b - a) * t;

    app.ticker.add(() => {
      let targetRadius = baseRadius;

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);

        const bassBins = Math.min(32, bufferLength);
        const bassAvg =
          dataArray.slice(0, bassBins).reduce((sum, val) => sum + val, 0) /
          bassBins;

        const scale = Math.pow(bassAvg / 255, 1.5); // nonlinear boost
        targetRadius += scale * 120; // more aggressive
      }

      currentRadius = lerp(currentRadius, targetRadius, 0.25);

      shape.clear();
      shape.beginFill(color);
      shape.drawCircle(centerX, centerY, currentRadius);
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
  bassCircle: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const radius = settings.radius || 60;
    const color = settings.color || 0xff0077;
    const analyser = settings.analyser;
    const data = new Uint8Array(analyser?.frequencyBinCount || 0);

    const draw = () => {
      if (!analyser || !data) return;
      analyser.getByteFrequencyData(data);
      const bass = data.slice(0, 30);
      const avg = bass.reduce((a, b) => a + b, 0) / bass.length;
      const scale = Math.pow(avg / 255, 1.5);

      shape.clear();
      shape.beginFill(color);
      shape.drawCircle(centerX, centerY, radius + scale * 60);
      shape.endFill();
    };

    app.ticker.add(draw);
    return () => app.ticker.remove(draw);
  },

  wideCircle: (app, settings) => {
    const shape = new PIXI.Graphics();
    app.stage.addChild(shape);

    const centerX = settings.canvasWidth / 2;
    const centerY = settings.canvasHeight / 2;
    const radius = settings.radius || 100;
    const color = settings.color || 0x00ddff;
    const analyser = settings.analyser;
    const data = new Uint8Array(analyser?.frequencyBinCount || 0);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const wide = data.slice(30, 128);
      const avg = wide.reduce((a, b) => a + b, 0) / wide.length;
      const scale = Math.pow(avg / 255, 1.2);

      shape.clear();
      shape.lineStyle(2, color);
      shape.drawCircle(centerX, centerY, radius + scale * 40);
    };

    app.ticker.add(draw);
    return () => app.ticker.remove(draw);
  },

  bassCircleWave: (app, settings) => {
    const {
      analyser,
      color = 0xff3377,
      radius = 80,
      canvasWidth,
      canvasHeight,
    } = settings;

    if (!analyser || !analyser.frequencyBinCount) return;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const fftData = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = new Float32Array(360).fill(radius);

    const circle = new PIXI.Graphics();
    circle.x = centerX;
    circle.y = centerY;

    const wave = new PIXI.Graphics();
    wave.x = centerX;
    wave.y = centerY;

    circle.filters = [
      new GlowFilter({ color, distance: 20, outerStrength: 2 }),
    ];

    wave.filters = [
      new GlowFilter({ color, distance: 15, outerStrength: 1.5 }),
      new BlurFilter(1),
    ];

    app.stage.addChild(circle);
    app.stage.addChild(wave);

    let pulseScale = 1;

    const draw = () => {
      analyser.getByteFrequencyData(fftData);

      // --- Calculate Bass Average ---
      const bass = fftData.slice(0, 30);
      const bassAvg = bass.reduce((a, b) => a + b, 0) / bass.length;
      const scaleFactor = 1 + Math.pow(bassAvg / 255, 1.5) * 0.5;

      // Animate pulsing
      gsap.to(circle.scale, {
        x: scaleFactor,
        y: scaleFactor,
        duration: 0.15,
        ease: "power2.out",
      });

      // --- Draw Base Circle ---
      circle.clear();
      circle.beginFill(color);
      circle.drawCircle(0, 0, radius);
      circle.endFill();

      // --- Draw Waveform Ring ---
      wave.clear();
      wave.lineStyle(2, color, 1);

      const points = [];

      for (let i = 0; i < 360; i++) {
        const angle = (i / 360) * Math.PI * 2;
        const index = Math.floor((i / 360) * fftData.length);
        const amplitude = fftData[index] || 0;
        const norm = amplitude / 255;
        const targetRadius = radius + norm * 40;

        gsap.to(smoothed, {
          [i]: targetRadius,
          duration: 0.2,
          ease: "power3.out",
        });

        const x = Math.cos(angle) * smoothed[i];
        const y = Math.sin(angle) * smoothed[i];
        points.push({ x, y });
      }

      wave.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        wave.lineTo(points[i].x, points[i].y);
      }
      wave.closePath();
    };

    app.ticker.add(draw);
    return () => app.ticker.remove(draw);
  },
};

export default shapeRegistry;
