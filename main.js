// ===== Utilities =====
const $ = (sel, root = document) => root.querySelector(sel);

const applySavedTheme = () => {
  const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    // follow system
    document.documentElement.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
};

const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};

const showToast = (msg) => {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  });
};

// ===== On Load =====
document.addEventListener('DOMContentLoaded', () => {
  // Year
  $('#year').textContent = new Date().getFullYear();

  // Theme
  applySavedTheme();
  $('#theme-toggle').addEventListener('click', toggleTheme);

  // Mobile menu
  const menuBtn = $('#menu-toggle');
  const nav = $('#nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  // EmailJS
  // Provided by you:
  const PUBLIC_KEY = '3snkqX3NQku24zL9h';
  const SERVICE_ID = 'service_t7owhv7';
  const TEMPLATE_ID = 'template_15piz2d';

  if (window.emailjs) {
    emailjs.init(PUBLIC_KEY);
  }

  const form = $('#contact-form');
  const sendBtn = $('#send-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.emailjs) {
      showToast('Email service not loaded. Check your internet.');
      return;
    }
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
      form.reset();
      showToast('✅ Message sent! I will get back to you soon.');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to send. Please try again.');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    }
  });
});
