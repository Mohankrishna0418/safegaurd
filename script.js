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
  if (!callBtn) return;

  callBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.innerWidth <= 768) {
      window.location.href = "tel:+919535733411";
    } else {
      document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
    }
  });
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

/* ================= Enquiry Form ================= */
const openBtn = document.getElementById("openEnquiry");
const closeBtn = document.getElementById("closeEnquiry");
const panel = document.getElementById("enquiryPanel");

openBtn.onclick = () => panel.classList.add("active");
closeBtn.onclick = () => panel.classList.remove("active");

document.getElementById("enquiryForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: this.name.value,
    phone: this.phone.value,
    email: this.email.value,
    message: this.message.value
  };

  try {
    const res = await fetch("/api/send-enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Request failed");

    alert("Thank you! We will contact you shortly.");
    this.reset();
    document.getElementById("enquiryPanel").classList.remove("active");

  } catch (err) {
    console.error(err);
    alert("Failed to send enquiry. Please try again.");
  }
});
