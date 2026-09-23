const SHOWCASE_CASES = [
  // ["01", "stability_support", "0380"],
  // ["02", "sustained_contact", "0300"],
  // ["04", "impact_collision", "0411"],
  // ["03", "constrained_rigid", "0898"],
  ["05", "external_intervention", "0213"],
  // ["06", "many_body", "0929"],
  ["07", "boundary_interaction", "0244"],
  ["08", "free_motion", "0038"],
  // ["09", "constrained_rigid", "0888"],
  // ["10", "constrained_rigid", "0444"],
  // ["11", "stability_support", "0979"],
  // ["12", "many_body", "0009"],
  // ["13", "impact_collision", "0195"],
  // ["14", "many_body", "0610"],
  // ["15", "external_intervention", "0201"],
  // ["16", "sustained_contact", "0418"],
  // ["17", "many_body", "0357"],
  // ["18", "sustained_contact", "0327"],
  ["19", "impact_collision", "0435"],
  ["20", "stability_support", "0718"],
  ["21", "stability_support", "0298"],
  ["22", "external_intervention", "0908"],
  ["23", "external_intervention", "0799"],
  ["24", "external_intervention", "0035"],
  // ["25", "stability_support", "0762"],
  // ["26", "stability_support", "0302"],
  // ["27", "stability_support", "0965"],
  // ["28", "stability_support", "0975"],
  // ["29", "constrained_rigid", "0850"],
  ["30", "constrained_rigid", "0571"],
  ["31", "constrained_rigid", "0700"],
  // ["32", "constrained_rigid", "0000"],
  // ["33", "many_body", "0900"],
  // ["34", "many_body", "0366"],
  ["35", "many_body", "0127"],
  ["36", "many_body", "0382"]
];

const CATEGORY_LABELS = {
  stability_support: "Stability support",
  sustained_contact: "Sustained contact",
  constrained_rigid: "Constrained rigid motion",
  impact_collision: "Impact collision",
  external_intervention: "External intervention",
  many_body: "Many-body interaction",
  boundary_interaction: "Boundary interaction",
  free_motion: "Free motion"
};

const MOVI_CASES = [
  ["01", "movia", "1602", 8],
  ["02", "movia", "3359", 8],
  // ["03", "movia", "2239", 8],
  ["04", "movia", "4028", 9],
  ["05", "movia", "1603", 10],
  // ["06", "movia", "619", 10],
  ["07", "movib", "4684", 5],
  ["08", "movib", "18368", 6],
  ["09", "movib", "1875", 7],
  ["10", "movib", "4799", 8],
  ["11", "movib", "1378", 9],
  ["12", "movib", "17097", 10],
  ["13", "movis", "1540", 9],
  ["14", "movis", "1089", 10],
  ["15", "movis", "2344", 9],
  ["16", "movis", "4396", 9],
  // ["17", "movis", "2487", 10],
  ["18", "movis", "3050", 10]
];

const OOD_CASES = [
  ["01", "free_motion", "0034"],
  ["02", "impact_collision", "0037"],
  ["03", "sustained_contact", "0006"],
  ["04", "stability_support", "0010"],
  ["05", "external_intervention", "0029"],
  ["06", "constrained_rigid", "0000"],
  ["07", "many_body", "0032"],
  ["08", "boundary_interaction", "0018"]
];

function asset(group, sceneId, methodId) {
  const root = `assets/${group}/${sceneId}`;
  return {
    video: `${root}/${methodId}.mp4`,
    poster: `${root}/${methodId}_frame_048.png`
  };
}

window.RESULTS_DATA = {
  generated: "2026-08-25",
  methods: [
    {
      id: "gt",
      label: "GT",
      detail: "Reference simulation",
      provenance: "Rigid-8 ground-truth trajectories rendered with Blender/Eevee.",
      status: "verified"
    },
    {
      id: "worlddirector",
      label: "WorldDirector",
      detail: "Qwen SE(3) planning baseline",
      provenance: "WorldDirector-style Qwen plans predict center positions and full XYZW orientations from frame-0 physical state, then render with Blender/Eevee.",
      status: "verified"
    },
    {
      id: "ours_fm",
      label: "PhysiFormer",
      detail: "With coarse condition",
      provenance: "Direct SE(3) model conditioned on the Qwen coarse plan, checkpoint 100000.",
      status: "verified",
      featured: true
    },
    {
      id: "ours",
      label: "Ours (VLM)",
      detail: "Qwen coarse plan",
      provenance: "Nine-anchor Qwen coarse pose waypoints used as the model condition.",
      status: "verified"
    },
    {
      id: "coarse_se3b",
      label: "Ours",
      detail: "Object-SE(3), checkpoint 90k",
      provenance: "PhysiFormer-SE3-B direct SE(3) model conditioned on the Qwen coarse plan, sampled with 25 steps and seed 0.",
      status: "verified",
      featured: true
    }
  ],
  scenes: SHOWCASE_CASES.map(([rank, category, id]) => {
      const sceneId = `${category}_${id}`;
      return {
        id: sceneId,
        title: CATEGORY_LABELS[category],
        sampleId: `rigid_${category}_id_${id}`,
        split: "test",
        group: category.replace(/_/g, "-"),
        category: CATEGORY_LABELS[category],
        assets: {
          gt: asset("rigid", sceneId, "gt"),
          worlddirector: asset("rigid", sceneId, "worlddirector"),
          ours: asset("rigid", sceneId, "ours"),
          // physiformer: asset("rigid", sceneId, "physiformer"),
          ours_fm: asset("rigid", sceneId, "ours_fm"),
          coarse_se3b: asset("rigid", sceneId, "coarse_se3b")
        }
      };
    })
};

window.MOVI_DATA = {
  generated: "2026-08-25",
  methods: [
    {
      id: "gt",
      label: "GT",
      provenance: "Ground-truth object meshes rendered with Blender/Eevee.",
      status: "verified"
    },
    {
      id: "worlddirector",
      label: "WorldDirector",
      detail: "Qwen SE(3) planning baseline",
      provenance: "Qwen predicts center positions and full XYZW orientations from frame-0 physical state.",
      status: "verified"
    },
    {
      id: "prediction",
      label: "PhysiFormer",
      detail: "Without coarse condition",
      provenance: "The all-labeled 100k checkpoint predicts mesh trajectories without a coarse plan.",
      status: "verified"
    },
    {
      id: "qwen_coarse",
      label: "Ours (VLM)",
      detail: "Position waypoints",
      provenance: "Nine Qwen center-position anchors are linearly interpolated while frame-0 orientation is held fixed.",
      status: "verified"
    },
    {
      id: "coarse_se3b",
      label: "Ours",
      detail: "Object-SE(3)",
      provenance: "MOVi-A/S use the coarse-conditioned 90k checkpoint; MOVi-B uses the no-coarse 5k checkpoint.",
      status: "verified",
      featured: true
    }
  ],
  scenes: MOVI_CASES.map(([rank, source, id, objectCount]) => {
    const sampleId = `${source}_${id}`;
    const sourceLabel = {
      movia: "MOVi-A",
      movis: "MOVi-S",
      movib: "MOVi-B"
    }[source];
    return {
      id: sampleId,
      title: `${sourceLabel} · ${objectCount} objects`,
      sampleId,
      split: "val",
      category: `${sourceLabel} · ${objectCount} objects`,
      assets: {
        gt: asset("movi", sampleId, "gt"),
        worlddirector: asset("movi", sampleId, "worlddirector"),
        prediction: asset("movi", sampleId, "prediction"),
        qwen_coarse: asset("movi", sampleId, "qwen_coarse"),
        coarse_se3b: source === "movib"
          ? asset("movib_physiformer", sampleId, "se3b_no_coarse_5k")
          : asset("movi", sampleId, "coarse_se3b")
      }
    };
  })
};

window.OOD_DATA = {
  generated: "2026-08-25",
  methods: [
    {
      id: "gt",
      label: "GT",
      detail: "Reference simulation",
      provenance: "Rigid+ OOD ground-truth trajectories rendered with Blender/Eevee.",
      status: "verified"
    },
    {
      id: "qwen_coarse",
      label: "Qwen coarse",
      detail: "SE(3) pose waypoints",
      provenance: "Interpolated Qwen coarse pose waypoints used as model condition.",
      status: "verified"
    },
    {
      id: "coarse_se3b",
      label: "SE3-B + Coarse",
      detail: "Object-SE(3), checkpoint 90k",
      provenance: "PhysiFormer-SE3-B conditioned on the Qwen coarse plan, sampled with 25 steps and seed 0.",
      status: "verified",
      featured: true
    }
  ],
  scenes: OOD_CASES.map(([rank, category, id]) => {
    const sceneId = `${category}_ood_${id}`;
    return {
      id: sceneId,
      title: `${CATEGORY_LABELS[category]} · OOD Case ${rank}`,
      sampleId: `rigid_${sceneId}`,
      split: "ood",
      group: category.replace(/_/g, "-"),
      category: CATEGORY_LABELS[category],
      assets: {
        gt: asset("ood", sceneId, "gt"),
        qwen_coarse: asset("ood", sceneId, "qwen_coarse"),
        coarse_se3b: asset("ood", sceneId, "coarse_se3b")
      }
    };
  })
};