// ============================================================
// utils.js — LSPD Intranet v6 — Nouvelle navigation
// ============================================================

export const GRADES = {
  'chef de police':  { label:'Chef de Police',  color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'chef assistant':  { label:'Chef Assistant',  color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'chef adjoint':    { label:'Chef Adjoint',    color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'commandant':      { label:'Commandant',      color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'capitaine':       { label:'Capitaine',       color:'blue', canRead:true, canWrite:true, canDelete:true, canAdmin:false, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'lieutenant':      { label:'Lieutenant',      color:'blue', canRead:true, canWrite:true, canDelete:false, canAdmin:false, canLogs:true, canManageOfficers:true, canManageWeapons:false, canManageVehicles:false, canEditOfficiers:false, canViewOfficierDossier:false, canEtatMajor:false },
  'sergent':         { label:'Sergent',         color:'blue', canRead:true, canWrite:true, canDelete:false, canAdmin:false, canLogs:true, canManageOfficers:true, canManageWeapons:false, canManageVehicles:false, canEditOfficiers:false, canViewOfficierDossier:false, canEtatMajor:false },
  'officier':        { label:'Officier',        color:'blue', canRead:true, canWrite:true, canDelete:false, canAdmin:false, canLogs:false, canManageOfficers:true, canManageWeapons:false, canManageVehicles:false, canEditOfficiers:false, canViewOfficierDossier:false, canEtatMajor:false },
  'cadet':           { label:'Cadet',           color:'gray', canRead:true, canWrite:false, canDelete:false, canAdmin:false, canLogs:false, canManageOfficers:true, canManageWeapons:false, canManageVehicles:false, canEditOfficiers:false, canViewOfficierDossier:false, canEtatMajor:false },
  'invite':          { label:'Invité',          color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
  'admin':           { label:'Admin',           color:'gold', canRead:true, canWrite:true, canDelete:true, canAdmin:true, canLogs:true, canManageOfficers:true, canManageWeapons:true, canManageVehicles:true, canEditOfficiers:true, canViewOfficierDossier:true, canEtatMajor:true },
};

export function getPerms(grade) {
  const g = (grade||'').toLowerCase();
  return GRADES[g] || { label:g||'Inconnu', color:'gray', canRead:true, canWrite:false, canDelete:false, canAdmin:false, canLogs:false, canManageOfficers:true, canManageWeapons:false, canManageVehicles:false, canEditOfficiers:false, canViewOfficierDossier:false, canEtatMajor:false };
}

// ============================================================
// AUTH
// ============================================================
export async function initPage(auth, db, onAuthStateChanged, pageName) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async user => {
      if (!user) { window.location.href = 'index.html'; return; }
      let grade = 'cadet', name = user.email;
      try {
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          grade = (data.grade||'cadet').toLowerCase();
          name = data.displayName||user.email;
          if (data.suspended) { window.location.href = 'index.html'; return; }
        }
      } catch(e) { console.warn('Grade load failed:', e); }
      const perms = getPerms(grade);
      const gradeEl = document.getElementById('tbGrade');
      const nameEl = document.getElementById('tbName');
      if (gradeEl) {
        gradeEl.textContent = perms.label||grade;
        const colors = { gold:'background:rgba(201,170,77,.15);color:#c9aa4d;border:1px solid #c9aa4d', blue:'background:rgba(37,137,208,.15);color:#2589d0;border:1px solid #1458a0', gray:'background:rgba(68,94,122,.15);color:#445e7a;border:1px solid #445e7a' };
        gradeEl.style.cssText = (colors[perms.color]||colors.gray)+';font-family:Share Tech Mono,monospace;font-size:10px;padding:3px 9px;border-radius:3px;letter-spacing:1px';
      }
      if (nameEl) nameEl.textContent = name;
      buildSidebar('sidebar', pageName, grade);
  
      // ── WATCHER MAINTENANCE EN TEMPS RÉEL ──────────────────
      const mtnBypass = ['maintenance.html','admin.html','index.html','change-password.html'];
      const currentPageMtn = window.location.pathname.split('/').pop() || '';
      if (!mtnBypass.some(p => currentPageMtn.endsWith(p))) {
        try {
          const { doc: docM, onSnapshot: onSnapM } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          onSnapM(docM(db, 'config', 'maintenance'), snap => {
            if (snap.exists() && snap.data().enabled === true) {
              if (grade !== 'chef de police') {
                const d = snap.data();
                const params = new URLSearchParams({ msg: d.message||'', eta: d.eta||'', reason: d.reason||'' });
                window.location.replace('maintenance.html?' + params.toString());
              }
            }
          });
        } catch(e) { console.warn('[Maintenance watcher]', e); }
      }
      // ────────────────────────────────────────────────────────

      // ── WATCHER DÉCONNEXION FORCÉE ──────────────────────────
      try {
        const { doc: docFL, onSnapshot: onSnapFL, updateDoc: updFL } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        onSnapFL(docFL(db, 'users', user.uid), async snap => {
          if (snap.exists() && snap.data().forceLogout === true) {
            try {
              await updFL(docFL(db, 'users', user.uid), { forceLogout: false });
              const { signOut: soFL } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
              await soFL(auth);
            } catch(e) {}
            window.location.replace('index.html');
          }
        });
      } catch(e) { console.warn('[ForceLogout watcher]', e); }
      // ────────────────────────────────────────────────────────

      // ── WATCHER BROADCAST MESSAGE ────────────────────────────
      const bcastBypass = ['admin.html','index.html','maintenance.html'];
      const currentPageBcast = window.location.pathname.split('/').pop() || '';
      if (!bcastBypass.some(p => currentPageBcast.endsWith(p))) {
        try {
          const style = document.createElement('style');
          style.textContent = `.broadcast-banner{position:fixed;top:52px;left:0;right:0;z-index:190;padding:10px 20px;display:none;align-items:center;gap:12px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:1px;box-shadow:0 2px 12px rgba(0,0,0,.4)}.broadcast-banner.warning{background:rgba(214,137,16,.95);color:#fff;border-bottom:1px solid #d68910}.broadcast-banner.info{background:rgba(20,88,160,.95);color:#fff;border-bottom:1px solid #2589d0}.broadcast-banner.danger{background:rgba(192,57,43,.95);color:#fff;border-bottom:1px solid #c0392b}.bb-title{font-weight:700;margin-right:4px}.bb-close{margin-left:auto;cursor:pointer;opacity:.7;font-size:18px;background:none;border:none;color:inherit;padding:0 4px}`;
          document.head.appendChild(style);
          const banner = document.createElement('div');
          banner.id = 'broadcastBanner';
          banner.className = 'broadcast-banner';
          banner.innerHTML = '<span class="bb-title" id="bbTitle"></span><span id="bbBody"></span><button class="bb-close" onclick="this.parentElement.style.display=\'none\'">×</button>';
          document.body.appendChild(banner);
          const { doc: docBC, onSnapshot: onSnapBC } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          onSnapBC(docBC(db, 'config', 'broadcast'), snap => {
            const b = document.getElementById('broadcastBanner');
            if (!b) return;
            if (snap.exists() && snap.data().active === true) {
              const d = snap.data();
              b.className = 'broadcast-banner ' + (d.type || 'warning');
              document.getElementById('bbTitle').textContent = d.title ? d.title + ' —' : '';
              document.getElementById('bbBody').textContent = d.body || '';
              b.style.display = 'flex';
            } else {
              b.style.display = 'none';
            }
          });
        } catch(e) { console.warn('[Broadcast watcher]', e); }
      }
      // ────────────────────────────────────────────────────────
    resolve({ user, grade, name, perms });
    });
  });
}

// ============================================================
// SIDEBAR avec sections dépliables
// ============================================================
export function buildSidebar(elementId, activePage, grade) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const p = getPerms(grade);

  let html = '';

  // PRINCIPAL
  html += `<div class="sb-section">PRINCIPAL</div>`;
  html += `<a class="sb-item ${'dashboard'===activePage?'active':''}" href="dashboard.html"><span class="sb-icon">📊</span>Tableau de bord</a>`;

  // OPÉRATIONS — accessible à tous
  html += `<div class="sb-divider"></div><div class="sb-section">OPÉRATIONS</div>`;
  if (p.canRead) {
    html += `<a class="sb-item ${'casiers'===activePage?'active':''}" href="casiers.html"><span class="sb-icon">📁</span>Casiers judiciaires</a>`;
    html += `<a class="sb-item ${'arrestations'===activePage?'active':''}" href="arrestations.html"><span class="sb-icon">🚔</span>Arrestations</a>`;
    html += `<a class="sb-item ${'amendes'===activePage?'active':''}" href="amendes.html"><span class="sb-icon">💰</span>Amendes / PV</a>`;
    html += `<a class="sb-item ${'rapports'===activePage?'active':''}" href="rapports.html"><span class="sb-icon">📋</span>Rapports</a>`;
    html += `<a class="sb-item ${'saisies'===activePage?'active':''}" href="saisies.html"><span class="sb-icon">📦</span>Saisies</a>`;
  }

  // PERSONNEL — accessible à tous
  html += `<div class="sb-divider"></div><div class="sb-section">PERSONNEL</div>`;
  html += `<a class="sb-item ${'officiers'===activePage?'active':''}" href="officiers.html"><span class="sb-icon">👮</span>Officiers</a>`;

  // ÉTAT MAJOR — hauts grades seulement
  if (p.canEtatMajor) {
    html += `<div class="sb-divider"></div><div class="sb-section">ÉTAT MAJOR</div>`;
    if (p.canManageVehicles) html += `<a class="sb-item ${'vehicules'===activePage?'active':''}" href="vehicules.html"><span class="sb-icon">🚓</span>Véhicules</a>`;
    if (p.canManageWeapons) html += `<a class="sb-item ${'armurerie'===activePage?'active':''}" href="armurerie.html"><span class="sb-icon">🔫</span>Armurerie</a>`;
    if (p.canLogs) html += `<a class="sb-item ${'logs'===activePage?'active':''}" href="logs.html"><span class="sb-icon">📜</span>Historique</a>`;
    if (p.canAdmin) html += `<a class="sb-item ${'admin'===activePage?'active':''}" href="admin.html"><span class="sb-icon">⚙️</span>Administration</a>`;
  }

  html += `<div class="sb-divider"></div>`;
  html += `<div class="sb-section">RÉSEAU</div>`;
  html += `<a class="sb-item ${'interpolice'===activePage?'active':''}" href="interpolice.html"><span class="sb-icon">🌐</span>Interpolice</a>`;
  html += `<div class="sb-divider"></div>`;
  html += `<a class="sb-item" href="#" onclick="window.logout()"><span class="sb-icon">🚪</span>Déconnexion</a>`;

  el.innerHTML = html;
}

// ============================================================
// UTILITAIRES
// ============================================================
export function startClock(elementId) {
  const update = () => { const el = document.getElementById(elementId); if (el) el.textContent = new Date().toLocaleTimeString('fr-FR'); };
  update(); setInterval(update, 1000);
}
export function showToast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = (type==='success'?'✓ ':type==='error'?'✕ ':'ℹ ')+msg;
  t.className = 'toast '+type+' show';
  setTimeout(()=>t.classList.remove('show'), 3000);
}
export function openModal(id) { document.getElementById(id)?.classList.add('open'); }
export function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
export function setupModalClose() {
  document.querySelectorAll('.modal-bg').forEach(m => m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); }));
}
export function generateRef(prefix='REF') {
  const now = new Date();
  return `${prefix}-${now.getFullYear().toString().slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
}
export function statusBadge(s) {
  const map = {'En vie':'b-alive','Mort':'b-dead','LSPD':'b-lspd','Actif':'b-active','Inactif':'b-inactive','Congé':'b-repair','Disponible':'b-active','Maintenance':'b-repair','Hors service':'b-dead','Ouvert':'b-open','Fermé':'b-closed','Payée':'b-paid','Impayée':'b-unpaid'};
  return `<span class="badge ${map[s]||'b-inactive'}">${s||'—'}</span>`;
}
export async function addLog(db, action, details) {
  try {
    const name = document.getElementById('tbName')?.textContent||'Inconnu';
    const { addDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await addDoc(collection(db,'logs'), { user:name, action, details, timestamp:new Date().toISOString() });
  } catch(e) { console.warn('Log failed:',e); }
}
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch(e) { return dateStr; }
}
export function initTopbar() { return { grade:'', name:'' }; }
export function getSessionInfo() { return { grade:'', name:'', uid:'' }; }
export function checkAuth(auth, onAuthStateChanged) { return new Promise(resolve => onAuthStateChanged(auth, user => { if(!user) window.location.href='index.html'; else resolve({user}); })); }
export async function refreshGradeFromFirebase() {}

// ============================================================
// GÉNÉRATION PDF — LSPD Intranet
// =========================================================

export async function captureModal(modalBodyId) {
  const el = document.getElementById(modalBodyId);
  if (!el) { showToast('Élément introuvable', 'error'); return; }

  // Charger html2canvas si pas déjà chargé
  if (!window.html2canvas) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  try {
    showToast('Capture en cours...', 'info');
    const canvas = await window.html2canvas(el, {
      backgroundColor: '#0c1220',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Copier dans le presse-papier
    canvas.toBlob(async blob => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('✓ Capture copiée ! Collez sur Discord (Ctrl+V)', 'success');
      } catch(e) {
        // Fallback : télécharger l'image
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `lspd-capture-${Date.now()}.png`;
        a.click();
        showToast('Image téléchargée !', 'success');
      }
    }, 'image/png');
  } catch(e) {
    showToast('Erreur capture: '+e.message, 'error');
  }
}
