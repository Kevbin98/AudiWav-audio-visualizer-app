export const shapeRenderers = {
  bars: (g, i, value, app) => {
    g.beginFill(0x00ffcc);
    g.drawRect(i * 6, app.screen.height - value, 4, value);
    g.endFill();
  },
  circles: (g, i, value, app, dataArray) => {
    const radius = value * 0.25;
    g.beginFill(0xff0066);
    g.drawCircle(app.screen.width / 2, app.screen.height / 2, radius);
    g.endFill();
  },
  lines: (g, i, value, app) => {
    g.lineStyle(2, 0xffffff);
    g.moveTo(i * 6, app.screen.height / 2);
    g.lineTo(i * 6, app.screen.height / 2 - value);
  },
};
