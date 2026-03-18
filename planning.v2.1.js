/* ==========================================================
POMP BASIC 2.1 — planning.yourpomp
JS DROP-IN
========================================================== */

(function () {

/* ----------------------------------------------------------
CONFIG
---------------------------------------------------------- */

const WEBHOOK_URL = "https://hook.us2.make.com/yje83hyt1q03zek4mwlz1fe9l3ghl4ri";
const form = document.getElementById("pomp-basic-form");
if (!form) return;

/* ----------------------------------------------------------
HELPERS
---------------------------------------------------------- */

const $ = (id) => document.getElementById(id);

function show(id) { const el = $(id); if (el) el.style.display = "block"; }
function hide(id) { const el = $(id); if (el) el.style.display = "none"; }
function val(id) { return $(id)?.value?.trim() || ""; }

function checked(name) {
return document.querySelector(`input[name="${name}"]:checked`);
}

function checkedAll(name) {
return [...document.querySelectorAll(`input[name="${name}"]:checked`)];
}

function generateClientId() {
return `pomp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function isoNow() {
return new Date().toISOString();
}

/* ----------------------------------------------------------
UI BEHAVIOR
---------------------------------------------------------- */

function toggleOther(chkId, txtId) {
const chk = $(chkId);
const txt = $(txtId);
if (!chk || !txt) return;
txt.style.display = chk.checked ? "block" : "none";
}

function bindSingleSelectGroups() {
document.querySelectorAll(".checklist-group[data-single-select]").forEach(group => {
const boxes = group.querySelectorAll('input[type="checkbox"]');
boxes.forEach(cb => {
cb.addEventListener("change", () => {
if (cb.checked) boxes.forEach(o => { if (o !== cb) o.checked = false; });
runLogic();
});
});
});
}

function runLogic() {

/* DISPOSITION */
const dispositionSelected = document.querySelector('input[name="disposition"]:checked');

if (dispositionSelected) {
show("block-services");
} else {
hide("block-services");
hide("block-viewing");
hide("block-memorial");
hide("block-celebration");
}

/* SERVICES */
const selectedServices = checkedAll("services_selected").map(cb => cb.value);

selectedServices.includes("viewing") ? show("block-viewing") : hide("block-viewing");
selectedServices.includes("memorial") ? show("block-memorial") : hide("block-memorial");
selectedServices.includes("celebration") ? show("block-celebration") : hide("block-celebration");

/* OTHER FIELD TOGGLES */
toggleOther("disposition_other_chk", "disposition_other_text");
toggleOther("viewing_location_other_chk", "viewing_location_other_text");
toggleOther("memorial_location_other_chk", "memorial_location_other_text");
toggleOther("celebration_location_other_chk", "celebration_location_other_text");
}

/* ----------------------------------------------------------
EMPTY SNAPSHOT (LOCKED SCHEMA)
---------------------------------------------------------- */

function emptySnapshot() {
return {
client_id: "",
submission_source: "planning",
schema_version: 3,
created_at: "",
last_updated_at: "",

person: {
full_name: "", first_name: "", middle_name: "", last_name: "",
phone: "", email: "", address: "", city: "", state: "", zip: ""
},

services: {
disposition: "",
disposition_other: "",
services_selected: [],

viewing: {
location_place: "", location_call: "", location_other: "",
jewelry_notes: "", clothing_notes: "", spiritual_traditions_notes: ""
},
memorial: {
location_place: "", location_call: "", location_other: "",
spiritual_traditions_notes: ""
},
celebration: {
location_place: "",
location_call: "",
location_other: "",
spiritual_traditions_notes: "",

production_details: {
flowers: "",
slideshow: "",
mc: "",
prayer_leader: "",
music_live: "",
catering_notes: "",
decor_theme: ""
}
},

service_mood: "",
special_requests: ""
},

contacts: [{
name: "", relationship: "", phone: "", email: "", address: "", notes: ""
}],

insurance: [{
insured_name: "",
carrier: "",
policy_number: "",
policy_type: "",
face_amount: "",
beneficiaries: "",
riders: "",
owner_relationship: "",
payor_relationship: ""
}],

music: [{ title: "", artist: "", notes: "" }],

legal: {
legal_name: "", sex: "", social_security_number: "", dob: "",
place_of_birth: "", county: "",
veteran_status: "", veteran_notes: "",
flag_presented_to: "", dd214_location: "",

hispanic_origin: "",
father_legal_name: "",
mother_maiden_name: ""
},
cemetery: {
cemetery_name: "", cemetery_location: "", cemetery_section: "",
cemetery_lot: "", cemetery_grave_number: "", interment_type: "",
timing_of_services_and_disposition: "",
remains_container: "",
remains_out_of_state: "",
remains_notes: "",

ashes_instructions: "",
urn_preference: "",
scattering_location: ""
},

funding: {
funding_help_requested: "", funding_approach: "", would_like_help_reviewing: ""
},

obituary: {
obituary_name: "", publications: [], draft_text: "", tone: "",
family_list: "", include_service_details: false, photo_url: ""
}
};
}

/* ----------------------------------------------------------
BUILD SNAPSHOT
---------------------------------------------------------- */

function buildSnapshot() {
const snap = emptySnapshot();

snap.client_id = generateClientId();
snap.created_at = isoNow();

/* PERSON */
const fullName = val("full_name");
const parts = fullName.split(/\s+/).filter(Boolean);
snap.person.full_name = fullName;
snap.person.first_name = parts[0] || "";
snap.person.last_name = parts.slice(1).join(" ");
snap.person.phone = val("phone");
snap.person.email = val("email");

/* DISPOSITION */
const disp = checked("disposition");
if (disp) {
snap.services.disposition = disp.value;
snap.services.disposition_other = disp.value === "other" ? val("disposition_other_text") : "";
}

/* SERVICES SELECTED */
snap.services.services_selected = checkedAll("services_selected").map(cb => cb.value);

/* VIEWING LOCATION */
const viewing = checked("viewing_location");
if (viewing) {
snap.services.viewing.location_place = viewing.value;
snap.services.viewing.location_other = viewing.value === "other" ? val("viewing_location_other_text") : "";
}

/* MEMORIAL LOCATION */
const memorial = checked("memorial_location");
if (memorial) {
snap.services.memorial.location_place = memorial.value;
snap.services.memorial.location_other = memorial.value === "other" ? val("memorial_location_other_text") : "";
}

/* CELEBRATION LOCATION */
const celebration = checked("celebration_location");
if (celebration) {
snap.services.celebration.location_place = celebration.value;
snap.services.celebration.location_other = celebration.value === "other" ? val("celebration_location_other_text") : "";
}

/* FUNDING */
const funding = checked("funding_help_requested");
if (funding) snap.funding.funding_help_requested = funding.value;

return snap;
}

/* ----------------------------------------------------------
SUBMIT
---------------------------------------------------------- */

form.addEventListener("submit", async (e) => {
e.preventDefault();

const snapshot = buildSnapshot();

await fetch(WEBHOOK_URL, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ snapshot })
});

form.style.display = "none";
$("basic-confirmation")?.style.setProperty("display", "block");
});

/* ----------------------------------------------------------
INIT
---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
bindSingleSelectGroups();
document.querySelectorAll("input[type='checkbox']")
.forEach(el => el.addEventListener("change", runLogic));
runLogic();
});

})();
