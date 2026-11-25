export const STUDIO_PROFILE = {
  brand: 'PRAFASTA',
  subBrand: 'Monograph',
  handle: 'MrEuwn',
  email: 'rafagans02@gmail.com',
  githubProfile: 'https://github.com/MrEuwn',
  location: 'Jakarta, ID · Remote Worldwide',
  roleEn: 'Creative Web Designer & Design Engineer',
  roleId: 'Desainer Web Kreatif & Design Engineer',
  edition: 'INDEX 2026 · 05 WORLDS LIVE',
};

export const CATEGORIES = [
  { id: 'all', en: 'All Categories', idLabel: 'Semua Kategori' },
  { id: 'culture', en: 'Culture / Museum', idLabel: 'Budaya / Museum' },
  { id: 'hardware', en: 'Hardware / Optics', idLabel: 'Perangkat / Optik' },
  { id: 'ai-tool', en: 'AI Compute Tool', idLabel: 'Alat Komputasi AI' },
  { id: 'architecture', en: 'Architecture', idLabel: 'Arsitektur' },
  { id: 'scenography', en: 'Stage / Event', idLabel: 'Panggung / Acara' },
];

export const PILLARS = [
  { id: 'all', en: 'All Pillars', idLabel: 'Semua Pilar' },
  { id: 'expressive-motion', en: 'Expressive Motion', idLabel: 'Expressive Motion' },
  { id: 'design-system', en: 'Design System', idLabel: 'Design System' },
  { id: 'data-dense', en: 'Data-Dense', idLabel: 'Data-Dense' },
  { id: 'research', en: 'Research & Utility', idLabel: 'Riset & Utilitas' },
];

export const PROJECTS = [
  {
    index: '01',
    slug: 'wiraloka-batik',
    shortName: 'SOGA',
    title: 'Rumah Wiraloka',
    subtitleEn: 'Adibusana Batik Tulis Atelier & Optical Archive',
    subtitleId: 'Atelier Batik Tulis Adibusana & Arsip Optis',
    categoryId: 'culture',
    categoryLabel: 'Culture / Arts / Museum',
    primaryStyle: 'Warm Organic / Craft Atelier',
    pillars: ['expressive-motion'],
    status: 'Self-initiated',
    year: '2026',
    hours: '40h',
    roleEn: 'Solo Direction, GLSL Refraction Shader, React 19 + Lenis Build',
    roleId: 'Arah Visual Solo, Shader Refraksi GLSL, Build React 19 + Lenis',
    stack: ['React 19', 'Vite 6', 'Three.js GLSL', 'Lenis', 'View Transitions API'],
    liveUrl: 'https://wiraloka-batik.vercel.app',
    repoUrl: 'https://github.com/MrEuwn/wiraloka-batik',
    dnaCode: 'DNA 01 · 8-COL WEAVE + GLSL CRYSTAL',
    dnaTitleEn: '8-Column 12.5vw Weave Grid & Optical Canting Shader',
    dnaTitleId: 'Grid Tenun 8-Kolom 12.5vw & Shader Canting Optis',
    dnaSummaryEn:
      'Precision 1px woven cells frame a clear GLSL Fresnel 3D Canting sculpture that bends grid hairlines without clouding serif typography underneath.',
    dnaSummaryId:
      'Sel tenun 1px presisi membingkai patung 3D Canting ber-shader Fresnel bening yang membiaskan garis grid tanpa mengaburkan tipografi di belakangnya.',
    tokens: {
      polarity: 'light',
      ground: '#EFE7D9',
      surface: '#E4D7C3',
      ink: '#2A1E17',
      accent: '#9A481E',
      displayFont: 'EB Garamond',
      bodyFont: 'Noto Sans',
      ratio: '13.6:1 AAA',
    },
    recruiterSummaryEn:
      'Haute batik collectors struggle to judge wax canting precision and natural soga dye heritage through generic storefront thumbnails. Rumah Wiraloka reimagines an archival textile atelier on an 8-column 12.5vw woven grid with a real-time GLSL 3D Crystal Canting, trilingual (Id/En/Jv) switching, and a 4-bath natural dye simulator. The decisive trade-off was authoring a low-alpha Fresnel shader instead of Three.js transmission glass so underlying editorial text stays legible. Validation: [Heuristic Audit] zero horizontal overflow, WCAG AAA ink contrast, and interactive dye-bath simulation ready for collector usability testing [Hypothesis].',
    recruiterSummaryId:
      'Kolektor batik tulis adibusana kesulitan menilai presisi proses malam dan pewarnaan soga alami melalui katalog daring biasa. Rumah Wiraloka membangun atelier arsip di atas grid tenun 8 kolom 12.5vw lengkap dengan 3D Crystal Canting GLSL, 3 bahasa (Id/En/Jv), dan simulator 4 celupan alam. Keputusan terpentingnya adalah memakai shader Fresnel alpha rendah alih-alih kaca transmission bawaan agar teks grid tetap jernih dibaca. Validasi: [Heuristic Audit] nol overflow, kontras WCAG AAA, serta siap diuji ke kolektor tekstil [Hypothesis].',
    problemEn:
      'Collectors and museum patrons cannot inspect wax dot density, natural soga soaking layers, or Javanese motif provenance through standard e-commerce cards.',
    problemId:
      'Kolektor dan penikmat arsip kesulitan memeriksa kerapatan malam, lapisan celupan soga alami, serta riwayat motif Jawa melalui kartu toko standar.',
    evidenceTag: '[Heuristic Audit]',
    dnaFirewall: {
      principles: [
        '8-column 12.5vw architectural hairline grid anchoring vertical & horizontal rhythm',
        'Custom Fresnel refraction over light ground with ~0.07 interior alpha',
        'Full View Transitions API routing paired with Lenis inertia scroll',
      ],
      forbidden: [
        'Zero monochrome chess metaphors or copied layout copy from European references',
        'Zero cloudy WebGL MeshPhysicalMaterial transmission fog over HTML text',
      ],
      divergence:
        'Shifted cold monochrome minimalism into Warm Soga Linen (#EFE7D9), sculpted a culturally grounded 3D Crystal Canting & Cap Tembaga, built a 4-bath natural dye simulator, and shipped full Basa Jawa Krama localization.',
    },
    rejectedOptions: [
      {
        title: 'Dark Luxury Gold-on-Black Batik Theme',
        reason:
          'Overused cliché for heritage brands that hides fine hairline weave structure and clashes with daylight archival museum reading.',
      },
      {
        title: 'Three.js MeshPhysicalMaterial Transmission',
        reason:
          'Created milky white haze over EB Garamond serif headlines on light backgrounds during early browser testing.',
      },
    ],
    tradeOffs: [
      {
        decision: 'Custom GLSL Fresnel shader with ~0.07 interior alpha',
        alternative: 'Standard PBR glass transmission pass',
        reason: 'Preserves razor readability on 1px grid rules and serif headlines underneath the 3D Canting.',
        tradeOff: 'Sacrificed real-time multi-bounce caustics to guarantee crisp legibility and 60fps on integrated GPUs.',
        evidence: '[Heuristic Audit]',
      },
      {
        decision: 'Full 3-language toggle (Indonesian, English, Javanese Krama)',
        alternative: 'Single English editorial landing page',
        reason: 'Honors Solo Laweyan craft provenance while staying accessible to international museum curators.',
        tradeOff: 'Tripled copy maintenance and required careful typography wrapping checks across longer Javanese strings.',
        evidence: '[Hypothesis]',
      },
    ],
    validationPlanEn:
      'Not yet tested with external collectors [Hypothesis]. Proposed protocol: 5 textile collectors & curators complete 3 tasks (compare Parang vs Kawung dye baths, switch to Javanese Krama, export a fitting specification card) targeting >= 85% unassisted completion and < 50s median time-on-task.',
    validationPlanId:
      'Belum diuji ke kolektor eksternal [Hypothesis]. Rencana uji: 5 kolektor tekstil menyelesaikan 3 skenario (membandingkan celupan Parang vs Kawung, beralih ke Basa Jawa Krama, mengunduh kartu spesifikasi) dengan target >= 85% keberhasilan mandiri di bawah 50 detik.',
    reflectionEn:
      'The 8-column 12.5vw grid immediately gave cultural craft architectural discipline without feeling sterile. Next iteration would capture real macro cross-polarized textile scans for true normal-mapped weave lighting.',
    reflectionId:
      'Grid 8 kolom 12.5vw langsung memberi disiplin arsitektural pada kriya tradisi tanpa terasa kaku. Iterasi berikutnya akan menambah pemindaian makro tekstil untuk pencahayaan serat yang lebih dalam.',
    plates: [
      {
        src: '/previews/wiraloka-batik/preview-hero.png',
        alt: 'Rumah Wiraloka hero featuring 8-column woven hairline grid and 3D Crystal Canting sculpture',
        captionEn: 'Decision: Low-alpha Fresnel GLSL Canting refracts the 12.5vw woven grid without veiling EB Garamond headlines.',
        captionId: 'Keputusan: Shader Fresnel Canting ber-alpha rendah membiaskan grid 12.5vw tanpa menyamarkan judul EB Garamond.',
      },
      {
        src: '/previews/wiraloka-batik/preview-koleksi.png',
        alt: 'Rumah Wiraloka collection studio with 4 natural dye bath simulator controls',
        captionEn: 'Decision: Interactive 4-bath natural dye simulator lets visitors compare Soga, Wedel Nila, Keling, and Mori finishes live.',
        captionId: 'Keputusan: Simulator 4 rendaman warna alam membandingkan hasil Soga, Wedel Nila, Keling, dan Mori secara langsung.',
      },
      {
        src: '/previews/wiraloka-batik/preview-kriya.png',
        alt: 'Rumah Wiraloka heritage materials view with rotating 3D copper batik stamp',
        captionEn: 'Decision: Secondary 3D Cap Tembaga Kawung anchors the craft materials essay inside the same architectural grid.',
        captionId: 'Keputusan: Patung 3D Cap Tembaga Kawung mengikat esai material alam dalam modul grid yang konsisten.',
      },
    ],
  },
  {
    index: '02',
    slug: 'koma-optics',
    shortName: 'OPTIC',
    title: 'KOMA O-III',
    subtitleEn: 'Modular Cinema Lens & Optical Instrument Monograph',
    subtitleId: 'Monograf Lensa Sinema Modular & Instrumen Optik',
    categoryId: 'hardware',
    categoryLabel: 'Gaming / Audio / Hardware',
    primaryStyle: 'Monolithic Dark / Cinematic Product',
    pillars: ['expressive-motion', 'design-system'],
    status: 'Speculative',
    year: '2026',
    hours: '45h',
    roleEn: 'Product Direction, Single-Context WebGL2 Scissor Renderer, Design System',
    roleId: 'Arah Produk, Renderer WebGL2 Single-Context Scissor, Sistem Desain',
    stack: ['React', 'Vite', 'Three.js PMREM', 'Single-Context Scissor', 'Lenis'],
    liveUrl: 'https://koma-optics.vercel.app',
    repoUrl: 'https://github.com/MrEuwn/koma-optics',
    dnaCode: 'DNA 02 · DARKROOM POLARITY + SCISSOR PBR',
    dnaTitleEn: 'Darkroom-to-Paper Polarity & Single-Context WebGL2',
    dnaTitleId: 'Polaritas Darkroom-ke-Kertas & WebGL2 Single-Context',
    dnaSummaryEn:
      'Alternates specular titanium darkroom drama (#0D1014) with 1px orthographic laboratory paper (#EEF0EC) driven by a single leak-free WebGL2 context.',
    dnaSummaryId:
      'Memadukan dramaturgi ruang gelap titanium (#0D1014) dan kertas laboratorium ortografis 1px (#EEF0EC) dalam satu konteks WebGL2 tanpa crash.',
    tokens: {
      polarity: 'dark',
      ground: '#0D1014',
      surface: '#171C22',
      ink: '#EFF2F5',
      accent: '#D96B27',
      displayFont: 'Schibsted Grotesk',
      bodyFont: 'IBM Plex Mono',
      ratio: '17.1:1 AAA',
    },
    recruiterSummaryEn:
      'Independent cinematographers struggle to evaluate modular lens barrel proportions, glass coatings, and filter spectral behavior from flat PDF spec sheets. KOMA O-III pairs a specular titanium WebGL2 darkroom hero with orthographic lab-paper engineering spreads and an interactive tabletop drop-in filter studio. The primary engineering decision replaced 15 crash-prone WebGL contexts from the reference teardown with one shared PMREM WebGL2 scissor renderer. Validation: [Heuristic Audit] instant first paint, zero WebGL context loss, and keyboard-accessible filter testing ready for DP evaluation [Hypothesis].',
    recruiterSummaryId:
      'Sinematografer independen kesulitan menilai proporsi bodi lensa modular, lapisan kaca, dan karakter filter optik dari lembar spesifikasi PDF datar. KOMA O-III menggabungkan ruang gelap 3D titanium, bentangan cetak biru kertas lab, serta meja uji filter optik interaktif. Keputusan teknis utamanya mengganti 15 konteks WebGL rentan crash pada referensi menjadi satu WebGL2 scissor renderer bersama. Validasi: [Heuristic Audit] LCP instan, nol kehilangan konteks WebGL, dan aksesibilitas keyboard penuh siap diuji ke sinematografer [Hypothesis].',
    problemEn:
      'Cinematographers cannot feel barrel ergonomics, optical mass balance, or dichroic filter shifts from static PDF datasheets before booking lens rentals.',
    problemId:
      'Sinematografer tidak bisa merasakan proporsi tabung lensa, bobot optik, atau pergeseran spektrum filter dari dokumen PDF statis sebelum menyewa.',
    evidenceTag: '[Heuristic Audit]',
    dnaFirewall: {
      principles: [
        'Dual polarity cadence: Darkroom Slate (#0D1014) alternating with Lab Paper (#EEF0EC)',
        '4-zone architectural header with subtle top scrim and scroll-morphing scale',
        'Tactile tabletop interaction where clicking physical optical pieces animates live light response',
      ],
      forbidden: [
        'Zero flower/vase lifestyle art direction from ottoobjects.com',
        'Zero 15-canvas multi-context WebGL memory crashes or blocking preloaders',
      ],
      divergence:
        'Engineered a single-context WebGL2 scissor manager driving machined cinema lens barrels and an interactive drop-in optical filter studio with live T-stop & spectral transmission readouts.',
    },
    rejectedOptions: [
      {
        title: 'Separate <Canvas> Instance per Product Section',
        reason:
          'Browsers cap active WebGL contexts at 8 to 16; forensic testing showed context eviction and blank black canvases on rapid scrolling.',
      },
      {
        title: 'Pure Dark Mode Throughout Entire Page',
        reason:
          'Dense orthographic technical drawings and dimension lines read far more sharply on open Lab Paper (#EEF0EC) than glowing lines on black.',
      },
    ],
    tradeOffs: [
      {
        decision: 'Single-context WebGL2 scissor renderer with procedural PMREM studio HDRI',
        alternative: 'Multiple independent Three.js canvases + external 15MB HDR files',
        reason: 'Eliminates GPU context loss and achieves instant first paint without downloading multi-megabyte environment maps.',
        tradeOff: 'Requires synchronized DOM rect scissor tracking on scroll frames.',
        evidence: '[Heuristic Audit]',
      },
      {
        decision: 'Interactive drop-in filter studio with keyboard activation',
        alternative: 'Pre-rendered video loop of filter samples',
        reason: 'Lets cinematographers compare Amber Dichroic, Anamorphic Streak, and Frosted Mist side-by-side at their own pace.',
        tradeOff: 'Procedural spectral approximation rather than measured Zemax optical raytracing.',
        evidence: '[Hypothesis]',
      },
    ],
    validationPlanEn:
      'Not yet tested with working DPs [Hypothesis]. Proposed protocol: 5 camera operators compare all 3 optical filters, configure a 2-lens reservation kit, and verify total optical mass in grams under 60 seconds.',
    validationPlanId:
      'Belum diuji ke sinematografer lapangan [Hypothesis]. Rencana uji: 5 operator kamera membandingkan 3 filter optik, menyusun kit reservasi 2 lensa, dan memverifikasi total bobot gram di bawah 60 detik.',
    reflectionEn:
      'Alternating darkroom PBR drama with crisp lab paper created natural pacing without artificial dividers. Future iteration would ingest real MTF chart curves from physical glass assemblies.',
    reflectionId:
      'Pergantian ruang gelap PBR dan kertas lab menciptakan ritme alami tanpa garis pemisah berlebihan. Iterasi lanjut dapat memuat kurva MTF terukur dari rakitan lensa nyata.',
    plates: [
      {
        src: '/previews/koma-optics/preview-hero.png',
        alt: 'KOMA O-III darkroom chiaroscuro 3D titanium cinema lens barrels',
        captionEn: 'Decision: Procedural PMREM softbox reflections sculpt anodized titanium cylinders on #0D1014 darkroom slate.',
        captionId: 'Keputusan: Refleksi softbox PMREM prosedural memahat silinder titanium di atas bidang gelap #0D1014.',
      },
      {
        src: '/previews/koma-optics/preview-story.png',
        alt: 'KOMA O-III orthographic engineering spread on open lab paper',
        captionEn: 'Decision: Switching to Lab Paper (#EEF0EC) restores maximum contrast for orthographic engineering typography.',
        captionId: 'Keputusan: Beralih ke Lab Paper (#EEF0EC) memaksimalkan kontras untuk tipografi teknis ortografis.',
      },
      {
        src: '/previews/koma-optics/preview-bench.png',
        alt: 'KOMA O-III interactive tabletop optical filter bench with glowing spectral beam',
        captionEn: 'Decision: Clicking any machined drop-in filter lifts it into the lens barrel and updates live optical telemetry.',
        captionId: 'Keputusan: Mengklik filter optik mengangkatnya ke tabung lensa sambil memperbarui telemetri spektral seketika.',
      },
    ],
  },
  {
    index: '03',
    slug: 'silika-vault',
    shortName: 'SILICON',
    title: 'SILIKA',
    subtitleEn: 'Spatial AI Compute & Silicon Module Archive',
    subtitleId: 'Arsip Spasial Modul Komputasi & Silikon AI',
    categoryId: 'ai-tool',
    categoryLabel: 'AI Workflow Tool',
    primaryStyle: 'Tactile Industrial / Hardware Instrument',
    pillars: ['data-dense', 'expressive-motion'],
    status: 'Speculative',
    year: '2026',
    hours: '50h',
    roleEn: 'Spatial Interface Architect, 2D Retina CV-HUD, WebGL2 Bloom Cascade',
    roleId: 'Arsitek Antarmuka Spasial, 2D Retina CV-HUD, Cascade Bloom WebGL2',
    stack: ['React', 'Vite', 'Three.js EffectComposer', '2D Retina Canvas HUD', 'Web Audio'],
    liveUrl: 'https://silika-vault.vercel.app',
    repoUrl: 'https://github.com/MrEuwn/silika-vault',
    dnaCode: 'DNA 03 · 100DVH SPATIAL + CV-RETICLE HUD',
    dnaTitleEn: 'Zero-Scroll Spatial Stage & 2D Retina CV-Tracker',
    dnaTitleId: 'Panggung Spasial Zero-Scroll & Pelacak CV Retina 2D',
    dnaSummaryEn:
      'Pairs a 100dvh monochrome hardware cascade with a crisp 2D computer-vision targeting HUD, exploded cutaways, and dense thermal/TOPS benchmarking.',
    dnaSummaryId:
      'Memadukan kaskade perangkat keras 100dvh monokrom dengan HUD pelacak CV 2D tajam, cutaway 4 lapis, dan komparasi termal padat data.',
    tokens: {
      polarity: 'dark',
      ground: '#06090F',
      surface: '#0E1420',
      ink: '#E8EEF7',
      accent: '#38BDF8',
      displayFont: 'Archivo',
      bodyFont: 'JetBrains Mono',
      ratio: '17.4:1 AAA',
    },
    recruiterSummaryEn:
      'AI infrastructure engineers compare accelerator modules, memory bandwidth, and thermal envelopes across flat spreadsheets detached from physical form factors. SILIKA turns 20 compute cartridges into a zero-scroll 100dvh WebGL2 cascade layered with a 2D Retina CV-Tracker HUD and click-to-inspect 4-layer exploded cutaways with peer benchmark comparison. The critical architecture choice replaced the reference site WebGPU dead-end gate with universal WebGL2 plus a dedicated 2D Archive fallback. Validation: [Heuristic Audit] universal browser rendering, readable 4-corner vignette scrims, and always-visible Index (20) access ready for hardware engineer testing [Hypothesis].',
    recruiterSummaryId:
      'Engineer infrastruktur AI membandingkan puluhan modul akselerator, bandwidth memori, dan kurva termal lewat spreadsheet datar tanpa konteks fisik. SILIKA mengubah 20 modul komputasi menjadi panggung spasial WebGL2 100dvh berlapis 2D Retina CV-Tracker HUD serta laci cutaway 4 lapis dan pembanding benchmark. Pilihan teknis krusialnya mengganti gerbang WebGPU eksklusif menjadi WebGL2 universal beserta mode 2D Archive. Validasi: [Heuristic Audit] kompatibel lintas browser, scrim kontras 4 sudut terbaca jelas, siap diuji ke engineer perangkat keras [Hypothesis].',
    problemEn:
      'Hardware architects comparing HBM bandwidth, watt efficiency, and package thermals lose spatial intuition inside disconnected tabular spreadsheets.',
    problemId:
      'Arsitek perangkat keras yang membandingkan bandwidth HBM, efisiensi daya, dan termal kehilangan pemahaman fisik di dalam spreadsheet terpisah.',
    evidenceTag: '[Heuristic Audit]',
    dnaFirewall: {
      principles: [
        '100dvh zero-scroll spatial workbench with continuous vertical scroll/drag impulse',
        'Layered 2D Retina Canvas HUD drawing 1px bounding brackets, orbital ellipses, and live coordinates',
        'Click-to-inspect 4-layer exploded hardware cutaway synchronized with tabular telemetry',
      ],
      forbidden: [
        'Zero cassette tape nostalgia themes from bizar.ro',
        'Zero WebGPU-only hard error screens blocking Safari, Firefox, or older GPUs',
      ],
      divergence:
        'Built universal WebGL2 + manual 2D Archive fallback, added 4-corner obsidian vignette scrims protecting corner text from specular bloom, exposed an always-visible Index (20) trigger, and added peer-to-peer thermal curve comparisons.',
    },
    rejectedOptions: [
      {
        title: 'Strict WebGPU Renderer with Fallback Blocker Screen',
        reason:
          'Excludes a large share of recruiters and engineers on Safari, Firefox, or corporate laptops without hardware WebGPU.',
      },
      {
        title: 'Hover-Only Hidden Left Index Trigger',
        reason:
          'Fails discoverability and touch/keyboard accessibility; replaced with persistent top-right Index (20) + :focus-within support.',
      },
    ],
    tradeOffs: [
      {
        decision: 'Universal WebGL2 EffectComposer + full-feature 2D Archive toggle',
        alternative: 'WebGPU compute-shader-only showcase',
        reason: 'Guarantees every visitor sees either real-time 3D bloom cartridges or full spec data without hitting an error wall.',
        tradeOff: 'Slightly softer specular halation than custom WebGPU raymarched materials, gained near-100% device reach.',
        evidence: '[Heuristic Audit]',
      },
      {
        decision: 'Gesture-gated Web Audio synth with subtle bottom-right equalizer',
        alternative: 'Autoplay ambient hum on load',
        reason: 'Respects browser autoplay policies and office environments while rewarding deliberate interaction.',
        tradeOff: 'Audio feedback stays silent until user explicitly toggles sound.',
        evidence: '[Heuristic Audit]',
      },
    ],
    validationPlanEn:
      'Not yet tested with infrastructure teams [Hypothesis]. Proposed protocol: 5 ML systems engineers locate a <= 350W edge module, compare HBM bandwidth against a peer cartridge, and switch to 2D Archive view with zero errors.',
    validationPlanId:
      'Belum diuji ke tim infrastruktur ML [Hypothesis]. Rencana uji: 5 engineer menemukan modul edge <= 350W, membandingkan bandwidth HBM dengan modul pembanding, dan beralih ke mode 2D Archive tanpa kendala.',
    reflectionEn:
      'Separating the WebGL2 3D stage from a crisp 2D Retina Canvas HUD kept 1px engineering callouts razor-sharp even while UnrealBloomPass glowed behind them.',
    reflectionId:
      'Memisahkan panggung 3D WebGL2 dari lapisan HUD 2D Retina menjaga garis anotasi 1px tetap setajam vektor walau efek bloom menyala di belakangnya.',
    plates: [
      {
        src: '/previews/silika-vault/preview-tracker.png',
        alt: 'SILIKA 2D Retina CV-Tracker HUD with orbital ellipses and chroma macro mosaic reveal',
        captionEn: 'Decision: 2D Retina Canvas draws 1px bounding telemetry and fractured color silicon macro plates over monochrome 3D hardware.',
        captionId: 'Keputusan: Canvas 2D Retina menggambar batas pelacak 1px dan mosaik makro silikon berwarna di atas kaskade 3D monokrom.',
      },
      {
        src: '/previews/silika-vault/preview-hero.png',
        alt: 'SILIKA monochrome spatial cascade of 20 compute cartridges with selective bloom',
        captionEn: 'Decision: 4-corner invisible obsidian scrims preserve JetBrains Mono legibility whenever specular highlights pass behind.',
        captionId: 'Keputusan: Scrim gelap 4 sudut menjaga keterbacaan JetBrains Mono saat pantulan bloom melintas di belakang teks.',
      },
      {
        src: '/previews/silika-vault/preview-cutaway.png',
        alt: 'SILIKA 4-layer exploded silicon cutaway alongside peer benchmark comparison drawer',
        captionEn: 'Decision: Clicking any cartridge splits its 4 physical layers and opens peer-to-peer TOPS/W and thermal comparison curves.',
        captionId: 'Keputusan: Mengklik modul memecah 4 lapisan fisiknya sambil membuka komparasi TOPS/W dan kurva termal.',
      },
    ],
  },
  {
    index: '04',
    slug: 'redam-acoustics',
    shortName: 'ACOUSTIC',
    title: 'REDAM',
    subtitleEn: 'Architectural Acoustics & Urban Noise Engineering',
    subtitleId: 'Studio Akustik Arsitektur & Rekayasa Kebisingan Urban',
    categoryId: 'architecture',
    categoryLabel: 'Architecture / Real Estate',
    primaryStyle: 'Playful Spatial / Tactile Consumer',
    pillars: ['research', 'expressive-motion'],
    status: 'Self-initiated',
    year: '2026',
    hours: '42h',
    roleEn: 'Editorial Storyboarding, Custom Brush-Ink Visuals, Sabine RT60 & Web Audio',
    roleId: 'Storyboard Editorial, Ilustrasi Tinta Kuas, Sabine RT60 & Web Audio',
    stack: ['React', 'Vite', 'Lenis', 'Web Audio Low-Pass Filter', 'Sabine RT60 Engine'],
    liveUrl: 'https://redam-acoustics.vercel.app',
    repoUrl: 'https://github.com/MrEuwn/redam-acoustics',
    dnaCode: 'DNA 04 · 3-INK EDITORIAL + ACOUSTIC UTILITY',
    dnaTitleEn: 'Warm 3-Ink Borderless Editorial & Sabine RT60 Tool',
    dnaTitleId: 'Editorial 3-Tinta Hangat Tanpa Border & Kalkulator RT60',
    dnaSummaryEn:
      'Turns invisible room reverberation into witty brush-ink storytelling with a morphing pill navbar, scroll-pushed typography, throw-away cards, and live RT60 math.',
    dnaSummaryId:
      'Menerjemahkan gema ruang yang tak kasatmata menjadi kisah tinta kuas hangat dengan navbar kapsul, dorongan teks scroll, kartu lempar, dan kalkulator RT60.',
    tokens: {
      polarity: 'light',
      ground: '#EDE8E6',
      surface: '#FFFFFF',
      ink: '#47220E',
      accent: '#FFA125',
      displayFont: 'Montserrat',
      bodyFont: 'Instrument Serif',
      ratio: '11.5:1 AAA',
    },
    recruiterSummaryEn:
      'Architects and urban cafe founders often deliver visually striking glass interiors that exhaust guests with harsh reverberation, while acoustic consulting brochures feel impenetrable. REDAM pairs a warm 3-ink editorial discipline (Warm Parchment, Espresso Ink, Marigold Amber) and bespoke brush-ink characters with scroll-pushed typography, throw-away process cards, a gesture-gated Web Audio dampening switch, and a real Sabine RT60 room estimator. The key decision replaced boxed card borders with tonal surface elevation and clamped the preloader frame-1 counter to avoid negative percentages. Validation: [Heuristic Audit] 11.5:1 AAA contrast, full ID/EN switching, ready for architect usability testing [Hypothesis].',
    recruiterSummaryId:
      'Arsitek dan pemilik kafe urban sering merancang ruang kaca memikat namun melelahkan telinga akibat gema tinggi, sementara brosur akustik terlalu kaku. REDAM memadukan disiplin editorial 3 tinta hangat (Parchment, Espresso, Marigold), karakter tinta kuas, dorongan teks scroll, kartu proses melayang, sakelar Mode Redam Web Audio, dan kalkulator Sabine RT60 nyata. Keputusan kuncinya menghapus border kartu demi elevasi tonal bersih dan mengunci counter preloader anti-negatif. Validasi: [Heuristic Audit] kontras AAA 11.5:1, dwi-bahasa ID/EN penuh, siap diuji ke arsitek [Hypothesis].',
    problemEn:
      'Hospitality owners and architects underestimate acoustic reverberation until after construction because acoustic engineering proposals lack relatable human storytelling and quick room estimation.',
    problemId:
      'Pemilik kafe dan arsitek kerap meremehkan gema hingga ruang selesai dibangun karena proposal akustik sulit dicerna dan minim alat estimasi cepat.',
    evidenceTag: '[Heuristic Audit]',
    dnaFirewall: {
      principles: [
        'Strict 3-ink editorial discipline (#EDE8E6 parchment, #47220E espresso, #FFA125 marigold) with borderless pure-white cards',
        'Morphing pill island navigation bar expanding in-place into velvet espresso (#3B1A14)',
        'Pinned scroll choreography: character pushing headline horizontally + tilted throw-away cards',
      ],
      forbidden: [
        'Zero fintech payroll copy or borrowed characters from ordix.org',
        'Zero cluttered card stroke borders or generic SaaS feature grids',
      ],
      divergence:
        'Reframed warm editorial craft around architectural acoustics with original Indonesian/English copy, a real Web Audio room-noise dampening filter, and a Sabine RT60 estimator exporting downloadable .txt acoustic briefs.',
    },
    rejectedOptions: [
      {
        title: 'Dark Sound-Wave Equalizer Agency Template',
        reason:
          'Feels like a nightclub DJ plugin instead of a calm architectural studio focused on serene interior spaces.',
      },
      {
        title: 'Heavy 1px Stroke Borders Around White Cards',
        reason:
          'Broke the paper-on-parchment editorial lightness observed during visual critique; switching to borderless tonal elevation elevated craft immediately.',
      },
    ],
    tradeOffs: [
      {
        decision: 'Borderless white cards on #EDE8E6 parchment + bespoke brush-ink characters',
        alternative: 'Stock architectural interior photos with dark overlays',
        reason: 'Visualizes invisible sound fatigue and acoustic calm with immediate human wit and unmistakable voice.',
        tradeOff: 'Requires disciplined character line-weight consistency across all scroll stages.',
        evidence: '[Heuristic Audit]',
      },
      {
        decision: 'Real Sabine RT60 formula calculator (0.161 * V / A) inside inquiry modal',
        alternative: 'Static contact form asking only name and email',
        reason: 'Gives architects an immediate baseline reverberation number before booking a site measurement.',
        tradeOff: 'Simplified 4-surface absorption model explicitly labeled as pre-audit estimate [Hypothesis].',
        evidence: '[Hypothesis]',
      },
    ],
    validationPlanEn:
      'Not yet tested with hospitality architects [Hypothesis]. Proposed protocol: 5 interior architects estimate RT60 for a 180m3 glass cafe, toggle Web Audio dampening, and download the baseline brief in < 90 seconds.',
    validationPlanId:
      'Belum diuji ke arsitek ruang publik [Hypothesis]. Rencana uji: 5 arsitek interior menghitung estimasi RT60 kafe kaca 180m3, mencoba filter Mode Redam Web Audio, dan mengunduh ringkasan audit di bawah 90 detik.',
    reflectionEn:
      'Stripping card borders and tightening typography contrast (Montserrat 800 + upright Instrument Serif) proved that restraint creates warmth far better than extra UI widgets.',
    reflectionId:
      'Menghapus garis tepi kartu dan merapatkan kontras tipografi (Montserrat 800 + Instrument Serif tegak) membuktikan bahwa ketenangan visual jauh lebih kuat daripada ornamen tambahan.',
    plates: [
      {
        src: '/previews/redam-acoustics/preview-hero.png',
        alt: 'REDAM warm parchment hero with morphing white pill navbar and brush-ink character',
        captionEn: 'Decision: 3-element editorial hero on #EDE8E6 parchment pairs Montserrat 800 uppercase with upright Instrument Serif.',
        captionId: 'Keputusan: Hero editorial 3 elemen di atas kertas #EDE8E6 memadukan Montserrat 800 kapital dengan Instrument Serif tegak.',
      },
      {
        src: '/previews/redam-acoustics/preview-push.png',
        alt: 'REDAM pinned scroll stage where brush-ink character pushes headline horizontally',
        captionEn: 'Decision: Pinned horizontal push stage physically visualizes acoustic resistance (HINGGA -14 dB) tied directly to scroll progress.',
        captionId: 'Keputusan: Babak dorong horizontal memvisualkan hambatan kebisingan (HINGGA -14 dB) yang terikat langsung ke progres scroll.',
      },
      {
        src: '/previews/redam-acoustics/preview-process.png',
        alt: 'REDAM throw-away borderless square process cards tilting past the morphing navbar',
        captionEn: 'Decision: Borderless tonal square cards tilt +/-16deg as they exit upward, keeping scroll pacing rhythmic and tactile.',
        captionId: 'Keputusan: Kartu proses persegi tanpa border miring +/-16 derajat saat terlempar ke atas menjaga ritme scroll tetap taktil.',
      },
    ],
  },
  {
    index: '05',
    slug: 'sorot-scenics',
    shortName: 'SCENIC',
    title: 'SOROT',
    subtitleEn: 'Kinetic Stage Scenography & Live Broadcast Studio',
    subtitleId: 'Studio Skenografi Panggung Kinetik & Siaran Langsung',
    categoryId: 'scenography',
    categoryLabel: 'Agency / Event Microsite',
    primaryStyle: 'Chromatic Drenched / Bold Brand System',
    pillars: ['expressive-motion', 'design-system'],
    status: 'Self-initiated',
    year: '2026',
    hours: '48h',
    roleEn: 'Chromatic Direction, FBO Prism Refraction, 360° XR Portal & 12-Act Scroll',
    roleId: 'Arah Kromatik, Refraksi Prisma FBO, Portal XR 360° & Koreografi 12 Babak',
    stack: ['React', 'Vite', 'Three.js FBO Shader', 'Lenis', 'CSS 3D preserve-3d'],
    liveUrl: 'https://sorot-scenics.vercel.app',
    repoUrl: 'https://github.com/MrEuwn/sorot-scenics',
    dnaCode: 'DNA 05 · CHROMATIC ARCHES + 360° XR PORTAL',
    dnaTitleEn: 'Full-Viewport Chromatic Arches & XR Visor 360° Galaxy',
    dnaTitleId: 'Lengkungan Kromatik Layar Penuh & Galaksi XR 360°',
    dnaSummaryEn:
      'Choreographs 12 full-viewport acts across Vermilion, Amber, Cyan, and Pitch-Black connected by 100vw dome arches, FBO glass prisms, and an XR visor lens fly-through.',
    dnaSummaryId:
      'Mengorkestrasi 12 babak layar penuh lintas Vermilion, Amber, Cyan, dan Hitam Pekat lewat kubah lengkung 100vw, prisma FBO, dan zoom-in visor XR 360°.',
    tokens: {
      polarity: 'chromatic',
      ground: '#D9381E',
      surface: '#111214',
      ink: '#FFFFFF',
      accent: '#29DAFF',
      displayFont: 'Big Shoulders Display',
      bodyFont: 'IBM Plex Sans',
      ratio: '18.7:1 AAA',
    },
    recruiterSummaryEn:
      'Festival and arena creative directors struggle to picture how kinetic lighting rigs and broadcast optics transform a venue from flat pitch decks. SOROT delivers a 12-act chromatic scroll journey spanning Signal Vermilion, full-screen Warm Amber and Ice Cyan chapters with curved 100vw dome wipes, real-time FBO glass prism typography refraction, a 600vh XR Stage Visor zoom-through into a 64-screen 360-degree dark galaxy, and a bottom-left Live Lighting Cue switcher. The decisive engineering fix isolated opacity onto the parent perspective wrapper so Chromium kept true isotropic 3D sphere depth across every rotation angle. Validation: [Heuristic Audit] 100/100 anti-slop score, 0px overflow, ready for show-director review [Hypothesis].',
    recruiterSummaryId:
      'Direktur kreatif festival dan siaran langsung kesulitan membayangkan dampak rig lampu kinetik dari deck proposal statis. SOROT menghadirkan perjalanan scroll 12 babak melintasi Signal Vermilion, babak layar penuh Amber dan Cyan bertransisi kubah 100vw, refraksi tipografi prisma kaca FBO, zoom-in XR Stage Visor 600vh menuju galaksi gelap 360 derajat berisi 64 layar, serta panel Live Cue di kiri bawah. Perbaikan teknis terpentingnya memisahkan opacity ke wadah perspektif induk agar kedalaman bola 3D isotropik tidak gepeng di Chromium. Validasi: [Heuristic Audit] skor anti-slop 100/100, overflow 0px, siap ditinjau sutradara panggung [Hypothesis].',
    problemEn:
      'Live show producers cannot feel multi-chapter lighting transitions, spatial screen wrap, or stage polarity shifts through static slide proposals.',
    problemId:
      'Produser pertunjukan langsung tidak bisa merasakan pergantian suasana cahaya dan ruang layar 360 derajat lewat slide proposal statis.',
    evidenceTag: '[Heuristic Audit]',
    dnaFirewall: {
      principles: [
        '100vw curved dome arch transitions connecting full-viewport chromatic chapters',
        'Real-time Three.js FBO glass prisms refracting condensed poster typography',
        '600vh XR Visor lens fly-through plunging into a pitch-black 360-degree 3D screen galaxy',
      ],
      forbidden: [
        'Zero violet PowerPoint presentation agency copy from laboiteaslides.fr',
        'Zero 10-second blocking loaders or 39 hidden iframes degrading Core Web Vitals',
      ],
      divergence:
        'Shifted domain to kinetic stage scenography in Signal Vermilion (#D9381E), engineered an interactive 3-cue Live Lighting switcher modifying live CSS tokens & WebGL shaders, and optimized 3D sphere rendering with pure preserve-3d retina tiles.',
    },
    rejectedOptions: [
      {
        title: 'Small Inset 3D Globe Floating on White Paper',
        reason:
          'User visual review caught that an inset globe broke immersion; rebuilt into a true 600vh XR Visor right-lens fly-through plunging 100vw x 100vh into black.',
      },
      {
        title: 'Applying will-change: opacity Directly on preserve-3d Sphere',
        reason:
          'Blink compositor flattened 3D child tiles at 90deg rotation; moving opacity to the outer perspective wrapper restored full 360-degree volumetric depth.',
      },
    ],
    tradeOffs: [
      {
        decision: '1060vh combined Hero + Amber runway before Productions',
        alternative: 'Short 220vh hero jumping straight into portfolio cards',
        reason: 'Gives prism refraction, H1 thesis, and chromatic arch transitions cinematic breathing room matching stage cue pacing.',
        tradeOff: 'Longer vertical travel mitigated by instant top Menu sheet shortcuts directly to Productions or Contact.',
        evidence: '[Heuristic Audit]',
      },
      {
        decision: 'Native 208x130px retina tiles inside scale3d(0.34 -> 1.32) sphere',
        alternative: 'Upscaling tiny 96x60px tiles by 3.7x',
        reason: 'Prevents GPU texture pixelation when stage monitors surround the full viewport.',
        tradeOff: 'Higher initial image decode budget handled cleanly by eager-loading shared compressed stage plates.',
        evidence: '[Heuristic Audit]',
      },
    ],
    validationPlanEn:
      'Not yet tested with live show directors [Hypothesis]. Proposed protocol: 5 lighting directors switch all 3 live lighting cues, traverse the 600vh XR Pre-Vis portal, and submit a technical stage brief via the modal.',
    validationPlanId:
      'Belum diuji ke lighting director eksternal [Hypothesis]. Rencana uji: 5 sutradara cahaya mencoba 3 live lighting cue, melintasi portal XR Pre-Vis 600vh, dan mengirim brief teknis panggung.',
    reflectionEn:
      'Debugging Chromium preserve-3d flattening proved why multi-angle headless visual QA catches real rendering bugs that code reviews alone miss.',
    reflectionId:
      'Menemukan bug flattening preserve-3d di Chromium membuktikan mengapa QA visual multi-sudut menangkap cacat render nyata yang luput dari pembacaan kode semata.',
    plates: [
      {
        src: '/previews/sorot-scenics/preview-hero.png',
        alt: 'SOROT Signal Vermilion hero with 3D glass prisms refracting condensed poster headline',
        captionEn: 'Decision: Real-time FBO chromatic aberration bends Big Shoulders Display poster lines behind 9 beveled Three.js prisms.',
        captionId: 'Keputusan: Refraksi kromatik FBO membengkokkan tipografi poster Big Shoulders Display di balik 9 prisma Three.js.',
      },
      {
        src: '/previews/sorot-scenics/preview-works.png',
        alt: 'SOROT full-screen 360-degree pitch-black VR stage screen galaxy with white editorial copy',
        captionEn: 'Decision: Right-lens XR Visor fly-through opens into a 100vw x 100vh dark galaxy wrapped by 64 retina stage screens.',
        captionId: 'Keputusan: Zoom-in lensa kanan XR Visor membuka galaksi gelap 100vw x 100vh yang dikelilingi 64 layar panggung tajam.',
      },
      {
        src: '/previews/sorot-scenics/preview-standards.png',
        alt: 'SOROT deep carbon obsidian 216px quality wall with flying frosted glass certification card',
        captionEn: 'Decision: Pinned 430vh Carbon Obsidian monolith contrasts 216px display type against sequentially flying superGlass cards.',
        captionId: 'Keputusan: Monolit Carbon Obsidian 430vh mempertemukan tipografi 216px dengan kartu superGlass yang melayang berurutan.',
      },
    ],
  },
];

export const GRAVEYARD_ITEMS = [
  {
    code: 'CUT-01',
    idea: 'Optik.Vault (Duplicate Cinema Lens Archive for bizar.ro DNA)',
    reasonEn:
      'Collided directly in product category with KOMA O-III. Replaced with SILIKA (AI Compute & Silicon Archive) so the AI Workflow Tool category and Data-Dense pillar were cleanly represented.',
    reasonId:
      'Bentrok kategori produk optik dengan KOMA O-III. Diganti ke SILIKA (Arsip Komputasi & Silikon AI) agar kategori AI Workflow Tool dan pilar Data-Dense terpenuhi tanpa tumpang tindih.',
  },
  {
    code: 'CUT-02',
    idea: 'Direct PowerPoint Presentation Agency Clone (laboiteaslides.fr DNA)',
    reasonEn:
      'Too close to the reference domain and value proposition. Pivoted completely to SOROT (Kinetic Stage Scenography) with Signal Vermilion polarity and an interactive Live Lighting Cue switcher.',
    reasonId:
      'Terlalu dekat dengan domain dan proposisi referensi asli. Dialihkan penuh ke SOROT (Skenografi Panggung Kinetik) dengan identitas Signal Vermilion dan konsol Live Lighting Cue.',
  },
  {
    code: 'CUT-03',
    idea: 'Space Grotesk & Poppins Display Stack Across Multiple Projects',
    reasonEn:
      'Flagged by our Anti-Slop typography firewall. Replaced with 10 distinct optical typefaces (EB Garamond, Schibsted Grotesk, Archivo, Montserrat, Instrument Serif, Big Shoulders Display, IBM Plex, JetBrains Mono).',
    reasonId:
      'Masuk daftar larangan tipografi klise anti-slop. Diganti dengan 10 wajah huruf optis berbeda agar setiap proyek memiliki suara tipografi orisinal.',
  },
];

export const HUB_COPY = {
  en: {
    navMenu: 'Index',
    navClose: 'Close',
    navBrief: 'Start Brief',
    heroKicker: 'CURATORIAL ARCHIVE · 05 LIVE AWWWARDS WORLDS',
    heroTitleLine1: 'Five Worlds,',
    heroTitleLine2: 'One Craft',
    heroTitleLine3: 'Discipline.',
    heroSub:
      'A curated hub uniting five opposing visual systems: woven museum craft, darkroom cinema optics, spatial silicon telemetry, warm acoustic storytelling, and chromatic stage choreography.',
    ctaExplore: 'Inspect Index',
    ctaLab: 'Enter Craft Lab',
    indexEyebrow: '01 / CURATORIAL INDEX WITH CV-RETICLE SPECIMEN STAGE',
    indexHeading: 'Five Distinct Architectures, Zero Shared Templates.',
    indexLedger: 'Index Ledger',
    indexGrid: 'Asymmetric Grid',
    inspectCase: 'Inspect Case',
    openLive: 'Live Site',
    synthesisEyebrow: '02 / DARKROOM FIVE-WORLD SYNTHESIS & LIVE ARTIFACT LAB',
    synthesisHeading: 'Test Every Signature Mechanism Live.',
    synthesisSub:
      'Rather than flattening five worlds into dead screenshots, test a real interactive micro-artifact extracted directly from each production codebase.',
    matrixEyebrow: '03 / PORTFOLIO DIVERSITY MATRIX & DESIGN GRAVEYARD',
    matrixHeading: 'Zero Category Overlap. Zero Hidden Trade-Offs.',
    graveyardTitle: 'The Design Graveyard (Cut Concepts)',
    footerHeadline: 'Ready to architect a distinctive digital world?',
    footerSub:
      'Available for Senior Creative Web Design, Design Engineering, Design Systems, and interactive WebGL showcase commissions.',
    footerCta: 'Open Project Brief',
    copyEmail: 'Copy Email',
    copiedEmail: 'Email Copied',
    backToIndex: 'Back to Hub Index',
    nextCase: 'Next World',
    visitLive: 'Visit Live App',
    viewCode: 'GitHub Repo',
    recruiterLabel: '30-SECOND EXECUTIVE SUMMARY',
    problemLabel: 'PROBLEM & EVIDENCE',
    firewallLabel: 'FORENSIC STYLE DNA & ABSTRACTION FIREWALL',
    tradeOffLabel: 'KEY DECISIONS & TRADE-OFFS',
    rejectedLabel: 'EXPLORED & REJECTED OPTIONS',
    artifactLabel: 'LIVE INTERACTIVE ARTIFACT EMBED',
    tokenLabel: 'SCOPED TOKEN SPECIMEN (CLICK HEX TO COPY)',
    validationLabel: 'HONEST VALIDATION & REFLECTION',
  },
  id: {
    navMenu: 'Indeks',
    navClose: 'Tutup',
    navBrief: 'Mulai Brief',
    heroKicker: 'ARSIP KURATORIAL · 05 DUNIA AWWWARDS AKTIF',
    heroTitleLine1: 'Lima Dunia,',
    heroTitleLine2: 'Satu Disiplin',
    heroTitleLine3: 'Kriya Digital.',
    heroSub:
      'Hub portofolio kuratorial yang menyatukan lima sistem visual bertolak belakang: atelier batik tenun, optik ruang gelap, telemetri silikon spasial, akustik editorial hangat, dan skenografi kromatik.',
    ctaExplore: 'Buka Indeks',
    ctaLab: 'Masuk Lab Interaksi',
    indexEyebrow: '01 / INDEKS KURATORIAL & PANGGUNG SPESIMEN CV-RETICLE',
    indexHeading: 'Lima Arsitektur Berbeda, Nol Template Seragam.',
    indexLedger: 'Daftar Indeks',
    indexGrid: 'Grid Asimetris',
    inspectCase: 'Bedah Studi Kasus',
    openLive: 'Situs Live',
    synthesisEyebrow: '02 / SINTESIS LIMA DUNIA & LAB ARTEFAK INTERAKTIF',
    synthesisHeading: 'Uji Langsung Setiap Mekanisme Khas.',
    synthesisSub:
      'Bukan sekadar tangkapan layar mati: coba langsung lima artefak interaktif nyata yang diambil dari masing-masing basis kode produksi.',
    matrixEyebrow: '03 / MATRIKS DIVERSITAS PORTOFOLIO & KUBURAN KONSEP',
    matrixHeading: 'Nol Duplikasi Kategori. Nol Trade-Off Disembunyikan.',
    graveyardTitle: 'Design Graveyard (Konsep yang Dibuang)',
    footerHeadline: 'Siap membangun dunia digital berkarakter kuat?',
    footerSub:
      'Tersedia untuk kolaborasi Senior Creative Web Design, Design Engineering, Design Systems, dan proyek showcase WebGL interaktif.',
    footerCta: 'Buka Brief Proyek',
    copyEmail: 'Salin Email',
    copiedEmail: 'Email Tersalin',
    backToIndex: 'Kembali ke Indeks Hub',
    nextCase: 'Dunia Berikutnya',
    visitLive: 'Buka Situs Live',
    viewCode: 'Repo GitHub',
    recruiterLabel: 'RINGKASAN EKSEKUTIF 30 DETIK',
    problemLabel: 'MASALAH & BUKTI',
    firewallLabel: 'DNA GAYA FORENSIK & ABSTRACTION FIREWALL',
    tradeOffLabel: 'KEPUTUSAN KUNCI & TRADE-OFF',
    rejectedLabel: 'OPSI YANG DIEKSPLORASI & DITOLAK',
    artifactLabel: 'ARTEFAK INTERAKTIF LANGSUNG',
    tokenLabel: 'SPESIMEN TOKEN TERISOLASI (KLIK HEX UNTUK SALIN)',
    validationLabel: 'VALIDASI JUJUR & REFLEKSI',
  },
};
