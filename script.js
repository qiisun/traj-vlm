const scenes = {
  starship: {
    title: "Reactor safety vanes",
    category: "Impact & collision",
    description: "A rolling maintenance unit triggers a four-object chain reaction.",
    baseline: "assets/applications/first-frame/domino_starship.mp4",
    guided: "assets/applications/trajectory-guided/domino_starship.mp4",
    poster: "assets/applications/posters/domino_starship_generated_first.png",
  },
  temple: {
    title: "Temple rune tablets",
    category: "Impact & collision",
    description: "A carved stone sphere topples four tablets in a sequential collision.",
    baseline: "assets/applications/first-frame/domino_temple.mp4",
    guided: "assets/applications/trajectory-guided/domino_temple.mp4",
    poster: "assets/applications/posters/domino_temple_generated_first.png",
  },
  orbital: {
    title: "Orbital cargo transfer",
    category: "Momentum transfer",
    description: "A sliding cargo module transfers momentum through four inspection units.",
    baseline: "assets/applications/first-frame/ramp_orbital.mp4",
    guided: "assets/applications/trajectory-guided/ramp_orbital.mp4",
    poster: "assets/applications/posters/ramp_orbital_generated_first.png",
  },
  warehouse: {
    title: "Warehouse collision",
    category: "Momentum transfer",
    description: "A steel crate descends a ramp and disperses a row of metal spheres.",
    baseline: "assets/applications/first-frame/ramp_warehouse.mp4",
    guided: "assets/applications/trajectory-guided/ramp_warehouse.mp4",
    poster: "assets/applications/posters/ramp_warehouse_generated_first.png",
  },
};

const featuredResults = [
  {
    title: "Rigid+ · Many-body interaction",
    sample: "rigid_many_body_id_0127",
    root: "showcase/assets/rigid/many_body_0127",
    insight: "Captures coupled motion and collision responses across a dense many-body scene.",
    methods: [
      ["GT", "gt"],
      ["WorldDirector", "worlddirector"],
      ["PhysiFormer", "ours_fm"],
      ["Ours (VLM)", "ours"],
      ["Ours", "coarse_se3b"],
    ],
  },
  {
    title: "MOVi-A · 9 objects",
    sample: "movia_4028",
    root: "showcase/assets/movi/movia_4028",
    insight: "Mixed shapes make both translation and orientation accuracy directly visible.",
    methods: [
      ["GT", "gt"],
      ["WorldDirector", "worlddirector"],
      ["PhysiFormer", "prediction"],
      ["Ours (VLM)", "qwen_coarse"],
      ["Ours", "coarse_se3b"],
    ],
  },
  {
    title: "MOVi-B · 6 objects",
    sample: "movib_18368",
    root: "showcase/assets/movi/movib_18368",
    insight: "Complex meshes expose the large rotation-error gap on MOVi-B.",
    methods: [
      ["GT", "gt"],
      ["WorldDirector", "worlddirector"],
      ["PhysiFormer", "prediction"],
      ["Ours (VLM)", "qwen_coarse"],
      [
        "Ours",
        "se3b_no_coarse_5k",
        "showcase/assets/movib_physiformer/movib_18368",
      ],
    ],
  },
  {
    title: "MOVi-S · 10 objects",
    sample: "movis_1089",
    root: "showcase/assets/movi/movis_1089",
    insight: "Dense multi-object motion stays coherent through impact and settling.",
    methods: [
      ["GT", "gt"],
      ["WorldDirector", "worlddirector"],
      ["PhysiFormer", "prediction"],
      ["Ours (VLM)", "qwen_coarse"],
      ["Ours", "coarse_se3b"],
    ],
  },
];

const featuredResultsContainer = document.querySelector("#featured-results");

featuredResults.forEach((result) => {
  const article = document.createElement("article");
  article.className = "result-case";

  const heading = document.createElement("div");
  heading.className = "result-case-heading";
  const title = document.createElement("h3");
  title.textContent = result.title;
  heading.appendChild(title);
  article.appendChild(heading);

  const scroll = document.createElement("div");
  scroll.className = "result-scroll";
  const grid = document.createElement("div");
  grid.className = "result-grid";

  result.methods.forEach(([label]) => {
    const method = document.createElement("div");
    method.className = "result-method";
    method.textContent = label;
    grid.appendChild(method);
  });

  result.methods.forEach(([label, file, root = result.root]) => {
    const cell = document.createElement("div");
    cell.className = "result-video";
    const video = document.createElement("video");
    video.src = `${root}/${file}.mp4`;
    video.poster = `${root}/${file}_frame_048.png`;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", `${result.title}, ${label}`);
    cell.appendChild(video);
    grid.appendChild(cell);
  });

  scroll.appendChild(grid);
  article.appendChild(scroll);
  const insight = document.createElement("p");
  insight.className = "result-insight";
  insight.textContent = result.insight;
  article.appendChild(insight);
  featuredResultsContainer?.appendChild(article);
});

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks?.classList.toggle("is-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLAnchorElement)) return;
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
  navLinks.classList.remove("is-open");
});

const baselineVideo = document.querySelector("#baseline-video");
const guidedVideo = document.querySelector("#guided-video");
const sceneTitle = document.querySelector("#application-scene-title");
const sceneCategory = document.querySelector("#application-category");
const sceneDescription = document.querySelector("#application-description");
const sceneTabs = document.querySelectorAll("[data-scene]");

function loadVideo(video, source, poster) {
  if (!(video instanceof HTMLVideoElement)) return;
  video.pause();
  video.src = source;
  video.poster = poster;
  video.load();
  video.play().catch(() => {
    // Autoplay can be blocked by browser or energy-saving settings.
  });
}

function selectScene(sceneKey) {
  const scene = scenes[sceneKey];
  if (!scene) return;

  sceneTitle.textContent = scene.title;
  sceneCategory.textContent = scene.category;
  sceneDescription.textContent = scene.description;
  loadVideo(baselineVideo, scene.baseline, scene.poster);
  loadVideo(guidedVideo, scene.guided, scene.poster);

  sceneTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.scene === sceneKey));
  });
}

sceneTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectScene(tab.dataset.scene));
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const originalLabel = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1600);
    } catch {
      button.textContent = "Select and copy";
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));