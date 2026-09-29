/**
 * Main application logic: navigation, screen management, settings.
 */

// ── Navigation ──────────────────────────────────────────────────────────────

const screens = ['scan', 'products', 'meals', 'settings'];
let currentScreen = 'scan';

function showScreen(name) {
  screens.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle('hidden', s !== name);
  });
  currentScreen = name;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.screen === name);
  });
  // Load data when entering a screen
  if (name === 'products') loadProducts();
  if (name === 'meals') loadMeals();
  if (name === 'settings') loadSettings();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showScreen(link.dataset.screen);
  });
});

// ── Settings ────────────────────────────────────────────────────────────────

function loadSettings() {
  const url = localStorage.getItem('ai_endpoint_url') || '';
  const key = localStorage.getItem('ai_api_key') || '';
  const model = localStorage.getItem('ai_model') || '';
  document.getElementById('setting-url').value = url;
  document.getElementById('setting-key').value = key;
  document.getElementById('setting-model').value = model;
}

function saveSettings() {
  const url = document.getElementById('setting-url').value.trim();
  const key = document.getElementById('setting-key').value.trim();
  const model = document.getElementById('setting-model').value.trim();
  localStorage.setItem('ai_endpoint_url', url);
  localStorage.setItem('ai_api_key', key);
  localStorage.setItem('ai_model', model);
  alert('Configuración guardada.');
}

document.getElementById('save-settings').addEventListener('click', saveSettings);

// ── Helpers ─────────────────────────────────────────────────────────────────

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function formatNutrition(value, unit) {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(1)} ${unit}`;
}

// ── Export for other modules ────────────────────────────────────────────────

window.showScreen = showScreen;
window.showToast = showToast;
window.formatNutrition = formatNutrition;