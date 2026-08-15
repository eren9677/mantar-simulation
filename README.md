# 🍄 Mantar Simülasyonu

Deneysel bir mantar ekosistemi simülasyonu. Metalin parlak grid üzerinde tıkladığın her noktada mantar yetişir; her türün farklı bir kök ağı (mycelium), büyüme stratejisi ve yayılma taktiği vardır.

## Özellikler

- **6 farklı mantar türü** — her birinin kendine özgü fiziği, rengi ve davranışı:
  - **Orman Şapkası** — dengeli, klasik spor yayılımı
  - **Slime Mantarı** — yapışkan zarla yayılır, saldırgan, titrek jel kütle
  - **Mercan Fungus** — yavaş ama dev dallanan yapı, rüzgarla çok uzak sporlar
  - **Işık Şapkası** — biyolüminesan, halo ışığı, sık spor üretir
  - **Parazit Ağı** — kök ağı yangın gibi yayılır, rakip kolonileri ele geçirir
  - **Dev Kubbe** — çok yavaş, kitlesel spor patlamaları
- **Kök ağı (mycelium) simülasyonu** — her türün yeraltı ağı ayrı renkte büyür; türler kök ağında **rekabet eder** (agresiflik + sağlık değerine göre)
- **İletişim sinyalleri** — olgun mantarların kök ağı üzerinden yayılan nabız sinyalleri (sadece kendi türünün bağlı ağında ilerler)
- **Spor mekaniği** — olgun mantarlar spor fırlatır, sporlar havada süzülüp yeni koloniler kurar
- **Zaman kontrolü** — duraklat, 1×–32× hıza sar
- **WebGPU 3D** — WebGPU desteklenmiyorsa otomatik WebGL2'ye düşer (three.js)
- **Yer altı görünümü** — kök ağlarını yüzeyin altından incele
- **Hotbar** — altta tür seçimi (klavye 1–6)

## Kullanım

```bash
npm install
npm run dev      # geliştirme
npm run build    # derleme (dist/)
npm run preview  # derlemeyi önizle
```

- **Sol tık**: seçili türü diker (3×3 kök ağı tohumlar)
- **Sağ tık**: mantarı söker (kök ağı kalır)
- **Boşluk**: başlat / duraklat · **R**: yer altı · **E**: rastgele ekosistem · **C**: temizle

## Teknik

- [three.js](https://threejs.org) r185 — `WebGPURenderer` (WebGL2 fallback)
- Grid 72×72 hücre, sabit adım (10 Hz) simülasyon, render tarafında görselleştirme
- Kök ağı: `InstancedMesh` (additive blending), sinyal yayılımı BFS ile
- Sporlar: `THREE.Points` partikül sistemi
