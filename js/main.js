/**
 * main.js - interactions globales (header sticky shadow, burger, form, FAQ).
 * Aucun framework. Tout en vanilla, chargé en defer.
 */

(function () {
  'use strict';

  // ---------- Header : ombre au scroll (desktop uniquement, > 768px) -------
  const header = document.querySelector('.site-header');
  if (header && window.matchMedia('(min-width: 769px)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 4) header.classList.add('is-pinned');
          else header.classList.remove('is-pinned');
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Burger menu (mobile) -----------------------------------------
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- Formulaire de contact ----------------------------------------
  // Netlify Forms : on valide côté client, puis on laisse le submit natif
  // partir vers /merci/. Netlify intercepte automatiquement la requête POST
  // (grâce à l'attribut data-netlify="true" et au champ form-name caché).
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const submitBtn = form.querySelector('[type="submit"]');

    const setError = (field, msg) => {
      const wrapper = field.closest('.field');
      if (!wrapper) return;
      wrapper.classList.add('is-invalid');
      const errorEl = wrapper.querySelector('.field__error');
      if (errorEl && msg) errorEl.textContent = msg;
    };
    const clearError = (field) => {
      const wrapper = field.closest('.field');
      if (wrapper) wrapper.classList.remove('is-invalid');
    };

    // Nettoyage à la saisie
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    form.addEventListener('submit', (e) => {
      // Validation maison (en + de la validation native)
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach((field) => {
        if (field.type === 'checkbox') {
          if (!field.checked) {
            setError(field, 'Champ requis.');
            valid = false;
          }
        } else if (!field.value.trim()) {
          setError(field, 'Champ requis.');
          valid = false;
        }
      });
      const emailField = form.querySelector('[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        setError(emailField, 'Email invalide.');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('.is-invalid input, .is-invalid select, .is-invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // OK : on laisse le submit natif partir (Netlify Forms l'intercepte
      // et redirige vers /merci/ une fois la soumission enregistrée).
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    });
  }

  // ---------- Smooth-scroll vers ancres (avec offset header) ---------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // ---------- FAQ : un seul ouvert à la fois (option) -----------------------
  // Désactivé par défaut - chaque détails est indépendant pour permettre une
  // lecture confortable. Décommente le bloc ci-dessous pour le mode "accordéon".
  /*
  document.querySelectorAll('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        d.parentElement.querySelectorAll('details').forEach((other) => {
          if (other !== d) other.open = false;
        });
      }
    });
  });
  */
})();
