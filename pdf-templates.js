// ============================================================
// pdf-templates.js — Modèles PDF LSPD/BCSO
// ============================================================

function pdfHeader(dept, ref, logo) {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const sousTitre = dept === 'BCSO' ? 'BLAINE COUNTY SHERIFF OFFICE' : 'LOS SANTOS POLICE DEPARTMENT';
  return `
    <div style="background:${couleur};color:#fff;padding:18px 28px;display:flex;justify-content:space-between;align-items:center">
      <div style="display:flex;align-items:center;gap:14px">
        <img src="${logo}" style="width:52px;height:52px;object-fit:contain;border-radius:50%;border:2px solid rgba(255,255,255,.4)" onerror="this.style.display='none'">
        <div>
          <div style="font-size:17px;font-weight:700;letter-spacing:4px">${dept === 'BCSO' ? 'B.C.S.O' : 'L.S.P.D'}</div>
          <div style="font-size:9px;opacity:.7;letter-spacing:2px;margin-top:2px">${sousTitre}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="background:rgba(255,255,255,.15);padding:6px 14px;border-radius:4px;font-family:monospace;font-size:13px;font-weight:700">${ref}</div>
        <div style="font-size:9px;opacity:.7;margin-top:5px">Généré le ${new Date().toLocaleString('fr-FR')}</div>
      </div>
    </div>`;
}

function pdfFooter(dept, ref) {
  return `
    <div style="background:#f5f5f5;border-top:1px solid #ddd;padding:10px 28px;display:flex;justify-content:space-between">
      <div style="font-size:9px;color:#666">Réf: ${ref} — ${dept} Intranet — Document officiel confidentiel</div>
      <div style="font-size:9px;color:#666">${dept === 'BCSO' ? 'Blaine County Sheriff Office' : 'Los Santos Police Department'} © ${new Date().getFullYear()}</div>
    </div>`;
}

function pdfSection(titre, couleur = '#003087') {
  return `<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:${couleur};border-bottom:2px solid ${couleur};padding-bottom:4px;margin:20px 0 12px">${titre}</div>`;
}

function pdfField(label, value, fullWidth = false) {
  return `
    <div style="${fullWidth ? 'grid-column:1/-1;' : ''}border-bottom:1px solid #e0e0e0;padding-bottom:6px;margin-bottom:6px">
      <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:2px">${label}</div>
      <div style="font-size:13px;font-weight:700">${value || '—'}</div>
    </div>`;
}

function pdfSignatures(sig1 = 'Officier rédacteur', sig2 = 'Superviseur') {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:30px">
      <div style="border-top:1px solid #000;padding-top:5px;font-size:10px;color:#666;text-align:center">
        <div style="height:45px"></div>${sig1}
      </div>
      <div style="border-top:1px solid #000;padding-top:5px;font-size:10px;color:#666;text-align:center">
        <div style="height:45px"></div>${sig2}
      </div>
    </div>`;
}

// ============================================================
// CASIER JUDICIAIRE
// ============================================================
export function printCasier(c, dept = 'LSPD', logo = '', source = '') {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const ref = c.reference || `CAS-${Date.now()}`;
  const infractions = (c.infractions || []);
  const permis = [c.ppa&&'🔫 Port d\'arme (PPA)', c.voiture&&'🚗 Permis voiture', c.camion&&'🚛 Permis camion', c.moto&&'🏍 Permis moto'].filter(Boolean);

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Casier — ${c.nom} ${c.prenom||''}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f0f0f0}
    .doc{background:#fff;max-width:750px;margin:0 auto;box-shadow:0 2px 20px rgba(0,0,0,.15)}
    .infraction{background:#f8f9fa;border-left:4px solid ${couleur};padding:10px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
    .badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700;letter-spacing:1px}
    @media print{body{background:#fff;padding:0}.doc{box-shadow:none}}
  </style></head><body><div class="doc">
  ${pdfHeader(dept, ref, logo)}
  ${c.wanted ? `<div style="background:#c0392b;color:#fff;text-align:center;padding:8px;font-size:11px;font-weight:700;letter-spacing:3px">⚠ SUJET ACTIVEMENT RECHERCHÉ — DANGEREUX</div>` : ''}
  ${source === 'INTERPOLICE' ? `<div style="background:#c9a84d;color:#000;text-align:center;padding:6px;font-size:10px;font-weight:700;letter-spacing:3px">🌐 DOCUMENT TRANSMIS VIA RÉSEAU INTERPOLICE SAN ANDREAS</div>` : ''}
  <div style="padding:24px 28px">
    ${pdfSection('Identité du suspect', couleur)}
    <div style="display:flex;gap:20px;margin-bottom:16px">
      <div style="width:90px;height:110px;border:2px solid ${couleur};border-radius:4px;background:#f0f4f8;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">
        ${c.photoUrl ? `<img src="${c.photoUrl}" style="width:100%;height:100%;object-fit:cover" onerror="this.outerHTML='<div style=font-size:36px;color:#ccc>👤</div>'">` : '<div style="font-size:36px;color:#ccc">👤</div>'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1">
        ${pdfField('Nom', `<strong>${c.nom||'—'}</strong>`)}
        ${pdfField('Prénom', c.prenom)}
        ${pdfField('Date de naissance', c.dateNaissance)}
        ${pdfField('Statut', `${c.statut||'—'} ${c.wanted ? '<span class="badge" style="background:#fde8e8;color:#c0392b;border:1px solid #c0392b">⚠ WANTED</span>' : ''}`)}
        ${pdfField('N° Empreinte', `<span style="font-family:monospace">${c.empreinte||'—'}</span>`)}
        ${pdfField('Nationalité', c.nationalite)}
      </div>
    </div>
    ${permis.length ? `${pdfSection('Permis & Autorisations', couleur)}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">${permis.map(p => `<div style="background:#e8f0fe;border:1px solid ${couleur};border-radius:4px;padding:5px 12px;font-size:11px;font-weight:700;color:${couleur}">${p}</div>`).join('')}</div>` : ''}
    ${pdfSection(`Infractions enregistrées (${infractions.length})`, couleur)}
    ${infractions.length ? infractions.map(i => `
      <div class="infraction">
        <div>
          <div style="font-size:13px;font-weight:700">${i.nom||i}</div>
          ${i.categorie ? `<div style="font-size:10px;color:#666;margin-top:2px">${i.categorie}</div>` : ''}
        </div>
      </div>`).join('') : '<div style="color:#666;font-size:13px;padding:10px">Aucune infraction enregistrée</div>'}
    ${c.plaques?.length ? `${pdfSection('Plaques d\'immatriculation', couleur)}<div style="font-family:monospace;font-size:13px;padding:10px;background:#f8f9fa;border-radius:4px">${c.plaques.join(' &nbsp;·&nbsp; ')}</div>` : ''}
    ${c.notes ? `${pdfSection('Notes & Observations', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;line-height:1.6">${c.notes}</div>` : ''}
    ${pdfSignatures('Officier rédacteur', 'Superviseur')}
  </div>
  ${pdfFooter(dept, ref)}
  </div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ============================================================
// ARRESTATION / MGV
// ============================================================
export function printArrestation(a, dept = 'LSPD', logo = '', source = '') {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const ref = a.reference || `ARR-${Date.now()}`;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Arrestation — ${a.nom||''}</title>
  <style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f0f0f0}.doc{background:#fff;max-width:750px;margin:0 auto;box-shadow:0 2px 20px rgba(0,0,0,.15)}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:13px}.lbl{color:#666;font-size:11px}@media print{body{background:#fff;padding:0}.doc{box-shadow:none}}</style>
  </head><body><div class="doc">
  ${pdfHeader(dept, ref, logo)}
  <div style="background:${couleur};color:#fff;text-align:center;padding:8px;font-size:12px;font-weight:700;letter-spacing:4px">MISE EN GARDE À VUE</div>
  ${source === 'INTERPOLICE' ? `<div style="background:#c9a84d;color:#000;text-align:center;padding:6px;font-size:10px;font-weight:700;letter-spacing:3px">🌐 DOCUMENT TRANSMIS VIA RÉSEAU INTERPOLICE</div>` : ''}
  <div style="padding:24px 28px">
    <div style="background:#fff8e1;border:1px solid #f57f17;border-radius:4px;padding:12px 16px;margin-bottom:20px;font-size:12px;line-height:1.5">
      ⚠ Ce document atteste que la personne ci-dessous est placée en garde à vue conformément à la procédure ${dept}.
    </div>
    ${pdfSection('Identité du détenu', couleur)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${pdfField('Nom complet', `<strong>${a.nom||'—'}</strong>`)}
      ${pdfField('Date de naissance', a.dob)}
      ${pdfField('Référence', `<span style="font-family:monospace">${ref}</span>`)}
      ${pdfField('Statut', a.statut||'—')}
    </div>
    ${pdfSection('Détails de l\'arrestation', couleur)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${pdfField('Officier', a.officier)}
      ${pdfField('Date & heure', a.date ? new Date(a.date).toLocaleString('fr-FR') : '—')}
      ${pdfField('Lieu', a.lieu, true)}
      ${pdfField('Durée de GAV', a.duree)}
    </div>
    ${pdfSection('Motif de l\'arrestation', couleur)}
    <div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;line-height:1.6;margin-bottom:16px">${a.motif||'—'}</div>
    ${a.objets ? `${pdfSection('Objets saisis', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;margin-bottom:16px">${a.objets}</div>` : ''}
    ${a.description ? `${pdfSection('Description / Rapport', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;line-height:1.6;margin-bottom:16px">${a.description}</div>` : ''}
    ${pdfSignatures(`Officier — ${a.officier||''}`, 'Superviseur')}
  </div>
  ${pdfFooter(dept, ref)}
  </div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ============================================================
// AMENDE / PV
// ============================================================
export function printAmende(a, dept = 'LSPD', logo = '') {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const ref = a.reference || `PV-${Date.now()}`;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PV — ${a.nom||''}</title>
  <style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f0f0f0}.doc{background:#fff;max-width:750px;margin:0 auto;box-shadow:0 2px 20px rgba(0,0,0,.15)}@media print{body{background:#fff;padding:0}.doc{box-shadow:none}}</style>
  </head><body><div class="doc">
  ${pdfHeader(dept, ref, logo)}
  <div style="background:${couleur};color:#fff;text-align:center;padding:8px;font-size:12px;font-weight:700;letter-spacing:4px">PROCÈS-VERBAL D'INFRACTION</div>
  <div style="padding:24px 28px">
    ${pdfSection('Contrevenant', couleur)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${pdfField('Nom complet', `<strong>${a.nom||'—'}</strong>`)}
      ${pdfField('Plaque / Véhicule', a.plaque)}
      ${pdfField('Officier verbalisateur', a.officier)}
      ${pdfField('Date', a.date)}
    </div>
    ${pdfSection('Infraction', couleur)}
    <div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;line-height:1.6;margin-bottom:16px">${a.motif||'—'}</div>
    ${pdfSection('Montant de l\'amende', couleur)}
    <div style="background:#f8f9fa;border:2px solid ${couleur};border-radius:8px;padding:20px;text-align:center;margin-bottom:20px">
      <div style="font-size:11px;color:#666;letter-spacing:2px;margin-bottom:8px">MONTANT DÛ</div>
      <div style="font-size:36px;font-weight:700;color:${couleur}">$${a.montant||'0'}</div>
      <div style="font-size:11px;color:#666;margin-top:8px">Statut : <strong>${a.statut||'—'}</strong></div>
    </div>
    ${a.notes ? `${pdfSection('Notes', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;margin-bottom:16px">${a.notes}</div>` : ''}
    ${pdfSignatures(`Officier — ${a.officier||''}`, 'Superviseur')}
  </div>
  ${pdfFooter(dept, ref)}
  </div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ============================================================
// RAPPORT D'INTERVENTION
// ============================================================
export function printRapport(r, dept = 'LSPD', logo = '') {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const ref = r.reference || `RAP-${Date.now()}`;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Rapport — ${r.titre||''}</title>
  <style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f0f0f0}.doc{background:#fff;max-width:750px;margin:0 auto;box-shadow:0 2px 20px rgba(0,0,0,.15)}@media print{body{background:#fff;padding:0}.doc{box-shadow:none}}</style>
  </head><body><div class="doc">
  ${pdfHeader(dept, ref, logo)}
  <div style="background:${couleur};color:#fff;text-align:center;padding:8px;font-size:12px;font-weight:700;letter-spacing:4px">RAPPORT D'INTERVENTION</div>
  <div style="padding:24px 28px">
    ${pdfSection('Informations générales', couleur)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${pdfField('Titre', `<strong>${r.titre||'—'}</strong>`, true)}
      ${pdfField('Type', r.type)}
      ${pdfField('Officier', r.officier)}
      ${pdfField('Date', r.date)}
      ${pdfField('Heure', r.heure)}
      ${pdfField('Statut', r.statut)}
    </div>
    ${r.suspects ? `${pdfSection('Suspects impliqués', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;margin-bottom:16px">${r.suspects}</div>` : ''}
    ${pdfSection('Rapport d\'intervention', couleur)}
    <div style="border:1px solid #e0e0e0;border-radius:4px;padding:14px;font-size:13px;line-height:1.8;margin-bottom:16px;min-height:120px">${r.contenu||r.description||'—'}</div>
    ${pdfSignatures(`Officier — ${r.officier||''}`, 'Superviseur')}
  </div>
  ${pdfFooter(dept, ref)}
  </div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ============================================================
// SAISIE JUDICIAIRE
// ============================================================
export function printSaisie(s, dept = 'LSPD', logo = '') {
  const couleur = dept === 'BCSO' ? '#5c3a1e' : '#003087';
  const ref = s.reference || `SAI-${Date.now()}`;
  const typeIcons = {'Drogue':'💊','Arme':'🔫','Véhicule':'🚗','Argent':'💰','Document':'📄','Électronique':'📱','Autre':'📦'};
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Saisie — ${s.reference||''}</title>
  <style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f0f0f0}.doc{background:#fff;max-width:750px;margin:0 auto;box-shadow:0 2px 20px rgba(0,0,0,.15)}@media print{body{background:#fff;padding:0}.doc{box-shadow:none}}</style>
  </head><body><div class="doc">
  ${pdfHeader(dept, ref, logo)}
  <div style="background:${couleur};color:#fff;text-align:center;padding:8px;font-size:12px;font-weight:700;letter-spacing:4px">FICHE DE SAISIE JUDICIAIRE</div>
  <div style="padding:24px 28px">
    <div style="display:flex;align-items:center;gap:20px;background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin-bottom:20px">
      <div style="font-size:52px">${typeIcons[s.type]||'📦'}</div>
      <div>
        <div style="font-size:20px;font-weight:700;margin-bottom:4px">${s.type||'—'}</div>
        <div style="font-size:13px;color:#666">Statut : <strong>${s.statut||'—'}</strong></div>
        ${s.quantite ? `<div style="font-size:14px;font-weight:700;color:${couleur};margin-top:4px">Quantité : ${s.quantite}</div>` : ''}
      </div>
    </div>
    ${pdfSection('Informations', couleur)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${pdfField('Suspect', `<strong>${s.nom||'—'}</strong>`)}
      ${pdfField('N° Dossier', `<span style="font-family:monospace">${ref}</span>`)}
      ${pdfField('Officier', s.officier)}
      ${pdfField('Date', s.date)}
      ${pdfField('Lieu', s.lieu, true)}
      ${s.refArrestation ? pdfField('Réf. Arrestation', `<span style="font-family:monospace">${s.refArrestation}</span>`, true) : ''}
    </div>
    ${s.description ? `${pdfSection('Description', couleur)}<div style="border:1px solid #e0e0e0;border-radius:4px;padding:12px;font-size:13px;line-height:1.6;margin-bottom:16px">${s.description}</div>` : ''}
    ${pdfSignatures(`Officier — ${s.officier||''}`, 'Superviseur')}
  </div>
  ${pdfFooter(dept, ref)}
  </div></body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 600);
}
