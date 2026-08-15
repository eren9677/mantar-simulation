import * as THREE from "three";
import { SPECIES } from "./species.js";

export function makeGlowTexture(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function makeEnvTexture() {
  const w = 512, h = 256;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#dfe9ff");
  g.addColorStop(0.45, "#f4f6fa");
  g.addColorStop(0.6, "#c9cdd8");
  g.addColorStop(1, "#5a6170");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * w, y = Math.random() * h * 0.55;
    const r = 20 + Math.random() * 50;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, "rgba(255,255,255,0.9)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const haloTex = makeGlowTexture();

const BUILT_HEIGHT = {
  forest: 1.05,
  slime: 1.0,
  coral: 4.4,
  glowcap: 1.15,
  parasite: 1.1,
  giant: 3.7,
};

const shared = {};

export { shared };

function materialFor(si) {
  const def = SPECIES[si];
  if (!shared[def.kind]) {
    switch (def.kind) {
      case "slime":
        shared.slime = new THREE.MeshStandardMaterial({
          color: def.color, metalness: 0.85, roughness: 0.16,
          transparent: true, opacity: 0.82,
          emissive: def.emissive, emissiveIntensity: 0.35,
        });
        break;
      case "glowcap":
        shared.glowcap = new THREE.MeshStandardMaterial({
          color: def.color, metalness: 0.2, roughness: 0.4,
          emissive: def.emissive, emissiveIntensity: 0.9,
        });
        break;
      case "parasite":
        shared.parasite = new THREE.MeshStandardMaterial({
          color: def.color, metalness: 0.3, roughness: 0.5,
          emissive: def.emissive, emissiveIntensity: 0.55,
        });
        break;
      default:
        shared[def.kind] = {};
    }
  }
  return shared[def.kind];
}

const shadowMat = new THREE.MeshBasicMaterial({
  color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false,
});

function addShadow(g, radius) {
  const disc = new THREE.Mesh(new THREE.CircleGeometry(radius, 24), shadowMat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.02;
  g.add(disc);
  return disc;
}

function buildForest(g, si, rand) {
  const def = SPECIES[si];
  const mat = { cap: new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.25, roughness: 0.5 }), stem: new THREE.MeshStandardMaterial({ color: def.stemColor, metalness: 0.08, roughness: 0.7 }) };
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.5, 8), mat.stem);
  stem.position.y = 0.25 + 0.18 * rand();
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat.cap);
  cap.scale.set(1, 0.55, 1);
  cap.position.y = 0.72 + 0.25 * rand();
  g.add(stem, cap);
  addShadow(g, 0.42);
}

function buildSlime(g, si, rand) {
  const def = SPECIES[si];
  const mat = materialFor(si);
  const blob = new THREE.Mesh(new THREE.SphereGeometry(0.78, 16, 12), mat);
  const pos = blob.geometry.attributes.position;
  const pv = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    pv.fromBufferAttribute(pos, i).normalize();
    const r = 1 + (rand() - 0.5) * 0.45;
    pv.multiplyScalar(r);
    pos.setXYZ(i, pv.x, pv.y, pv.z);
  }
  blob.geometry.computeVertexNormals();
  blob.scale.set(1, 0.72, 1);
  blob.position.y = 0.56;
  const g2 = new THREE.Group();
  g2.add(blob);
  for (let i = 0; i < 3; i++) {
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.16 + rand() * 0.12, 10, 8), mat);
    const a = (i / 3) * Math.PI * 2 + rand();
    sat.position.set(Math.cos(a) * 0.55, 0.28 + rand() * 0.25, Math.sin(a) * 0.55);
    g2.add(sat);
  }
  g.add(g2);
  addShadow(g, 0.8);
}

function buildCoral(g, si, rand) {
  const def = SPECIES[si];
  const mat = { branch: new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.15, roughness: 0.6 }), tip: new THREE.MeshStandardMaterial({ color: def.stemColor, metalness: 0.1, roughness: 0.6 }) };
  const cylGeom = new THREE.CylinderGeometry(1, 0.55, 1, 8);
  let tip = new THREE.Vector3(0, 0.2, 0);
  let dir = new THREE.Vector3(0, 1, 0);
  const segs = 7;
  for (let s = 0; s < segs; s++) {
    const len = 0.62 + rand() * 0.2;
    const rad = 0.24 * (1 - s / segs) + 0.02;
    const m = new THREE.Mesh(cylGeom, mat.branch);
    m.scale.set(rad, len, rad);
    if (s > 0) {
      dir.applyAxisAngle(new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI * 2), (rand() - 0.5) * 0.3);
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (rand() - 0.5) * 0.4);
    }
    const mid = tip.clone().add(dir.clone().multiplyScalar(len / 2));
    m.position.copy(mid);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(m);
    tip.addScaledVector(dir, len);
    if (s === 2 || s === 4) {
      const bDir = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.7 + rand() * 0.5);
      bDir.applyAxisAngle(new THREE.Vector3(1, 0, 0), (rand() - 0.5) * 0.5);
      const bLen = len * 0.8;
      const bm = new THREE.Mesh(cylGeom, mat.branch);
      bm.scale.set(rad * 0.8, bLen, rad * 0.8);
      bm.position.copy(tip.clone().addScaledVector(bDir, bLen / 2));
      bm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bDir);
      g.add(bm);
      const tm = new THREE.Mesh(new THREE.SphereGeometry(rad * 0.9, 8, 6), mat.tip);
      tm.position.copy(tip.clone().addScaledVector(bDir, bLen));
      g.add(tm);
    }
  }
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat.tip);
  cap.position.copy(tip);
  g.add(cap);
  addShadow(g, 0.5);
}

function buildGlowcap(g, si, rand) {
  const def = SPECIES[si];
  const mat = { stem: new THREE.MeshStandardMaterial({ color: def.stemColor, metalness: 0.1, roughness: 0.6 }), cap: materialFor(si) };
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.5, 8), mat.stem);
  stem.position.y = 0.25;
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.7, 12), mat.cap);
  cap.position.y = 0.78;
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloTex, color: def.emissive, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85,
  }));
  halo.userData.halo = true;
  halo.position.y = 1.15;
  halo.scale.set(1.7, 1.7, 1);
  g.add(stem, cap, halo);
  addShadow(g, 0.4);
}

function buildParasite(g, si, rand) {
  const def = SPECIES[si];
  const mat = materialFor(si);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), mat);
  core.position.y = 0.5;
  g.add(core);
  const tentGeom = new THREE.CylinderGeometry(0.04, 0.09, 1, 6);
  for (let i = 0; i < 6; i++) {
    const t = new THREE.Mesh(tentGeom, mat);
    const a = (i / 6) * Math.PI * 2 + rand() * 0.6;
    const tilt = 0.5 + rand() * 0.35;
    t.rotation.z = Math.cos(a) * tilt;
    t.rotation.x = -Math.sin(a) * tilt;
    t.position.set(Math.cos(a) * 0.22, 0.55, Math.sin(a) * 0.22);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), mat);
    tip.position.set(Math.cos(a) * 0.5, 0.92, Math.sin(a) * 0.5);
    g.add(t, tip);
  }
  addShadow(g, 0.5);
}

function buildGiant(g, si, rand) {
  const def = SPECIES[si];
  const mats = {
    stem: new THREE.MeshStandardMaterial({ color: def.stemColor, metalness: 0.12, roughness: 0.7 }),
    cap: new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.2, roughness: 0.55 }),
    gills: new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: 0.3, roughness: 0.5 }),
  };
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 1.1, 12), mats.stem);
  stem.position.y = 0.55;
  const gills = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.09, 8, 26), mats.gills);
  gills.position.y = 1.3;
  gills.rotation.x = Math.PI / 2;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1.7, 18, 12), mats.cap);
  cap.scale.set(1, 0.5, 1);
  cap.position.y = 1.95;
  g.add(stem, gills, cap);
  addShadow(g, 1.5);
}

const builders = { forest: buildForest, slime: buildSlime, coral: buildCoral, glowcap: buildGlowcap, parasite: buildParasite, giant: buildGiant };

export function buildMushroom(si, rand) {
  const def = SPECIES[si];
  const g = new THREE.Group();
  builders[def.kind](g, si, rand);
  const unit = BUILT_HEIGHT[def.kind];
  return { group: g, unitScale: 1 / unit, yBias: def.kind === "coral" ? 1.45 : def.kind === "slime" ? 0.85 : 1 };
}
