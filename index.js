function myFunction(btn) {
  // Animate the hamburger bars
  btn.classList.toggle("change");
  toggleMobileMenu(btn);
}

function toggleMobileMenu(btn) {
  const menu = document.getElementById("mobileMenu");
  const isOpen = menu.classList.toggle("open");
  document.body.classList.toggle("no-scroll", isOpen);

  // a11y
  btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

// Close on backdrop click, link click, or Esc
document.addEventListener("click", (e) => {
  const menu = document.getElementById("mobileMenu");
  if (!menu.classList.contains("open")) return;

  // backdrop click (only if clicking the backdrop, not the panel)
  if (e.target === menu) closeMenu();

  // any menu link
  if (e.target.closest(".mobile-link")) closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

function closeMenu() {
  const menu = document.getElementById("mobileMenu");
  if (!menu || !menu.classList.contains("open")) return;
  menu.classList.remove("open");
  document.body.classList.remove("no-scroll");

  // also un-animate the hamburger if visible
  const btn = document.querySelector(".container-hamburger");
  if (btn) btn.classList.remove("change");
  if (btn) btn.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
}
