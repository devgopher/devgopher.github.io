(function () {
  var root = document.querySelector("[data-promo-archive]");
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll("[data-promo-item]"));
  var pageSize = parseInt(root.getAttribute("data-page-size") || "5", 10);
  if (!isFinite(pageSize) || pageSize < 1) pageSize = 5;

  var pager = root.querySelector("[data-promo-pager]");
  var pageCount = Math.ceil(items.length / pageSize);

  if (!pager || pageCount <= 1) {
    if (pager) pager.hidden = true;
    return;
  }

  var newerBtn = pager.querySelector("[data-pager-newer]");
  var olderBtn = pager.querySelector("[data-pager-older]");
  var status = pager.querySelector("[data-pager-status]");
  var template = (status && status.getAttribute("data-template")) || "Page {current} of {total}";

  function readHash() {
    var match = /(?:^|#)page=(\d+)/.exec(window.location.hash || "");
    if (!match) return 1;
    var n = parseInt(match[1], 10);
    if (!isFinite(n) || n < 1) return 1;
    return Math.min(n, pageCount);
  }

  var current = readHash();

  function render() {
    var start = (current - 1) * pageSize;
    var end = start + pageSize;
    items.forEach(function (item, index) {
      var visible = index >= start && index < end;
      item.hidden = !visible;
      if (!visible) {
        item.querySelectorAll("video").forEach(function (video) {
          video.pause();
        });
      }
    });
    if (status) {
      status.textContent = template
        .replace("{current}", String(current))
        .replace("{total}", String(pageCount));
    }
    if (newerBtn) newerBtn.disabled = current <= 1;
    if (olderBtn) olderBtn.disabled = current >= pageCount;
    try {
      history.replaceState(null, "", "#page=" + current);
    } catch (e) {}
  }

  if (newerBtn) {
    newerBtn.addEventListener("click", function () {
      if (current > 1) {
        current -= 1;
        render();
        root.scrollIntoView({ block: "start" });
      }
    });
  }
  if (olderBtn) {
    olderBtn.addEventListener("click", function () {
      if (current < pageCount) {
        current += 1;
        render();
        root.scrollIntoView({ block: "start" });
      }
    });
  }

  pager.hidden = false;
  render();
})();
