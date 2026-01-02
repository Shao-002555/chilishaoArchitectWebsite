// form.js
// Basic client-side validation for the contact form (no backend)

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');
  const statusEl = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearStatus();

    const errors = [];
    // Name
    if (!nameEl.value.trim()) {
      errors.push('name');
      errorName.textContent = 'Please enter your name.';
    }

    // Email
    const emailVal = emailEl.value.trim();
    if (!emailVal) {
      errors.push('email');
      errorEmail.textContent = 'Please enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(emailVal)) {
      errors.push('email');
      errorEmail.textContent = 'Please enter a valid email address.';
    }

    // Message
    if (messageEl.value.trim().length < 10) {
      errors.push('message');
      errorMessage.textContent = 'Message should be at least 10 characters.';
    }

    if (errors.length) {
      statusEl.textContent = '';
      const first = errors[0];
      if (first === 'name') nameEl.focus();
      if (first === 'email') emailEl.focus();
      if (first === 'message') messageEl.focus();
      return;
    }

    // Simulate success (no backend)
    statusEl.textContent = 'Thanks! Your message has been validated locally.';
    form.reset();
  });

  function clearStatus() {
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorMessage.textContent = '';
    statusEl.textContent = '';
  }
})();

