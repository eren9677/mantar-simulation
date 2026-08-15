# Mantar Ekosistemi Simülasyonu — Fungal Büyüme ve Yayılma Modelleri

**Araştırma dokümanı** · Tarih: 2026-08-15
**Kapsam:** WebGL/WebGPU three.js tabanlı, 72×72 grid üzerinde çalışan gerçek zamanlı mantar ekosistemi simülasyonu için bilimsel literatür taraması.
**Kaynak politikası:** Bu dokümündeki her bağlantı araştırma sırasında gerçekten çekilip doğrulanmıştır (PubMed/PMC via NCBI E-utilities, arXiv API, Semantic Scholar API, journal sayfaları, Wikipedia). Uydurma referans yoktur. Bir kaynak doğrulanamadıysa listeden çıkarılmıştır.

---

## 1. On Gerçek Mantar Türü / Slime Mold Profili

Her profilde: **bilimsel ad**, **yaşam/gelişim şekli**, **yayılma mekanizması**, **en iyi karşılık gelen hesaplamalı algoritma**, **ilginç bilgiler**.

### 1.1 Physarum polycephalum (Ağsı cıvık mantar / slime mold)
- **Bilimsel ad:** *Physarum polycephalum* (Myxogastria / Amoebozoa) — gerçek mantar değildir, myxomycete'dir.
- **Gelişim şekli:** Plasmodium evresi; parlak sarı, çok çekirdekli (koenositik) tek dev hücre; içi iç içe geçmiş tüp ağı. Sitoplazma "shuttle streaming" ile ~1 mm/s hızla tüplerde gidip gelir (periyot ~100 sn). Açlıkta koyu kütle (sklerotium) veya çok başlı sporangium oluşturur ("polycephalum" = çok başlı).
- **Yayılma:** Sporangiumlardan rüzgârla spor; vejetatif olarak ağ büyümesi.
- **En iyi algoritma:** Tero adaptif taşıma ağı algoritması (Bölüm 3.3).
- **İlginç:** Labirentte en kısa yolu bulur (Nakagaki 2000); Tokyo metrosuna benzer verimli ağ kurar (Tero 2010). Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Physarum_polycephalum)

### 1.2 Coprinus comatus (Şakuli kısa gövde / ink cap)
- **Bilimsel ad:** *Coprinus comatus* (Agaricaceae, Basidiomycota).
- **Gelişim şekli:** Çayır ve yol kenarlarında saprotrof; silindirik, pullu, çan şeklinde şapka. "Deliquescence": olgun şapka saatler içinde siyah, spor dolu mürekkep sıvısına erir.
- **Yayılma:** Erime sıvısıyla sporlar; ayrıca nematod avlar (nematophagous; *Panagrellus redivivus*, *Meloidogyne arenaria* öldürür).
- **En iyi algoritma:** Peri halkası / reaksiyon-difüzyon kenar dalgası + hızlı "fruiting" tetikleyicisi (Bölüm 3.4).
- **İlginç:** Şapka 4-8 cm genişlik, 20 cm'ye kadar boy; toplanınca birkaç saat içinde kararıp erir, bu yüzden taze tüketilir. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Coprinus_comatus)

### 1.3 Calvatia gigantea (Dev kabak mantarı / puffball)
- **Bilimsel ad:** *Calvatia gigantea* (Agaricaceae; eski gasteromycetes grubu).
- **Gelişim şekli:** Küresel, sapsız fruiting body; tüm sporlar gövdenin *içinde* oluşur; gövde 80 cm çapa ve 23+ kg'a ulaşabilir.
- **Yayılma:** Trilyonlarca spor (3-6 µm); gövde deşildiğinde / yağmur damlası çarptığında sporlar rüzgâra bırakılır — klasik "puffing" mekanizması.
- **En iyi algoritma:** Balistik + rüzgâr (Gauss) spor dağılım çekirdeği, ani tek seferlik salınım (Bölüm 3.5).
- **İlginç:** Lindley hesabına göre 7 kentilyon spora ulaşabilir; geleneksel olarak kan durdurucu (styptic) pansuman olarak kullanılmıştır. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Calvatia_gigantea)

### 1.4 Geastrum (Yıldız mantarı / earthstar)
- **Bilimsel ad:** *Geastrum* spp. (Geastraceae, Geastrales) — ~50-120 tür.
- **Gelişim şekli:** Olgunlukta dış peridium segmentlere ayrılıp yıldız şeklinde açılır; içte spor kesesi (spore sac) yükselir. Bazı türlerde peridium nemde açılıp kuruda kapanır (hygroscopic hareket).
- **Yayılma:** Spor kesesine yağmur damlası düştüğünde sporlar "puff" ile atılır; birkaç tür böcekle yayılır (ör. *Geastrum entomophilum*).
- **En iyi algoritma:** Çevresel tetikleme (yağmur olayı) + kısa menzilli balistik salınım (Bölüm 3.5).
- **İlginç:** Adı "toprak yıldızı" anlamına gelir; kalsiyum oksalat kristalleri ve fenoloksidaz testleriyle türler ayırt edilir. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Geastrum)

### 1.5 Morchella (Kuzugöbeği / morel)
- **Bilimsel ad:** *Morchella* spp. (Morchellaceae, Ascomycota) — ~70+ tür.
- **Gelişim şekli:** Bal peteği görünümlü kapaklı asklı mantar; ilkbaharda; ağaçlarla endofitik/simbiyotik ya da saprotrof. Bazı türler pirofildir (yanmış ormanlarda bol çıkar; odun külü alkalinitesi fruitingi tetikler).
- **Yayılma:** Hava yoluyla spor (askosporlar); toplayıcıların file torbaları da spor dağıtır.
- **En iyi algoritma:** Çevresel tetikleyici (yangın/kül) gated fruiting + reaksiyon-difüzyon koloni büyümesi (Bölüm 3.4).
- **İlginç:** Akdeniz kökenli olduğu öne sürülür; kültüre alınması çok zordur (2021'de ancak iç mekânda başarıldı). Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Morchella)

### 1.6 Pleurotus ostreatus (İstiridye mantarı)
- **Bilimsel ad:** *Pleurotus ostreatus* (Pleurotaceae, Basidiomycota).
- **Gelişim şekli:** Yaprak döken ağaçlarda saprotrof beyaz çürüklük mantarı (primary decomposer); fan biçimli şapka; kültüre alınmış (WWI Almanya'sından beri).
- **Yayılma:** Basidiosporlar; miselyum nematodları öldürüp sindirerek azot sağlar (≥700 bilinen nematophagous mantardan biri).
- **En iyi algoritma:** Yoğun dallanan (dense-branching) fraktal büyüme — DLA varyantı (Bölüm 3.2).
- **İlginç:** Miselyumu dizel ile kirlenmiş toprağı ~%95 detoksifiye edebilir (mycoremediation). Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Pleurotus_ostreatus)

### 1.7 Ganoderma lucidum (Reishi)
- **Bilimsel ad:** *Ganoderma lucidum* (Ganodermataceae, Polyporales).
- **Gelişim şekli:** Çok yıllık, odunsu raf (bracket) mantarı; lakkate (cila görünümlü) kutikula, konsantrik büyüme zonları; sert, mantar gibi.
- **Yayılma:** Çift cidarlı basidiosporlar (8-12 µm) tüplerden salınır; uzun mesafe rüzgâr taşınımı (ör. *G. boninense* palm plantasyonlarında geniş alana yayılır).
- **En iyi algoritma:** Rekabetçi/dışlayıcı bölge tutma + yavaş, yoğun miselyal genişleme (Bölüm 3.6); fraktal büyüme analizi *Ganoderma*'da doğrudan yapılmıştır.
- **İlginç:** Geleneksel tıpta binlerce yıldır kullanılır; ticari ürünlerin %93'ünün DNA testinde *G. lucidum* değil *G. sichuanense* çıktığı gösterilmiştir. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Ganoderma_lucidum)

### 1.8 Tuber (Trüf)
- **Bilimsel ad:** *Tuber* spp. (Tuberaceae, Ascomycota) — cins Jura sonu (~156 Mya) tarihlendirilir.
- **Gelişim şekli:** Toprak *altında* (hypogeous) fruiting body; ağaçlarla zorunlu ektomikorizal.
- **Yayılma:** Koku yayan meyve gövdesi hayvanları çeker; hayvanlar (wallaby, kemirgen vb.) tüketip dışkıyla spor saçar (zoochory). Danks 2020 modeli tam bunu modeller.
- **En iyi algoritma:** Hayvan ajanlı (agent-based) spor taşınımı + mikorizal ortaklık ağı (Bölüm 3.5/3.6).
- **İlginç:** *T. magnatum* (beyaz trüf) dünyanın en pahalı gıdalarındandır; kültüre alınması yıllar alır. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Tuber_%28fungus%29)

### 1.9 Ophiocordyceps unilateralis (Zombi karınca mantarı)
- **Bilimsel ad:** *Ophiocordyceps unilateralis* (Ophiocordycipitaceae, Ascomycota) — tür kompleksi (sensu lato).
- **Gelişim şekli:** Camponotini karıncalarını enfekte eden entomopatojen; 4-10 günde konakçı davranışını değiştirir; karınca yaprak damarına "death grip" ile kilitlenir (~25 cm yükseklik, %94-95 nem), sonra kafasından fruiting body çıkar.
- **Yayılma:** Sporlar fruiting body'den havaya salınır; sporlar ince cidarlı ve kısa ömürlüdür, bu yüzden konakçı leşi güçlendirilir; "graveyard" alanlarında yoğunlaşma.
- **En iyi algoritma:** Ajan tabanlı konakçı bulma + enfeksiyon-kaynak (SIR tipi) yayılım modeli; balistik spor fırlatma için de Ruiter 2019 modeli.
- **İlginç:** *The Last of Us* serisinin ilham kaynağıdır; 48 milyon yıllık fosilde "death grip" izleri bulunmuştur. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Ophiocordyceps_unilateralis)

### 1.10 Phallus impudicus (Köpek mantarı / stinkhorn)
- **Bilimsel ad:** *Phallus impudicus* (Phallaceae, Phallales).
- **Gelişim şekli:** Saprotrof; "cadı yumurtası" (volva) evresinden 1-2 günde 10-30 cm'ye büyür; ölçülen büyüme hızı **10-15 cm/saat** (asimfaltı delebilecek 1.33 kPa basınç).
- **Yayılma:** Şapkanın üzerindeki yapışkan gleba leş kokusu (methanethiol, H₂S, dimethyl trisulfide) ile sinekleri çeker; sinekler bacaklarına ve dışkı damlalarıyla spor taşır.
- **En iyi algoritma:** Koku gradyanına dayalı hayvan vektör yayılımı (chemotaxis + random walk) (Bölüm 3.5).
- **İlginç:** Gleba sporları sindirimi hızlandırır (laksatif), böylece sporlar fruiting body yakınına bırakılır — sık kümeleşme deseni üretir. Kaynak: [Wikipedia](https://en.wikipedia.org/wiki/Phallus_impudicus)

---

## 2. Algoritmalar

### 2.1 Miselyal Ağ Büyüme Modelleri (lattice / agent-based)

**Modelleyen makaleler:**
- **Falconer, Bown, White & Crawford (2005)** — "Biomass recycling and the origin of phenotype in fungal mycelia", *Proc R Soc B* 272(1573):1727-34. Biomass geri dönüşümünün koloni fenotipini (halka görünümü dahil) nasıl ürettiğini gösterir: yaşlı miselyum çözülüp büyüyen cepheye besin olarak taşınır. [PMC1559848](https://pmc.ncbi.nlm.nih.gov/articles/PMC1559848/) · [PubMed 16087429](https://pubmed.ncbi.nlm.nih.gov/16087429/)
- **Davidson, Boswell, Fischer, Heaton, Hofstadler & Roper (2011)** — "Mathematical modelling of fungal growth and function", *IMA Fungus* 2(1):33-7. Hif ucu / lattice / ajan modellerinin kapsamlı özeti; Roper'ın spor ve hif mekaniği çalışmaları. [PMC3317364](https://pmc.ncbi.nlm.nih.gov/articles/PMC3317364/) · [PubMed 22679586](https://pubmed.ncbi.nlm.nih.gov/22679586/)
- **Kuwata (2024)** — "A generalised spatial branching process with ancestral branching to model the growth of a filamentous fungus", arXiv:2409.13627. Her ipliğin tip pozisyonu SDE ile, dallanma ve ölüm oranları diğer tiplerin konumlarına bağlı. [arXiv](https://arxiv.org/abs/2409.13627)
- **Wood, Tordoff, Jones & Boddy (2006)** — "Reorganization of mycelial networks of *Phanerochaete velutina* in response to new woody resources", *Mycol Res* 110(8):985-93. Yeni kaynak bulunca ağın yeniden yapılanması. [PubMed 16891104](https://pubmed.ncbi.nlm.nih.gov/16891104/)

**Pseudocode (agent-based tip modeli, lattice üstünde):**

```text
// Grid NxN. Arrays: biomass[][], nutrient[][]
// tips: array of {x, y, age}
init: one tip at colony center

per frame:
  for each tip:
    growth = min(nutrient[x,y], uptakeRate)
    biomass[x,y] += growth; nutrient[x,y] -= growth
    if rand() < pBranch * nutrient[x,y]/maxNutrient:
        spawn 2 tips perpendicular to travel direction
    dir = weightedChoice(8-neighbors,
          w = chemotaxisGradient(x,y) + noise*0.3)
    move tip; age++
    if rand() < pDie or nutrient exhausted: remove tip
    if target cell has biomass of same colony and rand() < pFuse:
        remove tip, count as anastomosis   // ağ birleşmesi

  // Biomass recycling (Falconer 2005): eski kütle yeni cepheye taşınır
  for sampled cells:
    released = recycleRate * biomass[x,y]
    biomass[x,y] -= released
    nutrient[x + inwardVector(x,y)] += released * efficiency
```

### 2.2 Diffussion-Limited Aggregation (DLA) — fungal dallanma

**Modelleyen makaleler:**
- **Witten & Sander (1981)** — "Diffusion-limited aggregation, a kinetic critical phenomenon", *Phys Rev Lett* 47(19):1400. DLA'nın orijinal tanımı; fraktal kümeler üretir (D ≈ 1.71). DOI ile doğrulandı: [doi.org/10.1103/PhysRevLett.47.1400](https://doi.org/10.1103/PhysRevLett.47.1400)
- **Papagianni (2006)** — "Quantification of the fractal nature of mycelial aggregation in *Aspergillus niger*", *Microb Cell Fact* 5:5. Miselyal agregasyonun fraktal (yoğunluk bağımlı) morfolojisi; DLA-benzeri yoğun dallanma için destek. [PMC1382250](https://pmc.ncbi.nlm.nih.gov/articles/PMC1382250/) · [PubMed 16472407](https://pubmed.ncbi.nlm.nih.gov/16472407/)
- **Ravi, Tan, Kamali & Muniandy (2025)** — "Elucidation of Foraging Strategies of *Ganoderma lucidum* ... Using Fractal Morphology", *Curr Microbiol* 82:229. Fraktal morfoloji ile besin arama stratejileri. [PubMed 40178632](https://pubmed.ncbi.nlm.nih.gov/40178632/)

**Pseudocode:**

```text
// occupancy: boolean grid; cluster cells; seed at center
// walkers: fixed pool, released on boundary annulus radius R
init: occupy seed

per frame:
  release W walkers at random positions on circle radius R
  for each walker:
    for step in 1..maxSteps:
      move to random 8-neighbor (optionally biased toward nutrient)
      if any occupied neighbor:
          if rand() < pStick: occupy walker cell; push radius R
          break                    // else keep walking
      if walker escaped grid: recycle
  // R güncellemesi tembel yapılır (her N frame, max distance scan)
```

### 2.3 Physarum Adaptif Taşıma Ağı (Tero et al. 2010)

**Modelleyen makaleler:**
- **Tero, Takagi, Saigusa, Ito, Bebber, Fricker, Yumiki, Kobayashi & Nakagaki (2010)** — "Rules for biologically inspired adaptive network design", *Science* 327(5964):439-42. Kanonik model: tüp iletkenliği akıyla artar, sabit bozunur. [PubMed 20093467](https://pubmed.ncbi.nlm.nih.gov/20093467/) · DOI: 10.1126/science.1177894
- **Tero, Yumiki, Kobayashi, Saigusa & Nakagaki (2008)** — "Flow-network adaptation in *Physarum* amoebae", *Theory Biosci* 127(2):89-94. Ağ uyumunun erken formülasyonu. [PubMed 18415133](https://pubmed.ncbi.nlm.nih.gov/18415133/)
- **Bonifaci (2016/2017)** — "A revised model of fluid transport optimization in *Physarum polycephalum*", *J Math Biol* 74(3):567-581; arXiv:1606.04225. Akış yerine basınç gradyanı kontrol değişkeni; global optimizasyon garantisi genişletildi. [arXiv](https://arxiv.org/abs/1606.04225)
- **Proverbio & Giordano (2025)** — "Threshold sensing yields optimal path formation in *Physarum polycephalum*", arXiv:2507.12347. Eşik algılama: yeterince akı taşıyan tüpler korunur, diğerleri budanır → tek ve optimal yol. [arXiv](https://arxiv.org/abs/2507.12347)
- **Jones (2015)** — "Automated Guidance of Collective Movement in a Multi-Agent Model of *Physarum polycephalum*", arXiv:1511.07654. Grid üzerinde çalışan çok ajanlı (agent-based) Physarum varyantı; yüzlerce ajan kemotaksi alanında hareket edip koku bırakır. [arXiv](https://arxiv.org/abs/1511.07654)
- **Awad, Pang, Lusseau & Coghill (2021)** — "A Survey on *Physarum polycephalum* Intelligent Foraging Behaviour and Bio-Inspired Applications", arXiv:2103.00172. Biyolojik modeller + yarışmalı Physarum modeli (competition). [arXiv](https://arxiv.org/abs/2103.00172)

**Pseudocode (Tero 2010, çizge üzerinde):**

```text
// Graph: nodes (food sources + lattice junctions), edges between neighbors
// Edge state: D_ij (conductivity), L_ij = 1 (unit length)
loop until converged:
  // 1) Pressure solve (Poiseuille):
  //    Q_ij = D_ij * (p_i - p_j) / L_ij
  //    mass conservation: sum_j Q_ij = S_i  (S_i: food sink/source)
  //    solve linear system with Gauss-Seidel until residual < eps
  // 2) Conductivity update:
  //    dD_ij/dt = alpha * |Q_ij|^mu - beta * D_ij
  //    D_ij = clamp(D_ij + dt*(alpha*pow(|Q|,mu) - beta*D), D_min, D_max)
  // 3) Prune: if |Q_ij| < threshold for long time, set D -> D_min
  //          (Proverbio & Giordano: threshold sensing)
```

**Grid uyarlaması (Jones tarzı, 72x72 için pratik):**

```text
// fields: chemotaxis[][], vein[][]; agents: list of {x,y}
per frame:
  for each agent:
    pick best 8-neighbor by chemotaxis + noise; move there
    vein[cell] = min(vein[cell] + deposit, cap)
  for each cell (double-buffered):
    chemotaxis' = chemotaxis + dt*(diffuse3x3(chemotaxis) + agentSource)
    chemotaxis' *= evapRate
  // food sources attract: add source term at food positions
```

### 2.4 Reaksiyon-Difüzyon / Koloni Genişlemesi ve Peri Halkası (Fairy Ring)

**Modelleyen makaleler:**
- **Stevenson & Thompson (1976)** — "Fairy ring kinetics", *J Theor Biol* 58(1):143-63. Peri halkasının ilk matematiksel modeli: halka yarıçapı zamana karşı doğrusal büyür; iç ölüm + dış büyüme dengesi. [PubMed 957678](https://pubmed.ncbi.nlm.nih.gov/957678/) · DOI: 10.1016/0022-5193(76)90144-2
- **Karst, Dralle & Thompson (2016)** — "Spiral and Rotor Patterns Produced by Fairy Ring Fungi", *PLoS One* 11(3):e0149254. Reaksiyon-difüzyon bazlı desen modeli; peri halkası mantarlarının halka, spiral ve rotor desenleri ürettiği gösterilir. [PMC4774996](https://pmc.ncbi.nlm.nih.gov/articles/PMC4774996/) · [PubMed 26934477](https://pubmed.ncbi.nlm.nih.gov/26934477/)
- **Salvatori et al. (2023)** — "Process based modelling of plants-fungus interactions explains fairy ring types and dynamics", *Sci Rep* 13:19918. Bitki-mantar etkileşimli PDE modeli; halka tipleri ve dinamiği. [PMC10646123](https://pmc.ncbi.nlm.nih.gov/articles/PMC10646123/) · [PubMed 37963907](https://pubmed.ncbi.nlm.nih.gov/37963907/)
- **Li et al. (2022)** — "Assessing soil microbes that drive fairy ring patterns in temperate semiarid grasslands", *BMC Ecol Evol* 22:130. [PMC9636817](https://pmc.ncbi.nlm.nih.gov/articles/PMC9636817/)
- **Zotti et al. (2026)** — "The fellowship of the ring: species-associated effects of fairy ring fungi on soil, microbiota, and vegetation", *ISME Commun* 6:ycag177. [PMC13356810](https://pmc.ncbi.nlm.nih.gov/articles/PMC13356810/)

**Pseudocode (Gray-Scott reaksiyon-difüzyon):**

```text
// A: besin benzeri madde, B: mantar biyokütle yoğunluğu
// double-buffered arrays; lap() = 3x3 precomputed stencil
per cell:
  A' = A + dt*(DA*lap(A) - A*B*B + f*(1 - A))
  B' = B + dt*(DB*lap(B) + A*B*B - (k + f)*B)
swap buffers

// Peri halkası = yayılan trigger dalgası:
//   B yüksekliği önde besini tüketir, arkada tükenmiş zona girer
// Fruiting koşulu:
//   if B[x,y] > threshold and ageSinceWave > fruitingDelay:
//       spawn fruit body at cell; reset local B
```

Not: Gerçek peri halkası kinetiği (Stevenson-Thompson) bu dalganın doğrusal hızda yayılmasıyla örtüşür; Karst 2016 halka yerine spiral/rotor da üretilebileceğini gösterir (oyun için güzel varyasyon).

### 2.5 Spor Dağılım Çekirdekleri (dispersal kernels)

**Modelleyen makaleler:**
- **Wang et al. (2021)** — "A general trait-based modelling framework for revealing patterns of airborne fungal dispersal threats", *New Phytol* 232(3):1506-18. Hava taşınımlı spor dağılımı için özellik tabanlı çerçeve (kernel parametreleri türe bağlı). [PubMed 34338336](https://pubmed.ncbi.nlm.nih.gov/34338336/) · DOI: 10.1111/nph.17659
- **Meyer et al. (2017)** — "Quantifying airborne dispersal routes of pathogens over continents", *Nat Plants* 3(10):780-86. Kıtalar arası uzun mesafe taşınım. [PubMed 28947769](https://pubmed.ncbi.nlm.nih.gov/28947769/)
- **de Ruiter et al. (2019)** — "Fungal artillery of zombie flies: infectious spore dispersal using a soft water cannon", *J R Soc Interface* 16(159):20190448. Entomophthora'nın basınçla spor fırlatması (balistik). [PMC6833328](https://pmc.ncbi.nlm.nih.gov/articles/PMC6833328/) · [PubMed 31662074](https://pubmed.ncbi.nlm.nih.gov/31662074/)
- **Liu et al. (2017)** — "Asymmetric drop coalescence launches fungal ballistospores with directionality", *J R Soc Interface* 14(132):20170083. Ballistos por fırlatma mekaniği. [PMC5550963](https://pmc.ncbi.nlm.nih.gov/articles/PMC5550963/)
- **Vidal et al. (2017)** — "Cultivar architecture modulates spore dispersal by rain splash", *PLoS One* 12(11):e0187788. Yağmur sıçraması (splash) kernel modeli. [PMC5687742](https://pmc.ncbi.nlm.nih.gov/articles/PMC5687742/) · [PubMed 29140990](https://pubmed.ncbi.nlm.nih.gov/29140990/)
- **Vidal et al. (2018)** — "Contrasting plant height ... modelling splash dispersal in 3-D canopies", *Ann Bot* 121(7):1299-1308. 3B gölgelikte sıçrama modeli. [PMC6007607](https://pmc.ncbi.nlm.nih.gov/articles/PMC6007607/)
- **Penet et al. (2014)** — "Direct splash dispersal prevails ... during rains in *Colletotrichum gloeosporioides*", *PLoS One* 9(12):e115757. [PMC4274098](https://pmc.ncbi.nlm.nih.gov/articles/PMC4274098/)
- **Hassett, Fischer & Money (2015)** — "Short-range splash discharge of peridioles in *Nidularia*", *Fungal Biol* 119(6):471-5. **Kuş yuvası mantarları**: yağmur damlası peridiyolleri (spor paketleri) kısa menzile (cm-dm) fırlatır. [PubMed 25986543](https://pubmed.ncbi.nlm.nih.gov/25986543/) · DOI: 10.1016/j.funbio.2015.01.003
- **Danks et al. (2020)** — "Modeling mycorrhizal fungi dispersal by the mycophagous swamp wallaby", *Ecol Evol* 10(23):12920-28. Hayvan vektörlü (zoochory) dağılım modeli — trüf için birebir. [PMC7713961](https://pmc.ncbi.nlm.nih.gov/articles/PMC7713961/)

**Pseudocode (kernel tablosu yaklaşımı):**

```text
// Precompute discrete kernel tables once (e.g. 21x21) per dispersal type:
//   ballistic: uniform disk radius R, gravity bias (downward offset)
//   splash:    p(d) ~ exp(-d/L) in a downwind fan; exponent L ~ few cells
//   wind:      Gaussian with mean (vx,vy)*T, sigma = sqrt(2*D*T)
//   fat-tail:  rare long-distance jumps: p(x) ~ x^-alpha (Pareto), xmin large

sample(weights):  // O(log n) via prefix-sum + binary search (or alias table)
  u = rand(); return offsetAt(binarySearch(prefixSums, u))

per spore event:
  off = sample(kernelOf(species, weather))
  cell(x+off.x, y+off.y) += spores

// Bird's nest fungi (Nidularia / Cyathus): rain event -> 5-20 peridioles
//   launched ballistically 10-100 cm; each peridiole = spore bundle
// Zoochory (Tuber): agent eats fruit body, walks k steps (random walk),
//   defecates: spore burst at arrival cell with dispersal radius 1-2
```

### 2.6 Rekabet / Karşılıklı Dışlama (inter-species exclusion)

**Modelleyen makaleler:**
- **Boddy (2000)** — "Interspecific combative interactions between wood-decaying basidiomycetes", *FEMS Microbiol Ecol* 31(3):185-94. Türler arası kombat mekanizmaları: deadlock (kilitlenme), replacement (ele geçirme), inhibitör salgılama, antennal/kanal teması; kombat hiyerarşisi. [PubMed 10719199](https://pubmed.ncbi.nlm.nih.gov/10719199/) · DOI: 10.1111/j.1574-6941.2000.tb00683.x
- **Falconer et al. (2005)** — biomass geri dönüşüm fenotipi (koloni şekli rekabette avantaj sağlar). [PMC1559848](https://pmc.ncbi.nlm.nih.gov/articles/PMC1559848/)
- **Awad et al. (2021)** — Physarum yarışma modeli (iki Physarum ağı çarpışınca ne olur). [arXiv](https://arxiv.org/abs/2103.00172)
- **Zotti et al. (2026) / Li et al. (2022)** — peri halkası mantarlarının toprak mikrobiyotasını ve bitkileri tür-bağımlı etkilemesi (kimyasal dışlama zonları). [PMC13356810](https://pmc.ncbi.nlm.nih.gov/articles/PMC13356810/) · [PMC9636817](https://pmc.ncbi.nlm.nih.gov/articles/PMC9636817/)

**Pseudocode (bölge + inhibitör tabanlı):**

```text
// per species: owner[N][N] (id), biomass[N][N], inhibitor[N][N]
per frame:
  // 1) Growth only into own or contested cells (as in 2.1)
  // 2) Encounter: A tip enters cell owned by B:
  //    combatScore = defenseOf(A) - defenseOf(B) + rand()
  //    if combatScore > threshold: capture cell (replacement)
  //    else: deadlock (B keeps cell, A tip dies)
  // 3) Inhibitor emission: each species secretes into 3x3 neighborhood
  //    inhibitorS[s] field diffuses + decays slowly
  // 4) Exclusion rule:
  //    growth into cell c of species B by A blocked if
  //    sum(inhibitorS of A's antagonists at c) > blockThreshold
  // 5) Optional: dead mycelium stays as "deadlock zone" for a while
  //    (Boddy 2000: deadlock outcomes are common and can persist)
```

---

## 3. Implementasyon Önerileri (72×72 grid, gerçek zamanlı JS)

Genel: hücre başına nesne üretmeyin — `Uint8Array`/`Float32Array` + çift tampon (double buffer) kullanın; kare başına tüm hücreleri değil rastgele örneklenmiş alt kümeyi güncelleyin (asynchronous update, her hücre ortalama her N frame bir güncellenir).

### 3.1 Miselyal büyüme (2.1)
- Tip'leri (uçları) ayrı bir küçük dizide tutun (hücre başına tip yok); her frame uç başına O(1) iş. 72×72'de birkaç yüz tip yeterli görüntü verir.
- Komşu ağırlıklarını önceden hesaplanmış 8 yönlü ofset tablosundan okuyun; her adımda rastgele yön seçimi tek `rand()` + kümülatif tablo.
- Nutrient alanını seyrek güncelleyin: her frame hücrelerin %10-20'si (rastgele) — difüzyon yerine tek seferlik 3x3 stencil; biomass geri dönüşümü sadece aktif zon sınırındaki hücrelerde hesaplayın.

### 3.2 DLA (2.2)
- Walker havuzu sabit (100-300 walker); `maxSteps` (~100) aşan walker'ları geri dönüştürün — sonsuz döngü olmaz.
- Yapışma testini sadece walker'ın 8 komşusunu okuyarak yapın (bütün grid taraması yok).
- Radius R'yi her N frame bir "max manhattan distance" taramasıyla güncelleyin; halka üretimi yerine köşe ofsetleriyle yeni walker konumları üretin (sin/cos yerine önceden hesaplanmış tablo).

### 3.3 Physarum (2.3)
- Grid varyantı (Jones multi-agent) çizge çözümünden çok daha ucuzdur: ajan sayısı ~200-500, her ajan 3x3'te en iyi komşuyu arar; difüzyonu ayrılabilir iki 1D geçişle (separable blur) yapın — 9 çarpma yerine 6.
- Evaporasyon ve difüzyonu tek `vein *= evap` + `addSource` olarak birleştirin; tam Tero (basınç çözümü) yalnızca az sayıda besin kaynağı (5-15 düğüm) olduğunda Gauss-Seidel ile uygulanabilir.
- Eşik budaması (Proverbio-Giordano) ucuzdur: düşük akılı hücreleri periyodik olarak sıfırlayın — "akıllı" görünen optimal ağlar üretir.

### 3.4 Reaksiyon-difüzyon / peri halkası (2.4)
- Gray-Scott stencil'ını (w0..w8) sabit katsayılı, tam sayı ağırlıklı yazın; `Float32Array` ×2 tampon, hücre başına ~20 float işlemi — 72×72 = 5184 hücre, 60 fps'te rahatça çalışır.
- Hücrelerin yarısını her frame güncelleyin (checkerboard update) — maliyet yarıya iner, desen bozulmaz.
- Fruiting testini dalga cephesinde yapın: `B > eşik` VE hücrenin "yaşı" yeterli — halka boyunca periyodik meyve gövdeleri elde edersiniz; eşik haritasını (threshold map) önceden hesaplayın.

### 3.5 Spor dağılımı (2.5)
- Kernel'leri **önceden hesaplanmış tamsayı tablolar** olarak tutun (ör. 21×21 `Int8Array` + prefix-sum); örnekleme `binarySearch` ile O(log n). Rüzgâr yönü değişince tabloyu 90°/180° döndürerek yeniden kullanın (sin/cos yok).
- Balistik sporları tek tek değil "spore paketi" olarak atın (1 olay = 5-50 spor → hücreye toplu ekleme); uzun mesafe (fat-tail) olaylarını %1-2 olasılıkla ayrı havuzdan örnekleyin.
- Yağmur olayları nadirdir: olay başına bir kez splash kernel uygulayın; kuş yuvası mantarı için peridiyol fırlatmasını 3-5 balistik ofset olarak hardcode edin.

### 3.6 Rekabet (2.6)
- Tür başına tek `owner Uint8Array` + `biomass Float32Array`; çarpışma testini yalnızca tip'in hedef hücresinde yapın (O(1)).
- Tür çifti savunma matrisini (8×8 sabit tablo) önceden hesaplayın; `Math.random()` karşılaştırmasıyla sonuç.
- Inhibitör alanını tek ortak "contested" maskesiyle yaklaşıklaştırın (tür başına ayrı difüzyon yerine) — iki tür sınırında "no man's land" zonu görselleştirmek için yeterli.

---

## 4. Kaynakça (doğrulanmış bağlantılar)

### Miselyal büyüme / ağ
- Falconer et al. 2005, *Proc R Soc B* — [PMC1559848](https://pmc.ncbi.nlm.nih.gov/articles/PMC1559848/) · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16087429/)
- Davidson et al. 2011, *IMA Fungus* — [PMC3317364](https://pmc.ncbi.nlm.nih.gov/articles/PMC3317364/) · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22679586/)
- Kuwata 2024 — [arXiv:2409.13627](https://arxiv.org/abs/2409.13627)
- Wood et al. 2006, *Mycol Res* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/16891104/)
- Bretherton et al. 2006, *FEMS Microbiol Ecol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/16958906/)

### DLA ve fraktal morfoloji
- Witten & Sander 1981, *Phys Rev Lett* — [doi.org/10.1103/PhysRevLett.47.1400](https://doi.org/10.1103/PhysRevLett.47.1400) (Semantic Scholar API ile doğrulandı)
- Papagianni 2006, *Microb Cell Fact* — [PMC1382250](https://pmc.ncbi.nlm.nih.gov/articles/PMC1382250/)
- Ravi et al. 2025, *Curr Microbiol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/40178632/)

### Physarum
- Tero et al. 2010, *Science* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/20093467/)
- Tero et al. 2008, *Theory Biosci* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/18415133/)
- Bonifaci 2017, *J Math Biol* — [arXiv:1606.04225](https://arxiv.org/abs/1606.04225)
- Proverbio & Giordano 2025 — [arXiv:2507.12347](https://arxiv.org/abs/2507.12347)
- Jones 2015 — [arXiv:1511.07654](https://arxiv.org/abs/1511.07654)
- Awad et al. 2021 (survey + competition) — [arXiv:2103.00172](https://arxiv.org/abs/2103.00172)

### Peri halkası / reaksiyon-difüzyon
- Stevenson & Thompson 1976, *J Theor Biol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/957678/)
- Karst et al. 2016, *PLoS One* — [PMC4774996](https://pmc.ncbi.nlm.nih.gov/articles/PMC4774996/)
- Salvatori et al. 2023, *Sci Rep* — [PMC10646123](https://pmc.ncbi.nlm.nih.gov/articles/PMC10646123/)
- Li et al. 2022, *BMC Ecol Evol* — [PMC9636817](https://pmc.ncbi.nlm.nih.gov/articles/PMC9636817/)
- Zotti et al. 2026, *ISME Commun* — [PMC13356810](https://pmc.ncbi.nlm.nih.gov/articles/PMC13356810/)

### Spor dağılımı
- Wang et al. 2021, *New Phytol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/34338336/)
- Meyer et al. 2017, *Nat Plants* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/28947769/)
- de Ruiter et al. 2019, *J R Soc Interface* — [PMC6833328](https://pmc.ncbi.nlm.nih.gov/articles/PMC6833328/)
- Liu et al. 2017, *J R Soc Interface* — [PMC5550963](https://pmc.ncbi.nlm.nih.gov/articles/PMC5550963/)
- Vidal et al. 2017, *PLoS One* — [PMC5687742](https://pmc.ncbi.nlm.nih.gov/articles/PMC5687742/)
- Vidal et al. 2018, *Ann Bot* — [PMC6007607](https://pmc.ncbi.nlm.nih.gov/articles/PMC6007607/)
- Penet et al. 2014, *PLoS One* — [PMC4274098](https://pmc.ncbi.nlm.nih.gov/articles/PMC4274098/)
- Hassett et al. 2015, *Fungal Biol* (kuş yuvası mantarı) — [PubMed](https://pubmed.ncbi.nlm.nih.gov/25986543/)
- Danks et al. 2020, *Ecol Evol* (zoochory) — [PMC7713961](https://pmc.ncbi.nlm.nih.gov/articles/PMC7713961/)

### Rekabet
- Boddy 2000, *FEMS Microbiol Ecol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/10719199/)

### Tür profilleri (doğrulanmış bilgi kaynakları)
- [Physarum polycephalum — Wikipedia](https://en.wikipedia.org/wiki/Physarum_polycephalum)
- [Coprinus comatus — Wikipedia](https://en.wikipedia.org/wiki/Coprinus_comatus)
- [Calvatia gigantea — Wikipedia](https://en.wikipedia.org/wiki/Calvatia_gigantea)
- [Geastrum — Wikipedia](https://en.wikipedia.org/wiki/Geastrum)
- [Morchella — Wikipedia](https://en.wikipedia.org/wiki/Morchella)
- [Pleurotus ostreatus — Wikipedia](https://en.wikipedia.org/wiki/Pleurotus_ostreatus)
- [Ganoderma lucidum — Wikipedia](https://en.wikipedia.org/wiki/Ganoderma_lucidum)
- [Tuber — Wikipedia](https://en.wikipedia.org/wiki/Tuber_%28fungus%29)
- [Ophiocordyceps unilateralis — Wikipedia](https://en.wikipedia.org/wiki/Ophiocordyceps_unilateralis)
- [Phallus impudicus — Wikipedia](https://en.wikipedia.org/wiki/Phallus_impudicus)

Ek tür bazlı doğrulanmış makaleler:
- Ganoderma dağılımı: Mercière et al. 2017, *Fungal Biol* — [PubMed](https://pubmed.ncbi.nlm.nih.gov/28606348/)
- Ophiocordyceps genomik: Lu et al. 2024, *Front Microbiol* — [PMC11057048](https://pmc.ncbi.nlm.nih.gov/articles/PMC11057048/)
- Ophiocordyceps kompleks taksonomi: Ballesteros-Aguirre et al. 2025, *Persoonia* — [PMC12798844](https://pmc.ncbi.nlm.nih.gov/articles/PMC12798844/)
- Ophiocordyceps konakçı genelliği: Lin et al. 2020, *Sci Rep* — [PMC7156370](https://pmc.ncbi.nlm.nih.gov/articles/PMC7156370/)
- Trüf genomu: Martelossi et al. 2025, *Genome Res* — [PMC12581995](https://pmc.ncbi.nlm.nih.gov/articles/PMC12581995/)
- Pleurotus miselyumu: Qi et al. 2026, *Plants* — [PMC13119485](https://pmc.ncbi.nlm.nih.gov/articles/PMC13119485/)
- Morchella hiposferi: Zhang et al. 2026, *Microorganisms* — [PMC13209776](https://pmc.ncbi.nlm.nih.gov/articles/PMC13209776/)
- Marasmius oreades (peri halkası türü) lektini: Wohlschlager et al. 2011, *JBC* — [PMC3162392](https://pmc.ncbi.nlm.nih.gov/articles/PMC3162392/)
