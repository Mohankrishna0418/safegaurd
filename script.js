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
  loadSection("hero", "hero.html", initCallButton);
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

  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle("active");
  });

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
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        location.href = `../index.html#${sectionId}`;
      }
    });
  });

  document.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
}

/* ================= Call Now Button ================= */
function initCallButton() {
  const callBtn = document.getElementById("callBtn");
  const footer = document.getElementById("footer");

  if (!callBtn || !footer) return;

  callBtn.addEventListener("click", function (e) {
    // Desktop view
    if (window.innerWidth > 768) {
      e.preventDefault();
      footer.scrollIntoView({ behavior: "smooth" });
    }
    // Mobile view → default tel: works automatically
  });
}

// Ensure it runs after page & sections load
document.addEventListener("DOMContentLoaded", initCallButton);


function handleCallClick(e) {
  // Desktop view → scroll to footer
  if (window.innerWidth > 768) {
    e.preventDefault(); // stop tel:
    const footer = document.getElementById("footer");
    footer?.scrollIntoView({ behavior: "smooth" });
  }
  // Mobile view → tel: works normally
}


/* ================= Link Fixer ================= */
function fixGlobalLinks() {
  document.querySelectorAll("[data-nav]").forEach(link => {
    const section = link.dataset.nav;
    link.href = `${basePath}index.html#${section}`;
  });

  document.querySelectorAll("[data-home]").forEach(link => {
    link.href = `${basePath}index.html`;
  });

  document.querySelectorAll("[data-service]").forEach(link => {
    const page = link.dataset.service;
    link.href = `${basePath}services/${page}.html`;
  });
}


(function addFavicon() {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = "/assets/logo-2.png";
  document.head.appendChild(link);
})();


const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'services');

fs.readdir(servicesDir, (err, files) => {
  if (err) return console.error('Error reading services folder:', err);

  files.forEach((file) => {
    if (file.endsWith('.html')) {
      const filePath = path.join(servicesDir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      const updated = content.replace(/href=["']\/style\.css["']/g, 'href="../style.css"');

      if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`✔ Updated: ${file}`);
      }
    }
  });
});
