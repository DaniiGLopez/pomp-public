/* ==========================================================
POMP BASIC 2.2 — planning.yourpomp
External JS File
========================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------
  CONFIG
  ---------------------------------------------------------- */

  const WEBHOOK_URL = "https://hook.us2.make.com/yje83hyt1q03zek4mwlz1fe9l3ghl4ri";

  /* ----------------------------------------------------------
  HELPERS
  ---------------------------------------------------------- */

  const $ = (id) => document.getElementById(id);

  function show(id) {
    const el = $(id);
    if (el) el.style.display = "block";
  }

  function hide(id) {
    const el = $(id);
    if (el) el.style.display = "none";
  }

  function val(id) {
    return $(id)?.value?.trim() || "";
  }

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

  function setDisplay(id, shouldShow) {
    const el = $(id);
    if (!el) return;
    el.style.display = shouldShow ? "block" : "none";
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
    document.querySelectorAll(".checklist-group[data-single-select]").forEach((group) => {
      const boxes = group.querySelectorAll('input[type="checkbox"]');

      boxes.forEach((cb) => {
        cb.addEventListener("change", () => {
          if (cb.checked) {
            boxes.forEach((other) => {
              if (other !== cb) other.checked = false;
            });
          }
          runLogic();
        });
      });
    });
  }

  function runLogic() {
    /* DISPOSITION */
    const dispositionSelected = checked("disposition");

    if (dispositionSelected) {
      show("block-services");
    } else {
      hide("block-services");
      hide("block-viewing");
      hide("block-memorial");
      hide("block-celebration");
    }

    /* SERVICES */
    const selectedServices = checkedAll("services_selected").map((cb) => cb.value);

    setDisplay("block-viewing", selectedServices.includes("viewing"));
    setDisplay("block-memorial", selectedServices.includes("memorial"));
    setDisplay("block-celebration", selectedServices.includes("celebration"));

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
      schema_version: 4,
      created_at: "",
      last_updated_at: "",

      person: {
        full_name: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: ""
      },

      services: {
        disposition: "",
        disposition_other: "",
        services_selected: [],

        viewing: {
          location_type: "",
          location_name: "",
          location_address: "",
          location_phone: "",
          location_other: "",
          jewelry_notes: "",
          clothing_notes: "",
          spiritual_traditions_notes: ""
        },

        memorial: {
          location_type: "",
          location_name: "",
          location_address: "",
          location_phone: "",
          location_other: "",
          spiritual_traditions_notes: ""
        },

        celebration: {
          location_type: "",
          location_name: "",
          location_address: "",
          location_phone: "",
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

      contacts: [
        {
          name: "",
          relationship: "",
          phone: "",
          email: "",
          address: "",
          notes: ""
        }
      ],

      insurance: [
        {
          insured_name: "",
          carrier: "",
          policy_number: "",
          policy_type: "",
          face_amount: "",
          beneficiaries: "",
          riders: "",
          owner_relationship: "",
          payor_relationship: ""
        }
      ],

      music: [
        {
          title: "",
          artist: "",
          notes: ""
        }
      ],

      legal: {
        legal_name: "",
        sex: "",
        social_security_number: "",
        dob: "",
        place_of_birth: "",
        county: "",
        veteran_status: "",
        veteran_notes: "",
        flag_presented_to: "",
        dd214_location: "",
        hispanic_origin: "",
        father_legal_name: "",
        mother_maiden_name: ""
      },

      cemetery: {
        cemetery_name: "",
        cemetery_location: "",
        cemetery_section: "",
        cemetery_lot: "",
        cemetery_grave_number: "",
        interment_type: "",
        timing_of_services_and_disposition: "",
        remains_container: "",
        remains_out_of_state: "",
        remains_notes: "",
        ashes_instructions: "",
        urn_preference: "",
        scattering_location: ""
      },

      funding: {
        funding_help_requested: "",
        funding_approach: "",
        would_like_help_reviewing: ""
      },

      obituary: {
        obituary_name: "",
        publications: [],
        draft_text: "",
        tone: "",
        family_list: "",
        include_service_details: false,
        photo_url: ""
      }
    };
  }

  /* ----------------------------------------------------------
  VMC LOCATION BUILDER
  ---------------------------------------------------------- */

  function buildServiceLocation(serviceKey) {
    const selected = checked(`${serviceKey}_location`);

    return {
      location_type: selected?.value || "",
      location_name: val(`${serviceKey}_location_name`),
      location_address: val(`${serviceKey}_location_address`),
      location_phone: val(`${serviceKey}_location_phone`),
      location_other: selected?.value === "other" ? val(`${serviceKey}_location_other_text`) : ""
    };
  }

  /* ----------------------------------------------------------
  BUILD SNAPSHOT
  ---------------------------------------------------------- */

  function buildSnapshot() {
    const snap = emptySnapshot();

    snap.client_id = generateClientId();
    snap.created_at = isoNow();
    snap.last_updated_at = snap.created_at;

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
      snap.services.disposition_other =
        disp.value === "other" ? val("disposition_other_text") : "";
    }

    /* SERVICES SELECTED */
    snap.services.services_selected = checkedAll("services_selected").map((cb) => cb.value);

    /* VIEWING */
    snap.services.viewing = {
      ...snap.services.viewing,
      ...buildServiceLocation("viewing")
    };

    /* MEMORIAL */
    snap.services.memorial = {
      ...snap.services.memorial,
      ...buildServiceLocation("memorial")
    };

    /* CELEBRATION */
    snap.services.celebration = {
      ...snap.services.celebration,
      ...buildServiceLocation("celebration")
    };

    /* FUNDING */
    const funding = checked("funding_help_requested");
    if (funding) {
      snap.funding.funding_help_requested = funding.value;
    }

    return snap;
  }

  /* ----------------------------------------------------------
  SUBMIT
  ---------------------------------------------------------- */

  async function handleSubmit(e, form) {
    e.preventDefault();

    const submitBtn =
      form.querySelector('button[type="submit"], input[type="submit"]');

    if (submitBtn) submitBtn.disabled = true;

    try {
      const snapshot = buildSnapshot();

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      form.style.display = "none";
      $("basic-confirmation")?.style.setProperty("display", "block");
    } catch (err) {
      console.error("POMP planning submit failed:", err);
      alert("Something went wrong while submitting the form. Please try again.");
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  /* ----------------------------------------------------------
  INIT
  ---------------------------------------------------------- */

  function bindLogicListeners() {
    document
      .querySelectorAll("input[type='checkbox'], input[type='radio']")
      .forEach((el) => el.addEventListener("change", runLogic));
  }

  function initPompBasic() {
    const form = $("pomp-basic-form");
    if (!form) return;

    bindSingleSelectGroups();
    bindLogicListeners();

    form.addEventListener("submit", (e) => handleSubmit(e, form));

    runLogic();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPompBasic);
  } else {
    initPompBasic();
  }
})();
