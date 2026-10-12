// Sesión administrativa Sarita: expiración por inactividad (15 minutos).
// No contiene credenciales ni modifica las reglas de Firestore.
import {getAuth, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
const KEY='sarita_admin_ultima_actividad_v1';
const LIMIT=15*60*1000;
const auth=getAuth();
let closing=false;
export function validSession(){
  const stamp=Number(localStorage.getItem(KEY));
  return Number.isFinite(stamp)&&stamp>0&&Date.now()>=stamp&&Date.now()-stamp<LIMIT;
}
export function markLogin(){localStorage.setItem(KEY,String(Date.now()));}
export async function expireSession(){
  if(closing)return;
  closing=true;
  localStorage.removeItem(KEY);
  try{await signOut(auth);}catch(e){console.warn('No se pudo cerrar Firebase:',e);}
  window.location.replace('./index.html?sesion=expirada');
}
let lastWrite=0;
function activity(){
  if(!auth.currentUser||closing)return;
  if(!validSession()){void expireSession();return;}
  if(Date.now()-lastWrite>5000){lastWrite=Date.now();markLogin();}
}
function check(){if(auth.currentUser&&!validSession())void expireSession();}
onAuthStateChanged(auth,user=>{if(user)check();});
['pointerdown','keydown','touchstart','scroll'].forEach(ev=>document.addEventListener(ev,activity,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
window.addEventListener('focus',check);
window.addEventListener('pageshow',check);
window.addEventListener('storage',e=>{if(e.key===KEY)check();});
setInterval(check,10000);
check();
