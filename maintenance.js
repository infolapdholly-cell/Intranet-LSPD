// ============================================================
// maintenance.js — LSPD Intranet v8
// Reçoit l'instance db de la page — aucun conflit Firebase
// ============================================================

const BYPASS_PAGES = ['maintenance.html', 'admin.html', 'index.html'];
const currentPage  = window.location.pathname.split('/').pop() || 'index.html';
const isBypass     = BYPASS_PAGES.some(p => currentPage.endsWith(p));

function buildRedirectUrl(data) {
  const params = new URLSearchParams({
    msg:    data.message || '',
    eta:    data.eta     || '',
    reason: data.reason  || '',
  });
  return 'maintenance.html?' + params.toString();
}

// Vérification unique au chargement — reçoit db depuis la page
export async function checkMaintenance(db) {
  if (isBypass) return;
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, 'config', 'maintenance'));
    if (snap.exists() && snap.data().enabled === true) {
      window.location.replace(buildRedirectUrl(snap.data()));
    }
  } catch(e) {
    console.warn('[Maintenance] Check failed (fail-open):', e);
  }
}

// Écoute en temps réel pendant la navigation — reçoit db depuis la page
export function watchMaintenance(db) {
  if (isBypass) return;
  import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js").then(({ doc, onSnapshot }) => {
    onSnapshot(doc(db, 'config', 'maintenance'), snap => {
      if (snap.exists() && snap.data().enabled === true) {
        window.location.replace(buildRedirectUrl(snap.data()));
      }
    });
  }).catch(e => console.warn('[Maintenance] Watch failed:', e));
}
