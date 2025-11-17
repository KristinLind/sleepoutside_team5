// normalizePublicImage function from public
export function normalizePublicImage(p) {
  const raw = String(p || "").trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) return raw;

  const cleaned = raw
    .replace(/^(\.\.\/)+/, "")  // strip any ../ at the start
    .replace(/^\.\/+/, "")      // strip any ./ at the start
    .replace(/^\/+/, "");       // strip leading slashes

  return `/${cleaned}`;
}

// Asynchronous Fetch
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(
      `Failed to load template from ${path}: Status ${res.status}`
    );
  }
  const template = await res.text();
  return template;
}

// render template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// load header and footer partials
export async function loadHeaderFooter() {
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

  // Load the templates concurrently
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate(headerPath),
    loadTemplate(footerPath),
  ]);

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }

  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }

  return true;
}

// wrapper for querySelector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localStorage
export function getLocalStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error(`Error parsing localStorage key: ${key}`);
    return [];
  }
}

// save data to localStorage
export function setLocalStorage(key, data) {
  console.log("[setLocalStorage]", key, { isArray: Array.isArray(data), data });
  localStorage.setItem(key, JSON.stringify(data));
}

// alert message
export function alertMessage(message, scroll = true) {
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());

  // Create the alert container
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert');

  // Set content (example structure: message + close button)
  alertEl.innerHTML = `
    <p>${message}</p>
    <span class="alert-close">X</span>
  `;

  // Add listener to close the alert
  alertEl.addEventListener('click', function (e) {
    // Check if the click target is the alert itself or the close span
    if (e.target.classList.contains('alert-close') || e.target === this) {
      this.remove();
    }
  });

  const main = document.querySelector('main');
  main.prepend(alertEl);
  if (scroll) {
    window.scrollTo(0, 0);
  }
}

export function setClick(selector, callback) {

    const el = qs(selector);
    if (!el) return;
    el.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback(event);
    });
    el.addEventListener("click", (event) => {
      callback(event);
  });
}

