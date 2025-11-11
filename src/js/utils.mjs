// normalizePublicImage ensures image paths load correctly from the /public folder
export function normalizePublicImage(p) {
  const raw = String(p || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw; // full URL stays
  return raw.startsWith("/") ? raw : `/${raw}`; // "images/..." → "/images/..."
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
