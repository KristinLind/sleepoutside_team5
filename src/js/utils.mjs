// normalizePublicImage ensures image paths load correctly from the /public folder
export function normalizePublicImage(p) {
  const raw = String(p || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; // full URL stays
  return raw.startsWith("/") ? raw : `/${raw}`; // "images/..." → "/images/..."
}
// Asynchronous Fetch
export async function loadTemplate(path) {
  const res = await fetch(path);
  // Ensure we handle network errors before converting to text
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
  const headerPath = '../public/partials/header.html';
  const footerPath = '../public/partials/footer.html';

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

// retrieve data from localstorage 
export function getLocalStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null; // 
  try {
    return JSON.parse(raw);
  } catch {
    console.error(`Error parsing localStorage key: ${key}`);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
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
