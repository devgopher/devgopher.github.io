(function () {
  var QUALITIES = ["1080", "480", "360", "240", "144"];
  var LANGS = ["en", "ru", "de", "fr", "es", "zh"];
  var QUALITY_KEY = "torglink-promo-quality";
  var PLAYBACK_KEY = "torglink-promo-playback";

  var root = document.querySelector("[data-promo]");
  if (!root) return;

  var video = root.querySelector(".promo-video");
  var source = video.querySelector("source");
  var select = root.querySelector(".promo-quality-select");
  var track = video.querySelector("track");
  var base = root.getAttribute("data-promo-base") || "/assets/promo/";
  var lang = root.getAttribute("data-promo-lang") || "en";
  if (LANGS.indexOf(lang) === -1) lang = "en";
  if (base.slice(-1) !== "/") base += "/";

  function defaultQuality() {
    try {
      var saved = localStorage.getItem(QUALITY_KEY);
      if (saved && QUALITIES.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) {
      return "480";
    }
    return "1080";
  }

  function promoUrl(quality) {
    return base + "promo-" + lang + "-" + quality + ".mp4";
  }

  function readPlayback() {
    try {
      var raw = sessionStorage.getItem(PLAYBACK_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : null;
    } catch (e) {
      return null;
    }
  }

  function savePlayback() {
    try {
      sessionStorage.setItem(
        PLAYBACK_KEY,
        JSON.stringify({
          t: video.currentTime || 0,
          paused: video.paused,
        })
      );
    } catch (e) {}
  }

  function applySource(quality, restore) {
    var next = promoUrl(quality);
    var time = restore && typeof restore.t === "number" ? restore.t : video.currentTime || 0;
    var shouldPlay = restore ? restore.paused === false : !video.paused && video.readyState > 0;

    video.poster = base + "promo-" + lang + ".jpg";
    if (source) source.src = next;
    else video.src = next;
    if (track) {
      track.src = base + "promo-" + lang + ".vtt";
      track.srclang = lang;
    }
    video.load();

    function onMeta() {
      video.removeEventListener("loadedmetadata", onMeta);
      if (time > 0 && isFinite(time)) {
        try {
          video.currentTime = time;
        } catch (e) {}
      }
      if (shouldPlay) {
        var playResult = video.play();
        if (playResult && playResult.catch) playResult.catch(function () {});
      }
    }
    video.addEventListener("loadedmetadata", onMeta);
  }

  var quality = defaultQuality();
  if (select) select.value = quality;
  applySource(quality, readPlayback());

  if (select) {
    select.addEventListener("change", function () {
      var next = select.value;
      if (QUALITIES.indexOf(next) === -1) return;
      try {
        localStorage.setItem(QUALITY_KEY, next);
      } catch (e) {}
      applySource(next, {
        t: video.currentTime || 0,
        paused: video.paused,
      });
    });
  }

  window.addEventListener("pagehide", savePlayback);
  document.querySelectorAll(".langs a").forEach(function (link) {
    link.addEventListener("click", savePlayback);
  });
})();
