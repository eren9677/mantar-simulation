export const GRID = 72;
export const N = GRID * GRID;

const DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

const MAX_TOTAL_MUSH = 900;

export class Simulation {
  constructor(defs) {
    this.defs = defs;
    this.nSpecies = defs.length;
    this.myc = new Int8Array(N);
    this.health = new Float32Array(N);
    this.mushAt = new Int16Array(N);
    this.mushrooms = [];
    this.speciesCells = defs.map(() => []);
    this.signal = new Float32Array(N);
    this.time = 0;
    this._id = 0;
  }

  static idx(c, r) { return r * GRID + c; }
  static col(i) { return i % GRID; }
  static row(i) { return (i / GRID) | 0; }

  inBounds(c, r) {
    return c >= 0 && r >= 0 && c < GRID && r < GRID;
  }

  occupy(i, si, h) {
    const old = this.myc[i];
    if (old !== 0 && old !== si) this._removeFrom(old, i);
    if (this.myc[i] !== si) {
      this.myc[i] = si;
      this.speciesCells[si].push(i);
    }
    this.health[i] = h > 1 ? 1 : h;
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
    const mush = this.mushrooms;

    for (let k = 0; k < mush.length; k++) {
      const m = mush[k];
      if (m.dead) continue;
      m.age += dt;
      m.progress = Math.min(1, m.progress + dt / m.growthTime);
      if (m.age > m.lifetime) { this.kill(m.id); continue; }
      const def = this.defs[m.si];
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
        const d = DIRS[(Math.random() * 8) | 0];
        const nc = c + d[0], nr = r + d[1];
        if (!this.inBounds(nc, nr)) continue;
        const t = this.idx(nc, nr);
        const other = this.myc[t];
        if (other === 0) {
          this.occupy(t, si, 0.35 + Math.random() * 0.3);
        } else if (other !== si) {
          if (Math.random() < this.fightChance(si, other, i, t)) {
            this.occupy(t, si, Math.max(0.4, this.health[t]));
          } else {
            this.health[t] -= 0.05;
          }
        }
      }
      if (cells.length > 3 && Math.random() < 0.6) {
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

  fightChance(a, b, ia, ib) {
    const da = this.defs[a].aggression * (0.6 + 0.4 * this.health[ia]);
    const db = this.defs[b].aggression * (0.6 + 0.4 * this.health[ib]);
    return da / (da + db);
  }

  emitSpore(m, def) {
    const t = m.x + (Math.random() * 2 - 1) * def.sporeRange;
    const u = m.z + (Math.random() * 2 - 1) * def.sporeRange;
    const cc = Math.max(0, Math.min(GRID - 1, Math.floor(t + GRID / 2)));
    const rr = Math.max(0, Math.min(GRID - 1, Math.floor(u + GRID / 2)));
    const cell = rr * GRID + cc;
    return {
      sx: m.x, sy: 1.2 * m.scale + 0.5, sz: m.z,
      cx: cc - GRID / 2 + 0.5, cz: rr - GRID / 2 + 0.5,
      cell, si: m.si, t: 0,
      dur: 0.6 + Math.random() * 0.5,
      seed: Math.random() * 7,
    };
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
