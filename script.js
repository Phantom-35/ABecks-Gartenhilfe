document.addEventListener('DOMContentLoaded', () => {
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

  const data = {
    allround: ['Ihre Paketauswahl', 'Allround-Gartenpaket', 'Festpreis / Nach Besichtigung', ['Rasenmähen & Kanten pflegen', 'Hecken- & Strauchschnitt', 'Unkraut- & Beetpflege', 'Stein- & Gehwegreinigung', 'Fachgerechte Grünabfallentsorgung']],
    heckenschnitt: ['Ihre Leistungsauswahl', 'Heckenschnitt', 'Nach Aufwand / Besichtigung', ['Form- & Rückschnitt von Hecken & Sträuchern', 'Fachgerechte Schnittgutentsorgung']],
    rasenmaehen: ['Ihre Leistungsauswahl', 'Rasenmähen', 'Nach Fläche / Absprache', ['Präzises Mähen & Kanten trimmen', 'Saubere Grasschnittentsorgung']],
    beetpflege: ['Ihre Leistungsauswahl', 'Beetpflege', 'Nach Aufwand', ['Gründliche Unkrautentfernung', 'Boden auflockern & säubern']],
    pflasterreinigung: ['Ihre Leistungsauswahl', 'Pflasterreinigung', 'Nach Quadratmeter', ['Effektive Hochdruckreinigung', 'Fugenreinigung & Nachsanden']],
    baumpflege: ['Ihre Leistungsauswahl', 'Baumpflege', 'Nach Besichtigung', ['Totholzbeseitigung', 'Fachgerechter Lichtungsschnitt']],
    laubbeseitigung: ['Ihre Leistungsauswahl', 'Laubbeseitigung', 'Nach Aufwand', ['Rasen- & Beetflächen säubern', 'Abtransport & Entsorgung']]
  };
  const params = new URLSearchParams(location.search);
  const selected = data[params.get('paket')] || data[params.get('leistung')];
  if (selected) {
    const [badgeText, titleText, priceText, featureTexts] = selected;
    document.getElementById('paket-spezifikation')?.style.setProperty('display', 'block');
    const badge = document.querySelector('#paket-spezifikation .paket-badge');
    const title = document.getElementById('paket-titel');
    const price = document.getElementById('paket-preis');
    const subject = document.getElementById('betreff');
    const select = document.getElementById('leistung-select');
    const features = document.getElementById('paket-features');
    if (badge) badge.textContent = badgeText;
    if (title) title.textContent = titleText;
    if (price) price.textContent = priceText;
    if (subject) subject.value = `Anfrage: ${titleText}`;
    if (select) select.value = titleText;
    if (features) features.replaceChildren(...featureTexts.map(text => { const li = document.createElement('li'); li.textContent = `✓ ${text}`; return li; }));
    const overview = document.getElementById('buchung-ueberblick');
    const overviewText = document.getElementById('gewaehlte-leistung-text');
    if (overview && overviewText) { overviewText.textContent = titleText; overview.style.display = 'block'; }
  }

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

  const slides = [...document.querySelectorAll('.slide')];
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  if (slides.length > 1 && prevBtn && nextBtn) {
    let currentIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    const status = document.querySelector('.slider-status');
    const updateSlider = () => {
      slides.forEach(slide => slide.classList.remove('active', 'prev', 'next'));
      slides[currentIndex].classList.add('active');
      slides[(currentIndex - 1 + slides.length) % slides.length].classList.add('prev');
      slides[(currentIndex + 1) % slides.length].classList.add('next');
      slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== currentIndex)));
      if (status) status.textContent = `Bild ${currentIndex + 1} von ${slides.length}: ${slides[currentIndex].alt}`;
    };
    prevBtn.type = 'button'; nextBtn.type = 'button';
    prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateSlider(); });
    nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % slides.length; updateSlider(); });
    updateSlider();
  }
});
