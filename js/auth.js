// Works for both the login page and the register page.
// Ask Wesley and Ndjadi to confirm these addresses and the field names.
const API = { login: '/api/auth/signin', register: '/api/auth/signup' };
const AFTER_LOGIN = 'reports.html'; // the reports list page

const form = document.getElementById('auth');
const errorBox = document.getElementById('error');
const mode = form.dataset.mode; // "login" or "register"

function showError(msg) { errorBox.textContent = msg; errorBox.classList.add('show'); }

function clearErrors() {
  errorBox.classList.remove('show');
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
}

function fieldError(input, msg) {
  input.setAttribute('aria-invalid', 'true');
  const p = document.createElement('p');
  p.className = 'field-error';
  p.textContent = msg;
  input.closest('.field').appendChild(p);
}

// Show / Hide password buttons
document.querySelectorAll('.toggle').forEach(btn => {
  btn.onclick = () => {
    const input = btn.previousElementSibling;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  };
});

// Message after registering
if (new URLSearchParams(location.search).get('registered')) {
  const n = document.getElementById('notice');
  if (n) n.classList.add('show');
}

function validate(v) {
  let ok = true;
  const bad = (name, msg) => { fieldError(form.elements[name], msg); ok = false; };
  if (mode === 'register' && !v.name.trim()) bad('name', 'Please enter your name.');
  if (!/^\S+@\S+\.\S+$/.test(v.email)) bad('email', 'Please enter a valid email, like you@example.com.');
  if (mode === 'login' && !v.password) bad('password', 'Please enter your password.');
  if (mode === 'register') {
    if (v.password.length < 8) bad('password', 'Use at least 8 characters.');
    if (v.confirm !== v.password) bad('confirm', 'The passwords do not match.');
  }
  return ok;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();
  const v = Object.fromEntries(new FormData(form));
  v.email = (v.email || '').trim();
  if (!validate(v)) { const first = form.querySelector('[aria-invalid]'); if (first) first.focus(); return; }

  const btn = form.querySelector('button[type=submit]');
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Please wait...';

  const body = mode === 'login'
    ? { email: v.email, password: v.password }
    : { name: v.name.trim(), email: v.email, password: v.password };

  try {
    const res = await fetch(API[mode], { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showError(data.message || (mode === 'login' ? 'Wrong email or password.' : 'We could not create your account. Please try again.'));
      return;
    }
    if (data.token) { try { localStorage.setItem('token', data.token); } catch (_) {} }
    window.location.href = mode === 'login' ? AFTER_LOGIN : 'login.html?registered=1';
  } catch (_) {
    showError('Cannot reach the server. Check your connection and try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});
