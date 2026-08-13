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
    },
    pilotCta: {
      image: "A10_Yuna_PilotCTA_Profile_FIGMA.png",
      position: "50% 24%"
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

  function replaceImageSlot(slot, config) {
    if (!slot || slot.dataset.spreeaiReplaced) return;
    slot.dataset.spreeaiReplaced = "true";
    slot.setAttribute("src", config.image);
    slot.setAttribute("fit", "cover");
    slot.dataset.spreeaiObjectPosition = config.position;
    function setCrop() {
      const image = slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
      if (image) {
        image.style.left = config.position.split(" ")[0];
        image.style.top = config.position.split(" ")[1];
      }
    }
    requestAnimationFrame(function () {
      setCrop();
      requestAnimationFrame(setCrop);
    });
    setTimeout(setCrop, 250);
  }

  function applyReplacements() {
    const root = document.getElementById("dc-root");
    if (!root) return false;

    const hero = document.querySelector("section video[data-media]:not([data-video-slot])");
    const demo = document.querySelector('video[data-video-slot="demo"]');
    replaceVideo(hero, assets.hero);
    replaceVideo(demo, assets.demo);

    const pilotCta = document.querySelector('image-slot#pilot');
    replaceImageSlot(pilotCta, assets.pilotCta);

    const outputImages = Array.from(document.querySelectorAll('img[style*="top: 19%"]'));
    assets.outputs.forEach(function (config, index) {
      replaceOutputImage(outputImages[index], config);
    });

    Object.keys(assets.channels).forEach(function (slot) {
      const video = document.querySelector('video[data-video-slot="' + slot + '"]');
      replaceVideo(video, assets.channels[slot]);
      removeLegacyChannelOverlay(video);
    });

    const expected = hero && demo && pilotCta && outputImages.length >= 3 &&
      Object.keys(assets.channels).every(function (slot) {
        return document.querySelector('video[data-video-slot="' + slot + '"]');
      });
    if (expected) {
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
