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

  function replaceOutputImage(image, config) {
    if (!image || image.dataset.spreeaiReplaced) return;
    image.dataset.spreeaiReplaced = "true";
    image.src = config.image;
    image.style.objectFit = "cover";
    image.style.objectPosition = config.position;
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
