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

// set a listener for both touchend and click (guard the element)
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
