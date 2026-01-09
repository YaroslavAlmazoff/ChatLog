function measurePerformance() {
  return new Promise((resolve) => {
    const start = performance.now();
    let x = 0;
    for (let i = 0; i < 1e6; i++) {
      x += Math.sqrt(i);
    }
    const cpuTime = performance.now() - start;

    let frames = 0;
    let startFps = performance.now();

    function fpsTest() {
      frames++;
      if (frames < 10) {
        requestAnimationFrame(fpsTest);
      } else {
        const fps = (1000 * frames) / (performance.now() - startFps);
        resolve({ cpuTime, fps });
      }
    }

    requestAnimationFrame(fpsTest);
  });
}

measurePerformance().then(({ cpuTime, fps }) => {
  let level;

  if (cpuTime < 40 && fps > 50) {
    level = "high";
  } else if (cpuTime < 100 && fps > 30) {
    level = "medium";
  } else {
    level = "low";
  }

  document.body.dataset.perf = level;
  console.log("Performance level:", level);
});
