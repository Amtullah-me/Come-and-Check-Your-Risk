/* ================================================
   OncoGen Care — Auth Script
   ================================================ */

// ── Age Group Config ──
const ageConfig = {
  kids:    { icon: '👶', label: 'Kids',    range: '0–12 years',  color: '#5cc8f0' },
  teens:   { icon: '🎓', label: 'Teens',   range: '13–19 years', color: '#9b6dd7' },
  adults:  { icon: '💼', label: 'Adults',  range: '20–59 years', color: '#4a8af4' },
  seniors: { icon: '❤️', label: 'Seniors', range: '60+ years',   color: '#f0923e' },
};

// ── Toggle Password Visibility ──
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

// ── Show Toast ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Show / Hide Error ──
function showError(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) el.classList.add('show');
  else el.classList.remove('show');
}

// ── Apply Age Theme to Card ──
function applyAgeTheme(cardId, badgeId, badgeIconId, badgeTextId, group) {
  const card = document.getElementById(cardId);
  const badge = document.getElementById(badgeId);
  const icon = document.getElementById(badgeIconId);
  const text = document.getElementById(badgeTextId);
  if (!card || !badge) return;

  // Remove old classes
  card.classList.remove('age-kids', 'age-teens', 'age-adults', 'age-seniors');
  badge.classList.remove('kids', 'teens', 'adults', 'seniors');

  const cfg = ageConfig[group] || ageConfig.adults;

  card.classList.add('age-' + (group || 'adults'));
  badge.classList.add(group || 'adults');
  if (icon) icon.textContent = cfg.icon;
  if (text) text.textContent = cfg.label + ' Mode';
}

// ── Login: Update Age Theme ──
function updateLoginAgeTheme() {
  const sel = document.getElementById('loginAgeGroup');
  if (!sel) return;
  applyAgeTheme('loginCard', 'loginAgeBadge', 'loginAgeBadgeIcon', 'loginAgeBadgeText', sel.value || 'adults');
}

// ── Signup: Detect Age Group ──
function detectAgeGroup() {
  const ageInput = document.getElementById('age');
  const badge = document.getElementById('detectedBadge');
  const iconEl = document.getElementById('detectedIcon');
  const textEl = document.getElementById('detectedText');
  const valueEl = document.getElementById('detectedValue');
  if (!ageInput) return;

  const age = parseInt(ageInput.value);

  if (isNaN(age) || ageInput.value === '') {
    if (badge) badge.classList.remove('show');
    applyAgeTheme('signupCard', 'signupAgeBadge', 'signupAgeBadgeIcon', 'signupAgeBadgeText', 'adults');
    return;
  }

  let group = 'adults';
  if (age <= 12) group = 'kids';
  else if (age <= 19) group = 'teens';
  else if (age <= 59) group = 'adults';
  else group = 'seniors';

  const cfg = ageConfig[group];

  if (badge) badge.classList.add('show');
  if (iconEl) iconEl.textContent = cfg.icon;
  if (textEl) textEl.textContent = cfg.label + ' (' + cfg.range + ')';
  if (valueEl) valueEl.style.color = cfg.color;

  applyAgeTheme('signupCard', 'signupAgeBadge', 'signupAgeBadgeIcon', 'signupAgeBadgeText', group);
}

// ── Login Form Validation & Submit ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const ageGroup = document.getElementById('loginAgeGroup').value;

    // Email
    if (!email || (!/\S+@\S+\.\S+/.test(email) && email.length < 3)) {
      showError('loginEmailError', true); valid = false;
    } else { showError('loginEmailError', false); }

    // Password
    if (!password || password.length < 8) {
      showError('loginPasswordError', true); valid = false;
    } else { showError('loginPasswordError', false); }

    // Age Group
    if (!ageGroup) {
      showError('loginAgeGroupError', true); valid = false;
    } else { showError('loginAgeGroupError', false); }

    if (!valid) return;

    // Send POST request
    const data = {
      email: email,
      password: password,
      ageGroup: ageGroup,
      rememberMe: document.getElementById('rememberMe').checked
    };

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Login successful! Redirecting…');
        setTimeout(() => { window.location.href = result.redirect || '/dashboard'; }, 1200);
      } else {
        showToast(result.error || 'Invalid email or password');
      }
    } catch (err) {
      showToast('Unable to connect to the server right now.');
    }
  });
}

// ── Signup Form Validation & Submit ──
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    let valid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value.trim();
    const country = document.getElementById('country').value;
    const terms = document.getElementById('terms').checked;

    // Full Name
    if (!fullName) { showError('fullNameError', true); valid = false; }
    else { showError('fullNameError', false); }

    // Email
    if (!email || !/\S+@\S+\.\S+/.test(email)) { showError('signupEmailError', true); valid = false; }
    else { showError('signupEmailError', false); }

    // Password
    if (!password || password.length < 8) { showError('signupPasswordError', true); valid = false; }
    else { showError('signupPasswordError', false); }

    // Confirm Password
    if (password !== confirm) { showError('confirmPasswordError', true); valid = false; }
    else { showError('confirmPasswordError', false); }

    // Gender
    if (!gender) { showError('genderError', true); valid = false; }
    else { showError('genderError', false); }

    // Age
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 120) { showError('ageError', true); valid = false; }
    else { showError('ageError', false); }

    // Phone
    if (!phone) { showError('phoneError', true); valid = false; }
    else { showError('phoneError', false); }

    // Country
    if (!country) { showError('countryError', true); valid = false; }
    else { showError('countryError', false); }

    // Terms
    if (!terms) { showError('termsError', true); valid = false; }
    else { showError('termsError', false); }

    if (!valid) return;

    // Detect age group
    let ageGroup = 'adults';
    if (ageNum <= 12) ageGroup = 'kids';
    else if (ageNum <= 19) ageGroup = 'teens';
    else if (ageNum <= 59) ageGroup = 'adults';
    else ageGroup = 'seniors';

    const data = {
      fullName, email, password, gender,
      age: ageNum, ageGroup, phone, country
    };

    try {
      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Account created successfully!');
        setTimeout(() => { window.location.href = '/'; }, 1200);
      } else {
        showToast(result.error || 'Could not create account');
      }
    } catch (err) {
      showToast('Unable to connect to the server right now.');
    }
  });
}
