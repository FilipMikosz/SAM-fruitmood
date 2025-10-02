/* =========
   Mobile menu
   ========= */
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
  if (!menu || !menu.classList.contains("open")) return;

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
  if (btn) {
    btn.classList.remove("change");
    btn.setAttribute("aria-expanded", "false");
  }
  menu.setAttribute("aria-hidden", "true");
}

/* =========
   Smooth ribbon animation (spring)
   - płynne skalowanie navbara w #two/#three/#four,
     bez „zatrzymywania się” między produktami
   ========= */
(function () {
  // Wyłącz na urządzeniach dotykowych — hover nie ma sensu
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  function setupRibbon(section, itemSelector, options = {}) {
    if (!section) return;
    const navbar = section.querySelector(".navbar");
    const items = section.querySelectorAll(itemSelector);
    if (!navbar || !items.length) return;

    // Parametry sprężyny
    const baseScale = options.baseScale ?? 1.0;
    const hoverScale = options.hoverScale ?? 1.2; // cel podczas hover
    const stiffness = options.stiffness ?? 18.0; // „sprężyna”
    const damping = options.damping ?? 3.2; // tłumienie
    const impulse = options.impulse ?? 0.65; // „kop” na wejściu
    const maxScale = options.maxScale ?? 1.28; // ogranicznik

    let current = baseScale;
    let target = baseScale;
    let velocity = 0;
    let lastTime = performance.now();
    let lastItem = null;
    let rafId = null;

    // pisz do zmiennej CSS
    function apply() {
      section.style.setProperty("--ribbonScale", current.toFixed(4));
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000); // max 50ms
      lastTime = now;

      // Sprężyna (Hooke) + tłumienie
      const force = stiffness * (target - current) - damping * velocity;
      velocity += force * dt;
      current += velocity * dt;

      // Ogranicz i domknij, żeby nie „pływało”
      if (
        target === baseScale &&
        Math.abs(current - baseScale) < 0.0008 &&
        Math.abs(velocity) < 0.0008
      ) {
        current = baseScale;
        velocity = 0;
      }
      if (current > maxScale) {
        current = maxScale;
        velocity = Math.min(velocity, 0);
      }
      if (current < 0.9) {
        current = 0.9;
        velocity = Math.max(velocity, 0);
      }

      apply();
      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (rafId == null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    }

    function stopLoopIfIdle() {
      // Można dodać zatrzymywanie pętli, ale rAF jest lekki; zostawiamy włączony
    }

    // Zdarzenia
    items.forEach((el) => {
      el.addEventListener("pointerenter", () => {
        if (isCoarse) return; // na dotyku nic nie robimy
        startLoop();

        // Każde wejście na INNY element: ustaw cel i daj mały impuls
        if (lastItem !== el) {
          target = hoverScale;
          velocity += impulse;
          lastItem = el;
        }
      });
    });

    // Wyjście kursora z całej sekcji => wróć do bazowej skali
    section.addEventListener("pointerleave", () => {
      if (isCoarse) return;
      target = baseScale;
      lastItem = null;
      // delikatny powrót (nie twardy snap)
      velocity = Math.min(velocity, 0.0);
    });

    // Inicjalny zapis CSS var
    apply();
    startLoop();
  }

  function init() {
    setupRibbon(
      document.querySelector("#two"),
      ".products .product, .products .product img",
      { hoverScale: 1.2, stiffness: 20, damping: 3.4, impulse: 0.7 }
    );
    setupRibbon(document.querySelector("#three"), ".products img", {
      hoverScale: 1.2,
      stiffness: 20,
      damping: 3.4,
      impulse: 0.7,
    });
    setupRibbon(
      document.querySelector("#four"),
      ".products .product, .products .product img, .products .product p",
      { hoverScale: 1.2, stiffness: 20, damping: 3.4, impulse: 0.7 }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
