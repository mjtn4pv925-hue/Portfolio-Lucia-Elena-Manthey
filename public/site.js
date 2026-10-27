// Kleine Interaktionen: Bilder-Slider und aufklappbare Panels.

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slides");
  const step = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
  slider.querySelector(".prev").addEventListener("click", () => step(-1));
  slider.querySelector(".next").addEventListener("click", () => step(1));
});

const toggles = document.querySelectorAll(".drawer-toggle");

function setDrawer(toggle, open) {
  const drawer = document.getElementById(toggle.getAttribute("aria-controls"));
  toggle.setAttribute("aria-expanded", String(open));
  drawer.classList.toggle("open", open);
  if (open) drawer.scrollTop = 0;
}

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    setDrawer(toggle, toggle.getAttribute("aria-expanded") !== "true");
  });
  // Direktlink wie /intro#how-i-think öffnet das Panel gleich
  if (location.hash === "#" + toggle.getAttribute("aria-controls")) setDrawer(toggle, true);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggles.forEach((t) => setDrawer(t, false));
});
