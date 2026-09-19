(function () {
  var section = document.querySelector(".downloads[data-ci-runs-api]");
  if (!section) return;

  var api = section.getAttribute("data-ci-runs-api");
  if (!api) return;

  fetch(api, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then(function (res) {
      if (!res.ok) throw new Error("runs " + res.status);
      return res.json();
    })
    .then(function (data) {
      var run = data && data.workflow_runs && data.workflow_runs[0];
      if (!run || !run.html_url) return;
      var href = run.html_url + "#artifacts";
      section.querySelectorAll(".download-run-link, .download-latest-run").forEach(function (el) {
        el.setAttribute("href", href);
      });
    })
    .catch(function () {
      /* keep static success-list fallback */
    });
})();
