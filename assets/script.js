/* ===== Form kirim pesan ke Google Sheets ===== */
const scriptURL = "https://script.google.com/macros/s/AKfycbyQDDs1vde7J5ShEI134fJMqJQTt_7pB51ZAs2BHW5l1RlaPjifZn9E24dxFr7iQD8d/exec";
const form = document.forms["Submit-to-Google-Sheets"];
const btnKirim = form.querySelector(".btn-kirim");
const formAlert = document.getElementById("formAlert");

const setLoading = (isLoading) => {
  btnKirim.disabled = isLoading;
  btnKirim.querySelector(".spinner-border").classList.toggle("d-none", !isLoading);
  btnKirim.querySelector(".bi-send-fill").classList.toggle("d-none", isLoading);
  btnKirim.querySelector(".btn-label").textContent = isLoading ? "Mengirim..." : "Kirim";
};

const showAlert = (type, title, message) => {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");

  const strong = document.createElement("strong");
  strong.textContent = title;
  alert.append(strong, ` ${message}`);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");
  alert.append(closeButton);

  formAlert.replaceChildren(alert);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  setLoading(true);
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (result.result !== "success") {
      showAlert("danger", "Gagal mengirim.", result.message || "Pesan tidak dapat disimpan.");
      return;
    }

    showAlert("success", "Terima kasih!", "Pesan Anda sudah kami terima.");
    form.reset();
    form.classList.remove("was-validated");
  } catch (error) {
    showAlert("danger", "Gagal mengirim.", "Periksa koneksi internet lalu coba lagi.");
    console.error("Error saat mengirim pesan:", error);
  } finally {
    setLoading(false);
  }
});

/* ===== Tema terang / gelap ===== */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  themeIcon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  localStorage.setItem("theme", theme);
};

applyTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* ===== Navbar, tombol ke atas, dan menu mobile ===== */
const navbar = document.querySelector(".navbar");
const backToTop = document.getElementById("backToTop");
const navCollapse = document.getElementById("navbarNav");

const handleScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  backToTop.classList.toggle("show", window.scrollY > 500);
};
window.addEventListener("scroll", handleScroll);
handleScroll();

document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => bootstrap.Collapse.getInstance(navCollapse)?.hide());
});

/* ===== Filter project ===== */
const filterButtons = document.querySelectorAll("#projectFilter .btn-filter");
const projectItems = document.querySelectorAll(".project-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    projectItems.forEach((item) => {
      const categories = item.dataset.category?.trim().split(/\s+/) ?? [];
      const match = button.dataset.filter === "all" || categories.includes(button.dataset.filter);
      item.classList.toggle("d-none", !match);
    });
  });
});

/* ===== Modal preview project ===== */
document.getElementById("projectModal").addEventListener("show.bs.modal", (event) => {
  const { img, title, projectUrl } = event.relatedTarget.dataset;
  const projectLink = document.getElementById("projectModalLink");

  document.getElementById("projectModalImg").src = img;
  document.getElementById("projectModalImg").alt = title;
  document.getElementById("projectModalTitle").textContent = title;

  projectLink.classList.add("d-none");
  projectLink.removeAttribute("href");

  if (!projectUrl) return;

  try {
    const url = new URL(projectUrl, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("URL project harus menggunakan HTTP atau HTTPS.");
    }

    projectLink.href = url.href;
    projectLink.classList.remove("d-none");
  } catch (error) {
    console.error("URL project tidak valid:", error);
  }
});
