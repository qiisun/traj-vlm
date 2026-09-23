(function () {
  "use strict";

  const data = window.RESULTS_DATA;
  const moviData = window.MOVI_DATA;
  const results = document.getElementById("results");
  const moviResults = document.getElementById("movi-results");
  const playButton = document.getElementById("play-all");
  const restartButton = document.getElementById("restart-all");
  const timeline = document.getElementById("global-timeline");
  const frameOutput = document.getElementById("frame-output");
  const videos = new Set();
  let playing = false;
  let scrubbing = false;
  let autoplayVisible = true;

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting && autoplayVisible) {
        video.play().catch(() => {});
      } else if (!entry.isIntersecting) {
        video.pause();
      }
    });
  }, { rootMargin: "160px 0px", threshold: 0.01 });

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setButtonState(nextPlaying) {
    playing = nextPlaying;
    playButton.textContent = playing ? "Pause all" : "Play all";
  }

  function activeVideos() {
    return Array.from(videos);
  }

  function registerVideo(video) {
    videos.add(video);
    visibilityObserver.observe(video);
    video.addEventListener("playing", () => setButtonState(true));
    video.addEventListener("pause", () => {
      requestAnimationFrame(() => {
        if (activeVideos().every((candidate) => candidate.paused)) {
          setButtonState(false);
        }
      });
    });
    video.addEventListener("timeupdate", () => {
      if (scrubbing || video !== activeVideos()[0] || !Number.isFinite(video.duration)) return;
      const value = Math.round((video.currentTime / video.duration) * 1000);
      timeline.value = String(value);
      frameOutput.value = `${String(Math.round(value * 48 / 1000)).padStart(2, "0")} / 48`;
    });
  }

  function makeVideo(asset, scene, method) {
    const wrap = make("div", "video-wrap");
    const video = document.createElement("video");
    video.src = asset.video;
    if (asset.poster) video.poster = asset.poster;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", `${scene.title}, ${method.label}`);
    wrap.appendChild(video);
    registerVideo(video);
    return wrap;
  }

  function makeMissing(scene, method) {
    const missing = make("div", "missing");
    missing.appendChild(make("span", "", "Video not available"));
    const label = make("label", "file-label", "Load video");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.setAttribute("aria-label", `Load ${method.label} video for ${scene.title}`);
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const asset = { video: URL.createObjectURL(file) };
      missing.replaceWith(makeVideo(asset, scene, method));
      updateCount();
    });
    label.appendChild(input);
    missing.appendChild(label);
    return missing;
  }

  function updateCount() {
    const total = data.scenes.length * data.methods.length
      + moviData.scenes.reduce(
        (count, scene) => count + moviData.methods.filter((method) => scene.assets[method.id]).length,
        0
      );
    document.getElementById("asset-count").textContent = `${videos.size} / ${total}`;
  }

  function renderScenes(dataset, target, options = {}) {
    dataset.scenes.forEach((scene) => {
      const methods = options.hideMissing
        ? dataset.methods.filter((method) => scene.assets[method.id])
        : dataset.methods;
      const section = make("section", "scene");
      const heading = make("div", "scene-heading");
      heading.appendChild(make("strong", "", scene.title));
      section.appendChild(heading);

      const scroll = make("div", "comparison-scroll");
      const grid = make("div", "comparison-grid");
      if (options.hideMissing) {
        grid.style.gridTemplateColumns = `repeat(${methods.length}, minmax(200px, 1fr))`;
      }
      methods.forEach((method) => grid.appendChild(make("div", "method", method.label)));
      methods.forEach((method) => {
        const cell = make("div", "cell");
        const asset = scene.assets[method.id];
        cell.appendChild(asset ? makeVideo(asset, scene, method) : makeMissing(scene, method));
        grid.appendChild(cell);
      });
      scroll.appendChild(grid);
      section.appendChild(scroll);
      target.appendChild(section);
    });
  }

  renderScenes(data, results);
  renderScenes(moviData, moviResults, { hideMissing: true });

  playButton.addEventListener("click", () => {
    const nextPlaying = !playing;
    autoplayVisible = nextPlaying;
    activeVideos().forEach((video) => nextPlaying ? video.play() : video.pause());
    setButtonState(nextPlaying);
  });

  restartButton.addEventListener("click", () => {
    activeVideos().forEach((video) => { video.currentTime = 0; });
    timeline.value = "0";
    frameOutput.value = "00 / 48";
  });

  timeline.addEventListener("pointerdown", () => { scrubbing = true; });
  timeline.addEventListener("input", () => {
    const ratio = Number(timeline.value) / 1000;
    activeVideos().forEach((video) => {
      if (Number.isFinite(video.duration)) video.currentTime = ratio * video.duration;
    });
    frameOutput.value = `${String(Math.round(ratio * 48)).padStart(2, "0")} / 48`;
  });
  timeline.addEventListener("pointerup", () => { scrubbing = false; });
  timeline.addEventListener("change", () => { scrubbing = false; });

  updateCount();
})();