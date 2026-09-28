(function () {
  var root = document.querySelector("[data-issues-filter]");
  if (!root) return;

  var input = root.querySelector("#issues-search");
  var empty = root.querySelector(".issues-empty");
  var items = root.querySelectorAll(".issue");
  if (!input || !items.length) return;

  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function apply() {
    var q = norm(input.value);
    var shown = 0;
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var hay = norm((el.getAttribute("data-search") || "") + " " + (el.textContent || ""));
      var match = !q || hay.indexOf(q) !== -1;
      el.hidden = !match;
      if (match) shown++;
    }
    if (empty) empty.hidden = shown !== 0;
  }

  input.addEventListener("input", apply);
  input.addEventListener("search", apply);
  apply();
})();
