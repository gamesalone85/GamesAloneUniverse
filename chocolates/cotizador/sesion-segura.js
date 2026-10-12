// Sarita: cierre de sesión por 15 minutos de inactividad.
// Se inicia después de que la página haya ejecutado initializeApp().
import { getApps } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

const KEY = 'sarita_admin_ultima_actividad_v1';
const LIMIT = 15 * 60 * 1000;
let auth = null;
let closing = false;
let lastWrite = 0;

export function validSession() {
  const stamp = Number(localStorage.getItem(KEY));
  return Number.isFinite(stamp) && stamp > 0 && Date.now() >= stamp && Date.now() - stamp < LIMIT;
}
export function markLogin() { localStorage.setItem(KEY, String(Date.now())); }
export async function expireSession() {
  if (closing || !auth) return;
  closing = true;
  localStorage.removeItem(KEY);
  try { await signOut(auth); } catch (error) { console.warn('No se pudo cerrar Firebase:', error); }
  window.location.replace('./index.html?sesion=expirada');
}
function check() {
  if (auth?.currentUser && !validSession()) void expireSession();
}
function activity() {
  if (!auth?.currentUser || closing) return;
  if (!validSession()) { void expireSession(); return; }
  if (Date.now() - lastWrite >= 5000) {
    lastWrite = Date.now();
    markLogin();
  }
}
function start() {
  const app = getApps()[0];
  if (!app) {
    // En páginas que inicializan Firebase en su propio módulo,
    // la evaluación de esta importación ocurre antes de initializeApp().
    // Reintentamos hasta que termine de ejecutarse el módulo de la página.
    setTimeout(start, 50);
    return;
  }
  auth = getAuth(app);
  onAuthStateChanged(auth, user => { if (user) check(); });
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(name =>
    document.addEventListener(name, activity, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  window.addEventListener('focus', check);
  window.addEventListener('pageshow', check);
  window.addEventListener('storage', event => { if (event.key === KEY) check(); });
  setInterval(check, 10000);
  check();
}
// Deferir hasta que se evalúe el módulo principal que llama initializeApp().
setTimeout(start, 0);
