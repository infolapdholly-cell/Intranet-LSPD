// ============================================================
// utils.js — LSPD Intranet v7 — Corrigé & Amélioré
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
        const colors = {
          gold: 'background:rgba(212,168,67,.1);color:#f0c96a;border:1px solid rgba(212,168,67,.4)',
          blue: 'background:rgba(59,143,232,.08);color:#6aafff;border:1px solid rgba(59,143,232,.35)',
          gray: 'background:rgba(74,101,133,.1);color:#4a6585;border:1px solid rgba(74,101,133,.3)'
        };
        gradeEl.style.cssText = (colors[perms.color]||colors.gray)+';font-family:"JetBrains Mono",monospace;font-size:9px;font-weight:700;padding:4px 10px;border-radius:8px;letter-spacing:1.5px;text-transform:uppercase';
      }
      if (nameEl) nameEl.textContent = name;

      // ---- SIDEBAR ----
      buildSidebar('sidebar', pageName, grade);

      // ---- LOGOUT global ----
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

      // ---- SIDEBAR MOBILE toggle (défini globalement) ----
      window.toggleSidebar = function() {
        const sb = document.getElementById('sidebar');
        const ov = document.getElementById('sidebarOverlay');
        if (sb) sb.classList.toggle('open');
        if (ov) ov.classList.toggle('show');
      };

      resolve({ user, grade, name, perms });
    });
  });
}

// ============================================================
// SIDEBAR
// ============================================================
export function buildSidebar(elementId, activePage, grade) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const p = getPerms(grade);

  let html = '';

  html += `<div class="sb-section">PRINCIPAL</div>`;
  html += `<a class="sb-item ${'dashboard'===activePage?'active':''}" href="dashboard.html"><span class="sb-icon">📊</span>Tableau de bord</a>`;

  if (p.canRead) {
    html += `<div class="sb-divider"></div><div class="sb-section">OPÉRATIONS</div>`;
    html += `<a class="sb-item ${'casiers'===activePage?'active':''}" href="casiers.html"><span class="sb-icon">📁</span>Casiers judiciaires</a>`;
    html += `<a class="sb-item ${'arrestations'===activePage?'active':''}" href="arrestations.html"><span class="sb-icon">🚔</span>Arrestations</a>`;
    html += `<a class="sb-item ${'amendes'===activePage?'active':''}" href="amendes.html"><span class="sb-icon">💰</span>Amendes / PV</a>`;
    html += `<a class="sb-item ${'rapports'===activePage?'active':''}" href="rapports.html"><span class="sb-icon">📋</span>Rapports</a>`;
    html += `<a class="sb-item ${'saisies'===activePage?'active':''}" href="saisies.html"><span class="sb-icon">📦</span>Saisies</a>`;
  }

  html += `<div class="sb-divider"></div><div class="sb-section">PERSONNEL</div>`;
  html += `<a class="sb-item ${'officiers'===activePage?'active':''}" href="officiers.html"><span class="sb-icon">👮</span>Officiers</a>`;

  if (p.canEtatMajor) {
    html += `<div class="sb-divider"></div><div class="sb-section">ÉTAT MAJOR</div>`;
    if (p.canManageVehicles) html += `<a class="sb-item ${'vehicules'===activePage?'active':''}" href="vehicules.html"><span class="sb-icon">🚓</span>Véhicules</a>`;
    if (p.canManageWeapons) html += `<a class="sb-item ${'armurerie'===activePage?'active':''}" href="armurerie.html"><span class="sb-icon">🔫</span>Armurerie</a>`;
    if (p.canLogs) html += `<a class="sb-item ${'logs'===activePage?'active':''}" href="logs.html"><span class="sb-icon">📜</span>Historique</a>`;
    if (p.canAdmin) html += `<a class="sb-item ${'admin'===activePage?'active':''}" href="admin.html"><span class="sb-icon">⚙️</span>Administration</a>`;
  }

  html += `<div class="sb-divider"></div><div class="sb-section">RÉSEAU</div>`;
  html += `<a class="sb-item ${'interpolice'===activePage?'active':''}" href="interpolice.html"><span class="sb-icon">🌐</span>Interpolice</a>`;
  html += `<div class="sb-divider"></div>`;
  html += `<a class="sb-item" href="#" onclick="event.preventDefault();window.logout()"><span class="sb-icon">🚪</span>Déconnexion</a>`;

  el.innerHTML = html;
}

// ============================================================
// UTILITAIRES
// ============================================================
export function startClock(elementId) {
  const update = () => {
    const el = document.getElementById(elementId);
    if (el) el.textContent = new Date().toLocaleTimeString('fr-FR');
  };
  update();
  setInterval(update, 1000);
}

export function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  t.textContent = (icons[type]||'') + ' ' + msg;
  t.className = 'toast ' + type + ' show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

export function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

export function setupModalClose() {
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

export function generateRef(prefix = 'REF') {
  const now = new Date();
  return `${prefix}-${now.getFullYear().toString().slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*9000+1000)}`;
}

export function statusBadge(s) {
  const map = {
    'En vie':'b-alive', 'Mort':'b-dead', 'LSPD':'b-lspd',
    'Actif':'b-active', 'Inactif':'b-inactive', 'Congé':'b-repair',
    'Disponible':'b-active', 'Maintenance':'b-repair', 'Hors service':'b-dead',
    'Ouvert':'b-open', 'Fermé':'b-closed',
    'Payée':'b-paid', 'Impayée':'b-unpaid',
    'En garde à vue':'b-wanted', 'Libéré':'b-alive', 'Transféré':'b-repair',
  };
  return `<span class="badge ${map[s]||'b-inactive'}">${s||'—'}</span>`;
}

export async function addLog(db, action, details) {
  try {
    const name = document.getElementById('tbName')?.textContent || 'Inconnu';
    const { addDoc, collection } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await addDoc(collection(db, 'logs'), {
      user: name,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch(e) { console.warn('Log failed:', e); }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try { return new Date(dateStr).toLocaleDateString('fr-FR'); } catch(e) { return dateStr; }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch(e) { return dateStr; }
}

// Legacy compat
export function initTopbar() { return { grade:'', name:'' }; }
export function getSessionInfo() { return { grade:'', name:'', uid:'' }; }
export function checkAuth(auth, onAuthStateChanged) {
  return new Promise(resolve => onAuthStateChanged(auth, user => {
    if (!user) window.location.href = 'index.html';
    else resolve({ user });
  }));
}
export async function refreshGradeFromFirebase() {}

// ============================================================
// CAPTURE SCREENSHOT → Discord
// ============================================================
export async function captureModal(modalBodyId) {
  const el = document.getElementById(modalBodyId);
  if (!el) { showToast('Élément introuvable', 'error'); return; }

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
      backgroundColor: '#0d1526',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    canvas.toBlob(async blob => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('Capture copiée — Collez sur Discord (Ctrl+V)', 'success');
      } catch(e) {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `lspd-capture-${Date.now()}.png`;
        a.click();
        showToast('Image téléchargée', 'success');
      }
    }, 'image/png');
  } catch(e) {
    showToast('Erreur capture: ' + e.message, 'error');
  }
}
