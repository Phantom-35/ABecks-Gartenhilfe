document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }), { rootMargin: '0px 0px -10% 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.compare__frame').forEach(frame => {
    const range = frame.querySelector('.compare__range');
    range?.addEventListener('input', () => frame.style.setProperty('--pos', `${range.value}%`));
  });

  const burgerBtn = document.getElementById('burgerBtn');
  const navUl = document.querySelector('#main-navigation ul');

  if (burgerBtn && navUl) {
    burgerBtn.type = 'button';
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.addEventListener('click', () => {
      const isOpen = burgerBtn.classList.toggle('open');
      navUl.classList.toggle('active', isOpen);
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
      burgerBtn.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });
    navUl.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      burgerBtn.classList.remove('open');
      navUl.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      burgerBtn.setAttribute('aria-label', 'Menü öffnen');
    }));
  }

  /* ---------- Leistungsauswahl (Merkliste) ---------- */

  const services = {
    allround: { title: 'Rundum-Sorglos-Paket', price: 'Festpreis / Nach Besichtigung', features: ['Rasenmähen & Kanten pflegen', 'Hecken- & Strauchschnitt', 'Unkraut- & Beetpflege', 'Stein- & Gehwegreinigung', 'Grünabfallentsorgung'], includes: ['rasenmaehen', 'heckenschnitt', 'beetpflege', 'pflasterreinigung'] },
    heckenschnitt: { title: 'Heckenschnitt', price: 'Nach Aufwand / Besichtigung', features: ['Form- & Rückschnitt', 'Schnittgutentsorgung'] },
    rasenmaehen: { title: 'Rasenmähen', price: 'Nach Fläche / Absprache', features: ['Mähen & Kanten trimmen', 'Grasschnittentsorgung'] },
    beetpflege: { title: 'Beetpflege', price: 'Nach Aufwand', features: ['Unkrautentfernung', 'Boden auflockern'] },
    pflasterreinigung: { title: 'Pflasterreinigung', price: 'Nach Quadratmeter', features: ['Hochdruckreinigung', 'Fugen nachsanden'] },
    muelltonnen: { title: 'Mülltonnen-Reinigung', price: 'Nach Absprache', features: ['Hygienische Reinigung', 'Gründliches Ausspülen'] },
    baumpflege: { title: 'Baumpflege', price: 'Nach Besichtigung', features: ['Totholzbeseitigung', 'Lichtungsschnitt'] },
    laubbeseitigung: { title: 'Laubbeseitigung', price: 'Nach Aufwand', features: ['Rasen & Beete säubern', 'Abtransport & Entsorgung'] },
    winterdienst: { title: 'Winterdienst-Komplettpaket', price: 'Nach Fläche und Einsatzhäufigkeit', features: ['Schneeschippen', 'Streuen bei Glätte', 'Gehwege, Einfahrten & Zugänge'], includes: ['schnee-schippen', 'salz-streuen'] },
    'schnee-schippen': { title: 'Schnee schippen', price: 'Nach Fläche und Aufwand', features: ['Gehwege & Einfahrten freiräumen', 'Räumung nach Bedarf'] },
    'salz-streuen': { title: 'Salz streuen', price: 'Nach Fläche und Aufwand', features: ['Streuen bei Glätte und Frost', 'Zugänge sichern'] },
    'weihnachtsbaum-liefern': { title: 'Weihnachtsbaum liefern', price: 'Nach Größe, Sorte und Liefergebiet', features: ['Lieferung nach Hause', 'Größe & Sorte abstimmen'] },
    'brennholz-liefern': { title: 'Brennholz liefern', price: 'Nach Menge und Liefergebiet', features: ['Lieferung bis vor die Haustür', 'Menge nach Bedarf'] }
  };
  const STORAGE_KEY = 'abecks-auswahl';
  let memorySelection = [];

  const includedBy = key => Object.keys(services).find(pkg => services[pkg].includes?.includes(key));
  // Leistungen, die in einem gewählten Paket stecken, fliegen raus
  const normalize = keys => {
    const valid = [...new Set(keys)].filter(key => services[key]);
    return valid.filter(key => !valid.includes(includedBy(key)));
  };
  const readSelection = () => {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []); } catch { return normalize(memorySelection); }
  };
  const writeSelection = keys => {
    memorySelection = normalize(keys);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memorySelection)); } catch { /* privater Modus */ }
    renderSelection();
  };
  const keyFromLink = link => {
    const query = new URLSearchParams(link.search);
    return query.get('paket') || query.get('leistung');
  };
  const countLabel = n => `${n} ${n === 1 ? 'Leistung' : 'Leistungen'} ausgewählt`;

  // Schwebende Auswahl-Leiste unten (auf allen Seiten außer Kontakt)
  const isContactPage = Boolean(document.getElementById('kontakt-form'));
  let bar = null;
  if (header && !isContactPage) {
    bar = document.createElement('div');
    bar.className = 'selection-bar';
    bar.hidden = true;
    bar.innerHTML = `
      <div class="selection-bar__inner">
        <span class="selection-bar__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>
        <p class="selection-bar__text" aria-live="polite"><strong></strong><span></span></p>
        <button type="button" class="selection-bar__clear">Leeren</button>
        <a class="btn btn--primary btn--sm selection-bar__cta" href="kontakt.html"><span>Anfrage<span class="selection-bar__cta-long"> senden</span></span><span aria-hidden="true">→</span></a>
      </div>`;
    document.body.append(bar);
    bar.querySelector('.selection-bar__clear').addEventListener('click', () => writeSelection([]));
  }

  // Buchungs-Buttons auf der Leistungsseite werden zu Auswahl-Schaltern
  const toggles = isContactPage ? [] : [...document.querySelectorAll('main a[href^="kontakt.html?"]')].filter(link => services[keyFromLink(link)]);
  toggles.forEach(link => {
    const key = keyFromLink(link);
    const isPackage = Boolean(services[key].includes);
    const isArrow = link.classList.contains('link-arrow');
    link.dataset.key = key;
    link.dataset.label = isArrow ? `${services[key].title} hinzufügen` : (isPackage ? 'Paket hinzufügen' : 'Hinzufügen');
    link.dataset.labelActive = isArrow ? `${services[key].title} ausgewählt` : (isPackage ? 'Paket ausgewählt' : 'Ausgewählt');
    link.setAttribute('role', 'button');
    link.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); link.click(); }
    });
    link.addEventListener('click', event => {
      event.preventDefault();
      if (link.getAttribute('aria-disabled') === 'true') return;
      const current = readSelection();
      writeSelection(current.includes(key) ? current.filter(k => k !== key) : [...current, key]);
      if (bar && !bar.hidden) {
        bar.classList.remove('is-bumped');
        void bar.offsetWidth;
        bar.classList.add('is-bumped');
      }
    });
  });

  // Kontaktseite: Auswahlkarte und versteckte Formularfelder
  const selectionCard = document.getElementById('paket-spezifikation');
  const selectionList = document.getElementById('auswahl-liste');
  const selectionTitle = document.getElementById('paket-titel');
  const subjectField = document.getElementById('betreff');
  const serviceField = document.getElementById('leistung-select');
  const formTitle = document.querySelector('.form__title');

  function renderSelection() {
    const selection = readSelection();
    const titles = selection.map(key => services[key].title);

    if (bar) {
      bar.hidden = selection.length === 0;
      document.documentElement.classList.toggle('has-selection', selection.length > 0);
      bar.querySelector('.selection-bar__text strong').textContent = countLabel(selection.length);
      bar.querySelector('.selection-bar__text span').textContent = titles.join(' · ');
      bar.querySelector('.selection-bar__cta').href = `kontakt.html?auswahl=${selection.map(encodeURIComponent).join(',')}`;
    }

    toggles.forEach(link => {
      const key = link.dataset.key;
      const pkg = includedBy(key);
      const isIncluded = Boolean(pkg && selection.includes(pkg));
      const isSelected = selection.includes(key);
      link.classList.toggle('is-selected', isSelected);
      link.classList.toggle('is-included', isIncluded);
      link.setAttribute('aria-pressed', String(isSelected));
      link.setAttribute('aria-disabled', String(isIncluded));
      link.textContent = isIncluded ? `Im ${services[pkg].title} enthalten` : (isSelected ? `✓ ${link.dataset.labelActive}` : link.dataset.label);
      link.closest('.book-card, .package, .feature-row')?.classList.toggle('is-selected', isSelected);
      link.closest('.book-card, .package, .feature-row')?.classList.toggle('is-included', isIncluded);
    });

    if (selectionCard && selectionList) {
      selectionCard.hidden = selection.length === 0;
      if (selectionTitle) selectionTitle.textContent = countLabel(selection.length);
      selectionList.replaceChildren(...selection.map(key => {
        const service = services[key];
        const item = document.createElement('li');
        item.className = 'selection-item';
        item.innerHTML = `
          <div class="selection-item__text">
            <strong></strong>
            <span class="selection-item__price"></span>
            <span class="selection-item__features"></span>
          </div>
          <button type="button" class="selection-item__remove">✕</button>`;
        item.querySelector('strong').textContent = service.title;
        item.querySelector('.selection-item__price').textContent = service.price;
        item.querySelector('.selection-item__features').textContent = service.features.join(' · ');
        const remove = item.querySelector('.selection-item__remove');
        remove.setAttribute('aria-label', `${service.title} entfernen`);
        remove.addEventListener('click', () => writeSelection(readSelection().filter(k => k !== key)));
        return item;
      }));
      if (subjectField) subjectField.value = selection.length ? `Anfrage: ${titles.join(' + ')}` : 'Allgemeine Kontaktanfrage';
      if (serviceField) serviceField.value = selection.length ? titles.join(', ') : 'Allgemeine Anfrage';
      if (formTitle) formTitle.textContent = selection.length ? 'Fast geschafft – Ihre Kontaktdaten' : 'Anfrage senden';
    }
  }

  // Auswahl aus der URL übernehmen (?auswahl=a,b oder alte Links ?paket= / ?leistung=)
  const params = new URLSearchParams(location.search);
  if (params.has('auswahl')) {
    writeSelection(params.get('auswahl').split(',').filter(Boolean));
  } else if (params.get('paket') || params.get('leistung')) {
    writeSelection([...readSelection(), params.get('paket') || params.get('leistung')]);
  } else {
    renderSelection();
  }

  // Auswahl aus anderen Tabs übernehmen
  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) renderSelection(); });

  const form = document.getElementById('kontakt-form');
  const successMessage = document.getElementById('success-message');
  if (form && successMessage) form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('.submit-btn');
    const originalText = button?.textContent || 'Anfrage absenden';
    let errorMessage = document.getElementById('form-error');
    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.id = 'form-error';
      errorMessage.className = 'form-error';
      errorMessage.setAttribute('role', 'alert');
      errorMessage.setAttribute('tabindex', '-1');
      form.prepend(errorMessage);
    }
    errorMessage.hidden = true;
    if (button) { button.textContent = 'Wird gesendet…'; button.disabled = true; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, { method: form.method || 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('send failed');
      writeSelection([]);
      form.style.display = 'none';
      successMessage.style.display = 'block';
      successMessage.setAttribute('tabindex', '-1');
      successMessage.focus();
    } catch {
      errorMessage.textContent = 'Die Nachricht konnte nicht versendet werden. Bitte versuchen Sie es erneut oder nutzen Sie Telefon oder E-Mail.';
      errorMessage.hidden = false;
      errorMessage.focus();
      if (button) { button.textContent = originalText; button.disabled = false; }
    } finally {
      window.clearTimeout(timeout);
    }
  });

  const galleryItems = [...document.querySelectorAll('.gallery__item')];
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox?.showModal) {
    const lightboxImg = lightbox.querySelector('img');
    let currentIndex = 0;
    const show = index => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[currentIndex];
      lightboxImg.src = item.dataset.full;
      lightboxImg.alt = item.querySelector('img')?.alt || '';
    };
    galleryItems.forEach((item, index) => item.addEventListener('click', () => { show(index); lightbox.showModal(); }));
    lightbox.querySelector('.lightbox__prev').addEventListener('click', () => show(currentIndex - 1));
    lightbox.querySelector('.lightbox__next').addEventListener('click', () => show(currentIndex + 1));
    lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(currentIndex - 1);
      if (event.key === 'ArrowRight') show(currentIndex + 1);
    });
    lightbox.addEventListener('close', () => galleryItems[currentIndex].focus());
  }
});
