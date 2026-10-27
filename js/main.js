/**
 * PROPERTIES-DEV.COM — MAIN INTERACTION SCRIPT
 * Role: Independent Real Estate Consultancy & Strategic Marketing Partner
 * Phone: +201033373331
 */

document.addEventListener('DOMContentLoaded', () => {
  initLeadForm();
  initLegalLinksRouting();
});

/**
 * Lead capture form handling
 * Validates Full Name and Phone Number without placeholders,
 * displays elegant feedback, and connects seamlessly to WhatsApp.
 */
function initLeadForm() {
  const form = document.getElementById('consultationForm');
  const successBanner = document.getElementById('formSuccessBanner');
  const directWaLink = document.getElementById('successWaAction');

  if (!form) return;

  const nameInput = document.getElementById('fullName');
  const countryCodeSelect = document.getElementById('countryCode');
  const phoneInput = document.getElementById('phoneNumber');

  // Restrict phone input to valid telephone characters
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9\s-]/g, '');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const countryCodeVal = countryCodeSelect.value;

    let hasError = false;

    // Reset styles
    nameInput.style.borderColor = 'var(--bg-stone-border)';
    phoneInput.style.borderColor = 'var(--bg-stone-border)';

    if (!nameVal) {
      nameInput.style.borderColor = '#E53E3E';
      nameInput.focus();
      hasError = true;
    }

    if (!phoneVal || phoneVal.replace(/[^0-9]/g, '').length < 6) {
      phoneInput.style.borderColor = '#E53E3E';
      if (!hasError) phoneInput.focus();
      hasError = true;
    }

    if (hasError) return;

    const fullPhoneNumber = `${countryCodeVal} ${phoneVal}`;
    const cleanWaTarget = `201033373331`;

    const encodedMessage = encodeURIComponent(
      `Hello properties-dev.com,\n` +
      `I would like to request a private consultation.\n\n` +
      `• Full Name: ${nameVal}\n` +
      `• Phone: ${fullPhoneNumber}\n` +
      `• Status: New Consultation Request via properties-dev.com`
    );

    const waUrl = `https://wa.me/${cleanWaTarget}?text=${encodedMessage}`;

    // Hide inputs and display success state
    form.style.display = 'none';

    if (successBanner) {
      successBanner.classList.add('active');
    }

    if (directWaLink) {
      directWaLink.href = waUrl;
    }

    // Direct redirection option or instant WhatsApp trigger
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 1200);
  });
}

/**
 * Handles environment-agnostic routing for legal pages
 * Ensures both /privacy-policy and privacy-policy.html work cleanly
 */
function initLegalLinksRouting() {
  const isFileProtocol = window.location.protocol === 'file:';

  document.querySelectorAll('a[data-legal-route]').forEach((link) => {
    const route = link.getAttribute('data-legal-route');
    if (isFileProtocol) {
      link.setAttribute('href', `${route.replace(/^\//, '')}.html`);
    } else {
      link.setAttribute('href', route);
    }
  });
}
