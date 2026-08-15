import { SPECIES } from "./species.js";

export function initUI(handlers) {
  const els = {};
  for (const id of [
    "playBtn", "timeLabel", "speedChips", "rootsBtn", "randomBtn", "stormBtn",
    "clearBtn", "hotbar", "statsBox", "badge", "hint", "markerInfo",
  ]) {
    els[id] = document.getElementById(id);
  }

  els.hotbar.innerHTML = "";
  SPECIES.forEach((def, i) => {
    const b = document.createElement("button");
    b.className = "hot-slot";
    b.dataset.i = i;
    b.title = def.desc;
    b.innerHTML = `
      <span class="swatch" style="background:linear-gradient(145deg, #${def.color.toString(16).padStart(6, "0")}, #${def.mycColor.toString(16).padStart(6, "0")})"></span>
      <span class="name">${def.name}</span>
      <kbd>${i + 1}</kbd>`;
    b.addEventListener("click", () => handlers.onSelect(i));
    els.hotbar.appendChild(b);
  });

  els.playBtn.addEventListener("click", () => handlers.onPlayPause());

  const speeds = [0, 1, 2, 4, 8, 16, 32];
  const chips = speeds.map((s) => {
    const c = document.createElement("button");
    c.className = "chip";
    c.textContent = s === 0 ? "⏸" : `${s}×`;
    if (s === 0) c.classList.add("active");
    c.addEventListener("click", () => handlers.onSpeed(s));
    els.speedChips.appendChild(c);
    return c;
  });

  els.rootsBtn.addEventListener("click", () => handlers.onRoots());
  els.randomBtn.addEventListener("click", () => handlers.onRandom());
  els.stormBtn.addEventListener("click", () => handlers.onStorm());
  els.clearBtn.addEventListener("click", () => handlers.onClear());

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= SPECIES.length) handlers.onSelect(n - 1);
    if (e.key === " " || e.code === "Space") { e.preventDefault(); handlers.onPlayPause(); }
    if (e.key === "r" || e.key === "R") handlers.onRoots();
    if (e.key === "e" || e.key === "E") handlers.onRandom();
    if (e.key === "c" || e.key === "C") handlers.onClear();
  });

  return {
    setSelected(i) {
      els.hotbar.querySelectorAll(".hot-slot").forEach((b, k) => b.classList.toggle("selected", k === i));
    },
    setTransport(running, speed) {
      els.playBtn.textContent = running ? "⏸ Durdur" : "▶ Başlat";
      chips.forEach((c, k) => c.classList.toggle("active", speeds[k] === speed));
      if (running) {
        els.playBtn.classList.add("running");
      } else {
        els.playBtn.classList.remove("running");
      }
    },
    setTime(t) {
      const mm = String(Math.floor(t / 60)).padStart(2, "0");
      const ss = String(Math.floor(t % 60)).padStart(2, "0");
      els.timeLabel.textContent = `T+${mm}:${ss}`;
    },
    setStats(stats) {
      els.statsBox.innerHTML = stats.map((s) => {
        const def = SPECIES.find((d) => d.id === s.id);
        return `<div class="stat-row">
          <span class="stat-swatch" style="background:#${def.color.toString(16).padStart(6, "0")}"></span>
          <span class="stat-name">${def.name}</span>
          <span class="stat-num">${s.mushrooms}</span>
          <span class="stat-num dim">${s.mycelium}</span>
        </div>`;
      }).join("");
    },
    setBadge(text) {
      els.badge.textContent = text;
    },
    setMarkerInfo(text) {
      els.markerInfo.textContent = text;
    },
    setRoots(on) {
      els.rootsBtn.classList.toggle("active", on);
      els.rootsBtn.textContent = on ? "🌱 Yüzey" : "🕸️ Yer Altı";
    },
  };
}
