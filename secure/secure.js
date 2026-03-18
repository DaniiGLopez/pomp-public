/* =========================================================
SECURE 2.0 — CLEAN ARCHITECTURE (CLEANED)
Schema 3 Stable
========================================================= */

(function () {

console.log("SECURE JS LOADED");

const WEBHOOK_URL = "https://hook.us2.make.com/eh74qn7yg2mey49vvu209tjeyhgtiwns";
console.log("WEBHOOK URL:", WEBHOOK_URL);

/* =========================================================
UTILITIES
========================================================= */

function getClientIdFromURL() {
const params = new URLSearchParams(window.location.search);
return params.get("client_id");
}

function showError(message) {
let el = document.getElementById("secure-error");

if (!el) {
el = document.createElement("div");
el.id = "secure-error";
el.style.margin = "20px 0";
el.style.color = "#b00020";
el.style.fontWeight = "bold";
document.body.prepend(el);
}

el.textContent = message;
}

function setFieldValue(name, value) {
if (value === undefined || value === null) return;
const field = document.querySelector(`[name="${name}"]`);
if (!field) return;
field.value = value;
}

function setRowValue(row, selector, value) {
const el = row?.querySelector(selector);
if (!el) return;
el.value = value ?? "";
}

function getRowValue(row, selector) {
const el = row?.querySelector(selector);
return el ? (el.value || "").trim() : "";
}

function hasAnyValue(obj) {
return Object.values(obj).some(v => (v ?? "").toString().trim() !== "");
}

/* =========================================================
HYDRATION
========================================================= */

function hydrateInsurance(insuranceArray) {
if (!Array.isArray(insuranceArray)) return;

const rows = document.querySelectorAll(".policy-row");
if (!rows.length) return;

insuranceArray.forEach((policy, index) => {
const row = rows[index];
if (!row) return;

setRowValue(row, ".policy-insured", policy.insured_name);
setRowValue(row, ".policy-carrier", policy.carrier);
setRowValue(row, ".policy-number", policy.policy_number);
setRowValue(row, ".policy-type", policy.policy_type);
setRowValue(row, ".policy-face", policy.face_amount);
setRowValue(row, ".policy-beneficiaries", policy.beneficiaries);
setRowValue(row, ".policy-riders", policy.riders);

// Optional fields (only if you have them in HTML)
setRowValue(row, ".owner-relation", policy.owner_relationship);
setRowValue(row, ".payor-relation", policy.payor_relationship);
});
}

function hydrateMusic(musicArray) {
if (!Array.isArray(musicArray)) return;

const rows = document.querySelectorAll(".song-row");
if (!rows.length) return;

musicArray.forEach((song, index) => {
const row = rows[index];
if (!row) return;

setRowValue(row, ".song-title", song.title);
setRowValue(row, ".song-artist", song.artist);
setRowValue(row, ".song-notes", song.notes);
});
}

function hydratePerson(person) {
if (!person) return;

setFieldValue("full_name", person.full_name);
setFieldValue("email_address", person.email);
setFieldValue("phone_number", person.phone);
setFieldValue("address", person.address);
setFieldValue("city", person.city);
setFieldValue("state", person.state);
setFieldValue("zip", person.zip);
setFieldValue("first_name", person.first_name);
setFieldValue("middle_name", person.middle_name);
setFieldValue("last_name", person.last_name);
}

function hydrateServices(services) {
if (!services) return;

setFieldValue("mood_service", services.service_mood);
setFieldValue("special_requests_service", services.special_requests);

if (services.viewing) {
const v = services.viewing;
setFieldValue("viewing_location_place", v.location_place);
setFieldValue("viewing_location_call", v.location_call);
setFieldValue("viewing_location_other", v.location_other);
setFieldValue("viewing_spiritual_traditions_notes", v.spiritual_traditions_notes);
setFieldValue("viewing_jewelry_notes", v.jewelry_notes);
setFieldValue("viewing_clothing_notes", v.clothing_notes);
}

if (services.memorial) {
const m = services.memorial;
setFieldValue("memorial_location_place", m.location_place);
setFieldValue("memorial_location_call", m.location_call);
setFieldValue("memorial_location_other", m.location_other);
setFieldValue("memorial_spiritual_traditions_notes", m.spiritual_traditions_notes);
}

if (services.celebration) {
const c = services.celebration;
setFieldValue("celebration_location_place", c.location_place);
setFieldValue("celebration_location_call", c.location_call);
setFieldValue("celebration_location_other", c.location_other);
setFieldValue("celebration_spiritual_traditions_notes", c.spiritual_traditions_notes);

// Schema 3: production details (safe even if missing)
const pd = c.production_details || {};
setFieldValue("celebration_flowers", pd.flowers);
setFieldValue("celebration_slideshow", pd.slideshow);
setFieldValue("celebration_mc", pd.mc);
setFieldValue("celebration_prayer_leader", pd.prayer_leader);
setFieldValue("celebration_music_live", pd.music_live);
setFieldValue("celebration_catering_notes", pd.catering_notes);
setFieldValue("celebration_decor_theme", pd.decor_theme);
}
}

function hydrateLegal(legal) {
if (!legal) return;

setFieldValue("legal_name", legal.legal_name);
setFieldValue("sex", legal.sex);
setFieldValue("social_security_number", legal.social_security_number);
setFieldValue("dob", legal.dob);
setFieldValue("place_of_birth", legal.place_of_birth);
setFieldValue("county", legal.county);

setFieldValue("veteran_status", legal.veteran_status);
setFieldValue("veteran_notes", legal.veteran_notes);
setFieldValue("flag_presented_to", legal.flag_presented_to);
setFieldValue("dd214_location", legal.dd214_location);

// Schema 3 additions
setFieldValue("hispanic_origin", legal.hispanic_origin);
setFieldValue("father_legal_name", legal.father_legal_name);
setFieldValue("mother_maiden_name", legal.mother_maiden_name);
}

function hydrateCemetery(cemetery) {
if (!cemetery) return;

setFieldValue("cemetery_name", cemetery.cemetery_name);
setFieldValue("cemetery_location", cemetery.cemetery_location);
setFieldValue("cemetery_section", cemetery.cemetery_section);
setFieldValue("cemetery_lot", cemetery.cemetery_lot);
setFieldValue("cemetery_grave_number", cemetery.cemetery_grave_number);

setFieldValue("interment_type", cemetery.interment_type);
setFieldValue("timing_of_services_and_disposition", cemetery.timing_of_services_and_disposition);
setFieldValue("remains_container", cemetery.remains_container);
setFieldValue("remains_out_of_state", cemetery.remains_out_of_state);
setFieldValue("remains_notes", cemetery.remains_notes);

// Schema 3 additions
setFieldValue("ashes_instructions", cemetery.ashes_instructions);
setFieldValue("urn_preference", cemetery.urn_preference);
setFieldValue("scattering_location", cemetery.scattering_location);
}

function hydrateFunding(funding) {
if (!funding) return;

setFieldValue("funding_approach", funding.funding_approach);
setFieldValue("would_like_help_reviewing", funding.would_like_help_reviewing);
}

function hydrateContacts(contacts) {
if (!Array.isArray(contacts)) return;

const rows = document.querySelectorAll(".contact-row");
if (!rows.length) return;

contacts.forEach((contact, index) => {
const row = rows[index];
if (!row) return;

setRowValue(row, ".contact-name", contact.name);
setRowValue(row, ".contact-relationship", contact.relationship);
setRowValue(row, ".contact-phone", contact.phone);
setRowValue(row, ".contact-email", contact.email);
setRowValue(row, ".contact-address", contact.address);
setRowValue(row, ".contact-notes", contact.notes);
});
}

function hydrateSnapshot(snapshot) {
if (!snapshot) return;

hydratePerson(snapshot.person);
hydrateServices(snapshot.services);
hydrateLegal(snapshot.legal);
hydrateCemetery(snapshot.cemetery);
hydrateContacts(snapshot.contacts);
hydrateInsurance(snapshot.insurance);
hydrateMusic(snapshot.music);
hydrateFunding(snapshot.funding);
}

/* =========================================================
BUILDERS
========================================================= */

function buildInsuranceFromForm(snapshot) {
const rows = document.querySelectorAll(".policy-row");
const insurance = [];

rows.forEach(row => {
const policy = {
insured_name: getRowValue(row, ".policy-insured"),
carrier: getRowValue(row, ".policy-carrier"),
policy_number: getRowValue(row, ".policy-number"),
policy_type: getRowValue(row, ".policy-type"),
face_amount: getRowValue(row, ".policy-face"),
beneficiaries: getRowValue(row, ".policy-beneficiaries"),
riders: getRowValue(row, ".policy-riders"),

// Optional if you’re keeping these fields in HTML
owner_relationship: getRowValue(row, ".owner-relation"),
payor_relationship: getRowValue(row, ".payor-relation")
};

if (hasAnyValue(policy)) insurance.push(policy);
});

snapshot.insurance = insurance;
}

function buildMusicFromForm(snapshot) {
const rows = document.querySelectorAll(".song-row");
const music = [];

rows.forEach(row => {
// If you still have a “ghost” row in HTML, ignore it safely:
if (row.classList.contains("ghost")) return;

const song = {
title: getRowValue(row, ".song-title"),
artist: getRowValue(row, ".song-artist"),
notes: getRowValue(row, ".song-notes")
};

if (hasAnyValue(song)) music.push(song);
});

snapshot.music = music;
}

function buildFundingFromForm(snapshot) {
snapshot.funding = {
funding_approach: document.querySelector('[name="funding_approach"]')?.value || "",
would_like_help_reviewing: document.querySelector('[name="would_like_help_reviewing"]')?.value || ""
};
}

function buildPersonFromForm(snapshot) {
snapshot.person = {
full_name: document.querySelector('[name="full_name"]')?.value.trim() || "",
first_name: document.querySelector('[name="first_name"]')?.value.trim() || "",
middle_name: document.querySelector('[name="middle_name"]')?.value.trim() || "",
last_name: document.querySelector('[name="last_name"]')?.value.trim() || "",
phone: document.querySelector('[name="phone_number"]')?.value.trim() || "",
email: document.querySelector('[name="email_address"]')?.value.trim() || "",
address: document.querySelector('[name="address"]')?.value.trim() || "",
city: document.querySelector('[name="city"]')?.value.trim() || "",
state: document.querySelector('[name="state"]')?.value.trim() || "",
zip: document.querySelector('[name="zip"]')?.value.trim() || ""
};
}

function buildServicesFromForm(snapshot) {
// Ensure structure exists (do NOT replace the whole object)
snapshot.services = snapshot.services || {};
snapshot.services.viewing = snapshot.services.viewing || {};
snapshot.services.memorial = snapshot.services.memorial || {};
snapshot.services.celebration = snapshot.services.celebration || {};
snapshot.services.celebration.production_details = snapshot.services.celebration.production_details || {};

// Top-level service fields
snapshot.services.service_mood = document.querySelector('[name="mood_service"]')?.value || "";
snapshot.services.special_requests = document.querySelector('[name="special_requests_service"]')?.value || "";

// Viewing
snapshot.services.viewing.location_place = document.querySelector('[name="viewing_location_place"]')?.value || "";
snapshot.services.viewing.location_call = document.querySelector('[name="viewing_location_call"]')?.value || "";
snapshot.services.viewing.location_other = document.querySelector('[name="viewing_location_other"]')?.value || "";
snapshot.services.viewing.spiritual_traditions_notes = document.querySelector('[name="viewing_spiritual_traditions_notes"]')?.value || "";
snapshot.services.viewing.jewelry_notes = document.querySelector('[name="viewing_jewelry_notes"]')?.value || "";
snapshot.services.viewing.clothing_notes = document.querySelector('[name="viewing_clothing_notes"]')?.value || "";

// Memorial
snapshot.services.memorial.location_place = document.querySelector('[name="memorial_location_place"]')?.value || "";
snapshot.services.memorial.location_call = document.querySelector('[name="memorial_location_call"]')?.value || "";
snapshot.services.memorial.location_other = document.querySelector('[name="memorial_location_other"]')?.value || "";
snapshot.services.memorial.spiritual_traditions_notes = document.querySelector('[name="memorial_spiritual_traditions_notes"]')?.value || "";

// Celebration
snapshot.services.celebration.location_place = document.querySelector('[name="celebration_location_place"]')?.value || "";
snapshot.services.celebration.location_call = document.querySelector('[name="celebration_location_call"]')?.value || "";
snapshot.services.celebration.location_other = document.querySelector('[name="celebration_location_other"]')?.value || "";
snapshot.services.celebration.spiritual_traditions_notes = document.querySelector('[name="celebration_spiritual_traditions_notes"]')?.value || "";

// Schema 3: production_details (always visible in Secure)
const pd = snapshot.services.celebration.production_details;
pd.flowers = document.querySelector('[name="celebration_flowers"]')?.value || "";
pd.slideshow = document.querySelector('[name="celebration_slideshow"]')?.value || "";
pd.mc = document.querySelector('[name="celebration_mc"]')?.value || "";
pd.prayer_leader = document.querySelector('[name="celebration_prayer_leader"]')?.value || "";
pd.music_live = document.querySelector('[name="celebration_music_live"]')?.value || "";
pd.catering_notes = document.querySelector('[name="celebration_catering_notes"]')?.value || "";
pd.decor_theme = document.querySelector('[name="celebration_decor_theme"]')?.value || "";
}
function buildLegalFromForm(snapshot) {
snapshot.legal = snapshot.legal || {};

snapshot.legal.legal_name = document.querySelector('[name="legal_name"]')?.value || "";
snapshot.legal.sex = document.querySelector('[name="sex"]')?.value || "";
snapshot.legal.social_security_number = document.querySelector('[name="social_security_number"]')?.value || "";
snapshot.legal.dob = document.querySelector('[name="dob"]')?.value || "";
snapshot.legal.place_of_birth = document.querySelector('[name="place_of_birth"]')?.value || "";
snapshot.legal.county = document.querySelector('[name="county"]')?.value || "";

snapshot.legal.veteran_status = document.querySelector('[name="veteran_status"]')?.value || "";
snapshot.legal.veteran_notes = document.querySelector('[name="veteran_notes"]')?.value || "";
snapshot.legal.flag_presented_to = document.querySelector('[name="flag_presented_to"]')?.value || "";
snapshot.legal.dd214_location = document.querySelector('[name="dd214_location"]')?.value || "";

// Schema 3 additions
snapshot.legal.hispanic_origin = document.querySelector('[name="hispanic_origin"]')?.value || "";
snapshot.legal.father_legal_name = document.querySelector('[name="father_legal_name"]')?.value || "";
snapshot.legal.mother_maiden_name = document.querySelector('[name="mother_maiden_name"]')?.value || "";
}

function buildCemeteryFromForm(snapshot) {
snapshot.cemetery = snapshot.cemetery || {};

snapshot.cemetery.cemetery_name = document.querySelector('[name="cemetery_name"]')?.value || "";
snapshot.cemetery.cemetery_location = document.querySelector('[name="cemetery_location"]')?.value || "";
snapshot.cemetery.cemetery_section = document.querySelector('[name="cemetery_section"]')?.value || "";
snapshot.cemetery.cemetery_lot = document.querySelector('[name="cemetery_lot"]')?.value || "";
snapshot.cemetery.cemetery_grave_number = document.querySelector('[name="cemetery_grave_number"]')?.value || "";

snapshot.cemetery.interment_type = document.querySelector('[name="interment_type"]')?.value || "";
snapshot.cemetery.timing_of_services_and_disposition = document.querySelector('[name="timing_of_services_and_disposition"]')?.value || "";
snapshot.cemetery.remains_container = document.querySelector('[name="remains_container"]')?.value || "";
snapshot.cemetery.remains_out_of_state = document.querySelector('[name="remains_out_of_state"]')?.value || "";
snapshot.cemetery.remains_notes = document.querySelector('[name="remains_notes"]')?.value || "";

// Schema 3 additions
snapshot.cemetery.ashes_instructions = document.querySelector('[name="ashes_instructions"]')?.value || "";
snapshot.cemetery.urn_preference = document.querySelector('[name="urn_preference"]')?.value || "";
snapshot.cemetery.scattering_location = document.querySelector('[name="scattering_location"]')?.value || "";
}

function buildContactsFromForm(snapshot) {
  const rows = document.querySelectorAll(".contact-row");
  const contacts = [];

  rows.forEach(row => {
    const contact = {
      name: getRowValue(row, ".contact-name"),
      relationship: getRowValue(row, ".contact-relationship"),
      phone: getRowValue(row, ".contact-phone"),
      email: getRowValue(row, ".contact-email"),
      address: getRowValue(row, ".contact-address"),
      notes: getRowValue(row, ".contact-notes")
    };

    if (hasAnyValue(contact)) contacts.push(contact);
  });

  snapshot.contacts = contacts;
}

/* =========================================================
LOAD
========================================================= */

async function loadSnapshot(clientId) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "load", client_id: clientId })
    });

    const raw = await res.json();
    const snapshot = Array.isArray(raw) && raw[0]?.body
      ? JSON.parse(raw[0].body)
      : raw;

    if (!snapshot?.client_id) {
      showError("Client not found.");
      return;
    }

    window.currentSnapshot = snapshot;
    hydrateSnapshot(snapshot);

  } catch (err) {
    console.error("LOAD ERROR:", err);
    showError("Something went wrong loading this plan.");
  }
}

/* =========================================================
SAVE
========================================================= */

function bindSaveHandler() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const snapshot = window.currentSnapshot;
    if (!snapshot) {
      showError("Nothing to save.");
      return;
    }

    buildPersonFromForm(snapshot);
    buildServicesFromForm(snapshot);
    buildLegalFromForm(snapshot);
    buildCemeteryFromForm(snapshot);
    buildContactsFromForm(snapshot);
    buildInsuranceFromForm(snapshot);
    buildMusicFromForm(snapshot);
    buildFundingFromForm(snapshot);

    snapshot.last_updated_at = new Date().toISOString();

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "save", snapshot })
      });

      alert("Saved successfully.");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      showError("Save failed.");
    }
  });
}

/* =========================================================
BOOT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const clientId = getClientIdFromURL();

  if (!clientId) {
    showError("Missing client ID.");
    return;
  }

  loadSnapshot(clientId);
  bindSaveHandler();
});

})();
