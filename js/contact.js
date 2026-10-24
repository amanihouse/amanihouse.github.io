// Formulaire de contact
// Le site est statique (GitHub Pages) : sans service d'envoi configure, la demande
// s'ouvre dans l'application e-mail du visiteur, deja remplie.
// Pour recevoir les demandes directement, creer un formulaire sur https://formspree.io
// et coller son adresse ci-dessous (ex. 'https://formspree.io/f/abcdwxyz').
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'info.amaniihouse@gmail.com';

const contactForm = document.getElementById('contact-form');
const formError = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');

const LABELS = {
  prenom: 'Prénom',
  nom: 'Nom',
  email: 'E-mail',
  telephone: 'Téléphone',
  evenement: "Type d'événement",
  date: 'Date envisagée',
  lieu: 'Lieu / ville',
  invites: "Nombre d'invités",
  services: 'Services souhaités',
  budget: 'Budget estimé',
  message: 'Message',
};

function collectFields(form) {
  const data = new FormData(form);
  const fields = {};
  for (const key of Object.keys(LABELS)) {
    const values = data.getAll(key).filter(Boolean);
    if (values.length) fields[key] = values.join(', ');
  }
  return fields;
}

function showSuccess() {
  contactForm.hidden = true;
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    contactForm.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    const invalid = [...contactForm.querySelectorAll('[required]')].filter((el) => !el.checkValidity());
    if (invalid.length) {
      invalid.forEach((el) => el.closest('.field').classList.add('is-invalid'));
      formError.hidden = false;
      invalid[0].focus();
      return;
    }
    formError.hidden = true;

    const fields = collectFields(contactForm);

    if (FORM_ENDPOINT) {
      const submit = contactForm.querySelector('.form-submit');
      submit.disabled = true;
      submit.textContent = 'Envoi en cours…';
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(fields),
        });
        if (!res.ok) throw new Error(res.statusText);
        showSuccess();
      } catch {
        formError.textContent = "L'envoi a échoué. Merci de réessayer ou de nous écrire à " + CONTACT_EMAIL + '.';
        formError.hidden = false;
        submit.disabled = false;
        submit.textContent = 'Envoyer ma demande';
      }
      return;
    }

    const body = Object.entries(fields)
      .map(([key, value]) => `${LABELS[key]} : ${value}`)
      .join('\n');
    const subject = `Demande de contact — ${fields.evenement || 'Événement'} — ${fields.prenom} ${fields.nom}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showSuccess();
  });
}
