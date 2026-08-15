export const GRID = 72;
export const N = GRID * GRID;

const DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

const MAX_TOTAL_MUSH = 900;

function buildKernelTable(kind, R) {
  const size = R * 2 + 1;
  const weights = new Float64Array(size * size);
  let sum = 0;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const d = Math.hypot(dx, dy);
      let w = 0;
      if (kind === "ballistic") w = d <= R ? 1 / (1 + d * 1.2) : 0;
      else if (kind === "splash") w = d <= R ? Math.exp(-d / (R * 0.3)) : 0;
      else if (kind === "wind") w = d <= R ? Math.exp(-(d * d) / (2 * (R * 0.28) ** 2)) : 0;
      weights[(dy + R) * size + (dx + R)] = w;
      sum += w;
    }
  }
  const cum = new Float32Array(size * size);
  let acc = 0;
  for (let i = 0; i < size * size; i++) {
    acc += weights[i] / sum;
    cum[i] = acc;
  }
  return { size, R, cum };
}

function sampleKernel(k, u) {
  let lo = 0, hi = k.cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (k.cum[mid] < u) lo = mid + 1;
    else hi = mid;
  }
  const size = k.size;
  return { dx: (lo % size) - k.R, dy: ((lo / size) | 0) - k.R };
}

function buildDefense(defs) {
  const n = defs.length;
  const m = new Float32Array(n * n);
  for (let a = 0; a < n; a++) {
    const vs = defs[a].vs || {};
    for (let b = 0; b < n; b++) {
      m[a * n + b] = defs[a].aggression + (vs[defs[b].id] || 0);
    }
  }
  return m;
}

export class Simulation {
  constructor(defs) {
    this.defs = defs;
    this.nSpecies = defs.length;
    this.myc = new Int8Array(N);
    this.health = new Float32Array(N);
    this.mushAt = new Int16Array(N);
    this.growDir = new Int8Array(N);
    this.mushrooms = [];
    this.speciesCells = defs.map(() => []);
    this.signal = new Float32Array(N);
    this.defense = buildDefense(defs);
    this.kernels = defs.map((d) => {
      if (d.spreadKernel === "network") return null;
      return buildKernelTable(d.spreadKernel, Math.max(3, Math.ceil(d.sporeRange)));
    });
    this.time = 0;
    this.windAngle = 0;
    this._id = 0;
  }

  static idx(c, r) { return r * GRID + c; }
  static col(i) { return i % GRID; }
  static row(i) { return (i / GRID) | 0; }

  inBounds(c, r) {
    return c >= 0 && r >= 0 && c < GRID && r < GRID;
  }

  occupy(i, si, h) {
    if (si === 0) { this.clearCell(i); return; }
    const old = this.myc[i];
    if (old !== 0 && old !== si) this._removeFrom(old, i);
    if (this.myc[i] !== si) {
      this.myc[i] = si;
      this.speciesCells[si].push(i);
    }
    this.health[i] = h > 1 ? 1 : h;
  }

  clearCell(i) {
    const si = this.myc[i];
    if (si === 0) return;
    this._removeFrom(si, i);
    this.myc[i] = 0;
    this.health[i] = 0;
  }

  _removeFrom(si, i) {
    const arr = this.speciesCells[si];
    const k = arr.indexOf(i);
    if (k >= 0) {
      const last = arr.pop();
      if (k < arr.length) arr[k] = last;
    }
  }

  plantAt(c, r, si) {
    const i = this.idx(c, r);
    if (this.mushAt[i]) this.kill(this.mushAt[i] - 1);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nc = c + dx, nr = r + dy;
        if (!this.inBounds(nc, nr)) continue;
        const t = this.idx(nc, nr);
        const other = this.myc[t];
        if (other === 0) this.occupy(t, si, 0.5 + Math.random() * 0.3);
        else if (other !== si && Math.random() < 0.6) this.occupy(t, si, Math.max(0.4, this.health[t]));
      }
    }
    return this.spawnMushroom(i, si);
  }

  kill(mid) {
    const m = this.mushrooms[mid];
    if (!m || m.dead) return;
    m.dead = true;
    m.shrinkT = 0;
    if (this.mushAt[m.cell] === m.id + 1) this.mushAt[m.cell] = 0;
  }

  killAll() {
    for (const m of this.mushrooms) this.kill(m.id);
  }

  spawnMushroom(i, si) {
    if (this.mushrooms.length >= MAX_TOTAL_MUSH) return null;
    const def = this.defs[si];
    let cnt = 0;
    for (const m of this.mushrooms) if (m.si === si) cnt++;
    if (cnt >= def.maxCount) return null;
    const c = this.col(i), r = this.row(i);
    const m = {
      id: this._id++,
      si,
      cell: i,
      x: c - GRID / 2 + 0.5,
      z: r - GRID / 2 + 0.5,
      age: 0,
      progress: 0,
      dead: false,
      shrinkT: 0,
      lifetime: def.lifetime * (0.75 + Math.random() * 0.5),
      growthTime: def.growthTime * (0.85 + Math.random() * 0.3),
      sporeT: def.sporeInterval * (0.5 + Math.random() * 0.7),
      wobPhase: Math.random() * Math.PI * 2,
      tiltY: Math.random() * Math.PI * 2,
      scale: def.height * (0.8 + Math.random() * 0.4),
    };
    this.mushrooms.push(m);
    this.mushAt[i] = m.id + 1;
    return m;
  }

  tick(dt) {
    this.time += dt;
    this.windAngle += dt * 0.05;
    const mush = this.mushrooms;

    for (let k = 0; k < mush.length; k++) {
      const m = mush[k];
      if (m.dead) continue;
      m.age += dt;
      m.progress = Math.min(1, m.progress + dt / m.growthTime);
      if (m.age > m.lifetime) { this.kill(m.id); continue; }
      const def = this.defs[m.si];
      if (def.puff && !m.puffed && m.progress >= 0.95) {
        m.puffed = true;
        const n = def.burst || 40;
        for (let b = 0; b < n; b++) this.emitSpore(m, def);
        m.lifetime = Math.min(m.lifetime, m.age + 6);
      }
      if (m.progress > 0.6) {
        m.sporeT -= dt;
        if (m.sporeT <= 0) {
          m.sporeT = def.sporeInterval * (0.6 + Math.random() * 0.8);
          const n = def.burst || 1;
          for (let b = 0; b < n; b++) {
            if (Math.random() < def.sporeChance) this.emitSpore(m, def);
          }
        }
      }
    }

    for (let si = 0; si < this.nSpecies; si++) {
      const def = this.defs[si];
      const cells = this.speciesCells[si];
      if (!cells.length) continue;
      const want = def.myceliumRate * cells.length * dt;
      let n = Math.floor(want);
      if (Math.random() < want - n) n++;
      if (n > 500) n = 500;
      while (n-- > 0) {
        const i = cells[(Math.random() * cells.length) | 0];
        const c = this.col(i), r = this.row(i);
        let d = (Math.random() * 8) | 0;
        if (def.momentum && Math.random() < def.momentum) d = this.growDir[i];
        const nc = c + DIRS[d][0], nr = r + DIRS[d][1];
        if (!this.inBounds(nc, nr)) continue;
        const t = this.idx(nc, nr);
        const other = this.myc[t];
        if (other === 0) {
          this.occupy(t, si, 0.35 + Math.random() * 0.3);
          this.growDir[t] = d;
        } else if (other !== si) {
          if (Math.random() < this.fightChance(si, other, i, t)) {
            this.occupy(t, si, Math.max(0.4, this.health[t]));
            this.growDir[t] = d;
          } else {
            this.health[t] -= 0.05;
          }
        }
        if (def.prune) {
          this.health[i] = Math.min(1, this.health[i] + 0.03);
        }
      }
      if (def.prune && Math.random() < 0.05) {
        for (let s = 0; s < 26; s++) {
          const i = cells[(Math.random() * cells.length) | 0];
          if (this.mushAt[i] !== 0) continue;
          this.health[i] -= 0.02;
          if (this.health[i] < 0.1) this.clearCell(i);
        }
      }
      if (def.recycle) {
        for (let s = 0; s < 20; s++) {
          const i = cells[(Math.random() * cells.length) | 0];
          if (this.health[i] > 0.5) this.health[i] -= 0.006;
        }
      }
      if (cells.length > 3 && Math.random() < 0.6) {
        if (def.ring) {
          for (let s = 0; s < 26; s++) {
            const i = cells[(Math.random() * cells.length) | 0];
            const h = this.health[i];
            if (h > 0.42 && h < 0.75 && this.mushAt[i] === 0 && Math.random() < 0.07) {
              this.spawnMushroom(i, si);
              break;
            }
          }
        } else {
          for (let s = 0; s < 14; s++) {
            const i = cells[(Math.random() * cells.length) | 0];
            if (this.health[i] > 0.68 && this.mushAt[i] === 0 && Math.random() < 0.05) {
              this.spawnMushroom(i, si);
              break;
            }
          }
        }
      }
    }
  }

  fightChance(a, b, ia, ib) {
    const n = this.nSpecies;
    const da = this.defense[a * n + b] * (0.6 + 0.4 * this.health[ia]);
    const db = this.defense[b * n + a] * (0.6 + 0.4 * this.health[ib]);
    return da / (da + db);
  }

  emitSpore(m, def) {
    const { tx, tz, cell, drift } = this.sporeTarget(m, def);
    return {
      sx: m.x, sy: 1.2 * m.scale + 0.5, sz: m.z,
      cx: tx, cz: tz,
      cell, si: m.si, t: 0,
      dur: (def.spreadKernel === "wind" ? 1.2 : 0.6) + Math.random() * 0.5,
      drift, seed: Math.random() * 7,
    };
  }

  sporeTarget(m, def) {
    const kernel = def.spreadKernel || "ballistic";
    if (kernel === "network") {
      const cells = this.speciesCells[m.si];
      let picked = null;
      for (let tries = 0; tries < 14; tries++) {
        const cand = cells[(Math.random() * cells.length) | 0];
        const dx = (cand % GRID) - (m.x + GRID / 2);
        const dy = ((cand / GRID) | 0) - (m.z + GRID / 2);
        if (Math.hypot(dx, dy) <= def.sporeRange) { picked = cand; break; }
      }
      if (picked == null) picked = m.cell;
      const c = picked % GRID, r = (picked / GRID) | 0;
      return { tx: c - GRID / 2 + 0.5, tz: r - GRID / 2 + 0.5, cell: picked, drift: 1.1 };
    }
    const k = this.kernels[m.si];
    const { dx, dy } = sampleKernel(k, Math.random());
    let ox = dx, oz = dy;
    let drift = 0.3;
    if (kernel === "wind") {
      const ca = Math.cos(this.windAngle), sa = Math.sin(this.windAngle);
      const rx = ox * ca - oz * sa;
      const rz = ox * sa + oz * ca;
      ox = rx; oz = rz;
      drift = 2.6;
      if (def.fatTail && Math.random() < def.fatTail) {
        ox *= 2.5;
        oz *= 2.5;
      }
    } else if (kernel === "splash") {
      drift = 0.9;
    }
    const tx = m.x + ox, tz = m.z + oz;
    const cc = Math.max(0, Math.min(GRID - 1, Math.floor(tx + GRID / 2)));
    const rr2 = Math.max(0, Math.min(GRID - 1, Math.floor(tz + GRID / 2)));
    return { tx: cc - GRID / 2 + 0.5, tz: rr2 - GRID / 2 + 0.5, cell: rr2 * GRID + cc, drift };
  }

  landSpore(sp) {
    const { cell, si } = sp;
    const other = this.myc[cell];
    if (other === 0) {
      this.occupy(cell, si, 0.45 + Math.random() * 0.25);
    } else if (other === si) {
      this.health[cell] = Math.min(1, this.health[cell] + 0.12);
      if (Math.random() < 0.22 && this.mushAt[cell] === 0) this.spawnMushroom(cell, si);
    } else if (Math.random() < this.fightChance(si, other, cell, cell)) {
      this.occupy(cell, si, Math.max(0.35, this.health[cell]));
    }
  }

  computeSignals() {
    const sig = this.signal;
    sig.fill(0);
    for (let si = 0; si < this.nSpecies; si++) {
      let level = [];
      for (const m of this.mushrooms) {
        if (m.si === si && !m.dead && m.progress > 0.45 && this.myc[m.cell] === si && sig[m.cell] === 0) {
          sig[m.cell] = 1;
          level.push(m.cell);
        }
      }
      let strength = 1;
      while (level.length && strength > 0.05) {
        strength *= 0.82;
        const next = [];
        for (let k = 0; k < level.length; k++) {
          const i = level[k];
          const c = this.col(i), r = this.row(i);
          for (let d = 0; d < 4; d++) {
            const nc = c + DIRS[d][0], nr = r + DIRS[d][1];
            if (!this.inBounds(nc, nr)) continue;
            const t = this.idx(nc, nr);
            if (this.myc[t] === si && sig[t] === 0) {
              sig[t] = strength;
              next.push(t);
            }
          }
        }
        level = next;
      }
    }
  }

  randomCell() {
    return (Math.random() * N) | 0;
  }

  getStats() {
    return this.defs.map((def, si) => {
      let mushrooms = 0;
      for (const m of this.mushrooms) if (m.si === si && !m.dead) mushrooms++;
      return { id: def.id, mushrooms, mycelium: this.speciesCells[si].length };
    });
  }
}
