const api = typeof browser !== "undefined" ? browser : chrome;
const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function render(enabled) {
  toggle.checked = enabled;
  status.textContent = enabled ? "Shorts hidden" : "Shorts visible";
}

api.storage.local.get({ enabled: true }).then((stored) => {
  render(stored.enabled);
});

toggle.addEventListener("change", () => {
  api.storage.local.set({ enabled: toggle.checked });
  render(toggle.checked);
});
