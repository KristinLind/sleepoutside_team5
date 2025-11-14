// normalizePublicImage function from public
export function normalizePublicImage(p) {
  const raw = String(p || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; 
  return raw.startsWith("/") ? raw : `/${raw}`; 
}
// Asynchronous Fetch
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template from ${path}: Status ${res.status}`);
  }
  const template = await res.text();
  return template;
}
//export template
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  // Check for and execute the optional callback function
  if (callback) {
    callback(data);
  }
}

//export async function HeaderFooter
export async function loadHeaderFooter() {
  // Define paths to the partials
  const headerPath = '/partials/header.html';
  const footerPath = '/partials/footer.html';

  // Load the templates concurrently (optional, but good practice)
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate(headerPath),
    loadTemplate(footerPath)
  ]);

  // Grab the placeholder elements from the DOM
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  // Render the templates. Header requires no data or callback here.
  if (headerElement) {
    renderWithTemplate(headerTemplate, headerElement);
  }

  // Render the footer. Footer requires no data or callback here.
  if (footerElement) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localStorage (always returns an array for cart safety)
export function getLocalStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // eslint-disable-next-line no-console
    console.error(`Error parsing localStorage key: ${key}`);
    return [];
  }
}

// save data to localStorage
export function setLocalStorage(key, data) {
  // eslint-disable-next-line no-console
  console.log('[setLocalStorage]', key, { isArray: Array.isArray(data), data });
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
