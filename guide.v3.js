(function () {
const WEBHOOK_URL = "https://hook.us2.make.com/eh74qn7yg2mey49vvu209tjeyhgtiwns";

/* ----------------------------------------------------------
UTILITIES
---------------------------------------------------------- */

function el(id) {
return document.getElementById(id);
}

function show(id) {
const node = el(id);
if (node) node.style.display = "";
}

function hide(id) {
const node = el(id);
if (node) node.style.display = "none";
}

function setText(id, value) {
const node = el(id);
if (node) node.textContent = (value ?? "").toString().trim();
}

function nonEmpty(v) {
return (v ?? "").toString().trim() !== "";
}

function anyNonEmpty(obj) {
return Object.values(obj || {}).some(v => nonEmpty(v));
}

function escapeHtml(str) {
return (str ?? "").toString()
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}

function formatAddress(p) {
const parts = [];
if (nonEmpty(p?.address)) parts.push(p.address);
const cityLine = [p?.city, p?.state, p?.zip].filter(nonEmpty).join(" ");
if (nonEmpty(cityLine)) parts.push(cityLine);
return parts.join(", ");
}

/* ----------------------------------------------------------
SHARED RENDERERS
---------------------------------------------------------- */

function makeKeyValueGrid(containerId, pairs) {
const node = el(containerId);
if (!node) return;
node.innerHTML = "";
pairs.forEach(({ label, value }) => {
if (!nonEmpty(value)) return;
const cell = document.createElement("div");
cell.innerHTML = `<div class="pomp-label"></div><div class="pomp-value"></div>`;
cell.querySelector(".pomp-label").textContent = label;
cell.querySelector(".pomp-value").textContent = value;
node.appendChild(cell);
});
}

function makeSimpleList(containerId, items) {
const node = el(containerId);
if (!node) return;
node.innerHTML = "";
items.forEach(text => {
if (!nonEmpty(text)) return;
const div = document.createElement("div");
div.className = "pomp-item";
div.textContent = text;
node.appendChild(div);
});
}

function renderServiceBlock(targetListId, service) {
  const lines = [];

  if (nonEmpty(service?.location_place)) {
    const loc = service.location_place === "other" && nonEmpty(service?.location_other)
      ? service.location_other
      : service.location_place;
    if (nonEmpty(loc)) lines.push(`Location: ${loc}`);
  }

  if (nonEmpty(service?.location_call))
    lines.push(`Call / contact: ${service.location_call}`);

  if (nonEmpty(service?.spiritual_traditions_notes))
    lines.push(`Spiritual traditions: ${service.spiritual_traditions_notes}`);

  if (nonEmpty(service?.jewelry_notes))
    lines.push(`Jewelry: ${service.jewelry_notes}`);

  if (nonEmpty(service?.clothing_notes))
    lines.push(`Clothing: ${service.clothing_notes}`);

  // ✨ Schema 3 — Production Details (only if present)
  const pd = service?.production_details;

  if (pd && anyNonEmpty(pd)) {
    if (nonEmpty(pd.flowers)) lines.push(`Flowers: ${pd.flowers}`);
    if (nonEmpty(pd.slideshow)) lines.push(`Photo slideshow: ${pd.slideshow}`);
    if (nonEmpty(pd.mc)) lines.push(`Master of ceremonies: ${pd.mc}`);
    if (nonEmpty(pd.prayer_leader)) lines.push(`Prayer leader: ${pd.prayer_leader}`);
    if (nonEmpty(pd.music_live)) lines.push(`Live music: ${pd.music_live}`);
    if (nonEmpty(pd.catering_notes)) lines.push(`Catering: ${pd.catering_notes}`);
    if (nonEmpty(pd.decor_theme)) lines.push(`Decor theme: ${pd.decor_theme}`);
  }

  if (lines.length) makeSimpleList(targetListId, lines);
}

/* ----------------------------------------------------------
SECTION RENDERERS
---------------------------------------------------------- */

function renderContacts(contacts) {
// Filter to valid rows first
const valid = (Array.isArray(contacts) ? contacts : []).filter(c => anyNonEmpty(c));
if (!valid.length) { hide("secContacts"); return; }
show("secContacts");

const node = el("contacts_table");
node.innerHTML = `
<table>
<thead>
<tr>
<th>Name</th>
<th>Relationship</th>
<th>Phone</th>
<th>Email</th>
<th>Address</th>
<th>Notes</th>
</tr>
</thead>
<tbody></tbody>
</table>`;

const tbody = node.querySelector("tbody");
valid.forEach(c => {
const tr = document.createElement("tr");
tr.innerHTML = `
<td>${escapeHtml(c.name || "")}</td>
<td>${escapeHtml(c.relationship || "")}</td>
<td>${escapeHtml(c.phone || "")}</td>
<td>${escapeHtml(c.email || "")}</td>
<td>${escapeHtml(c.address || "")}</td>
<td>${escapeHtml(c.notes || "")}</td>`;
tbody.appendChild(tr);
});
}

function renderInsurance(insurance) {
// Filter to valid rows first
const valid = (Array.isArray(insurance) ? insurance : []).filter(p => anyNonEmpty(p));
if (!valid.length) { hide("secInsurance"); return; }
show("secInsurance");

const node = el("insurance_table");
node.innerHTML = `
<table>
<thead>
<tr>
<th>Insured</th>
<th>Carrier</th>
<th>Policy #</th>
<th>Type</th>
<th>Face Amount</th>
<th>Beneficiaries</th>
<th>Riders / Notes</th>
</tr>
</thead>
<tbody></tbody>
</table>`;

const tbody = node.querySelector("tbody");
valid.forEach(p => {
const tr = document.createElement("tr");
tr.innerHTML = `
<td>${escapeHtml(p.insured_name || "")}</td>
<td>${escapeHtml(p.carrier || "")}</td>
<td>${escapeHtml(p.policy_number || "")}</td>
<td>${escapeHtml(p.policy_type || "")}</td>
<td>${escapeHtml(p.face_amount || "")}</td>
<td>${escapeHtml(p.beneficiaries || "")}</td>
<td>${escapeHtml(p.riders || "")}</td>`;
tbody.appendChild(tr);
});
}

function renderMusic(music) {
// Filter to valid rows first
const valid = (Array.isArray(music) ? music : []).filter(s => anyNonEmpty(s));
if (!valid.length) { hide("secMusic"); return; }
show("secMusic");

const node = el("music_list");
node.innerHTML = "";
valid.forEach(s => {
const div = document.createElement("div");
div.className = "pomp-item";
const title = (s.title || "").trim();
const artist = (s.artist || "").trim();
const notes = (s.notes || "").trim();
const topLine = [title, artist ? `— ${artist}` : ""].join(" ").trim();
div.innerHTML = `
<div class="pomp-item__title">${escapeHtml(topLine || "Song")}</div>
${notes ? `<div class="pomp-item__notes">${escapeHtml(notes)}</div>` : ""}`;
node.appendChild(div);
});
}

function renderLegal(legal) {
const pairs = [
{ label: "Legal name", value: legal?.legal_name },
{ label: "Sex", value: legal?.sex },
{ label: "Social Security #", value: legal?.social_security_number },
{ label: "Date of birth", value: legal?.dob },
{ label: "Place of birth", value: legal?.place_of_birth },
{ label: "County", value: legal?.county },
{ label: "Armed forces (Yes/No)", value: legal?.armed_forces },
{ label: "Education level", value: legal?.level_of_education },
{ label: "Hispanic origin", value: legal?.hispanic_origin },
{ label: "Race", value: legal?.race },
{ label: "Father's legal name", value: legal?.father_legal_name },
{ label: "Mother's maiden name", value: legal?.mother_maiden_name },
];
if (!pairs.some(p => nonEmpty(p.value))) { hide("secLegal"); return; }
show("secLegal");
makeKeyValueGrid("legal_grid", pairs);
}

function renderVeteran(legal) {
const pairs = [
{ label: "Veteran status", value: legal?.veteran_status },
{ label: "Veteran notes", value: legal?.veteran_notes },
{ label: "Flag presented to", value: legal?.flag_presented_to },
{ label: "DD-214 location", value: legal?.dd214_location },
];
if (!pairs.some(p => nonEmpty(p.value))) { hide("secVeteran"); return; }
show("secVeteran");
makeKeyValueGrid("veteran_grid", pairs);
}

function renderCemetery(cem) {
const pairs = [
{ label: "Cemetery name", value: cem?.cemetery_name },
{ label: "Location", value: cem?.cemetery_location },
{ label: "Section", value: cem?.cemetery_section },
{ label: "Lot", value: cem?.cemetery_lot },
{ label: "Grave number", value: cem?.cemetery_grave_number },
{ label: "Interment type", value: cem?.interment_type },
{ label: "Timing of services & disposition", value: cem?.timing_of_services_and_disposition },
{ label: "Remains container", value: cem?.remains_container },
{ label: "Out-of-state remains", value: cem?.remains_out_of_state },
{ label: "Final resting instructions", value: cem?.ashes_instructions },
{ label: "Urn preference", value: cem?.urn_preference },
{ label: "Scattering location", value: cem?.scattering_location },
{ label: "Notes", value: cem?.remains_notes },
];
if (!pairs.some(p => nonEmpty(p.value))) { hide("secCemetery"); return; }
show("secCemetery");
makeKeyValueGrid("cemetery_grid", pairs);
}

function renderFunding(funding) {
const pairs = [
{ label: "Funding approach", value: funding?.funding_approach },
{ label: "Would like help reviewing", value: funding?.would_like_help_reviewing },
{ label: "Funding help requested", value: funding?.funding_help_requested },
];
if (!pairs.some(p => nonEmpty(p.value))) { hide("secFunding"); return; }
show("secFunding");
makeKeyValueGrid("funding_grid", pairs);
}

/* ----------------------------------------------------------
MAIN RENDER
---------------------------------------------------------- */

function render(snapshot) {
// Cover
const name = snapshot?.person?.full_name || snapshot?.legal?.legal_name || "Planning Guide";
setText("coverName", name);

const created = snapshot?.created_at ? new Date(snapshot.created_at).toLocaleDateString() : "";
const updated = snapshot?.last_updated_at ? new Date(snapshot.last_updated_at).toLocaleDateString() : "";
const meta = [
updated ? `Last updated: ${updated}` : "",
created ? `Created: ${created}` : ""
].filter(Boolean).join(" • ");
setText("coverMeta", meta);

// Personal
setText("p_full_name", snapshot?.person?.full_name || "");
setText("p_email", snapshot?.person?.email || "");
setText("p_phone", snapshot?.person?.phone || "");
setText("p_address", formatAddress(snapshot?.person || {}));

// Service Vision
const mood = snapshot?.services?.service_mood || "";
const requests = snapshot?.services?.special_requests || "";

if (nonEmpty(mood)) { show("svcMoodBlock"); setText("svc_mood", mood); }
else { hide("svcMoodBlock"); }
if (nonEmpty(requests)) { show("svcRequestsBlock"); setText("svc_requests", requests); }
else { hide("svcRequestsBlock"); }

const viewing = snapshot?.services?.viewing;
const memorial = snapshot?.services?.memorial;
const celebration = snapshot?.services?.celebration;

if (anyNonEmpty(viewing)) { show("blockViewing"); renderServiceBlock("viewing_list", viewing); }
else { hide("blockViewing"); }
if (anyNonEmpty(memorial)) { show("blockMemorial"); renderServiceBlock("memorial_list", memorial); }
else { hide("blockMemorial"); }
if (anyNonEmpty(celebration) || anyNonEmpty(celebration?.production_details)) { show("blockCelebration"); renderServiceBlock("celebration_list", celebration); }
else { hide("blockCelebration"); }

renderContacts(snapshot?.contacts);
renderInsurance(snapshot?.insurance);
renderMusic(snapshot?.music);
renderLegal(snapshot?.legal);
renderVeteran(snapshot?.legal);
renderCemetery(snapshot?.cemetery);
renderFunding(snapshot?.funding);
}

/* ----------------------------------------------------------
LOAD
---------------------------------------------------------- */

function showError(msg) {
const node = el("guideError");
if (!node) return;
node.style.display = "";
node.textContent = msg;
}

function setStatus(msg) {
const node = el("guideStatus");
if (node) node.textContent = msg || "";
}

function getClientId() {
return new URLSearchParams(window.location.search).get("client_id");
}

async function loadSnapshot(clientId) {
const res = await fetch(WEBHOOK_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ mode: "load", client_id: clientId })
});
if (!res.ok) throw new Error("Load failed");
const raw = await res.json();
return (Array.isArray(raw) && raw[0]?.body) ? JSON.parse(raw[0].body) : raw;
}

document.addEventListener("DOMContentLoaded", async () => {
const clientId = getClientId();
if (!clientId) {
showError("Missing client ID in URL. Add ?client_id=...");
return;
}

const btn = el("btnPrint");
if (btn) btn.addEventListener("click", () => window.print());

try {
setStatus("Loading…");
const snapshot = await loadSnapshot(clientId);
if (!snapshot?.client_id) throw new Error("Client not found");
render(snapshot);
setStatus("");
} catch (e) {
showError("Could not load this guide. Check client_id and webhook response.");
setStatus("");
}
});

})();
