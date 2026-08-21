document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burgerBtn');
  const navUl = document.querySelector('header nav ul');

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
    allround: ['Deine Paket-Auswahl', 'Allround-Gartenpaket', 'Festpreis / Nach Besichtigung', ['Rasenmähen & Kanten pflegen', 'Hecken- & Strauchschnitt', 'Unkraut- & Beetpflege', 'Stein- & Gehwegreinigung', 'Fachgerechte Grünabfallentsorgung']],
    heckenschnitt: ['Deine Leistungsauswahl', 'Heckenschnitt', 'Nach Aufwand / Besichtigung', ['Form- & Rückschnitt von Hecken & Sträuchern', 'Fachgerechte Schnittgutentsorgung']],
    rasenmaehen: ['Deine Leistungsauswahl', 'Rasenmähen', 'Nach Fläche / Absprache', ['Präzises Mähen & Kanten trimmen', 'Saubere Grasschnittentsorgung']],
    beetpflege: ['Deine Leistungsauswahl', 'Beetpflege', 'Nach Aufwand', ['Gründliche Unkrautentfernung', 'Boden auflockern & säubern']],
    pflasterreinigung: ['Deine Leistungsauswahl', 'Pflasterreinigung', 'Nach Quadratmeter', ['Effektive Hochdruckreinigung', 'Fugenreinigung & Nachsanden']],
    baumpflege: ['Deine Leistungsauswahl', 'Baumpflege', 'Nach Besichtigung', ['Totholzbeseitigung', 'Fachgerechter Lichtungsschnitt']],
    laubbeseitigung: ['Deine Leistungsauswahl', 'Laubbeseitigung', 'Nach Aufwand', ['Rasen- & Beetflächen säubern', 'Abtransport & Entsorgung']]
  };
  const params = new URLSearchParams(location.search);
  const selected = data[params.get('paket') || params.get('leistung')];
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
    if (button) { button.textContent = 'Wird gesendet…'; button.disabled = true; }
    try {
      const response = await fetch(form.action, { method: form.method || 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('send failed');
      form.style.display = 'none';
      successMessage.style.display = 'block';
    } catch {
      alert('Die Nachricht konnte nicht versendet werden. Bitte versuchen Sie es erneut.');
      if (button) { button.textContent = originalText; button.disabled = false; }
    }
  });

  const slides = [...document.querySelectorAll('.slide')];
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  if (slides.length > 1 && prevBtn && nextBtn) {
    let currentIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    const updateSlider = () => {
      slides.forEach(slide => slide.classList.remove('active', 'prev', 'next'));
      slides[currentIndex].classList.add('active');
      slides[(currentIndex - 1 + slides.length) % slides.length].classList.add('prev');
      slides[(currentIndex + 1) % slides.length].classList.add('next');
    };
    prevBtn.type = 'button'; nextBtn.type = 'button';
    prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateSlider(); });
    nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % slides.length; updateSlider(); });
    updateSlider();
  }
});
