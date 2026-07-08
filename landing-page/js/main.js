// ---- Fill these in before going live ----
const WHATSAPP_NUMBER = "51900000000"; // TODO: replace with the real WhatsApp number, country code + number, no symbols
const WHATSAPP_MESSAGE = "Hola, quiero más información sobre CampusHub.";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME"; // TODO: replace with your real Formspree form endpoint
// ------------------------------------------

function track(eventName, params) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params || {});
  }
}

// Wire every WhatsApp CTA to the real wa.me link and track clicks.
document.querySelectorAll(".js-whatsapp-cta").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  link.target = "_blank";
  link.rel = "noopener";
  link.addEventListener("click", () => {
    track("click_whatsapp", { cta_location: link.dataset.ctaLocation || "unknown" });
  });
});

// Track which pricing plan CTA was clicked.
document.querySelectorAll(".js-plan-cta").forEach((link) => {
  link.addEventListener("click", () => {
    track("select_plan", { plan_name: link.dataset.plan || "unknown" });
  });
});

// Mobile nav toggle.
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Lead capture form.
const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");

function setFieldError(fieldId, hasError) {
  const field = document.getElementById(fieldId)?.closest(".field");
  if (field) field.classList.toggle("is-invalid", hasError);
}

function validateForm(data) {
  let valid = true;

  const nameValid = data.nombre.trim().length > 0;
  setFieldError("f-nombre", !nameValid);
  valid = valid && nameValid;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim());
  setFieldError("f-correo", !emailValid);
  valid = valid && emailValid;

  const rolValid = data.rol.trim().length > 0;
  setFieldError("f-rol", !rolValid);
  valid = valid && rolValid;

  return valid;
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
      nombre: form.nombre.value,
      correo: form.correo.value,
      rol: form.rol.value,
      mensaje: form.mensaje.value,
    };

    if (!validateForm(data)) {
      statusEl.textContent = "Revisa los campos marcados en rojo.";
      statusEl.className = "form-status is-error";
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    statusEl.textContent = "Enviando...";
    statusEl.className = "form-status";

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        statusEl.textContent = "¡Gracias! Te contactaremos pronto.";
        statusEl.className = "form-status is-success";
        track("generate_lead", { role: data.rol });
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      statusEl.textContent = "Algo salió mal. Intenta de nuevo o escríbenos por WhatsApp.";
      statusEl.className = "form-status is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
