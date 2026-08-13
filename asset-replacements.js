(function () {
  const assets = {
    hero: {
      video: "A01_Editorial_Transform_Hero.mp4",
      poster: "A01_Editorial_Transform_Hero_Poster.jpg",
      mobileVideo: "A01_Editorial_Transform_Hero_Mobile.mp4",
      mobilePoster: "A01_Editorial_Transform_Hero_Mobile_Poster.jpg",
      position: "50% 50%"
    },
    outputs: [
      { slot: "tryon", video: "A01_Editorial_Transform_Hero.mp4", poster: "A01_Editorial_Transform_Hero_Poster.jpg", position: "50% 50%" },
      { slot: "fit", video: "A06_Malik_InStore_Seedance25.mp4", poster: "A06_Malik_InStore_FIGMA.jpg", position: "50% 50%" },
      { slot: "styling", video: "A04_Male_SmartStyling.mp4", poster: "A04_Male_SmartStyling_Poster.jpg", position: "50% 50%" }
    ],
    vtoLooks: [
      { top: "VTO_Look_01_Top.jpg", bottom: "VTO_Look_01_Bottom.jpg", topName: "Metallic blazer", bottomName: "Wide-leg trouser" },
      { top: "VTO_Look_02_Top.jpg", bottom: "VTO_Look_02_Bottom.jpg", topName: "Iridescent column", bottomName: "Floor-length hem" },
      { top: "VTO_Look_03_Top.jpg", bottom: "VTO_Look_03_Bottom.jpg", topName: "Tuxedo jacket", bottomName: "Tailored trouser" },
      { top: "VTO_Look_04_Top.jpg", bottom: "VTO_Look_04_Bottom.jpg", topName: "Sculpted shell", bottomName: "Ivory trouser" },
      { top: "VTO_Look_05_Top.jpg", bottom: "VTO_Look_05_Bottom.jpg", topName: "Cropped knit", bottomName: "Column skirt" }
    ],
    channels: {
      "shopper-online": {
        video: "A05_Esme_Online_Seedance25.mp4",
        poster: "A05_Esme_Online_FIGMA.jpg",
        position: "50% 50%"
      },
      "shopper-instore": {
        video: "A06_Malik_InStore_Seedance25.mp4",
        poster: "A06_Malik_InStore_FIGMA.jpg",
        position: "50% 50%"
      },
      "shopper-vic": {
        video: "A07_Freja_VIP_Seedance25.mp4",
        poster: "A07_Freja_VIP_FIGMA.jpg",
        position: "50% 50%"
      }
    },
    demo: {
      video: "A06_Malik_InStore_Seedance25.mp4",
      poster: "A06_Malik_InStore_FIGMA.jpg",
      position: "50% 50%"
    },
    pilot: {
      video: "A04_Yuna_Styling_Seedance25.mp4",
      poster: "A04_Yuna_Styling_FIGMA.jpg",
      position: "50% 48%"
    }
  };

  let finished = false;

  function replaceVideo(video, config) {
    if (!video || video.dataset.spreeaiReplaced) return;
    video.dataset.spreeaiReplaced = "true";
    const useMobile = Boolean(config.mobileVideo && window.matchMedia("(max-width: 720px)").matches);
    video.src = useMobile ? config.mobileVideo : config.video;
    video.poster = useMobile ? (config.mobilePoster || config.poster) : config.poster;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.style.objectPosition = config.position || "50% 50%";
    video.load();
    const play = video.play();
    if (play && typeof play.catch === "function") play.catch(function () {});
  }

  function addOutputProductCard(parent, config) {
    if (parent.querySelector('[data-spreeai-product-card="' + config.slot + '"]')) return;
    const card = document.createElement("div");
    card.dataset.spreeaiProductCard = config.slot;
    card.style.cssText = [
      "position:absolute",
      "left:" + config.left,
      "top:" + config.top,
      "width:10%",
      "height:22.5%",
      "border-radius:8px",
      "overflow:hidden",
      "background:#fff",
      "box-shadow:0 1px 3px rgba(0,0,0,.18)",
      "z-index:2",
      "display:flex",
      "flex-direction:column",
      "pointer-events:none"
    ].join(";");

    const productFrame = document.createElement("div");
    productFrame.style.cssText = "position:relative;width:100%;height:74%;overflow:hidden;background:#fff";

    const product = document.createElement("img");
    product.dataset.spreeaiProductImage = config.slot;
    product.src = config.image;
    product.alt = config.name || config.label;
    product.style.cssText = "position:absolute;width:100%;height:100%;max-width:none;object-fit:cover;left:0;top:0";

    const label = document.createElement("span");
    label.dataset.spreeaiProductLabel = config.slot;
    label.style.cssText = "height:26%;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:1px;padding:0 10px;background:#f7f6f4;color:#111;font-family:Afacad,sans-serif";
    const labelType = document.createElement("small");
    labelType.textContent = config.label;
    labelType.style.cssText = "font:600 clamp(8px,.66vw,10px)/1 Afacad,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(17,17,17,.48)";
    const labelName = document.createElement("strong");
    labelName.dataset.spreeaiProductName = config.slot;
    labelName.textContent = config.name;
    labelName.style.cssText = "font:500 clamp(9px,.78vw,12px)/1.15 Afacad,sans-serif;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis";
    label.appendChild(labelType);
    label.appendChild(labelName);

    productFrame.appendChild(product);
    card.appendChild(productFrame);
    card.appendChild(label);
    parent.appendChild(card);
  }

  function setupVtoLookSync(video, parent) {
    if (!video || video.dataset.spreeaiLookSync) return;
    video.dataset.spreeaiLookSync = "true";
    const update = function () {
      const time = video.currentTime || 0;
      const lookIndex = time < 1.75 ? 0 : time < 3.45 ? 1 : time < 5 ? 2 : time < 6.8 ? 3 : 4;
      if (video.dataset.spreeaiLookIndex === String(lookIndex)) return;
      video.dataset.spreeaiLookIndex = String(lookIndex);
      const look = assets.vtoLooks[lookIndex];
      ["top", "bottom"].forEach(function (slot) {
        const image = parent.querySelector('[data-spreeai-product-image="' + slot + '"]');
        const name = parent.querySelector('[data-spreeai-product-name="' + slot + '"]');
        if (image) image.src = look[slot];
        if (name) name.textContent = look[slot + "Name"];
      });
      parent.querySelectorAll("[data-spreeai-product-card]").forEach(function (card) {
        card.animate([
          { opacity: .72, transform: "translateY(4px) scale(.985)" },
          { opacity: 1, transform: "translateY(0) scale(1)" }
        ], { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" });
      });
    };
    video.addEventListener("timeupdate", update);
    video.addEventListener("seeked", update);
    update();
  }

  function addFitIntelligenceUi(parent) {
    if (!parent || parent.querySelector('[data-spreeai-feature-ui="fit"]')) return;
    const ui = document.createElement("div");
    ui.dataset.spreeaiFeatureUi = "fit";
    ui.setAttribute("aria-label", "Fit recommendation: Medium, true to size");
    ui.innerHTML = '<span data-spreeai-ui-kicker>FIT INTELLIGENCE</span><strong>Medium</strong><span data-spreeai-fit-confidence><b>94%</b> fit confidence</span><div data-spreeai-size-row><span>XS</span><span>S</span><span data-recommended>M</span><span>L</span><span>XL</span></div><p>True to size<br><em>Relaxed through the chest</em></p>';
    parent.appendChild(ui);
  }

  function addStylingUi(parent) {
    if (!parent || parent.querySelector('[data-spreeai-feature-ui="styling"]')) return;
    const ui = document.createElement("div");
    ui.dataset.spreeaiFeatureUi = "styling";
    ui.setAttribute("aria-label", "Smart styling builds complete looks with layers and accessories");
    ui.innerHTML = '<span data-spreeai-ui-kicker>SMART STYLING</span><strong>Complete the look</strong><div data-spreeai-style-chips><span>Layer</span><span>Bag</span><span>Shoes</span></div><p>Live catalog · Look <b>01</b></p>';
    parent.appendChild(ui);
    const look = ui.querySelector("p b");
    let index = 1;
    setInterval(function () {
      index = index % 3 + 1;
      if (look) look.textContent = "0" + index;
    }, 4000);
  }

  function replaceOutputImage(image, config) {
    if (!image || image.dataset.spreeaiReplaced) return;
    image.dataset.spreeaiReplaced = "true";
    const parent = image.parentElement;
    const video = document.createElement("video");
    video.dataset.videoSlot = "output-" + config.slot;
    video.dataset.spreeaiModelFrame = "output";
    video.setAttribute("aria-label", "SPREEAI " + config.slot + " model experience");
    video.style.cssText = "position:absolute;left:50%;top:17%;transform:translateX(-50%);width:36%;height:calc(83% - 112px);object-fit:cover;object-position:" + config.position + ";background:#f2f2f2;border-radius:18px;box-shadow:var(--spree-shadow);outline:1px solid rgba(255,255,255,.5);display:block";
    image.insertAdjacentElement("beforebegin", video);
    image.style.visibility = "hidden";
    image.style.opacity = "0";
    image.style.pointerEvents = "none";
    replaceVideo(video, config);

    if (config.slot === "tryon") {
      const firstLook = assets.vtoLooks[0];
      addOutputProductCard(parent, {
        slot: "top",
        image: firstLook.top,
        name: firstLook.topName,
        label: "Top",
        left: "61%",
        top: "23%"
      });
      addOutputProductCard(parent, {
        slot: "bottom",
        image: firstLook.bottom,
        name: firstLook.bottomName,
        label: "Bottom",
        left: "29%",
        top: "54%"
      });
      setupVtoLookSync(video, parent);
    } else if (config.slot === "fit") {
      addFitIntelligenceUi(parent);
    } else if (config.slot === "styling") {
      addStylingUi(parent);
    }
  }

  function removeLegacyChannelOverlay(video) {
    const sibling = video && video.nextElementSibling;
    if (sibling && sibling.tagName === "IMG" && !sibling.alt) sibling.style.display = "none";
  }

  function injectPolishStyles() {
    if (document.getElementById("spreeai-polish-styles")) return;
    const style = document.createElement("style");
    style.id = "spreeai-polish-styles";
    style.textContent = `
      :root {
        --spree-serif: Didot, "Bodoni 72", "Big Caslon", Baskerville, "Times New Roman", serif;
        --spree-sans: Afacad, system-ui, sans-serif;
        --spree-shadow: 0 28px 72px rgba(22, 19, 16, .16), 0 3px 12px rgba(22, 19, 16, .08);
        --spree-card-radius: 24px;
        --spree-ease: cubic-bezier(.22, 1, .36, 1);
        --spree-accent: #b8a18b;
        --spree-ink: #11100f;
        --spree-cream: #f4f0eb;
      }
      body,
      [data-panel] { font-family: var(--spree-sans) !important; }
      html, body {
        overflow-x: clip !important;
        overflow-y: visible !important;
        scroll-behavior: smooth !important;
        overscroll-behavior-y: auto !important;
      }
      body {
        display: block !important;
        min-height: 100% !important;
        background: var(--spree-cream) !important;
        color: var(--spree-ink) !important;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
      }
      [data-panel] {
        position: relative !important;
        top: auto !important;
        height: 100svh !important;
        min-height: 680px !important;
        overflow: hidden !important;
        z-index: auto !important;
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
      }
      [data-panel] > [data-panel-inner] {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }
      [data-panel] [data-reveal] {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
        transition: none !important;
      }
      [data-panel] { scroll-snap-align: none !important; }
      [data-panel] h1,
      [data-panel] h2,
      [data-panel] h3 {
        font-family: var(--spree-serif) !important;
        font-weight: 400 !important;
        letter-spacing: -.035em !important;
        text-wrap: balance;
      }
      [data-panel] p,
      [data-panel] button,
      [data-panel] a { font-family: var(--spree-sans) !important; }
      [data-panel] p {
        font-weight: 400 !important;
        letter-spacing: -.012em !important;
        line-height: 1.45 !important;
        text-wrap: pretty;
      }
      [data-screen-label="01 Hero"] > [data-panel-inner] {
        background: #bbb2a8 !important;
      }
      [data-screen-label="01 Hero"] video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: 50% 50% !important;
      }
      [data-screen-label="01 Hero"] [data-dc-tpl="17"] {
        max-width: min(720px, 58vw) !important;
        padding: clamp(22px, 3vw, 42px) !important;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 22px;
        background: rgba(16,14,13,.28);
        box-shadow: 0 24px 80px rgba(0,0,0,.16);
        backdrop-filter: blur(18px) saturate(112%);
      }
      [data-screen-label="01 Hero"] h1,
      [data-screen-label="01 Hero"] p { color: #fff !important; text-shadow: 0 2px 18px rgba(0,0,0,.24); }
      nav,
      footer,
      nav a,
      footer a,
      footer span { font-family: var(--spree-sans) !important; }
      [data-spreeai-model-frame] {
        border-radius: var(--spree-card-radius) !important;
        box-shadow: var(--spree-shadow) !important;
        outline: 1px solid rgba(255,255,255,.46);
        overflow: hidden !important;
        background: rgba(255,255,255,.2);
      }
      [data-screen-label="01 Hero"] > [data-panel-inner] {
        border-radius: var(--spree-card-radius) !important;
        overflow: hidden !important;
      }
      [data-spreeai-demo] > [data-panel-inner] {
        left: 20px !important;
        top: 20px !important;
        right: 20px !important;
        bottom: 20px !important;
        width: auto !important;
        height: auto !important;
        border-radius: var(--spree-card-radius) !important;
        overflow: hidden !important;
      }
      [data-spreeai-output-visual] {
        transition: opacity .52s var(--spree-ease), transform .52s var(--spree-ease) !important;
      }
      [data-spreeai-output-visual][style*="visibility: hidden"] {
        transform: translateY(10px) scale(.985);
      }
      [data-spreeai-shopper-visual] {
        transition: opacity .52s var(--spree-ease), transform .52s var(--spree-ease) !important;
      }
      [data-spreeai-tab] {
        font-weight: 500 !important;
        transition: background-color .28s ease, color .28s ease, box-shadow .28s ease, transform .2s ease !important;
      }
      [data-spreeai-tab]:hover { transform: translateY(-1px); }
      [data-spreeai-product-card] {
        border: 1px solid rgba(17,17,17,.06);
        box-shadow: 0 12px 30px rgba(22,19,16,.12) !important;
        animation: spreeaiProductFloat 5.6s ease-in-out infinite;
      }
      [data-spreeai-product-card="bottom"] { animation-delay: -2.8s; }
      @keyframes spreeaiProductFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      [data-spreeai-feature-ui] {
        position: absolute;
        z-index: 6;
        width: clamp(190px, 17.5vw, 270px);
        padding: clamp(15px, 1.4vw, 22px);
        border: 1px solid rgba(255,255,255,.62);
        border-radius: 18px;
        color: #171513;
        background: rgba(255,255,255,.82);
        box-shadow: 0 22px 60px rgba(28,23,20,.2);
        backdrop-filter: blur(24px) saturate(130%);
        font-family: var(--spree-sans);
        pointer-events: none;
      }
      [data-spreeai-feature-ui="fit"] { left: 57%; top: 25%; }
      [data-spreeai-feature-ui="styling"] { left: 26%; top: 53%; }
      [data-spreeai-ui-kicker] {
        display: block;
        margin-bottom: 9px;
        font: 600 10px/1 var(--spree-sans);
        letter-spacing: .14em;
        color: rgba(17,15,13,.52);
      }
      [data-spreeai-feature-ui] > strong {
        display: block;
        font: 400 clamp(25px,2vw,34px)/1 var(--spree-serif);
        letter-spacing: -.025em;
      }
      [data-spreeai-fit-confidence] {
        display: block;
        margin-top: 5px;
        font-size: 12px;
        color: rgba(17,15,13,.58);
      }
      [data-spreeai-fit-confidence] b { color: #111; font-weight: 600; }
      [data-spreeai-size-row] { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; margin:15px 0 13px; }
      [data-spreeai-size-row] span {
        display:grid;
        place-items:center;
        aspect-ratio:1;
        border:1px solid rgba(17,15,13,.14);
        border-radius:50%;
        font:500 11px/1 var(--spree-sans);
        background:rgba(255,255,255,.56);
      }
      [data-spreeai-size-row] [data-recommended] {
        color:#fff;
        border-color:#111;
        background:#111;
        box-shadow:0 0 0 4px rgba(184,161,139,.22);
      }
      [data-spreeai-feature-ui] p { margin:0; font-size:12px !important; line-height:1.28 !important; }
      [data-spreeai-feature-ui] p em { color:rgba(17,15,13,.56); font-style:normal; }
      [data-spreeai-style-chips] { display:flex; flex-wrap:wrap; gap:6px; margin:15px 0 13px; }
      [data-spreeai-style-chips] span {
        padding:7px 10px;
        border:1px solid rgba(17,15,13,.14);
        border-radius:999px;
        background:rgba(255,255,255,.64);
        font:500 11px/1 var(--spree-sans);
      }
      [data-spreeai-loader] {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: grid;
        place-items: center;
        background: #f7f5f2;
        color: #080808;
        opacity: 1;
        visibility: visible;
        pointer-events: none;
        transition: opacity .72s var(--spree-ease), visibility .72s;
      }
      [data-spreeai-loader][data-exit="true"] {
        opacity: 0;
        visibility: hidden;
      }
      [data-spreeai-loader-mark] {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        animation: spreeaiLoaderMark 1.25s var(--spree-ease) both;
      }
      [data-spreeai-loader-mark] img {
        display: block;
        width: clamp(150px, 20vw, 260px);
        height: auto;
      }
      [data-spreeai-loader-line] {
        width: clamp(120px, 15vw, 210px);
        height: 1px;
        background: rgba(0,0,0,.15);
        overflow: hidden;
      }
      [data-spreeai-loader-line]::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background: #050505;
        transform-origin: left;
        animation: spreeaiLoaderLine 1.15s .12s var(--spree-ease) both;
      }
      @keyframes spreeaiLoaderMark {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spreeaiLoaderLine {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      [data-spreeai-stage-content] {
        transition: opacity .5s var(--spree-ease), transform .6s var(--spree-ease);
      }
      [data-spreeai-stage-content][data-visible="false"] {
        opacity: 0 !important;
        transform: translateY(18px) !important;
        pointer-events: none !important;
      }
      [data-spreeai-section-label] {
        position: absolute;
        z-index: 8;
        left: max(7.5rem, clamp(32px, 5vw, 80px));
        top: clamp(28px, 4vh, 54px);
        font: 600 12px/1 var(--spree-sans);
        letter-spacing: .16em;
        text-transform: uppercase;
        color: rgba(0,0,0,.52);
      }
      [data-spreeai-stat-number] {
        font-family: var(--spree-serif) !important;
        font-weight: 400 !important;
        letter-spacing: -.025em !important;
      }
      [data-spreeai-problem] h2 {
        font-family: var(--spree-serif) !important;
        letter-spacing: -.025em !important;
      }
      [data-spreeai-product] [data-panel-inner] {
        background:
          radial-gradient(circle at 52% 45%, rgba(230,217,224,.82), transparent 34%),
          linear-gradient(120deg, #f1eee9 0%, #e8ddd6 48%, #e9eef0 100%) !important;
      }
      [data-spreeai-product] [data-spreeai-output-visual] > div:first-child { opacity: .22; filter: saturate(.55); }
      [data-spreeai-product] [data-spreeai-output-visual] > h2 {
        left: 6% !important;
        top: 29% !important;
        width: 27% !important;
        height: auto !important;
        font-family: var(--spree-serif) !important;
        font-size: clamp(40px, 4vw, 70px) !important;
        line-height: 1.03 !important;
        letter-spacing: -.025em !important;
      }
      [data-spreeai-product] [data-spreeai-output-visual] > p {
        left: 73% !important;
        top: 59% !important;
        width: 20% !important;
        font-size: clamp(16px, 1.34vw, 21px) !important;
        line-height: 1.38 !important;
      }
      [data-spreeai-product] video[data-video-slot^="output-"] {
        left: 50% !important;
        top: 15.5% !important;
        width: 38% !important;
        height: calc(84.5% - 112px) !important;
        border-radius: var(--spree-card-radius) !important;
      }
      [data-spreeai-product] [data-spreeai-product-card] { width: 11.5% !important; height: 24% !important; border-radius: 12px !important; }
      [data-spreeai-product] [data-spreeai-product-card="top"] { left: 62.5% !important; top: 22% !important; }
      [data-spreeai-product] [data-spreeai-product-card="bottom"] { left: 26% !important; top: 57% !important; }
      [data-spreeai-auto-tabs] {
        padding: 6px !important;
        border-radius: 999px !important;
        background: rgba(255,255,255,.56) !important;
        border: 1px solid rgba(255,255,255,.52) !important;
        box-shadow: 0 12px 40px rgba(26,21,18,.12) !important;
        backdrop-filter: blur(22px) saturate(130%) !important;
      }
      [data-spreeai-auto-tabs] button { position: relative; overflow: hidden; }
      [data-spreeai-auto-tabs] button[data-spreeai-auto-active="true"] {
        background: rgba(255,255,255,.94) !important;
        box-shadow: 0 5px 16px rgba(20,17,15,.12) !important;
      }
      [data-spreeai-auto-tabs] button[data-spreeai-auto-active="true"]::after {
        content: "";
        position: absolute;
        left: 16%;
        right: 16%;
        bottom: 5px;
        height: 1.5px;
        border-radius: 2px;
        background: #111;
        transform-origin: left;
        animation: spreeaiTabProgress var(--spreeai-cycle, 5s) linear both;
      }
      @keyframes spreeaiTabProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      [data-spreeai-platform] [data-panel-inner] {
        background:
          radial-gradient(circle at 14% 20%, rgba(232,217,210,.9), transparent 36%),
          radial-gradient(circle at 86% 78%, rgba(204,218,221,.8), transparent 36%),
          #f4f1ed !important;
      }
      [data-spreeai-platform-header] {
        position: relative;
        padding-bottom: clamp(18px, 3vh, 36px);
      }
      [data-spreeai-platform-header]::after {
        content: "BUILT TO EVOLVE";
        position: absolute;
        top: -24px;
        left: 16.666%;
        font: 600 11px/1 var(--spree-sans);
        letter-spacing: .15em;
        color: rgba(0,0,0,.48);
      }
      [data-spreeai-platform-header] h2 { font-family: var(--spree-serif) !important; letter-spacing: -.025em !important; }
      [data-spreeai-platform-grid] {
        border: 0 !important;
        gap: clamp(10px, 1vw, 18px) !important;
      }
      [data-spreeai-platform-card] {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(18,16,14,.09) !important;
        border-radius: 18px;
        background: rgba(255,255,255,.56);
        box-shadow: 0 12px 36px rgba(43,35,30,.07);
        transition: transform .55s var(--spree-ease), background .4s, box-shadow .4s;
      }
      [data-spreeai-platform-card]::after {
        content: "";
        position: absolute;
        inset: auto -15% -55% 28%;
        height: 70%;
        border-radius: 50%;
        background: rgba(219,201,192,.42);
        filter: blur(30px);
        opacity: 0;
        transition: opacity .45s;
      }
      [data-spreeai-platform-card][data-active="true"] {
        transform: translateY(-10px);
        background: rgba(255,255,255,.88);
        box-shadow: 0 24px 64px rgba(43,35,30,.13);
      }
      [data-spreeai-platform-card][data-active="true"]::after { opacity: 1; }
      [data-spreeai-platform-card] > div:first-child {
        font-family: var(--spree-serif) !important;
        font-weight: 400 !important;
      }
      [data-spreeai-channels] [data-panel-inner] {
        background:
          radial-gradient(circle at 16% 72%, rgba(228,196,182,.85), transparent 38%),
          radial-gradient(circle at 88% 18%, rgba(188,213,223,.7), transparent 36%),
          #ece9e4 !important;
      }
      [data-spreeai-channels] [data-spreeai-shopper-visual] > div:first-child { opacity: .18; filter: saturate(.55); }
      [data-spreeai-channels] [data-spreeai-shopper-visual] > h2 {
        left: 5.5% !important;
        top: 27% !important;
        width: 24% !important;
        height: auto !important;
        font-family: var(--spree-serif) !important;
        font-size: clamp(40px, 4vw, 68px) !important;
        line-height: 1.04 !important;
        letter-spacing: -.025em !important;
      }
      [data-spreeai-channels] [data-spreeai-shopper-visual] > p {
        left: 73% !important;
        top: 59% !important;
        width: 21% !important;
        font-size: clamp(16px, 1.34vw, 21px) !important;
        line-height: 1.38 !important;
      }
      [data-spreeai-shopper-frame] {
        left: 31% !important;
        top: 14.5% !important;
        bottom: 108px !important;
        width: 38% !important;
        border-radius: var(--spree-card-radius) !important;
      }
      [data-spreeai-timeline] [data-panel-inner] {
        background:
          radial-gradient(circle at 50% 26%, rgba(83,70,61,.48), transparent 38%),
          #080808 !important;
      }
      [data-spreeai-timeline] [data-spreeai-section-label] { color: rgba(255,255,255,.58) !important; }
      [data-spreeai-timeline] h2 {
        max-width: 900px !important;
        font-size: clamp(44px, 5.3vw, 88px) !important;
        line-height: 1.02 !important;
        letter-spacing: -.025em !important;
      }
      [data-spreeai-timeline-grid] {
        border: 0 !important;
        gap: clamp(10px, 1vw, 18px);
        min-height: clamp(260px, 38vh, 420px) !important;
      }
      [data-spreeai-timeline-card] {
        border: 1px solid rgba(255,255,255,.14) !important;
        border-radius: 18px;
        background: rgba(255,255,255,.045);
        transition: transform .55s var(--spree-ease), background .4s, border-color .4s, box-shadow .4s;
      }
      [data-spreeai-timeline-card][data-active="true"] {
        transform: translateY(-12px);
        background: rgba(255,255,255,.105);
        border-color: rgba(255,255,255,.52) !important;
        box-shadow: 0 28px 70px rgba(0,0,0,.36);
      }
      [data-spreeai-timeline-card] > div:first-child > div:last-child {
        font-family: var(--spree-serif) !important;
        font-weight: 400 !important;
        font-size: clamp(42px, 4vw, 64px) !important;
      }
      [data-spreeai-timeline-card] > div:last-child > div:first-child {
        font-family: var(--spree-serif) !important;
        font-size: clamp(22px, 1.8vw, 30px) !important;
        line-height: 1.08 !important;
      }
      [data-spreeai-mobile-timeline] { display:none; }
      [data-spreeai-pilot-frame] {
        width: calc(100% - clamp(80px, 12vw, 190px)) !important;
        max-width: 1460px !important;
        aspect-ratio: 16 / 7.2 !important;
        max-height: 42vh !important;
        border-radius: var(--spree-card-radius) !important;
      }
      [data-spreeai-pilot-frame] video { object-position: 50% 20% !important; }
      footer[data-spreeai-footer] {
        position: relative !important;
        z-index: 12 !important;
        padding: clamp(28px,3.8vw,48px) clamp(30px,7vw,110px) 20px !important;
        gap: 18px !important;
        scroll-snap-align: none !important;
      }
      [data-spreeai-social-links] a {
        color: rgba(255,255,255,.74) !important;
        font: 400 16px/1.2 var(--spree-sans) !important;
        transition: color .2s, transform .2s;
      }
      [data-spreeai-social-links] a:hover { color: #fff !important; transform: translateY(-2px); }
      [data-spreeai-socials] {
        display: grid;
        grid-template-columns: auto minmax(0,1fr) auto;
        align-items: center;
        gap: 18px 30px;
        width: 100%;
        max-width: 1240px;
        margin: 0 auto;
        padding-top: 0;
        border-top: 0;
      }
      [data-spreeai-social-label] {
        color: #fff;
        font: 500 13px/1 var(--spree-sans);
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      [data-spreeai-social-links] { display:flex; flex-wrap:wrap; justify-content:center; gap:clamp(20px,3vw,46px); }
      [data-spreeai-back-top] {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #fff !important;
        font: 500 15px/1 var(--spree-sans) !important;
        white-space: nowrap;
        text-decoration: none;
        transition: color .25s ease, transform .25s var(--spree-ease);
      }
      [data-spreeai-back-top] span {
        display: grid;
        place-items: center;
        width: 31px;
        height: 31px;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 50%;
        transition: border-color .25s ease, background .25s ease;
      }
      [data-spreeai-back-top]:hover { color: var(--spree-accent) !important; transform: translateY(-2px); }
      [data-spreeai-back-top]:hover span { border-color: var(--spree-accent); background: rgba(173,153,134,.12); }
      [data-spreeai-footer-wordmark] {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto -6px;
        overflow: hidden;
      }
      [data-spreeai-footer-wordmark] a { display:block; width:100%; }
      [data-spreeai-footer-wordmark] img {
        display: block;
        width: 100% !important;
        height: auto !important;
        max-height: none !important;
        filter: brightness(0) invert(1);
        opacity: .97;
        transform: scale(1.004);
        transform-origin: center;
      }
      [data-spreeai-scroll-meter] {
        position: fixed;
        z-index: 100000;
        top: 0;
        right: 9px;
        width: 2px;
        height: 100dvh;
        background: rgba(34,31,29,.18);
        pointer-events: none;
      }
      [data-spreeai-scroll-progress] {
        display: block;
        width: 100%;
        height: 100%;
        background: var(--spree-accent);
        box-shadow: 0 0 12px rgba(173,153,134,.32);
        transform: scaleY(0);
        transform-origin: top;
        will-change: transform;
      }
      [data-spreeai-pilot-cta] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        color: #fff !important;
        border: 1px solid rgba(255,255,255,.08) !important;
        background: linear-gradient(135deg,#050505,#24201d) !important;
        box-shadow: 0 10px 28px rgba(0,0,0,.24) !important;
        transform-origin: center;
        animation: spreeaiPilotPulse 5.8s var(--spree-ease) infinite !important;
      }
      [data-spreeai-pilot-cta]::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: -120%;
        bottom: -120%;
        left: -55%;
        width: 42%;
        background: linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
        transform: rotate(18deg) translateX(-120%);
        animation: spreeaiPilotShine 5.8s ease-in-out infinite;
      }
      [data-spreeai-pilot-cta]::after {
        content: "";
        position: absolute;
        inset: -1px;
        z-index: -2;
        border: 1px solid rgba(201,178,154,.8);
        border-radius: inherit;
        opacity: 0;
        animation: spreeaiPilotRing 5.8s var(--spree-ease) infinite;
      }
      [data-spreeai-pilot-cta]:hover {
        transform: translateY(-2px) scale(1.025) !important;
        box-shadow: 0 16px 38px rgba(0,0,0,.3) !important;
      }
      @keyframes spreeaiPilotPulse {
        0%, 60%, 100% { transform: translateY(0) scale(1); box-shadow: 0 10px 28px rgba(0,0,0,.24); }
        68% { transform: translateY(-2px) scale(1.055); box-shadow: 0 16px 44px rgba(0,0,0,.32), 0 0 0 8px rgba(184,161,139,.13); }
        77% { transform: translateY(0) scale(1.015); box-shadow: 0 12px 34px rgba(0,0,0,.28), 0 0 0 2px rgba(184,161,139,.08); }
      }
      @keyframes spreeaiPilotShine {
        0%, 59% { transform: rotate(18deg) translateX(-140%); opacity: 0; }
        64% { opacity: .85; }
        76% { transform: rotate(18deg) translateX(520%); opacity: .15; }
        77%, 100% { transform: rotate(18deg) translateX(520%); opacity: 0; }
      }
      @keyframes spreeaiPilotRing {
        0%, 62%, 100% { opacity:0; transform:scale(1); }
        68% { opacity:.75; transform:scale(1.08); }
        78% { opacity:0; transform:scale(1.14); }
      }
      [data-spreeai-scroll-cue] {
        position: fixed;
        left: auto;
        right: clamp(16px,2vw,30px);
        top: 50%;
        bottom: auto;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        border: 0;
        background: transparent;
        color: rgba(239,229,219,.96);
        font: 500 12px/1 var(--spree-sans);
        letter-spacing: .08em;
        text-transform: uppercase;
        cursor: pointer;
        opacity: 1;
        transform: translateY(-50%);
        transition: opacity .35s ease, transform .35s var(--spree-ease);
        text-shadow: 0 1px 8px rgba(0,0,0,.32);
      }
      [data-spreeai-scroll-cue] > span:first-child {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
      }
      [data-spreeai-scroll-cue][data-hidden="true"] {
        opacity: 0;
        transform: translate(10px,-50%);
        pointer-events: none;
      }
      [data-spreeai-scroll-track] {
        position: relative;
        display: block;
        width: 22px;
        height: 34px;
        border: 1px solid rgba(227,213,199,.82);
        border-radius: 999px;
        background: rgba(0,0,0,.08);
        backdrop-filter: blur(8px);
      }
      [data-spreeai-scroll-dot] {
        position: absolute;
        left: 50%;
        top: 7px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #d8c4b0;
        transform: translateX(-50%);
        animation: spreeaiScrollDot 1.7s var(--spree-ease) infinite;
      }
      @keyframes spreeaiScrollDot {
        0% { opacity: 0; transform: translate(-50%,0); }
        22% { opacity: 1; }
        75% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%,15px); }
      }
      [data-spreeai-demo-cta] > [data-panel-inner] {
        isolation: isolate;
        display: grid !important;
        place-items: center !important;
        padding-bottom: 88px !important;
        box-sizing: border-box !important;
        background: #141210 !important;
      }
      [data-spreeai-demo-cta] > [data-panel-inner]::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: linear-gradient(110deg,rgba(11,9,8,.86),rgba(11,9,8,.46) 52%,rgba(11,9,8,.74));
        pointer-events: none;
      }
      [data-spreeai-demo-cta] video[data-video-slot="demo"] {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        filter: saturate(.62) contrast(1.03);
      }
      [data-spreeai-demo-card] {
        position: relative;
        z-index: 4;
        display: grid;
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        animation: none !important;
        grid-template-columns: minmax(280px,.82fr) minmax(360px,1.18fr);
        width: min(1040px, calc(100% - clamp(56px,10vw,170px)));
        min-height: min(560px, 68vh);
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.28);
        border-radius: 28px;
        background: rgba(246,242,237,.94);
        box-shadow: 0 40px 120px rgba(0,0,0,.36);
        backdrop-filter: blur(28px) saturate(118%);
      }
      [data-spreeai-demo-portrait] { position:relative; min-height:420px; overflow:hidden; background:#d8cec5; }
      [data-spreeai-demo-portrait]::after {
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(180deg,transparent 62%,rgba(18,15,13,.18));
        pointer-events:none;
      }
      [data-spreeai-demo-portrait] img { display:block; width:100%; height:100%; object-fit:cover; object-position:50% 20%; }
      [data-spreeai-demo-copy] {
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:flex-start;
        padding:clamp(38px,5vw,78px);
        color:#151311;
      }
      [data-spreeai-demo-copy] > span { font:600 11px/1 var(--spree-sans); letter-spacing:.16em; color:rgba(21,19,17,.48); }
      [data-spreeai-demo-copy] h2 { margin:22px 0 18px; font-size:clamp(48px,5.3vw,84px) !important; line-height:.94 !important; }
      [data-spreeai-demo-copy] p { max-width:520px; margin:0; font-size:clamp(17px,1.45vw,21px) !important; color:rgba(21,19,17,.68); }
      [data-spreeai-demo-actions] { display:flex; flex-wrap:wrap; gap:10px; margin-top:32px; }
      [data-spreeai-demo-actions] a {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:48px;
        padding:0 22px;
        border:1px solid rgba(21,19,17,.18);
        border-radius:999px;
        color:#151311 !important;
        background:rgba(255,255,255,.38);
        font-weight:500 !important;
        text-decoration:none;
        transition:transform .24s var(--spree-ease),background .24s,color .24s;
      }
      [data-spreeai-demo-actions] a:last-child { color:#fff !important; border-color:#151311; background:#151311; }
      [data-spreeai-demo-actions] a:hover { transform:translateY(-2px); }
      [data-spreeai-demo-cta] [data-spreeai-section-label] { z-index:6; color:rgba(255,255,255,.74) !important; opacity:1 !important; }
      @media (prefers-reduced-motion: reduce) {
        [data-spreeai-scroll-dot] { animation: none; }
        [data-spreeai-output-visual], [data-spreeai-shopper-visual] { transition: opacity .2s ease !important; }
        [data-spreeai-loader-mark], [data-spreeai-loader-line]::after,
        [data-spreeai-product-card], [data-spreeai-pilot-cta],
        [data-spreeai-auto-tabs] button[data-spreeai-auto-active="true"]::after { animation: none !important; }
      }
      @media (max-width: 980px) {
        [data-spreeai-product] video[data-video-slot^="output-"] { width: 46% !important; }
        [data-spreeai-product] [data-spreeai-output-visual] > h2,
        [data-spreeai-channels] [data-spreeai-shopper-visual] > h2 { left: 4% !important; width: 27% !important; font-size: clamp(34px,5vw,54px) !important; }
        [data-spreeai-product] [data-spreeai-output-visual] > p,
        [data-spreeai-channels] [data-spreeai-shopper-visual] > p { left: 76% !important; width: 20% !important; }
        [data-spreeai-shopper-frame] { left: 28% !important; width: 44% !important; }
      }
      @media (max-width: 720px) {
        html, body, [data-panel] { max-width: 100vw !important; overflow-x: hidden !important; }
        #dc-root { width: 100vw !important; max-width: 100vw !important; overflow-x: hidden !important; }
        #dc-root > .sc-host,
        #dc-root > .sc-host > div { width: 100vw !important; max-width: 100vw !important; overflow-x: hidden !important; }
        [data-spreeai-scroll-cue] { right: 10px; }
        [data-spreeai-scroll-meter] { right: 5px; }
        [data-spreeai-scroll-cue] > span:first-child { display: none; }
        [data-spreeai-section-label] { left: 24px; }
        [data-spreeai-product] video[data-video-slot^="output-"], [data-spreeai-shopper-frame] {
          left: 50% !important; top: 19% !important; width: 76% !important; height: 49% !important; bottom: auto !important;
        }
        [data-spreeai-product] [data-spreeai-output-visual] > h2,
        [data-spreeai-channels] [data-spreeai-shopper-visual] > h2 { left: 8% !important; top: 70% !important; width: 84% !important; font-size: 34px !important; }
        [data-spreeai-product] [data-spreeai-output-visual] > p,
        [data-spreeai-channels] [data-spreeai-shopper-visual] > p { display:none; }
        [data-spreeai-platform] [data-panel-inner] {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          padding: 76px 24px 28px !important;
        }
        [data-spreeai-platform-header] {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 16px !important;
          padding: 0 0 24px !important;
        }
        [data-spreeai-platform-header]::after {
          position: static !important;
          grid-row: 1;
          grid-column: 1 !important;
          margin-bottom: 2px;
        }
        [data-spreeai-platform-header] h2 {
          grid-column: 1 !important;
          grid-row: 2;
          width: 100% !important;
          max-width: 330px !important;
          font-size: 42px !important;
          line-height: 1.02 !important;
        }
        [data-spreeai-platform-header] p {
          grid-column: 1 !important;
          grid-row: 3;
          width: 100% !important;
          max-width: 330px !important;
          font-size: 16px !important;
          line-height: 1.38 !important;
        }
        [data-spreeai-timeline] h2 {
          width: calc(100% - 48px) !important;
          max-width: 330px !important;
          font-size: 42px !important;
          line-height: 1.02 !important;
        }
        [data-spreeai-timeline] [data-panel-inner] > *:not([data-spreeai-mobile-timeline]) { display:none !important; }
        [data-spreeai-mobile-timeline] {
          position:absolute;
          inset:0;
          display:flex !important;
          flex-direction:column;
          justify-content:center;
          gap:18px;
          padding:64px 24px 104px;
          box-sizing:border-box;
          color:#fff;
          opacity:1 !important;
          transform:none !important;
        }
        [data-spreeai-mobile-timeline] > span { font:600 10px/1 var(--spree-sans); letter-spacing:.16em; color:rgba(255,255,255,.58); }
        [data-spreeai-mobile-timeline] > h2 {
          width:100% !important;
          max-width:320px !important;
          margin:0 !important;
          font-size:44px !important;
          line-height:.98 !important;
          color:#fff !important;
        }
        [data-spreeai-mobile-timeline] > div { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
        [data-spreeai-mobile-timeline] article {
          min-height:170px;
          padding:16px;
          border:1px solid rgba(255,255,255,.16);
          border-radius:16px;
          background:rgba(255,255,255,.055);
          box-shadow:0 18px 46px rgba(0,0,0,.16);
        }
        [data-spreeai-mobile-timeline] article small { display:block; font:600 9px/1 var(--spree-sans); letter-spacing:.12em; color:rgba(255,255,255,.52); }
        [data-spreeai-mobile-timeline] article strong { display:block; margin:12px 0 10px; font:400 22px/1 var(--spree-serif); letter-spacing:-.02em; }
        [data-spreeai-mobile-timeline] article p { margin:0; font-size:12px !important; line-height:1.3 !important; color:rgba(255,255,255,.7); }
        [data-panel][data-screen-label="08 Pilot CTA"] h2,
        [data-panel][data-screen-label="08 Pilot CTA"] p {
          left: 24px !important;
          right: 24px !important;
          width: auto !important;
          max-width: 342px !important;
        }
        [data-panel][data-screen-label="08 Pilot CTA"] h2 {
          font-size: 38px !important;
          line-height: 1.02 !important;
        }
        [data-spreeai-product] [data-spreeai-product-card] { display:flex !important; width:90px !important; height:148px !important; border-radius:10px !important; }
        [data-spreeai-product] [data-spreeai-product-card="top"] { left:67% !important; top:23% !important; }
        [data-spreeai-product] [data-spreeai-product-card="bottom"] { left:8% !important; top:49% !important; }
        [data-spreeai-feature-ui] { width:150px; padding:12px; border-radius:14px; }
        [data-spreeai-feature-ui="fit"] { left:auto; right:8%; top:37%; }
        [data-spreeai-feature-ui="styling"] { left:8%; top:46%; }
        [data-spreeai-size-row] { gap:3px; margin:10px 0; }
        [data-spreeai-size-row] span { font-size:9px; }
        [data-spreeai-style-chips] { margin:10px 0; }
        [data-spreeai-style-chips] span { padding:5px 7px; font-size:9px; }
        [data-spreeai-demo-card] {
          grid-template-columns:1fr;
          width:calc(100% - 40px);
          min-height:0;
          max-height:calc(100svh - 150px);
          border-radius:20px;
        }
        [data-spreeai-demo-cta] > [data-panel-inner] { padding-bottom:88px !important; }
        [data-spreeai-demo-portrait] { min-height:0; height:38vh; }
        [data-spreeai-demo-copy] { padding:24px; }
        [data-spreeai-demo-copy] h2 { margin:12px 0 10px; font-size:38px !important; }
        [data-spreeai-demo-copy] p { font-size:15px !important; line-height:1.35 !important; }
        [data-spreeai-demo-actions] { margin-top:18px; gap:8px; }
        [data-spreeai-demo-actions] a { min-height:42px; padding:0 14px; font-size:13px !important; }
        [data-spreeai-platform-grid], [data-spreeai-timeline-grid] { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        [data-spreeai-platform-card], [data-spreeai-timeline-card] { min-height: 132px !important; padding: 16px !important; }
        [data-spreeai-socials] { grid-template-columns:1fr auto; align-items:start; }
        [data-spreeai-social-links] { grid-column:1 / -1; width:100%; justify-content:flex-start; gap:18px 28px; }
        [data-spreeai-footer-wordmark] { margin-top: 0; }
        [data-spreeai-pilot-frame] { width: calc(100% - 40px) !important; aspect-ratio: 16/8 !important; }
        [data-screen-label="01 Hero"] [data-dc-tpl="17"] {
          left: 20px !important;
          right: 20px !important;
          width: auto !important;
          max-width: none !important;
          bottom: 128px !important;
          gap: 13px !important;
          padding: 18px 20px !important;
          border-radius: 18px !important;
          background: rgba(16,14,13,.34) !important;
          backdrop-filter: blur(16px) saturate(112%) !important;
        }
        [data-screen-label="01 Hero"] video {
          object-fit: cover !important;
          object-position: 50% 50% !important;
          background: linear-gradient(160deg,#8f8880,#d8d1cb 58%,#a49b93) !important;
        }
        [data-screen-label="01 Hero"] [data-dc-tpl="18"] {
          max-width: 330px !important;
          width: 100% !important;
          font-size: 42px !important;
          line-height: .98 !important;
        }
        [data-screen-label="01 Hero"] [data-dc-tpl="20"] {
          width: 100% !important;
          max-width: 320px !important;
          font-size: 15px !important;
          line-height: 1.35 !important;
        }
        [data-screen-label="01 Hero"] [data-dc-tpl="21"] {
          max-width: 342px !important;
          width: 100% !important;
          gap: 8px !important;
        }
        [data-screen-label="01 Hero"] button {
          flex: 0 1 auto !important;
          min-width: 0 !important;
          height: 42px !important;
          padding: 8px 14px !important;
          font-size: 13px !important;
          white-space: nowrap !important;
        }
        [data-screen-label="01 Hero"] [data-dc-tpl="21"] > * { min-width: 0 !important; }
        nav.om-nav {
          bottom: 18px !important;
          width: calc(100% - 24px) !important;
          max-width: none !important;
          justify-content: space-between !important;
          padding: 9px 10px 9px 16px !important;
          overflow: visible !important;
        }
        nav.om-nav .om-nav-links {
          flex: 0 0 auto !important;
          width: auto !important;
          max-width: none !important;
          margin-left: 10px !important;
          opacity: 1 !important;
          animation: none !important;
          overflow: visible !important;
        }
        nav.om-nav .om-nav-links > a:not(:last-child) { display: none !important; }
        nav.om-nav .om-nav-links > a:last-child {
          display: inline-flex !important;
          margin-left: 0 !important;
          padding: 9px 15px !important;
          font-size: 13px !important;
        }
        nav.om-nav img[alt="SPREEAI"] { max-width: 92px !important; }
        [data-spreeai-scroll-cue], [data-spreeai-scroll-meter] { display: none !important; }
        [data-panel] { height: 100svh !important; min-height: 640px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function replacePilotArtwork() {
    const slot = document.querySelector("image-slot#pilot");
    if (!slot) return;
    const artwork = slot.parentElement;
    const panel = slot.closest("[data-panel]");
    const inner = panel && panel.firstElementChild;
    if (!artwork || !inner) return;

    const video = document.createElement("video");
    video.dataset.videoSlot = "pilot";
    video.setAttribute("aria-label", "SPREEAI model styling experience in motion");
    video.style.cssText = "display:block;width:100%;height:100%;object-fit:cover;object-position:center";
    slot.replaceWith(video);
    replaceVideo(video, assets.pilot);

    artwork.style.width = "min(900px,72%)";
    artwork.style.aspectRatio = "16 / 7";
    artwork.style.maxHeight = "32vh";
    artwork.style.borderRadius = "16px";
    artwork.style.background = "#f1f1f1";
    artwork.style.boxShadow = "var(--spree-shadow)";
    artwork.style.outline = "1px solid rgba(17,17,17,.06)";
    artwork.dataset.spreeaiModelFrame = "pilot";
    artwork.dataset.spreeaiPilotFrame = "true";

    const pilotObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const play = video.play();
          if (play && typeof play.catch === "function") play.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "25% 0px 25% 0px", threshold: 0 });
    pilotObserver.observe(video);

    inner.dataset.spreeaiPilotRefined = "true";
    inner.style.justifyContent = "center";
    inner.style.gap = "clamp(10px,1.6vh,18px)";
    inner.style.padding = "clamp(24px,3.5vh,44px) max(7.5rem,clamp(32px,5vw,80px)) 112px";
    inner.style.background = "radial-gradient(circle at 50% 34%, rgba(238,231,226,.7), rgba(255,255,255,0) 42%), #fff";
    const content = artwork.nextElementSibling;
    if (content) {
      const actions = content.nextElementSibling;
      if (actions) {
        actions.style.position = "static";
        actions.style.marginTop = "0";
        actions.style.transform = "none";
        actions.style.flexWrap = "wrap";
        actions.style.justifyContent = "center";
      }
      content.style.maxWidth = "900px";
      content.style.gap = "clamp(8px,1.4vh,14px)";
      content.style.padding = "0";
      content.style.border = "0";
      content.style.borderRadius = "0";
      content.style.background = "transparent";
      content.style.boxShadow = "none";
      content.style.backdropFilter = "none";
      const heading = content.querySelector("h2");
      if (heading) {
        heading.style.maxWidth = "860px";
        heading.style.fontSize = "clamp(30px,3.15vw,48px)";
        heading.style.lineHeight = "1.04";
      }
      const paragraph = content.querySelector("p");
      if (paragraph) {
        paragraph.style.maxWidth = "620px";
        paragraph.style.fontSize = "clamp(16px,1.35vw,19px)";
      }
      content.querySelectorAll("button").forEach(function (button) {
        button.style.minHeight = "46px";
        button.style.fontWeight = "500";
      });
    }
  }

  function polishModelPanels() {
    const outputVideos = Array.from(document.querySelectorAll('video[data-video-slot^="output-"]'));
    outputVideos.forEach(function (video) {
      const visual = video.parentElement;
      if (visual) visual.dataset.spreeaiOutputVisual = "true";
      video.dataset.spreeaiModelFrame = "output";
    });

    document.querySelectorAll('video[data-video-slot^="shopper-"]').forEach(function (video) {
      const frame = video.parentElement;
      const visual = frame && frame.parentElement;
      if (frame) {
        frame.dataset.spreeaiModelFrame = "shopper";
        frame.dataset.spreeaiShopperFrame = "true";
      }
      if (visual) visual.dataset.spreeaiShopperVisual = "true";
    });

    document.querySelectorAll("[data-panel] button").forEach(function (button) {
      button.dataset.spreeaiTab = "true";
      if (button.dataset.spreeaiPolishBound) return;
      button.dataset.spreeaiPolishBound = "true";
      button.addEventListener("click", function () {
        setTimeout(function () {
          applyPlatformCopy();
          const panel = button.closest("[data-panel]");
          if (!panel) return;
          const visibleMedia = Array.from(panel.querySelectorAll("img,video")).filter(function (media) {
            const host = media.parentElement;
            return host && getComputedStyle(host).visibility !== "hidden" && getComputedStyle(host).opacity !== "0";
          });
          visibleMedia.forEach(function (media) {
            media.animate([
              { opacity: .42, transform: "translateY(8px) scale(.992)" },
              { opacity: 1, transform: "translateY(0) scale(1)" }
            ], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" });
          });
        }, 0);
      });
    });
  }

  function addScrollCue() {
    if (document.querySelector("[data-spreeai-scroll-cue]")) return;
    const cue = document.createElement("button");
    cue.type = "button";
    cue.setAttribute("aria-label", "Scroll to explore the SPREEAI experience");
    cue.dataset.spreeaiScrollCue = "true";
    cue.innerHTML = '<span>Scroll to explore</span><span data-spreeai-scroll-track><span data-spreeai-scroll-dot></span></span>';
    const update = function () {
      cue.dataset.hidden = window.scrollY > Math.min(120, window.innerHeight * .16) ? "true" : "false";
    };
    cue.addEventListener("click", function () {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    });
    window.addEventListener("scroll", update, { passive: true });
    update();
    document.body.appendChild(cue);
  }

  function addScrollMeter() {
    if (document.querySelector("[data-spreeai-scroll-meter]")) return;
    const meter = document.createElement("div");
    meter.dataset.spreeaiScrollMeter = "true";
    meter.setAttribute("aria-hidden", "true");
    const progress = document.createElement("span");
    progress.dataset.spreeaiScrollProgress = "true";
    meter.appendChild(progress);

    let frame = null;
    const update = function () {
      frame = null;
      const page = document.documentElement;
      const distance = Math.max(1, page.scrollHeight - window.innerHeight);
      const value = Math.min(1, Math.max(0, window.scrollY / distance));
      progress.style.transform = "scaleY(" + value.toFixed(4) + ")";
    };
    const requestUpdate = function () {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    document.body.appendChild(meter);
    update();
  }

  function addBrandLoader() {
    let loader = document.querySelector("[data-spreeai-loader]");
    if (loader && loader.dataset.spreeaiLoaderStarted) return;
    const mark = document.querySelector("nav img[alt='SPREEAI']") || document.querySelector("footer img[alt='SPREEAI']");
    if (!loader) {
      loader = document.createElement("div");
      loader.dataset.spreeaiLoader = "true";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-label", "Loading SPREEAI");
      const loaderMark = document.createElement("div");
      loaderMark.dataset.spreeaiLoaderMark = "true";
      if (mark) {
        const logo = mark.cloneNode(true);
        logo.removeAttribute("style");
        logo.alt = "SPREEAI";
        loaderMark.appendChild(logo);
      } else {
        const wordmark = document.createElement("span");
        wordmark.textContent = "SPREEAI";
        wordmark.style.cssText = "font:400 clamp(46px,7vw,82px)/1 var(--spree-serif);letter-spacing:-.04em";
        loaderMark.appendChild(wordmark);
      }
      const line = document.createElement("span");
      line.dataset.spreeaiLoaderLine = "true";
      loaderMark.appendChild(line);
      loader.appendChild(loaderMark);
      document.body.appendChild(loader);
    }
    loader.dataset.spreeaiLoaderStarted = "true";
    document.documentElement.dataset.spreeaiLoading = "false";
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
    const finish = function () {
      loader.dataset.exit = "true";
      setTimeout(function () { loader.remove(); }, 820);
    };
    setTimeout(finish, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 350 : 1550);
  }

  function panelMap() {
    const panels = {};
    document.querySelectorAll("[data-panel]").forEach(function (panel) {
      panels[panel.dataset.screenLabel] = panel;
    });
    return panels;
  }

  function removeRedundantPilotPanel() {
    const panel = panelMap()["08 Pilot CTA"];
    if (panel) panel.remove();
  }

  function removeRequestedChannelsPanel() {
    const panel = panelMap()["05 Shopper types"];
    if (panel) panel.remove();
  }

  function buildLiveDemoCta() {
    const panel = panelMap()["07 Live demo"];
    if (!panel || panel.dataset.spreeaiDemoCta) return;
    const inner = panel.firstElementChild;
    if (!inner) return;
    panel.dataset.spreeaiDemoCta = "true";

    const legacyArtwork = panel.querySelector('img[alt*="Try SPREEAI"]');
    if (legacyArtwork) {
      legacyArtwork.style.display = "none";
      legacyArtwork.setAttribute("aria-hidden", "true");
    }

    const card = document.createElement("div");
    card.dataset.spreeaiDemoCard = "true";

    const media = document.createElement("div");
    media.dataset.spreeaiDemoPortrait = "true";
    const image = document.createElement("img");
    image.src = "A01_Nyah_Hero_FIGMA.jpg";
    image.alt = "Black woman featured in the SPREEAI live experience";
    media.appendChild(image);

    const copy = document.createElement("div");
    copy.dataset.spreeaiDemoCopy = "true";
    copy.innerHTML = '<span>SEE IT ON YOUR CATALOG</span><h2>Try SPREEAI live.</h2><p>See virtual try-on, fit intelligence, and styling working together on a real shopping journey.</p><div data-spreeai-demo-actions><a href="https://demo.spreeai.com/">See a live demo</a><a href="https://spreeai.com/create-account/">Start a Pilot</a></div>';

    card.appendChild(media);
    card.appendChild(copy);
    inner.appendChild(card);
  }

  function buildMobileTimeline(panel) {
    if (!panel || panel.querySelector("[data-spreeai-mobile-timeline]")) return;
    const inner = panel.firstElementChild;
    if (!inner) return;
    const timeline = document.createElement("div");
    timeline.dataset.spreeaiMobileTimeline = "true";
    timeline.innerHTML = '<span>THE PILOT</span><h2>Prove it on your catalog.</h2><div><article><small>STEP 01</small><strong>Select products</strong><p>Choose a representative catalog set. No reshoots.</p></article><article><small>STEP 02</small><strong>Match the brand</strong><p>Tune the experience to your brand and journey.</p></article><article><small>STEP 03</small><strong>Launch</strong><p>Go live on selected product pages.</p></article><article><small>STEP 04</small><strong>Measure, then scale</strong><p>Learn what works. Expand when the value is clear.</p></article></div>';
    inner.appendChild(timeline);
  }

  function addSectionLabel(panel, label) {
    if (!panel || panel.querySelector("[data-spreeai-section-label]")) return;
    const item = document.createElement("div");
    item.dataset.spreeaiSectionLabel = "true";
    item.textContent = label;
    panel.firstElementChild.appendChild(item);
  }

  function setupCleanPanelTransitions() {
    const panels = Array.from(document.querySelectorAll("[data-panel]"));
    panels.forEach(function (panel) {
      panel.style.position = "relative";
      panel.style.top = "auto";
      panel.style.zIndex = "auto";
      panel.style.opacity = "1";
      panel.style.transform = "none";
      panel.style.animation = "none";
      const inner = panel.firstElementChild;
      if (!inner) return;
      inner.style.animation = "none";
      inner.style.opacity = "1";
      inner.style.transform = "none";
      inner.style.transition = "none";
      inner.dataset.visible = "true";
      Array.from(inner.children).forEach(function (child) {
        child.dataset.spreeaiPanelChild = "true";
      });
    });
  }

  function setupAutoCycle(panel, buttons, interval) {
    if (!panel || !buttons.length || panel.dataset.spreeaiAutoCycle) return;
    panel.dataset.spreeaiAutoCycle = "true";
    const controls = buttons[0].parentElement;
    if (controls) {
      controls.dataset.spreeaiAutoTabs = "true";
      controls.style.setProperty("--spreeai-cycle", interval + "ms");
    }
    const visuals = Array.from(panel.querySelectorAll("[data-spreeai-output-visual],[data-spreeai-shopper-visual]"));
    const visibleIndex = visuals.findIndex(function (visual) {
      const style = getComputedStyle(visual);
      return style.visibility !== "hidden" && style.opacity !== "0";
    });
    let index = visibleIndex >= 0 ? visibleIndex : Math.max(0, buttons.findIndex(function (button) {
      const bg = getComputedStyle(button).backgroundColor;
      return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    }));
    let timer = null;
    let active = false;
    const syncPlayback = function () {
      panel.querySelectorAll("video").forEach(function (video) {
        const visual = video.closest("[data-spreeai-output-visual],[data-spreeai-shopper-visual]");
        const style = visual && getComputedStyle(visual);
        if (!visual || (style.visibility !== "hidden" && style.opacity !== "0")) {
          const play = video.play();
          if (play && typeof play.catch === "function") play.catch(function () {});
        } else {
          video.pause();
        }
      });
    };
    const setActive = function (nextIndex, shouldClick) {
      index = nextIndex;
      buttons.forEach(function (button, buttonIndex) {
        button.dataset.spreeaiAutoActive = buttonIndex === index ? "true" : "false";
      });
      if (shouldClick) {
        buttons[index].dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        setTimeout(syncPlayback, 80);
      } else {
        syncPlayback();
      }
    };
    const start = function () {
      if (timer || !active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(function () { setActive((index + 1) % buttons.length, true); }, interval);
    };
    const stop = function () { if (timer) clearInterval(timer); timer = null; };
    buttons.forEach(function (button, buttonIndex) {
      button.addEventListener("click", function () {
        setActive(buttonIndex, false);
        stop();
        start();
      });
    });
    const syncVisibility = function () {
      const localScroll = window.scrollY - panel.offsetTop;
      const nextActive = localScroll >= -window.innerHeight * .18 && localScroll < window.innerHeight * .88;
      if (nextActive && !active) {
        active = true;
        setActive(index, false);
        start();
      } else if (!nextActive && active) {
        active = false;
        stop();
        panel.querySelectorAll("video").forEach(function (video) { video.pause(); });
      }
    };
    let visibilityQueued = false;
    const scheduleVisibility = function () {
      if (visibilityQueued) return;
      visibilityQueued = true;
      requestAnimationFrame(function () {
        visibilityQueued = false;
        syncVisibility();
      });
    };
    window.addEventListener("scroll", scheduleVisibility, { passive: true });
    window.addEventListener("resize", scheduleVisibility);
    setActive(index, false);
    syncVisibility();
  }

  function redesignCorePanels() {
    const panels = panelMap();
    const problem = panels["02 Problem"];
    const product = panels["03 One input"];
    const platform = panels["04 Why SPREEAI"];
    const channels = panels["05 Shopper types"];
    const timeline = panels["06 Pilot timeline"];
    const demo = panels["07 Live demo"];

    if (problem) {
      problem.dataset.spreeaiProblem = "true";
      addSectionLabel(problem, "What SPREEAI does");
      const statWords = Array.from(problem.querySelectorAll("div,span")).filter(function (element) {
        return ["ONE", "THREE", "EVERY"].indexOf(element.textContent.trim()) >= 0 && element.children.length === 0;
      });
      statWords.forEach(function (word) { word.dataset.spreeaiStatNumber = "true"; });
    }
    if (product) {
      product.dataset.spreeaiProduct = "true";
      addSectionLabel(product, "The product");
      setupAutoCycle(product, Array.from(product.querySelectorAll("button")), 5200);
    }
    if (platform) {
      platform.dataset.spreeaiPlatform = "true";
      const inner = platform.firstElementChild;
      const header = inner && inner.children[0];
      const grid = inner && inner.children[1];
      if (header) header.dataset.spreeaiPlatformHeader = "true";
      if (grid) {
        grid.dataset.spreeaiPlatformGrid = "true";
        Array.from(grid.children).forEach(function (card) { card.dataset.spreeaiPlatformCard = "true"; });
      }
    }
    if (channels) {
      channels.dataset.spreeaiChannels = "true";
      addSectionLabel(channels, "Where it works");
      setupAutoCycle(channels, Array.from(channels.querySelectorAll("button")), 5600);
    }
    if (timeline) {
      timeline.dataset.spreeaiTimeline = "true";
      addSectionLabel(timeline, "The pilot");
      buildMobileTimeline(timeline);
      const grid = timeline.firstElementChild && timeline.firstElementChild.children[1];
      if (grid) {
        grid.dataset.spreeaiTimelineGrid = "true";
        Array.from(grid.children).forEach(function (card) { card.dataset.spreeaiTimelineCard = "true"; });
      }
    }
    if (demo) {
      demo.dataset.spreeaiDemo = "true";
      addSectionLabel(demo, "SPREEAI in motion");
    }
  }

  function setupCardSpotlights() {
    ["[data-spreeai-platform-grid]", "[data-spreeai-timeline-grid]"].forEach(function (selector, groupIndex) {
      const grid = document.querySelector(selector);
      if (!grid || grid.dataset.spreeaiSpotlight) return;
      grid.dataset.spreeaiSpotlight = "true";
      const cards = Array.from(grid.children);
      let index = 0;
      let timer = null;
      const update = function () { cards.forEach(function (card, cardIndex) { card.dataset.active = cardIndex === index ? "true" : "false"; }); };
      update();
      const observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          if (timer) clearInterval(timer);
          timer = null;
          return;
        }
        if (timer) return;
        timer = setInterval(function () { index = (index + 1) % cards.length; update(); }, groupIndex ? 1800 : 2200);
      }, { threshold: .45 });
      observer.observe(grid);
    });
  }

  function enhanceFooterAndNav() {
    const footer = document.querySelector("footer");
    if (footer && !footer.dataset.spreeaiFooter) {
      footer.dataset.spreeaiFooter = "true";
      const main = footer.children[0];
      if (main) main.remove();
      const socials = document.createElement("div");
      socials.dataset.spreeaiSocials = "true";
      const socialLabel = document.createElement("span");
      socialLabel.dataset.spreeaiSocialLabel = "true";
      socialLabel.textContent = "Follow SPREEAI";
      const socialLinks = document.createElement("div");
      socialLinks.dataset.spreeaiSocialLinks = "true";
      [
        ["Threads", "https://www.threads.com/@spreeai?igshid=NTc4MTIwNjQ2YQ=="],
        ["LinkedIn", "https://www.linkedin.com/company/spreeai"],
        ["Instagram", "https://www.instagram.com/spreeai/"],
        ["TikTok", "https://www.tiktok.com/@spreeai"],
        ["X", "https://twitter.com/spreeai"],
        ["YouTube", "https://www.youtube.com/channel/UCwqmYq9Cp-JE4iOU-LtRTPg"]
      ].forEach(function (item) {
        const link = document.createElement("a");
        link.textContent = item[0];
        link.href = item[1];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        socialLinks.appendChild(link);
      });
      const backToTop = document.createElement("a");
      backToTop.dataset.spreeaiBackTop = "true";
      backToTop.href = "#top";
      backToTop.setAttribute("aria-label", "Back to the top of the SPREEAI homepage");
      backToTop.innerHTML = 'Back to top <span aria-hidden="true">↑</span>';
      backToTop.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      socials.appendChild(socialLabel);
      socials.appendChild(socialLinks);
      socials.appendChild(backToTop);
      footer.insertBefore(socials, footer.lastElementChild);

      const sourceLogo = document.querySelector("nav img[alt='SPREEAI']") || footer.querySelector("img[alt='SPREEAI']");
      const wordmark = document.createElement("div");
      wordmark.dataset.spreeaiFooterWordmark = "true";
      const wordmarkLink = document.createElement("a");
      wordmarkLink.href = "#top";
      wordmarkLink.setAttribute("aria-label", "SPREEAI home");
      if (sourceLogo) {
        const logo = sourceLogo.cloneNode(true);
        logo.removeAttribute("style");
        logo.alt = "SPREEAI";
        wordmarkLink.appendChild(logo);
      } else {
        const fallback = document.createElement("span");
        fallback.textContent = "SPREEAI";
        fallback.style.cssText = "display:block;color:#fff;font:400 clamp(84px,17vw,260px)/.8 var(--spree-serif);letter-spacing:-.055em;text-align:center";
        wordmarkLink.appendChild(fallback);
      }
      wordmark.appendChild(wordmarkLink);
      footer.insertBefore(wordmark, footer.lastElementChild);
    }
    const nav = document.querySelector("nav");
    if (nav) {
      const cta = Array.from(nav.querySelectorAll("a")).find(function (link) { return link.textContent.trim().toLowerCase() === "start a pilot"; });
      if (cta) cta.dataset.spreeaiPilotCta = "true";
      nav.dataset.spreeaiFooterDocked = "false";
    }
  }

  function wireNavigation() {
    const panels = panelMap();
    const scrollToPanel = function (label) {
      const panel = panels[label];
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const routes = {
      "Explore the platform": function (event) { event.preventDefault(); scrollToPanel("03 One input"); },
      "Meet the team": "https://spreeai.com/meet-the-team/",
      "Become a partner": "https://spreeai.com/partners/",
      "Latest thinking": "https://spreeai.com/spreeai-at-carnegie-mellon/",
      "See a live demo": "https://demo.spreeai.com/",
      "Partner portal": "https://partner.spreeai.com/",
      "Start a pilot": "https://spreeai.com/create-account/",
      "Start a Pilot": "https://spreeai.com/create-account/"
    };
    document.querySelectorAll("nav a").forEach(function (link) {
      const route = routes[link.textContent.trim()];
      if (!route) return;
      if (typeof route === "function") {
        link.href = "#product";
        link.addEventListener("click", route);
      } else {
        link.href = route;
      }
    });

    const heroButtons = panels["01 Hero"] && panels["01 Hero"].querySelectorAll("button");
    if (heroButtons && heroButtons[0]) heroButtons[0].addEventListener("click", function () { scrollToPanel("03 One input"); });
    if (heroButtons && heroButtons[1]) heroButtons[1].addEventListener("click", function () { window.location.href = "https://spreeai.com/create-account/"; });

    const pilotButtons = panels["08 Pilot CTA"] && panels["08 Pilot CTA"].querySelectorAll("button");
    if (pilotButtons && pilotButtons[0]) pilotButtons[0].addEventListener("click", function () { window.location.href = "https://spreeai.com/create-account/"; });
    if (pilotButtons && pilotButtons[1]) pilotButtons[1].addEventListener("click", function () { window.location.href = "https://spreeai.com/partners/"; });
  }

  function stabilizeMobileViewport() {
    if (!window.matchMedia("(max-width: 720px)").matches) return;
    const width = Math.max(320, Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth));
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute("content", "width=" + width + ", initial-scale=1, maximum-scale=1");
    [document.documentElement, document.body, document.getElementById("dc-root")].forEach(function (element) {
      if (!element) return;
      element.style.width = width + "px";
      element.style.maxWidth = width + "px";
      element.style.overflowX = "hidden";
    });
    const root = document.getElementById("dc-root");
    if (root && root.firstElementChild) {
      root.firstElementChild.style.width = width + "px";
      root.firstElementChild.style.maxWidth = width + "px";
      if (root.firstElementChild.firstElementChild) {
        root.firstElementChild.firstElementChild.style.width = width + "px";
        root.firstElementChild.firstElementChild.style.maxWidth = width + "px";
      }
    }
  }

  function replaceExactText(root, replacements) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      const original = node.nodeValue;
      const key = original.trim();
      if (!Object.prototype.hasOwnProperty.call(replacements, key)) return;
      const leading = (original.match(/^\s*/) || [""])[0];
      const trailing = (original.match(/\s*$/) || [""])[0];
      node.nodeValue = leading + replacements[key] + trailing;
    });
  }

  function applyPlatformCopy() {
    const panels = {};
    document.querySelectorAll("[data-panel]").forEach(function (panel) {
      panels[panel.dataset.screenLabel] = panel;
    });

    replaceExactText(panels["01 Hero"], {
      "Your catalog.": "One platform.",
      "On every body.": "Every shopper.",
      "Virtual try-on, fit prediction and outfit intelligence — from one customer photo, live across every shopping channel.": "SPREEAI is the fashion-commerce platform that brings virtual try-on, fit intelligence, and styling into one journey—online, in store, and with an advisor.",
      "See it on your catalogue": "Explore the platform",
      "Try a live demo": "Explore the platform"
    });

    replaceExactText(panels["02 Problem"], {
      "Fit uncertainty costs conversion and drives customer returns": "One shopper. One decision. One connected experience.",
      "69% of shoppers leave a product page to find better information — and most never come back.": "SPREEAI connects the questions that shape a purchase—from how it looks to whether it fits and what completes it.",
      "#1": "SEE",
      "Reason for cart abandonment is sizing variance": "Visualize the garment on the shopper",
      "70%": "FIT",
      "Of fashion returns are due to fit, not personal taste": "Recommend the right size with confidence",
      "71%": "STYLE",
      "Would buy more often if virtual try-on were available": "Turn one item into a complete look"
    });

    replaceExactText(panels["03 One input"], {
      "One input.": "See it.",
      "Three outputs.": "Fit it. Style it.",
      "Photorealistic render of the exact garment on the customer's own body — fabric drape and proportion included, not a generic model swap.": "Show the exact garment on the shopper—with realistic drape, scale, and proportion.",
      "Fit builds confidence. Confidence converts.": "Find the right size.",
      "A size recommendation built from body measurements and the garment's actual pattern data, not just a size chart lookup.": "Connect shopper measurements with garment data to recommend the right size.",
      "From one piece to the whole look.": "Complete the look.",
      "Coordinated outfit picks pulled from the live catalogue, so the recommendation is always something they can actually buy.": "Build coordinated, shoppable outfits from the live catalog.",
      "Try on": "Virtual try-on",
      "Size and fit": "Fit intelligence"
    });

    replaceExactText(panels["04 Why SPREEAI"], {
      "Why": "Built for",
      "SPREEAI": "what comes",
      "is different": "next.",
      "Other platforms fragment the decision. Visualization tools don't solve for fit. Fit tools don't address style. Most try-on experiences add friction instead of removing it.": "Try-on, fit, and styling are the first experiences on one shared shopper and catalog foundation. New decision tools can join the same platform as commerce evolves.",
      "Less hesitation": "One shopper",
      "The decision stays on your product page.": "Signals can carry across the journey.",
      "Fewer returns": "One catalog",
      "Expectations and fit align before checkout.": "Products, fit, and styling stay connected.",
      "Larger baskets": "Every channel",
      "A product becomes a coordinated look.": "Ecommerce, stores, and clienteling work together.",
      "Live in days": "More to come",
      "No reshoots. No infrastructure rebuild.": "Motion, 360° views, deeper personalization, and new categories—on the same foundation."
    });

    replaceExactText(panels["05 Shopper types"], {
      "Convert uncertainty into a decision.": "From product page to confidence.",
      "Add try-on, fit, and styling at the moment of consideration, inside the experience customers already know.": "Let shoppers visualize, size, and style without leaving the page.",
      "More from every fitting room.": "A smarter fitting room.",
      "Give associates a visual, data-informed way to move from one garment to the right size and the complete look.": "Give associates the same intelligence at the mirror and on the floor.",
      "Private client styling, anywhere.": "Personal service, anywhere.",
      "Create curated, customer-specific looks that advisors and stylists can share before the client arrives—or after they leave.": "Help advisors curate and share personal looks before, during, or after an appointment.",
      "Online shoppers": "Ecommerce",
      "In-store customers": "Retail stores",
      "Very Important Clients": "Clienteling"
    });

    replaceExactText(panels["06 Pilot timeline"], {
      "From first call to a live pilot on your catalogue in days.": "Prove it on your catalog.",
      "Day": "Step",
      "Catalogue sync": "Select products",
      "We pull a sample from your product feed. No reshoot, no new asset spec.": "Choose a representative catalog set. No reshoots.",
      "Brand fit pass": "Match the brand",
      "UI matched to your site's type, color, and layout, so it looks native, not bolted on.": "Tune the experience to your brand and journey.",
      "Live on a page set": "Launch",
      "A single script tag live on a category or product page of your choosing.": "Go live on selected product pages.",
      "Exit anytime": "Measure, then scale",
      "Pilots run month to month. Remove the tag and it's gone, nothing left behind.": "Learn what works. Expand when the value is clear."
    });

    replaceExactText(panels["08 Pilot CTA"], {
      "See SPREEAI on your product catalogue in 48 hours": "Start with your catalog.",
      "We'll run SPREEAI on a selection of your catalog. No integration needed. Exit anytime.": "See SPREEAI on a representative product set in 48 hours. No reshoot. No long implementation.",
      "Start a pilot": "Start a Pilot",
      "Schedule a conversation": "Talk to our team"
    });

    replaceExactText(document.querySelector("footer"), {
      "Explore the product": "Explore the platform",
      "Try a live demo": "See a live demo",
      "Partner login": "Partner portal",
      "Read the latest": "Latest thinking"
    });
    replaceExactText(document.querySelector("nav"), {
      "Explore the product": "Explore the platform",
      "Try a live demo": "See a live demo",
      "Partner login": "Partner portal",
      "Read the latest": "Latest thinking",
      "Start a pilot": "Start a Pilot"
    });
    document.documentElement.dataset.spreeaiCopy = "platform";

    function setButtonLabel(button, label) {
      if (!button) return;
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
      let node = null;
      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) { node = walker.currentNode; break; }
      }
      if (node) node.nodeValue = label;
    }

    setButtonLabel(panels["01 Hero"] && panels["01 Hero"].querySelectorAll("button")[0], "Explore the platform");
    setButtonLabel(panels["01 Hero"] && panels["01 Hero"].querySelectorAll("button")[1], "Start a Pilot");
    const legacyHeroButton = panels["01 Hero"] && Array.from(panels["01 Hero"].querySelectorAll("button")).find(function (button) {
      return button.textContent.trim() === "See it on your catalogue";
    });
    setButtonLabel(legacyHeroButton, "Explore the platform");
    setButtonLabel(panels["08 Pilot CTA"] && panels["08 Pilot CTA"].querySelectorAll("button")[0], "Start a Pilot");
    setButtonLabel(panels["08 Pilot CTA"] && panels["08 Pilot CTA"].querySelectorAll("button")[1], "Talk to our team");

    const shopperHeadings = panels["05 Shopper types"] && panels["05 Shopper types"].querySelectorAll("h2");
    if (shopperHeadings && shopperHeadings[2]) shopperHeadings[2].textContent = "Personal service, anywhere.";

    const legacyFootnote = panels["04 Why SPREEAI"] && Array.from(panels["04 Why SPREEAI"].querySelectorAll("p,span,div")).find(function (element) {
      return element.textContent.trim().indexOf("*Results vary") === 0;
    });
    if (legacyFootnote) legacyFootnote.style.display = "none";
  }

  function normalizeCtaLabels() {
    const setFirstText = function (element, label) {
      if (!element) return;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        if (!walker.currentNode.nodeValue.trim()) continue;
        walker.currentNode.nodeValue = label;
        return;
      }
    };
    const heroButtons = panelMap()["01 Hero"] && panelMap()["01 Hero"].querySelectorAll("button");
    if (heroButtons && heroButtons[0]) setFirstText(heroButtons[0], "Explore the platform");
    if (heroButtons && heroButtons[1]) setFirstText(heroButtons[1], "Start a Pilot");
    const nav = document.querySelector("nav");
    if (nav) {
      const navCta = Array.from(nav.querySelectorAll("a")).find(function (link) {
        return link.textContent.trim().toLowerCase().indexOf("start") === 0;
      });
      if (navCta) setFirstText(navCta, "Start a Pilot");
    }
  }

  function applyPolish() {
    injectPolishStyles();
    addBrandLoader();
    removeRedundantPilotPanel();
    replacePilotArtwork();
    applyPlatformCopy();
    removeRequestedChannelsPanel();
    buildLiveDemoCta();
    polishModelPanels();
    redesignCorePanels();
    setupCleanPanelTransitions();
    setupCardSpotlights();
    enhanceFooterAndNav();
    wireNavigation();
    normalizeCtaLabels();
    setTimeout(normalizeCtaLabels, 350);
    stabilizeMobileViewport();
    addScrollCue();
    addScrollMeter();
  }

  function applyReplacements() {
    const root = document.getElementById("dc-root");
    if (!root) return false;

    const hero = document.querySelector("section video[data-media]:not([data-video-slot])");
    const demo = document.querySelector('video[data-video-slot="demo"]');
    replaceVideo(hero, assets.hero);
    replaceVideo(demo, assets.demo);

    const outputImages = Array.from(document.querySelectorAll('img[style*="top: 19%"]'));
    assets.outputs.forEach(function (config, index) {
      replaceOutputImage(outputImages[index], config);
    });

    Object.keys(assets.channels).forEach(function (slot) {
      const video = document.querySelector('video[data-video-slot="' + slot + '"]');
      replaceVideo(video, assets.channels[slot]);
      removeLegacyChannelOverlay(video);
    });

    const expected = hero && demo && outputImages.length >= 3 &&
      Object.keys(assets.channels).every(function (slot) {
        return document.querySelector('video[data-video-slot="' + slot + '"]');
      });
    if (expected) {
      applyPolish();
      finished = true;
      document.documentElement.dataset.spreeaiAssets = "updated";
      requestAnimationFrame(function () {
        window.dispatchEvent(new Event("resize"));
        if (typeof window.__spreeaiTick === "function") window.__spreeaiTick();
      });
    }
    return expected;
  }

  const observer = new MutationObserver(function () {
    if (finished) return;
    if (applyReplacements()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  requestAnimationFrame(function () {
    requestAnimationFrame(applyReplacements);
  });
})();
