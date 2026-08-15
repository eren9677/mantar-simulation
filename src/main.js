import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { WebGPURenderer } from "three/webgpu";
import { SPECIES } from "./species.js";
import { Simulation, GRID, N } from "./sim.js";
import { buildMushroom, makeGlowTexture, makeEnvTexture, shared } from "./meshes.js";
import { initUI } from "./ui.js";

const STEP = 0.1;
const MAX_SPORES = 2500;

const root = document.getElementById("app");

let renderer;
let usingWebGPU = false;
try {
  renderer = new WebGPURenderer({ antialias: true });
  usingWebGPU = !!(renderer.backend && renderer.backend.isWebGPUBackend);
} catch (e) {
  renderer = null;
}
if (!renderer) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
}
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f18);
scene.fog = new THREE.Fog(0x0b0f18, 90, 200);

try {
  scene.environment = makeEnvTexture();
  scene.environmentIntensity = 1.15;
} catch (e) { /* env is optional */ }

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 400);
camera.position.set(0, 26, 34);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 140;
controls.maxPolarAngle = Math.PI / 2.03;

scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x2a3040, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.3);
sun.position.set(30, 50, 20);
scene.add(sun);
scene.add(new THREE.AmbientLight(0x44506a, 0.5));

const GROUND_MAT = new THREE.MeshStandardMaterial({
  color: 0x161d2b, metalness: 1.0, roughness: 0.2,
  envMapIntensity: 1.2, transparent: true, opacity: 1, side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(GRID + 4, GRID + 4), GROUND_MAT);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const fineGrid = new THREE.GridHelper(GRID, GRID, 0x9cc3e5, 0x41556f);
fineGrid.position.y = 0.015;
fineGrid.material.transparent = true;
fineGrid.material.opacity = 0.22;
scene.add(fineGrid);

const coarseGrid = new THREE.GridHelper(GRID, 12, 0xd4e4f5, 0x6b86a8);
coarseGrid.position.y = 0.02;
coarseGrid.material.transparent = true;
coarseGrid.material.opacity = 0.4;
scene.add(coarseGrid);

const frameMat = new THREE.MeshStandardMaterial({
  color: 0x33405a, metalness: 0.95, roughness: 0.28,
  emissive: 0x0d1a2e, emissiveIntensity: 0.4,
});
const half = GRID / 2;
const wallGeo = new THREE.BoxGeometry(1, 1, 1);
for (const [x, z, w, d] of [
  [0, -half - 0.25, GRID + 0.8, 0.3],
  [0, half + 0.25, GRID + 0.8, 0.3],
  [-half - 0.25, 0, 0.3, GRID + 0.8],
  [half + 0.25, 0, 0.3, GRID + 0.8],
]) {
  const wall = new THREE.Mesh(wallGeo, frameMat);
  wall.scale.set(w, 0.55, d);
  wall.position.set(x, 0.18, z);
  scene.add(wall);
}

const sim = new Simulation(SPECIES);

const dummy = new THREE.Object3D();
const jx = new Float32Array(N);
const jz = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const h = ((i * 2654435761) >>> 0) / 4294967296;
  jx[i] = (h - 0.5) * 0.14;
  jz[i] = (((i * 40503 + 17) >>> 0) % 1000) / 1000 * 0.14 - 0.07;
}

const mycMat = new THREE.MeshBasicMaterial({
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
});
const mycMesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.15, 0), mycMat, N);
mycMesh.frustumCulled = false;
mycMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
mycMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
scene.add(mycMesh);

const sporeTex = makeGlowTexture();
const sporeGeo = new THREE.BufferGeometry();
const sporePos = new Float32Array(MAX_SPORES * 3);
const sporeCol = new Float32Array(MAX_SPORES * 3);
for (let i = 0; i < MAX_SPORES; i++) sporePos[i * 3 + 1] = -999;
sporeGeo.setAttribute("position", new THREE.BufferAttribute(sporePos, 3));
sporeGeo.setAttribute("color", new THREE.BufferAttribute(sporeCol, 3));
const sporeMat = new THREE.PointsMaterial({
  size: 0.16, map: sporeTex, transparent: true, opacity: 0.95,
  blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true, sizeAttenuation: true,
});
const sporePoints = new THREE.Points(sporeGeo, sporeMat);
sporePoints.frustumCulled = false;
scene.add(sporePoints);
const spores = [];

const markerMat = new THREE.MeshBasicMaterial({
  transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending,
});
const marker = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), markerMat);
marker.rotation.x = -Math.PI / 2;
marker.position.y = 0.03;
marker.visible = false;
scene.add(marker);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selected = 0;
let running = true;
let speed = 1;
let rootsMode = false;
let simAcc = 0;
let modeAnim = null;

const modes = {
  surface: { pos: new THREE.Vector3(0, 26, 34), tgt: new THREE.Vector3(0, 0, 0), polar: Math.PI / 2.03, groundOp: 1, gridOp: 0.4 },
  roots: { pos: new THREE.Vector3(18, -3.4, 18), tgt: new THREE.Vector3(0, 0, 0), polar: Math.PI * 0.6, groundOp: 0.04, gridOp: 0.06 },
};
const wind = { x: 0, z: 0 };

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function cellFromWorld(x, z) {
  const c = Math.floor(x + GRID / 2);
  const r = Math.floor(z + GRID / 2);
  if (c < 0 || r < 0 || c >= GRID || r >= GRID) return -1;
  return r * GRID + c;
}

function pickSpeciesFromColor() {
  const c = SPECIES[selected];
  markerMat.color.setHex(c.color);
  return c;
}

const ui = initUI({
  onSelect(i) { selected = i; pickSpeciesFromColor(); ui.setSelected(i); },
  onPlayPause() { running = !running; ui.setTransport(running, speed); },
  onSpeed(s) { speed = s; running = true; ui.setTransport(running, speed); },
  onRoots() {
    rootsMode = !rootsMode;
    ui.setRoots(rootsMode);
    const m = rootsMode ? modes.roots : modes.surface;
    controls.enabled = false;
    modeAnim = {
      t: 0,
      fromPos: camera.position.clone(),
      fromTgt: controls.target.clone(),
      toPos: m.pos.clone(),
      toTgt: m.tgt.clone(),
    };
    controls.maxPolarAngle = m.polar;
    controls.minDistance = rootsMode ? 2 : 4;
  },
  onRandom() {
    for (let i = 0; i < 14; i++) {
      const si = (Math.random() * SPECIES.length) | 0;
      const c = Math.floor(Math.random() * GRID);
      const r = Math.floor(Math.random() * GRID);
      sim.plantAt(c, r, si);
    }
  },
  onStorm() {
    for (let i = 0; i < 60; i++) {
      const si = (Math.random() * SPECIES.length) | 0;
      const cell = sim.randomCell();
      const c = Simulation.col(cell), r = Simulation.row(cell);
      spores.push({
        sx: c - GRID / 2 + 0.5, sy: 9 + Math.random() * 3, sz: r - GRID / 2 + 0.5,
        cx: c - GRID / 2 + 0.5, cz: r - GRID / 2 + 0.5,
        cell, si, t: 0, dur: 0.7 + Math.random() * 0.6, seed: Math.random() * 7,
      });
    }
  },
  onClear() {
    sim.killAll();
    sim.myc.fill(0);
    sim.health.fill(0);
    sim.signal.fill(0);
    sim.speciesCells = SPECIES.map(() => []);
    spores.length = 0;
    for (let i = 0; i < MAX_SPORES * 3; i += 3) sporePos[i + 1] = -999;
  },
});
ui.setSelected(0);
ui.setTransport(running, speed);
ui.setBadge(usingWebGPU ? "WebGPU" : "WebGL2");
pickSpeciesFromColor();

const pointer = (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
};

renderer.domElement.addEventListener("pointermove", (e) => {
  pointer(e);
  if (e.buttons === 0) {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(ground);
    if (hits.length) {
      const cell = cellFromWorld(hits[0].point.x, hits[0].point.z);
      if (cell >= 0) {
        const c = Simulation.col(cell), r = Simulation.row(cell);
        marker.position.set(c - GRID / 2 + 0.5, 0.03, r - GRID / 2 + 0.5);
        marker.visible = true;
        ui.setMarkerInfo(`${SPECIES[selected].name} → (${c}, ${r})`);
        return;
      }
    }
    marker.visible = false;
    ui.setMarkerInfo("");
  }
});

renderer.domElement.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  pointer(e);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground);
  if (!hits.length) return;
  const cell = cellFromWorld(hits[0].point.x, hits[0].point.z);
  if (cell >= 0) {
    sim.plantAt(Simulation.col(cell), Simulation.row(cell), selected);
  }
});

renderer.domElement.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  pointer(e);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground);
  if (!hits.length) return;
  const cell = cellFromWorld(hits[0].point.x, hits[0].point.z);
  if (cell >= 0 && sim.mushAt[cell]) sim.kill(sim.mushAt[cell] - 1);
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let last = performance.now();
let signalTimer = 0;
let statTimer = 0;
let glowTimer = 0;

function spawnFlightSpore(sp, dt) {
  sp.t += dt;
  const u = Math.min(1, sp.t / sp.dur);
  const lift = Math.sin(Math.PI * u);
  const x = sp.sx + (sp.cx - sp.sx) * u + lift * wind.x * sp.drift;
  const z = sp.sz + (sp.cz - sp.sz) * u + lift * wind.z * sp.drift;
  const y = sp.sy + (0.3 - sp.sy) * u + lift * 1.2 + Math.sin(u * 9 + sp.seed) * 0.1;
  return { x, y, z };
}

function renderLoop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const playing = running && speed > 0;

  if (playing) {
    simAcc += dt * speed;
    let steps = Math.floor(simAcc / STEP);
    if (steps > 24) steps = 24;
    simAcc -= steps * STEP;
    for (let s = 0; s < steps; s++) sim.tick(STEP);
  }

  if (shared.glowcap) {
    shared.glowcap.emissiveIntensity = 0.7 + 0.45 * Math.sin(t * 2.5);
  }
  wind.x = Math.sin(t * 0.06) * 0.45;
  wind.z = Math.cos(t * 0.043) * 0.45;

  for (let k = spores.length - 1; k >= 0; k--) {
    const sp = spores[k];
    if (!playing) break;
    const p = spawnFlightSpore(sp, dt);
    const idx = k * 3;
    sporePos[idx] = p.x;
    sporePos[idx + 1] = p.y;
    sporePos[idx + 2] = p.z;
    const c = SPECIES[sp.si].mycColor;
    sporeCol[idx] = ((c >> 16) & 255) / 255;
    sporeCol[idx + 1] = ((c >> 8) & 255) / 255;
    sporeCol[idx + 2] = (c & 255) / 255;
    if (sp.t >= sp.dur) {
      sim.landSpore(sp);
      sporePos[idx + 1] = -999;
      spores.splice(k, 1);
    }
  }

  const t = now / 1000;
  const mush = sim.mushrooms;
  for (let k = mush.length - 1; k >= 0; k--) {
    const m = mush[k];
    if (!m.group) {
      const built = buildMushroom(m.si, Math.random);
      m.unitScale = built.unitScale;
      m.yBias = built.yBias;
      m.group = built.group;
      m.group.position.set(m.x, 0, m.z);
      m.group.rotation.y = m.tiltY;
      m.haloRef = m.group.children.find((ch) => ch.userData.halo);
      scene.add(m.group);
    }
    const g = m.group;
    const base = m.scale * m.unitScale;
    if (!m.dead) {
      const p = 0.14 + 0.86 * easeOutCubic(m.progress);
      const wob = m.si === 1 ? 1 + 0.05 * Math.sin(t * 2.4 + m.wobPhase) : 1;
      const sy = m.si === 1 ? 1 + 0.05 * Math.sin(t * 3.1 + m.wobPhase * 1.7) : m.yBias;
      g.scale.set(base * p * wob, base * p * sy, base * p * wob);
      if (m.haloRef) {
        const s = (1.7 + 0.25 * Math.sin(t * 2.5 + m.wobPhase)) * (0.4 + 0.6 * p);
        m.haloRef.scale.set(s, s, 1);
      }
      const arms = g.userData.starArms;
      if (arms) {
        const open = easeOutCubic(m.progress);
        for (const ag of arms) ag.rotation.x = (Math.PI / 2) * open;
        g.userData.starBulb.position.y = 0.12 + 0.3 * open;
      }
    } else {
      m.shrinkT += dt;
      const kk = Math.max(0, 1 - m.shrinkT / 0.9);
      g.scale.setScalar(base * kk * m.yBias);
      if (kk <= 0) {
        scene.remove(g);
        mush.splice(k, 1);
      }
    }
  }

  const roots = rootsMode ? 1 : 0;
  const rootsT = rootsMode ? 1.45 : 0.8;
  const nowS = now / 1000;
  const defs = SPECIES;
  const mycArr = sim.myc, hpArr = sim.health, sigArr = sim.signal;
  const colArr = mycMesh.instanceColor.array;
  for (let i = 0; i < N; i++) {
    const si = mycArr[i];
    const o = i * 3;
    if (si === 0) {
      dummy.position.set(0, -500, 0);
      dummy.scale.setScalar(0);
      colArr[o] = colArr[o + 1] = colArr[o + 2] = 0;
    } else {
      const h = hpArr[i];
      const sig = sigArr[i];
      let pulse = 0;
      if (sig > 0.05) {
        const ps = defs[si].pulseSpeed;
        pulse = 0.6 + 0.4 * Math.sin(nowS * ps - sig * 2.5);
      }
      const s = 0.15 * (0.75 + 0.5 * h) * (1 + 0.4 * pulse) * (1 + roots * 0.25);
      dummy.position.set(i % GRID - GRID / 2 + 0.5 + jx[i], -0.36, ((i / GRID) | 0) - GRID / 2 + 0.5 + jz[i]);
      dummy.scale.setScalar(s);
      const bright = rootsT * (0.5 + 0.55 * h) * (1 + pulse * 0.9);
      const c = defs[si].mycColor;
      colArr[o] = Math.min(1.6, ((c >> 16) & 255) / 255 * bright);
      colArr[o + 1] = Math.min(1.6, ((c >> 8) & 255) / 255 * bright);
      colArr[o + 2] = Math.min(1.6, (c & 255) / 255 * bright);
    }
    dummy.updateMatrix();
    mycMesh.setMatrixAt(i, dummy.matrix);
  }
  mycMesh.instanceMatrix.needsUpdate = true;
  mycMesh.instanceColor.needsUpdate = true;

  sporeGeo.attributes.position.needsUpdate = true;
  sporeGeo.attributes.color.needsUpdate = true;

  signalTimer -= dt;
  if (signalTimer <= 0) {
    sim.computeSignals();
    signalTimer = 0.5;
  }

  statTimer -= dt;
  if (statTimer <= 0) {
    ui.setStats(sim.getStats());
    ui.setTime(sim.time);
    statTimer = 0.5;
  }

  const damp = 1 - Math.pow(0.001, dt);
  const mode = rootsMode ? modes.roots : modes.surface;
  if (modeAnim) {
    modeAnim.t += dt;
    const k = Math.min(1, modeAnim.t / 0.7);
    const e = 1 - Math.pow(1 - k, 3);
    camera.position.lerpVectors(modeAnim.fromPos, modeAnim.toPos, e);
    controls.target.lerpVectors(modeAnim.fromTgt, modeAnim.toTgt, e);
    if (k >= 1) {
      modeAnim = null;
      controls.enabled = true;
    }
  }
  GROUND_MAT.opacity += (mode.groundOp - GROUND_MAT.opacity) * damp;
  fineGrid.material.opacity += (mode.gridOp - fineGrid.material.opacity) * damp;
  coarseGrid.material.opacity += (mode.gridOp + 0.05 - coarseGrid.material.opacity) * damp;

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderLoop);
