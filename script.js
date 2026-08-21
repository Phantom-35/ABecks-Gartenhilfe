document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const navUl = document.querySelector('nav ul');

    if (burgerBtn && navUl) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('open');
            navUl.classList.toggle('active');
        });

        // Schließt das Menü automatisch, wenn ein Link angeklickt wird
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('open');
                navUl.classList.remove('active');
            });
        });
    }
});










// ==========================================
// DYNAMISCHE AUSWAHL-ERKENNUNG (Pakete & Einzelleistungen)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('paket') || urlParams.get('leistung');

  // Konfiguration für Pakete und Einzelleistungen
  const leistungenData = {
    'allround': {
      badge: 'Deine Paket-Auswahl',
      titel: 'Allround-Gartenpaket',
      preis: 'Festpreis / Nach Besichtigung',
      features: [
        'Rasenmähen & Kanten pflegen',
        'Hecken- & Strauchschnitt',
        'Unkraut- & Beetpflege',
        'Stein- & Gehwegreinigung',
        'Fachgerechte Grünabfallentsorgung'
      ]
    },
    'heckenschnitt': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Heckenschnitt',
      preis: 'Nach Aufwand / Besichtigung',
      features: [
        'Form- & Rückschnitt von Hecken & Sträuchern',
        'Fachgerechte Schnittgutentsorgung'
      ]
    },
    'rasenmaehen': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Rasenmähen',
      preis: 'Nach Fläche / Absprache',
      features: [
        'Präzises Mähen & Kanten trimmen',
        'Saubere Halmentsorgung'
      ]
    },
    'beetpflege': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Beetpflege',
      preis: 'Nach Aufwand',
      features: [
        'Gründliche Unkrautentfernung',
        'Boden auflockern & säubern'
      ]
    },
    'pflasterreinigung': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Pflasterreinigung',
      preis: 'Nach Quadratmeter',
      features: [
        'Effektive Hochdruckreinigung',
        'Fugenreinigung & Nachsanden'
      ]
    },
    'baumpflege': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Baumpflege',
      preis: 'Nach Besichtigung',
      features: [
        'Totholzbeseitigung',
        'Fachgerechter Lichtungsschnitt'
      ]
    },
    'laubbeseitigung': {
      badge: 'Deine Leistungsauswahl',
      titel: 'Laubbeseitigung',
      preis: 'Nach Aufwand',
      features: [
        'Rasen- & Beetflächen säubern',
        'Abtransport & Entsorgung'
      ]
    }
  };

  if (key && leistungenData[key]) {
    const data = leistungenData[key];

    const paketCard = document.getElementById('paket-spezifikation');
    const paketBadge = paketCard ? paketCard.querySelector('.paket-badge') : null;
    const paketTitel = document.getElementById('paket-titel');
    const paketPreis = document.getElementById('paket-preis');
    const paketFeatures = document.getElementById('paket-features');
    const betreffInput = document.getElementById('betreff');
    const hiddenSelect = document.getElementById('leistung-select');

    // 1. Box einblenden
    if (paketCard) paketCard.style.display = 'block';

    // 2. Texte anpassen
    if (paketBadge) paketBadge.textContent = data.badge;
    if (paketTitel) paketTitel.textContent = data.titel;
    if (paketPreis) paketPreis.textContent = data.preis;
    if (betreffInput) betreffInput.value = `Anfrage: ${data.titel}`;
    if (hiddenSelect) hiddenSelect.value = key;

    // 3. Stichpunkte dynamisch generieren
    if (paketFeatures && data.features) {
      paketFeatures.innerHTML = data.features
        .map(item => `<li><span class="check-icon">✓</span> ${item}</li>`)
        .join('');
    }
  }
});