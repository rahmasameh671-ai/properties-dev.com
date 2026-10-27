/**
 * PROPERTIES-DEV.COM — HYDE PARK PORTFOLIO (/hyde-park)
 * Role: Independent Real Estate Consultancy & Strategic Marketing Partner
 * Phone & WhatsApp: +201033373331
 * Webhook: https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountryCodes();
  initLeadForm();
  initSmoothScroll();
  initModalListeners();
  initAnalytics();
  initScrollSpy();
  initLegalLinksRouting();
});

// International country dialing codes with properly encoded UTF-8 flags
const countryCodes = [
  { code: '+20', name: 'Egypt', flag: '🇪🇬', default: true },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', name: 'USA / Canada', flag: '🇺🇸' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' }
];

const CONFIG = {
  whatsappNumber: '201033373331',
  zapierWebhookUrl: 'https://hooks.zapier.com/hooks/catch/25429357/uclzmpn/',
  storageKey: 'properties_dev_hydepark_leads'
};

/**
 * Initialize country codes dropdown
 */
function initCountryCodes() {
  const select = document.getElementById('countryCodeSelect');
  if (!select) return;

  select.innerHTML = '';
  countryCodes.forEach(item => {
    const option = document.createElement('option');
    option.value = item.code;
    option.textContent = `${item.flag} ${item.code} (${item.name})`;
    if (item.default) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

/**
 * Lead capture form handling (Zapier Webhook Integration & Google Analytics)
 */
function initLeadForm() {
  const form = document.getElementById('leadCaptureForm');
  if (!form) return;

  const phoneInput = document.getElementById('phoneNumber');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9\s-]/g, '');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('fullName');
    const countrySelect = document.getElementById('countryCodeSelect');
    const submitBtn = form.querySelector('button[type="submit"]');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const phoneNumber = phoneInput ? phoneInput.value.trim() : '';
    const countryCode = countrySelect ? countrySelect.value : '+20';

    // Form Validation
    if (!fullName) {
      showNotice('Please enter your full name.', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!phoneNumber || phoneNumber.replace(/[^0-9]/g, '').length < 6) {
      showNotice('Please enter a valid phone number.', 'error');
      if (phoneInput) phoneInput.focus();
      return;
    }

    const fullPhoneNumber = countryCode ? `${countryCode} ${phoneNumber}`.trim() : phoneNumber;

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      SUBMITTING...
    `;

    const data = {
      fullName: fullName,
      phoneNumber: fullPhoneNumber,
      portfolio: 'Hyde Park Portfolio',
      developer: 'Hyde Park Developments',
      domain: 'properties-dev.com',
      landingPageUrl: window.location.href,
      submissionDate: new Date().toISOString()
    };

    try {
      // POST to Zapier Webhook
      await fetch(CONFIG.zapierWebhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn("Zapier dispatch warning:", err);
    }

    // Local storage backup
    try {
      const stored = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
      stored.push({
        ...data,
        source: 'properties-dev.com — Hyde Park Portfolio'
      });
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(stored));
    } catch (storageErr) {
      console.warn('LocalStorage error:', storageErr);
    }

    // Google Ads & Analytics Conversion Event (AW-17050255563)
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Lead',
          event_label: 'Hyde Park Interest Form — properties-dev.com',
          value: 1.0,
          currency: 'EGP',
          send_to: 'AW-17050255563'
        });
      } catch (gtagErr) {
        console.warn('Google Tag tracking error:', gtagErr);
      }
    }

    form.reset();
    initCountryCodes();
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Show notice & open confirmation dialog
    showNotice('Thank You! Your details have been received. We will be in touch shortly.', 'success');
    openSuccessModal(data.fullName, data.phoneNumber);
  });
}

/**
 * Open luxury confirmation modal with instant WhatsApp action
 */
function openSuccessModal(name, fullPhone) {
  const modal = document.getElementById('successModal');
  const modalName = document.getElementById('modalLeadName');
  const whatsappBtn = document.getElementById('modalWhatsAppBtn');

  if (modalName) modalName.textContent = name;

  if (whatsappBtn) {
    const text = encodeURIComponent(
      `Hello properties-dev.com, my name is ${name} (${fullPhone}). I just registered my interest on properties-dev.com/hyde-park and would like to receive floor plans, updated availability, and payment breakdowns for Hyde Park Developments.`
    );
    whatsappBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function initModalListeners() {
  const closeBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('successModal');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Notice banner
 */
function showNotice(message, type = 'info') {
  let notice = document.getElementById('formNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'formNotice';
    notice.className = 'mt-3 p-3 text-xs font-semibold rounded-lg text-center transition-all duration-300';
    const form = document.getElementById('leadCaptureForm');
    if (form) form.appendChild(notice);
  }

  if (type === 'error') {
    notice.className = 'mt-3 p-3 text-xs font-semibold rounded-lg text-center bg-rose-50 text-rose-700 border border-rose-200';
  } else if (type === 'success') {
    notice.className = 'mt-3 p-4 text-xs font-semibold rounded-lg text-center bg-emerald-50 text-emerald-800 border border-emerald-200';
  } else {
    notice.className = 'mt-3 p-3 text-xs font-semibold rounded-lg text-center bg-slate-100 text-slate-800 border border-slate-300';
  }

  notice.textContent = message;
  notice.classList.remove('hidden');

  setTimeout(() => {
    if (notice) notice.classList.add('hidden');
  }, 4000);
}

/**
 * Smooth scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 40;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Google Ads & Analytics WhatsApp Tracking
 */
function initAnalytics() {
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', 'contact', {
            event_category: 'WhatsApp',
            event_label: link.getAttribute('href') || 'WhatsApp Consultation — properties-dev.com',
            send_to: 'AW-17050255563'
          });
        } catch (err) {
          console.warn('Google Tag WhatsApp tracking error:', err);
        }
      }
    });
  });
}

/**
 * Scroll spy for quick navigation pills
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.subnav-pill');
  if (!navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active', 'bg-[#1A202C]', 'text-white');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active', 'bg-[#1A202C]', 'text-white');
      }
    });
  });
}

/**
 * Ensure legal links work both under web server and local file protocol
 */
function initLegalLinksRouting() {
  const isFileProtocol = window.location.protocol === 'file:';

  document.querySelectorAll('a[data-legal-route]').forEach(link => {
    const route = link.getAttribute('data-legal-route');
    if (isFileProtocol) {
      // In nested folder /hyde-park/, link to ../privacy-policy.html
      const isSubdir = window.location.pathname.includes('/hyde-park');
      const prefix = isSubdir ? '../' : '';
      link.setAttribute('href', `${prefix}${route.replace(/^\//, '')}.html`);
    } else {
      link.setAttribute('href', route);
    }
  });
}
