// Detect base path (root or inside /services)
const basePath = window.location.pathname.includes("/services/")
  ? "../"
  : "";

// Utility loader
function loadSection(id, file, callback) {
  fetch(`${basePath}sections/${file}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback(); // ✅ run listeners AFTER load
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

/* ================= Load Sections ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadSection("header", "header.html", initHeader);
  loadSection("hero", "hero.html");
  loadSection("services", "services.html");
  loadSection("offers", "offers.html");
  loadSection("quote-modal", "quote-model.html", initQuoteModal);
  loadSection("stats", "stats.html");
  loadSection("how-it-works", "how-it-works.html");
  loadSection("footer", "footer.html");
});

/* ================= Header (Hamburger) ================= */
function initHeader() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Close menu on link click (mobile UX)
    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });
  }
}

/* ================= Quote Modal ================= */
function initQuoteModal() {
  const overlay = document.getElementById("quoteOverlay");

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeQuote();
    });
  }
}

function openQuote(service) {
  const overlay = document.getElementById("quoteOverlay");
  const selectedService = document.getElementById("selectedService");
  const serviceSelect = document.getElementById("serviceSelect");

  if (!overlay) return;

  overlay.classList.add("active");
  selectedService.innerText = `Service: ${service}`;
  serviceSelect.value = service;
}

function closeQuote() {
  const overlay = document.getElementById("quoteOverlay");
  if (overlay) overlay.classList.remove("active");
}
