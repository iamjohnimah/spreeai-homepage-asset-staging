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
        color: rgba(255,255,255,.94);
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
      @media (max-width: 720px) {
        [data-spreeai-scroll-cue] { right: 10px; }
        [data-spreeai-scroll-cue] > span:first-child { display: none; }
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
    video.setAttribute("aria-label", "SPREEAI garment detail in motion");
    video.style.cssText = "display:block;width:100%;height:100%;object-fit:cover;object-position:center";
    slot.replaceWith(video);
    replaceVideo(video, assets.demo);

    artwork.style.width = "min(900px,72%)";
    artwork.style.aspectRatio = "16 / 7";
    artwork.style.maxHeight = "32vh";
    artwork.style.borderRadius = "16px";
    artwork.style.background = "#f1f1f1";
    artwork.style.boxShadow = "var(--spree-shadow)";
    artwork.style.outline = "1px solid rgba(17,17,17,.06)";
    artwork.dataset.spreeaiModelFrame = "pilot";

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
    inner.style.gap = "clamp(14px,2.2vh,22px)";
    inner.style.padding = "clamp(34px,5vh,60px) max(7.5rem,clamp(32px,5vw,80px)) 126px";
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
        heading.style.fontSize = "clamp(32px,3.5vw,52px)";
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
      "On every body.": "Every body.",
      "Virtual try-on, fit prediction and outfit intelligence — from one customer photo, live across every shopping channel.": "Virtual try-on, fit intelligence, and smart styling—working together across every shopper, garment, and channel.",
      "See it on your catalogue": "See it on your catalog",
      "Try a live demo": "Explore the platform"
    });

    replaceExactText(panels["02 Problem"], {
      "Fit uncertainty costs conversion and drives customer returns": "Shopping is one decision. Technology made it three.",
      "69% of shoppers leave a product page to find better information — and most never come back.": "Try-on here. Fit there. Styling somewhere else. SPREEAI brings the entire decision into one platform.",
      "#1": "ONE",
      "Reason for cart abandonment is sizing variance": "Connected journey from product page to purchase",
      "70%": "THREE",
      "Of fashion returns are due to fit, not personal taste": "Intelligence systems, working as one",
      "71%": "EVERY",
      "Would buy more often if virtual try-on were available": "Shopping moments, powered by the same platform"
    });

    replaceExactText(panels["03 One input"], {
      "One input.": "One platform.",
      "Three outputs.": "Three answers.",
      "Photorealistic render of the exact garment on the customer's own body — fabric drape and proportion included, not a generic model swap.": "See the exact garment on the shopper's own body—with realistic drape, scale, and proportion.",
      "Fit builds confidence. Confidence converts.": "The right size. Before checkout.",
      "A size recommendation built from body measurements and the garment's actual pattern data, not just a size chart lookup.": "Fit intelligence connects body measurements with garment data to recommend the size that feels right.",
      "From one piece to the whole look.": "One garment. A complete look.",
      "Coordinated outfit picks pulled from the live catalogue, so the recommendation is always something they can actually buy.": "Styling intelligence turns one product into coordinated, shoppable outfits from the live catalog.",
      "Try on": "Virtual try-on",
      "Size and fit": "Fit intelligence"
    });

    replaceExactText(panels["04 Why SPREEAI"], {
      "Why": "Not a",
      "SPREEAI": "feature.",
      "is different": "The platform.",
      "Other platforms fragment the decision. Visualization tools don't solve for fit. Fit tools don't address style. Most try-on experiences add friction instead of removing it.": "Try-on. Fit. Styling. Most solutions stop at one. SPREEAI connects all three in a single platform.",
      "Less hesitation": "One connected decision",
      "The decision stays on your product page.": "See it, size it, and style it in one flow.",
      "Fewer returns": "Every channel in sync",
      "Expectations and fit align before checkout.": "Online, in-store, and clienteling share one platform.",
      "Larger baskets": "More from every garment",
      "A product becomes a coordinated look.": "Turn one product into a complete, shoppable look.",
      "Live in days": "Built to launch",
      "No reshoots. No infrastructure rebuild.": "Go live without reshoots or rebuilding your commerce stack."
    });

    replaceExactText(panels["05 Shopper types"], {
      "Convert uncertainty into a decision.": "Confidence, built into every product page.",
      "Add try-on, fit, and styling at the moment of consideration, inside the experience customers already know.": "Let shoppers see it, size it, and style it—without leaving the moment of intent.",
      "More from every fitting room.": "One platform. A smarter store.",
      "Give associates a visual, data-informed way to move from one garment to the right size and the complete look.": "Give associates the same intelligence to recommend the right size, the next piece, and the complete look.",
      "Private client styling, anywhere.": "Clienteling that continues everywhere.",
      "Create curated, customer-specific looks that advisors and stylists can share before the client arrives—or after they leave.": "Create personal looks advisors can build, share, and continue before, during, or after an appointment.",
      "Online shoppers": "Ecommerce",
      "In-store customers": "Retail stores",
      "Very Important Clients": "Clienteling"
    });

    replaceExactText(panels["06 Pilot timeline"], {
      "From first call to a live pilot on your catalogue in days.": "A platform you can prove in days.",
      "Catalogue sync": "Connect the catalog",
      "We pull a sample from your product feed. No reshoot, no new asset spec.": "We prepare a representative product set. No reshoots. No new asset workflow.",
      "Brand fit pass": "Make it yours",
      "UI matched to your site's type, color, and layout, so it looks native, not bolted on.": "We tune the experience to your brand, customers, and commerce journey.",
      "Live on a page set": "Launch the platform",
      "A single script tag live on a category or product page of your choosing.": "Try-on, fit, and styling go live together on a selected page set.",
      "Exit anytime": "Learn, then scale",
      "Pilots run month to month. Remove the tag and it's gone, nothing left behind.": "Measure what matters. Refine the experience. Expand when the value is clear."
    });

    replaceExactText(panels["08 Pilot CTA"], {
      "See SPREEAI on your product catalogue in 48 hours": "See the whole platform on your catalog.",
      "We'll run SPREEAI on a selection of your catalog. No integration needed. Exit anytime.": "In 48 hours, see try-on, fit, and styling working together on your own products.",
      "Start a pilot": "Start your pilot",
      "Schedule a conversation": "Talk to our team"
    });

    replaceExactText(document.querySelector("footer"), {
      "Explore the product": "Explore the platform",
      "Try a live demo": "See a live demo",
      "Partner login": "Partner portal"
    });
    replaceExactText(document.querySelector("nav"), {
      "Explore the product": "Explore the platform",
      "Try a live demo": "See a live demo",
      "Partner login": "Partner portal",
      "Start a pilot": "Start your pilot"
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

    setButtonLabel(panels["01 Hero"] && panels["01 Hero"].querySelectorAll("button")[0], "See it on your catalog");
    setButtonLabel(panels["08 Pilot CTA"] && panels["08 Pilot CTA"].querySelectorAll("button")[0], "Start your pilot");
    setButtonLabel(panels["08 Pilot CTA"] && panels["08 Pilot CTA"].querySelectorAll("button")[1], "Talk to our team");

    const shopperHeadings = panels["05 Shopper types"] && panels["05 Shopper types"].querySelectorAll("h2");
    if (shopperHeadings && shopperHeadings[2]) shopperHeadings[2].textContent = "Clienteling that continues everywhere.";

    const legacyFootnote = panels["04 Why SPREEAI"] && Array.from(panels["04 Why SPREEAI"].querySelectorAll("p,span,div")).find(function (element) {
      return element.textContent.trim().indexOf("*Results vary") === 0;
    });
    if (legacyFootnote) legacyFootnote.style.display = "none";
  }

  function applyPolish() {
    injectPolishStyles();
    replacePilotArtwork();
    polishModelPanels();
    addScrollCue();
    applyPlatformCopy();
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
