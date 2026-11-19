(() => {
  "use strict";

  const api = typeof browser !== "undefined" ? browser : chrome;
  const ROOT_CLASS = "ysb-on";
  const SHORTS_PATH = /^\/shorts\/([\w-]{5,})/;

  let enabled = true;

  // Turns the CSS rules on or off, and redirects Shorts URLs when enabled.
  function apply() {
    document.documentElement.classList.toggle(ROOT_CLASS, enabled);
    if (enabled) redirectShorts();
  }

  // A link like /shorts/abc123 is opened as a normal watch page instead.
  function redirectShorts() {
    const match = location.pathname.match(SHORTS_PATH);
    if (match) {
      location.replace(`/watch?v=${match[1]}`);
    }
  }

  // Apply the default immediately to avoid a flash of Shorts while the
  // saved setting loads.
  apply();

  api.storage.local.get({ enabled: true }).then((stored) => {
    enabled = stored.enabled;
    apply();
  });

  api.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.enabled) {
      enabled = changes.enabled.newValue;
      apply();
    }
  });

  // Fallback for navigation buttons: finds anything in the sidebar or tab bar
  // that points to Shorts or is labelled "Shorts", and marks its entry so
  // content.css can hide it. The mark is harmless when blocking is off.
  const NAV_CONTAINERS =
    "ytd-guide-renderer, ytd-mini-guide-renderer, tp-yt-app-drawer, ytm-pivot-bar-renderer";
  const NAV_MATCHES =
    'a[href="/shorts"], a[href="/shorts/"], [title="Shorts"], [aria-label="Shorts"]';
  const NAV_ENTRIES =
    "ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer, ytm-pivot-bar-item-renderer, yt-guide-entry-view-model";

  function markNavButtons() {
    if (!enabled) return;
    for (const container of document.querySelectorAll(NAV_CONTAINERS)) {
      for (const el of container.querySelectorAll(NAV_MATCHES)) {
        const entry = el.closest(NAV_ENTRIES) || el;
        entry.setAttribute("data-ysb-hidden", "");
      }
    }
  }

  let scanQueued = false;
  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    setTimeout(() => {
      scanQueued = false;
      markNavButtons();
    }, 200);
  }

  new MutationObserver(queueScan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // YouTube navigates without full page loads, so check on those events too.
  window.addEventListener("yt-navigate-finish", redirectIfEnabled);
  window.addEventListener("popstate", redirectIfEnabled);

  function redirectIfEnabled() {
    if (enabled) redirectShorts();
  }
})();
