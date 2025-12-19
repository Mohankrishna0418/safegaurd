/* ================= Base Path ================= */
const isServicePage = window.location.pathname.includes("/services/");
const basePath = isServicePage ? "../" : "";

/* ================= Section Loader ================= */
function loadSection(id, file, callback) {
  const container = document.getElementById(id);
  if (!container) return;

  fetch(`${basePath}sections/${file}`)
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      if (callback) callback();
    })
    .catch(err => console.error(`Error loading ${file}`, err));
}

/* ================= Init ================= */
document.addEventListener("DOMContentLoaded", () => {
  loadSection("header", "header.html", initHeaderAndLinks);
  loadSection("hero", "hero.html");
  loadSection("services", "services.html");
  loadSection("offers", "offers.html");
  loadSection("stats", "stats.html");
  loadSection("how-it-works", "how-it-works.html");
  loadSection("footer", "footer.html", fixGlobalLinks);
});

/* ================= Header ================= */
function initHeaderAndLinks() {
  initHeader();
  fixGlobalLinks();
}

function initHeader() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  if (!hamburger || !navMenu) return;

  // Toggle hamburger
  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle("active");
  });

  // Handle menu item click
  navMenu.querySelectorAll("a[data-section]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sectionId = link.dataset.section;
      navMenu.classList.remove("active");

      const isHome =
        location.pathname.endsWith("index.html") ||
        location.pathname === "/" ||
        location.pathname === "";

      if (isHome) {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        location.href = `../index.html#${sectionId}`;
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
}


/* ================= Link Fixer ================= */
function fixGlobalLinks() {
  // Section scroll links (header + footer)
  document.querySelectorAll("[data-nav]").forEach(link => {
    const section = link.dataset.nav;
    link.href = `${basePath}index.html#${section}`;
  });

  // Home logo
  document.querySelectorAll("[data-home]").forEach(link => {
    link.href = `${basePath}index.html`;
  });

  // Service pages
  document.querySelectorAll("[data-service]").forEach(link => {
    const page = link.dataset.service;
    link.href = `${basePath}services/${page}.html`;
  });
}
