// ============================================================
// utils.js — LSPD Intranet v8 — Ops Center
// ============================================================

export const GRADES = {
  'chef de police': { label:'Chef de Police', color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'chef assistant': { label:'Chef Assistant', color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'chef adjoint':   { label:'Chef Adjoint',   color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'commandant':     { label:'Commandant',      color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'capitaine':      { label:'Capitaine',       color:'blue', canRead:true,canWrite:true,canDelete:true,canAdmin:false,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'lieutenant':     { label:'Lieutenant',      color:'blue', canRead:true,canWrite:true,canDelete:false,canAdmin:false,canLogs:true,canManageOfficers:true,canManageWeapons:false,canManageVehicles:false,canEditOfficiers:false,canViewOfficierDossier:false,canEtatMajor:false },
  'sergent':        { label:'Sergent',         color:'blue', canRead:true,canWrite:true,canDelete:false,canAdmin:false,canLogs:true,canManageOfficers:true,canManageWeapons:false,canManageVehicles:false,canEditOfficiers:false,canViewOfficierDossier:false,canEtatMajor:false },
  'officier':       { label:'Officier',        color:'blue', canRead:true,canWrite:true,canDelete:false,canAdmin:false,canLogs:false,canManageOfficers:true,canManageWeapons:false,canManageVehicles:false,canEditOfficiers:false,canViewOfficierDossier:false,canEtatMajor:false },
  'cadet':          { label:'Cadet',           color:'gray', canRead:true,canWrite:false,canDelete:false,canAdmin:false,canLogs:false,canManageOfficers:true,canManageWeapons:false,canManageVehicles:false,canEditOfficiers:false,canViewOfficierDossier:false,canEtatMajor:false },
  'invite':         { label:'Invité',          color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
  'admin':          { label:'Admin',           color:'gold', canRead:true,canWrite:true,canDelete:true,canAdmin:true,canLogs:true,canManageOfficers:true,canManageWeapons:true,canManageVehicles:true,canEditOfficiers:true,canViewOfficierDossier:true,canEtatMajor:true },
};

export function getPerms(grade) {
  const g = (grade||'').toLowerCase();
  return GRADES[g] || { label:g||'Inconnu', color:'gray', canRead:true,canWrite:false,canDelete:false,canAdmin:false,canLogs:false,canManageOfficers:true,canManageWeapons:false,canManageVehicles:false,canEditOfficiers:false,canViewOfficierDossier:false,canEtatMajor:false };
}

// ── AUTH ──────────────────────────────────────────────────
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
          name  = data.displayName || user.email;
          if (data.suspended) {
            // Déconnecter proprement pour éviter la boucle de reconnexion
            try {
              const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
              await signOut(auth);
            } catch(e) {}
            window.location.replace('index.html');
            return;
          }
        }
      } catch(e) { console.warn('Grade load failed:', e); }

      const perms = getPerms(grade);

      // Topbar — grade badge
      const gradeEl = document.getElementById('tbGrade');
      const nameEl  = document.getElementById('tbName');
      if (gradeEl) {
        gradeEl.textContent = perms.label || grade;
        const map = {
          gold: 'color:var(--gold-b);background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3)',
          blue: 'color:var(--accent-b);background:rgba(37,137,208,.12);border:1px solid rgba(37,137,208,.25)',
          gray: 'color:var(--text2);background:rgba(61,88,120,.12);border:1px solid rgba(61,88,120,.25)',
        };
        gradeEl.style.cssText = (map[perms.color]||map.gray) +
          ';font-family:"JetBrains Mono",monospace;font-size:9px;padding:3px 9px;border-radius:3px;letter-spacing:1px;text-transform:uppercase';
      }
      if (nameEl) nameEl.textContent = name;

      buildSidebar('sidebar', pageName, grade);

      // ── LOGOUT global (BUG FIX — défini ici pour toutes les pages) ──
      window.logout = async function() {
        try {
          const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
          try {
            const { doc: docFn, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
            await deleteDoc(docFn(db, 'online', user.uid));
          } catch(e) {}
          await signOut(auth);
        } catch(e) { console.warn('Logout error:', e); }
        sessionStorage.clear();
        localStorage.removeItem('lspd_grade');
        localStorage.removeItem('lspd_name');
        window.location.href = 'index.html';
      };

      // ── SIDEBAR TOGGLE global (BUG FIX — manquait dans toutes les pages) ──
      window.toggleSidebar = function() {
        document.getElementById('sidebar')?.classList.toggle('open');
        document.getElementById('sidebarOverlay')?.classList.toggle('show');
      };


  
      // ── WATCHER MAINTENANCE ──────────────────────────────────
      const mtnBypass = ['maintenance.html','admin.html','index.html','change-password.html'];
      const curPageMtn = window.location.pathname.split('/').pop() || '';
      if (!mtnBypass.some(function(p){ return curPageMtn.endsWith(p); })) {
        try {
          const { doc: docM, onSnapshot: onSnapM } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          onSnapM(docM(db, 'config', 'maintenance'), function(snap) {
            if (snap.exists() && snap.data().enabled === true && grade !== 'chef de police') {
              const d = snap.data();
              window.location.replace('maintenance.html?' + new URLSearchParams({ msg: d.message||'', eta: d.eta||'', reason: d.reason||'' }).toString());
            }
          });
        } catch(e) { console.warn('[Maintenance]', e); }
      }
      // ── WATCHER DÉCONNEXION FORCÉE ───────────────────────────
      try {
        const { doc: docFL, onSnapshot: onSnapFL, updateDoc: updFL } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        onSnapFL(docFL(db, 'users', user.uid), async function(snap) {
          if (snap.exists() && snap.data().forceLogout === true) {
            try { await updFL(docFL(db, 'users', user.uid), { forceLogout: false }); } catch(e2) {}
            try { const { signOut: so } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"); await so(auth); } catch(e2) {}
            window.location.replace('index.html');
          }
        });
      } catch(e) { console.warn('[ForceLogout]', e); }
      // ────────────────────────────────────────────────────────

      // ── WATCHER BROADCAST MESSAGE ────────────────────────────
      const bcastBypass = ['admin.html','index.html','maintenance.html'];
      const curPageBcast = window.location.pathname.split('/').pop() || '';
      if (!bcastBypass.some(function(p){ return curPageBcast.endsWith(p); })) {
        try {
          // Créer la bannière dans le DOM
          const bStyle = document.createElement('style');
          bStyle.textContent = [
            '.bc-banner{position:fixed;top:52px;left:0;right:0;z-index:190;',
            'padding:10px 20px;display:none;align-items:center;gap:12px;',
            'font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:1px;',
            'box-shadow:0 2px 12px rgba(0,0,0,.4)}',
            '.bc-banner.warning{background:rgba(196,125,16,.95);color:#fff;border-bottom:1px solid #c47d10}',
            '.bc-banner.info{background:rgba(20,88,160,.95);color:#fff;border-bottom:1px solid #2589d0}',
            '.bc-banner.danger{background:rgba(184,48,48,.95);color:#fff;border-bottom:1px solid #b83030}',
            '.bc-title{font-weight:700;margin-right:4px}',
            '.bc-close{margin-left:auto;cursor:pointer;opacity:.7;font-size:18px;background:none;border:none;color:inherit;padding:0 4px}'
          ].join('');
          document.head.appendChild(bStyle);

          const bBanner = document.createElement('div');
          bBanner.id = 'bcBanner';
          bBanner.className = 'bc-banner';
          const bTitle = document.createElement('span');
          bTitle.className = 'bc-title';
          bTitle.id = 'bcTitle';
          const bBody = document.createElement('span');
          bBody.id = 'bcBody';
          const bClose = document.createElement('button');
          bClose.className = 'bc-close';
          bClose.textContent = '×';
          bClose.onclick = function(){ bBanner.style.display = 'none'; };
          bBanner.appendChild(bTitle);
          bBanner.appendChild(bBody);
          bBanner.appendChild(bClose);
          document.body.appendChild(bBanner);

          // Écouter Firestore
          const { doc: docBC, onSnapshot: onSnapBC } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          onSnapBC(docBC(db, 'config', 'broadcast'), function(snap) {
            if (snap.exists() && snap.data().active === true) {
              const d = snap.data();
              bBanner.className = 'bc-banner ' + (d.type || 'warning');
              bTitle.textContent = d.title ? d.title + ' —' : '';
              bBody.textContent = d.body || '';
              bBanner.style.display = 'flex';
            } else {
              bBanner.style.display = 'none';
            }
          });
        } catch(e) { console.warn('[Broadcast]', e); }
      }
      // ────────────────────────────────────────────────────────
    resolve({ user, grade, name, perms });
    });
  });
}

// ── SIDEBAR ───────────────────────────────────────────────
export function buildSidebar(elementId, activePage, grade) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const p = getPerms(grade);
  let h = '';

  h += `<div class="sb-section">Principal</div>`;
  h += nav('dashboard', activePage, '◈', 'Tableau de bord', 'dashboard.html');

  if (p.canRead) {
    h += `<div class="sb-divider"></div><div class="sb-section">Opérations</div>`;
    h += nav('casiers',      activePage, '▤', 'Casiers judiciaires', 'casiers.html');
    h += nav('arrestations', activePage, '◎', 'Arrestations',        'arrestations.html');
    h += nav('amendes',      activePage, '◇', 'Amendes / PV',        'amendes.html');
    h += nav('rapports',     activePage, '▣', 'Rapports',            'rapports.html');
    h += nav('saisies',      activePage, '▨', 'Saisies',             'saisies.html');
  }

  h += `<div class="sb-divider"></div><div class="sb-section">Personnel</div>`;
  h += nav('officiers', activePage, '▦', 'Officiers', 'officiers.html');

  if (p.canEtatMajor) {
    h += `<div class="sb-divider"></div><div class="sb-section">État major</div>`;
    if (p.canManageVehicles) h += nav('vehicules',  activePage, '◉', 'Véhicules',      'vehicules.html');
    if (p.canManageWeapons)  h += nav('armurerie',  activePage, '▲', 'Armurerie',       'armurerie.html');
    if (p.canLogs)           h += nav('logs',        activePage, '≡', 'Historique',     'logs.html');
    if (p.canAdmin)          h += nav('admin',       activePage, '⊞', 'Administration', 'admin.html');
  }

  h += `<div class="sb-divider"></div><div class="sb-section">Réseau</div>`;
  h += nav('interpolice', activePage, '↗', 'Interpolice', 'interpolice.html');
  h += `<div class="sb-divider"></div>`;
  h += `<a class="sb-item" href="#" onclick="event.preventDefault();window.logout()"><span class="sb-icon">⊘</span>Déconnexion</a>`;

  el.innerHTML = h;
}

function nav(key, active, icon, label, href) {
  return `<a class="sb-item ${key===active?'active':''}" href="${href}"><span class="sb-icon">${icon}</span>${label}</a>`;
}

// ── UTILITIES ─────────────────────────────────────────────
export function startClock(id) {
  const fn = () => { const el=document.getElementById(id); if(el) el.textContent=new Date().toLocaleTimeString('fr-FR'); };
  fn(); setInterval(fn, 1000);
}

export function showToast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) { t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  t.textContent = (icons[type]||'') + ' ' + msg;
  t.className = 'toast '+type+' show';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3200);
}

export function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
export function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

export function setupModalClose() {
  document.querySelectorAll('.modal-bg').forEach(m =>
    m.addEventListener('click', e => { if(e.target===m) m.classList.remove('open'); })
  );
}

export function generateRef(prefix='REF') {
  const n = new Date();
  return `${prefix}-${n.getFullYear().toString().slice(-2)}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
}

export function statusBadge(s) {
  const map = {
    'En vie':'b-alive','Mort':'b-dead','LSPD':'b-lspd',
    'Actif':'b-active','Inactif':'b-inactive','Congé':'b-repair',
    'Disponible':'b-active','Maintenance':'b-repair','Hors service':'b-dead',
    'Ouvert':'b-open','Fermé':'b-closed',
    'Payée':'b-paid','Impayée':'b-unpaid',
    'En garde à vue':'b-wanted','Libéré':'b-alive','Transféré':'b-repair',
  };
  return `<span class="badge ${map[s]||'b-inactive'}">${s||'—'}</span>`;
}

export async function addLog(db, action, details) {
  try {
    const name = document.getElementById('tbName')?.textContent || 'Inconnu';
    const { addDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await addDoc(collection(db,'logs'), { user:name, action, details, timestamp:new Date().toISOString() });
  } catch(e) { console.warn('Log failed:',e); }
}

export function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR'); } catch(e) { return d; }
}
export function formatDateTime(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e) { return d; }
}

// Legacy compat
export function initTopbar() { return {}; }
export function getSessionInfo() { return {}; }
export function checkAuth(auth, fn) { return new Promise(r => fn(auth, u => { if(!u) window.location.href='index.html'; else r({user:u}); })); }
export async function refreshGradeFromFirebase() {}

// ── SCREENSHOT ────────────────────────────────────────────
export async function captureModal(modalBodyId) {
  const el = document.getElementById(modalBodyId);
  if (!el) { showToast('Élément introuvable','error'); return; }
  if (!window.html2canvas) {
    await new Promise((res,rej) => {
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload=res; s.onerror=rej; document.head.appendChild(s);
    });
  }
  try {
    showToast('Capture en cours...','info');
    const canvas = await window.html2canvas(el, { backgroundColor:'#0e1420', scale:2, useCORS:true, logging:false });
    canvas.toBlob(async blob => {
      try {
        await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
        showToast('Capture copiée — Ctrl+V sur Discord','success');
      } catch(e) {
        const a=document.createElement('a'); a.href=canvas.toDataURL('image/png');
        a.download=`lspd-${Date.now()}.png`; a.click();
        showToast('Image téléchargée','success');
      }
    },'image/png');
  } catch(e) { showToast('Erreur: '+e.message,'error'); }
}
