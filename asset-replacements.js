(function () {
  const assets = {
    hero: {
      video: "A01_Nyah_Hero_Seedance25.mp4",
      poster: "A01_Nyah_Hero_FIGMA.jpg"
    },
    outputs: [
      { image: "A02_Yuna_TryOn_FIGMA.jpg", position: "50% 50%" },
      { image: "A03_Yuna_SizeFit_FIGMA.jpg", position: "50% 50%" },
      { image: "A04_Yuna_Styling_FIGMA.jpg", position: "50% 50%" }
    ],
    outputProducts: {
      top: "Yuna_Jacket.png",
      bottom: "Yuna_Trousers.png"
    },
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
      video: "A08_Yuna_Macro_Seedance25.mp4",
      poster: "A08_Yuna_Macro_FIGMA.jpg"
    }
  };

  let finished = false;

  function replaceVideo(video, config) {
    if (!video || video.dataset.spreeaiReplaced) return;
    video.dataset.spreeaiReplaced = "true";
    video.src = config.video;
    video.poster = config.poster;
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
    productFrame.style.cssText = "position:relative;width:100%;height:80%;overflow:hidden;background:#fff";

    const product = document.createElement("img");
    product.src = config.image;
    product.alt = "";
    product.style.cssText = "position:absolute;width:145%;height:145%;max-width:none;object-fit:cover;left:" + config.productLeft + ";top:" + config.productTop + ";transform:translate(-50%,-50%)";

    const label = document.createElement("span");
    label.textContent = config.label;
    label.style.cssText = "height:20%;display:flex;align-items:center;justify-content:center;background:#f4f4f4;color:#111;font:400 clamp(10px,.9vw,14px)/1 Afacad,sans-serif";

    productFrame.appendChild(product);
    card.appendChild(productFrame);
    card.appendChild(label);
    parent.appendChild(card);
  }

  function replaceOutputImage(image, config) {
    if (!image || image.dataset.spreeaiReplaced) return;
    image.dataset.spreeaiReplaced = "true";
    image.src = config.image;
    image.style.objectFit = "cover";
    image.style.objectPosition = config.position;
    image.style.left = "50%";
    image.style.top = "19%";
    image.style.width = "19.4%";
    image.style.height = "calc(81% - 128px)";
    image.style.background = "#f2f2f2";
    image.style.borderRadius = "3px";

    const parent = image.parentElement;
    addOutputProductCard(parent, {
      slot: "top",
      image: assets.outputProducts.top,
      label: "Top",
      left: "56.25%",
      top: "21.8%",
      productLeft: "50%",
      productTop: "46%"
    });
    addOutputProductCard(parent, {
      slot: "bottom",
      image: assets.outputProducts.bottom,
      label: "Bottom",
      left: "33.8%",
      top: "49.5%",
      productLeft: "86%",
      productTop: "50%"
    });
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
        --spree-serif: "Big Caslon", "Big Caslon Medium", Baskerville, "Times New Roman", serif;
        --spree-sans: Afacad, system-ui, sans-serif;
        --spree-shadow: 0 18px 50px rgba(22, 19, 16, .14), 0 2px 8px rgba(22, 19, 16, .08);
        --spree-card-radius: 12px;
        --spree-ease: cubic-bezier(.22, 1, .36, 1);
      }
      body,
      [data-panel] { font-family: var(--spree-sans) !important; }
      [data-panel] h1,
      [data-panel] h2,
      [data-panel] h3 { font-family: var(--spree-serif) !important; }
      [data-panel] p,
      [data-panel] button,
      [data-panel] a { font-family: var(--spree-sans) !important; }
      [data-spreeai-model-frame] {
        border-radius: var(--spree-card-radius) !important;
        box-shadow: var(--spree-shadow) !important;
        outline: 1px solid rgba(255,255,255,.46);
        overflow: hidden !important;
        background: rgba(255,255,255,.2);
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
      }
      [data-spreeai-scroll-cue] {
        position: fixed;
        left: 50%;
        bottom: 126px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        border: 0;
        background: transparent;
        color: rgba(255,255,255,.94);
        font: 500 12px/1 var(--spree-sans);
        letter-spacing: .08em;
        text-transform: uppercase;
        cursor: pointer;
        opacity: 1;
        transform: translate(-50%,0);
        transition: opacity .35s ease, transform .35s var(--spree-ease);
        text-shadow: 0 1px 8px rgba(0,0,0,.32);
      }
      [data-spreeai-scroll-cue][data-hidden="true"] {
        opacity: 0;
        transform: translate(-50%,10px);
        pointer-events: none;
      }
      [data-spreeai-scroll-track] {
        position: relative;
        display: block;
        width: 22px;
        height: 34px;
        border: 1px solid rgba(255,255,255,.72);
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
        background: #fff;
        transform: translateX(-50%);
        animation: spreeaiScrollDot 1.7s var(--spree-ease) infinite;
      }
      @keyframes spreeaiScrollDot {
        0% { opacity: 0; transform: translate(-50%,0); }
        22% { opacity: 1; }
        75% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%,15px); }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-spreeai-scroll-dot] { animation: none; }
        [data-spreeai-output-visual], [data-spreeai-shopper-visual] { transition: opacity .2s ease !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function removePilotArtwork() {
    const slot = document.querySelector("image-slot#pilot");
    if (!slot) return;
    const artwork = slot.parentElement;
    const panel = slot.closest("[data-panel]");
    const inner = panel && panel.firstElementChild;
    if (artwork) artwork.remove();
    if (!inner) return;
    inner.dataset.spreeaiPilotRefined = "true";
    inner.style.justifyContent = "center";
    inner.style.gap = "0";
    inner.style.padding = "clamp(52px,8vh,96px) max(7.5rem,clamp(32px,5vw,80px)) 130px";
    inner.style.background = "radial-gradient(circle at 50% 34%, rgba(238,231,226,.7), rgba(255,255,255,0) 42%), #fff";
    const content = inner.firstElementChild;
    if (content) {
      const actions = content.nextElementSibling;
      if (actions && actions.querySelector("button")) {
        content.appendChild(actions);
        actions.style.position = "static";
        actions.style.marginTop = "clamp(6px,1.2vh,12px)";
        actions.style.transform = "none";
        actions.style.flexWrap = "wrap";
        actions.style.justifyContent = "center";
      }
      content.style.maxWidth = "940px";
      content.style.gap = "clamp(12px,2vh,20px)";
      content.style.padding = "clamp(34px,5vw,64px)";
      content.style.border = "1px solid rgba(17,17,17,.08)";
      content.style.borderRadius = "18px";
      content.style.background = "rgba(255,255,255,.72)";
      content.style.boxShadow = "0 24px 70px rgba(32,26,22,.09)";
      content.style.backdropFilter = "blur(12px)";
      const heading = content.querySelector("h2");
      if (heading) {
        heading.style.maxWidth = "860px";
        heading.style.fontSize = "clamp(38px,4.6vw,70px)";
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
    const outputImages = Array.from(document.querySelectorAll('img[style*="top: 19%"]'));
    outputImages.forEach(function (image) {
      const visual = image.parentElement;
      if (visual) visual.dataset.spreeaiOutputVisual = "true";
      image.dataset.spreeaiModelFrame = "output";
      image.style.borderRadius = "12px";
      image.style.boxShadow = "var(--spree-shadow)";
      image.style.outline = "1px solid rgba(255,255,255,.46)";
    });

    document.querySelectorAll('video[data-video-slot^="shopper-"]').forEach(function (video) {
      const frame = video.parentElement;
      const visual = frame && frame.parentElement;
      if (frame) frame.dataset.spreeaiModelFrame = "shopper";
      if (visual) visual.dataset.spreeaiShopperVisual = "true";
    });

    document.querySelectorAll("[data-panel] button").forEach(function (button) {
      button.dataset.spreeaiTab = "true";
      if (button.dataset.spreeaiPolishBound) return;
      button.dataset.spreeaiPolishBound = "true";
      button.addEventListener("click", function () {
        setTimeout(function () {
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

  function applyPolish() {
    injectPolishStyles();
    removePilotArtwork();
    polishModelPanels();
    addScrollCue();
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
