# 🍄 Mantar Simülasyonu

Deneysel bir mantar ekosistemi simülasyonu. Metalin parlak grid üzerinde tıkladığın her noktada mantar yetişir; her türün farklı bir kök ağı (mycelium), büyüme stratejisi ve yayılma taktiği vardır. Yayılma modelleri gerçek akademik literatüre dayanır — araştırma dokümanı: [`research/fungal-spread-models.md`](research/fungal-spread-models.md) (10 tür profili, pseudocode'lar, doğrulanmış kaynaklar).

## Özellikler

- **10 farklı mantar türü** — her birinin kendine özgü fiziği, rengi ve davranışı:
  - **Orman Şapkası** — dengeli; momentumlu DLA-tarzı dallanan kök ağı, balistik spor
  - **Slime Mantarı** — splash kernel ile sıçrar, saldırgan, titrek jel kütle
  - **Mercan Fungus** — Gauss rüzgâr kerneli + nadir fat-tail uzun menzil, dev dallanan yapı
  - **Işık Şapkası** — biyolüminesan, halo ışığı, sık sinyal yayımı
  - **Parazit Ağı** — sporlarını kendi kök ağı içinde "teleport" eder, rakipleri ele geçirir
  - **Dev Kubbe** — kitlesel spor patlamaları, rüzgâr taşımacılığı
  - **Physarum Ağı** — damar benzeri ağ (momentum + takviye), eşik budaması (Tero 2010 / Proverbio-Giordano)
  - **Mürekkep Mantarı** — peri halkası dalgası: biomass geri dönüşümüyle (Falconer 2005) halka cephesinde meyve verir
  - **Puf Topu** — uzun olgunlaşma, sonra tek seferde kitlesel spor bulutu ve ölüm
  - **Yer Yıldızı** — yıldız kolları açılan Geastrum, splash dağılımı
- **Kök ağı (mycelium) simülasyonu** — her türün yeraltı ağı ayrı renkte büyür; türler **Boddy rekabet matrisiyle** kavga eder (tür çifti savunma bonusları + sağlık)
- **İletişim sinyalleri** — olgun mantarların kök ağı üzerinden yayılan nabız sinyalleri (sadece kendi bağlı ağında ilerler)
- **Spor mekaniği** — önceden hesaplanmış kernel tabloları (balistik/splash/Gauss rüzgâr) + binary search örnekleme; sporlar havada süzülüp rüzgârla sürüklenir
- **Zaman kontrolü** — duraklat, 1×–32× hıza sar
- **WebGPU 3D** — WebGPU desteklenmiyorsa otomatik WebGL2'ye düşer (three.js)
- **Yer altı görünümü** — kök ağlarını yüzeyin altından incele (R)
- **Hotbar** — altta tür seçimi (klavye 1–0)

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
- **Orbit**: sürükle = döndür · tekerlek = yakınlaş · sağ-sürükle (veya kaydır) = kaydır

## Teknik

- [three.js](https://threejs.org) r185 — `WebGPURenderer` (WebGL2 fallback)
- Grid 72×72 hücre, sabit adım (10 Hz) simülasyon, render tarafında görselleştirme
- Kök ağı: `InstancedMesh` (additive blending), sinyal yayılımı BFS ile
- Sporlar: `THREE.Points` partikül sistemi + önceden hesaplanmış kernel tabloları
- Yayılma modelleri: DLA momentum, Physarum ağ takviyesi + eşik budaması, peri halkası biomass geri dönüşümü, kernel tabanlı spor dağılımı, Boddy rekabet matrisi — kaynaklar: [`research/fungal-spread-models.md`](research/fungal-spread-models.md)
