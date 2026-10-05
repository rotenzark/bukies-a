/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'bukies',
    whatsapp: { number: '', message: '', ids: [] },
    /* orari: NON li sappiamo (cambiano da locale a locale, li annunciano su Instagram): nessuno stato orari nella pagina */
    hours: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    hoursStatusId: 'orarioStatoAssente',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    EN: {
      "m.salta": "Skip to content",
      "m.top": "Bukies: back to the top",
      "m.nav": "Sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.milano": "Milan",
      "n.menu": "The menu",
      "n.storia": "Our story",
      "n.locali": "Locations",
      "n.recensioni": "Reviews",
      "h.occhio": "Burger &amp; Cookies · six places in Italy",
      "h.t1": "Real",
      "h.t2": "American",
      "h.t3": "smashburgers",
      "h.t4": "&amp; cookies",
      "h.frase": "Three burgers, a special that changes almost every month and American cookies. The meat is smashed on the red-hot griddle, just like in New York.",
      "h.b1": "The menu",
      "h.b2": "Our six places",
      "h.annuncio": "Now in Milan too · Via Lecco&nbsp;7 · from 5&nbsp;October",
      "f.titolo": "The smash: the meat pressed on the griddle",
      "f.desc": "The red-hot iron griddle seen from above. A ball of meat drops onto it, the press smashes it flat, the fat sizzles and the edge turns into crispy lace. In the first mode a slice of cheddar melts on top; in the second the onions are smashed into the meat, like our Butter Onion Smash. Then the Bukies mark is stamped on the paper.",
      "f.d0": "Cheese: the ball drops, the press smashes it, the cheddar melts on top.",
      "f.d1": "Butter Onion: the onions end up smashed into the meat. Our tribute to 7th Street Burger.",
      "f.modi": "Pick the smash",
      "mi.occhio": "What’s new · our first place outside Campania",
      "mi.t1": "Milan,",
      "mi.t2": "fired up.",
      "mi.zona": "Porta Venezia · from 5 October 2026",
      "mi.frase": "We chose Porta Venezia, the Chelsea of Milan. In September our smash ended up on a billboard in Times Square, New York, reading “Bukies × Milan”: now the griddle is really on.",
      "mi.maglia": "Make Porta Venezia great again, the line on our T-shirt",
      "mi.b": "Directions to Via Lecco 7",
      "mi.ftimes": "Times Square, September 2026: “Even New York knows”",
      "a.times": "The Times Square billboard: one of our smashburgers dripping with cheddar, the Bukies script, Milan and Piero Armenti’s signature, among the skyscrapers.",
      "c.occhio": "What we do",
      "c.titolo": "Three ingredients are enough to conquer the world",
      "c.intro": "We don’t want an endless menu. We’d rather do a few things and do them really well. Be the best.",
      "c.r1": "The craft bun",
      "c.r1t": "The bun is no detail: soft just right, made to go with the smash without hiding its flavour.",
      "c.r2": "The right meat for the smash",
      "c.r2t": "Our own recipe: the right share of fat, the choice of breeds, cuts and processing. Fresh, delivered every day. The balance between lean and fat gives the crust outside and the juice inside.",
      "c.r3": "The Bukie sauce",
      "c.r3t": "A well-kept secret. And the bacon, crispy and as American as it gets.",
      "c.r4": "Chicken from the thigh",
      "c.r4t": "It stays far more tender and juicy: crispy breading outside, soft and tasty chicken inside.",
      "c.r5": "New York cookies",
      "c.r5t": "Soft and chewy, made to a real New York recipe: big, rich, with that over-the-top American taste we were looking for.",
      "c.fxxl": "The XXL, cut in half",
      "a.xxl": "An XXL cut in half: four layers of smashed meat with melted cheddar inside the bun.",
      "u.occhio": "Our menu",
      "u.titolo": "Three burgers. One special. The cookies.",
      "u.p1": "In four sizes, from a minimum of two to a maximum of five smash patties. Our first love is the Smashburger M; if you’re hungrier there’s the XXL.",
      "u.taglie": "From two to five smash patties",
      "u.p2": "The only non-smash burger you’ll find here: fried chicken thigh, bacon, lettuce, tomato and sweet chili sauce.",
      "u.n3": "The vegan one",
      "u.p3": "The third burger on the menu is the vegan version.",
      "u.n4": "The special",
      "u.p4": "It changes almost every month, so there’s always something new, and sometimes you choose it in the comments. THE BOS – Butter Onion Smash, the Potato Smash, the Pepperoni Smash and the Ultra Cheeseburger have all been here.",
      "u.p5": "The sweet part: our American cookies, irresistible and perfect to end the meal. Big, thick, soft inside.",
      "u.starter": "And before the smash",
      "u.lista": "Nashville mozzarella sticks · chicken tenders for dipping · chicken wings · ribs with ranch sauce · Vertigo fries with cheddar and bacon · sweet potato fries · Porkbelly Bites",
      "u.nota": "The menu can change from place to place and month to month: we announce what’s new on Instagram first.",
      "a.smash": "A smashburger between two black gloves: cheddar and sauce dripping over the smashed meat, with crispy bacon.",
      "a.pollo": "The Chicken Burger between black gloves: fried chicken thigh, lettuce, bacon and sauce.",
      "a.pepperoni": "The Pepperoni Smash between black gloves: double smashed meat, white cheese and pepperoni.",
      "a.cookie": "A dark chocolate cookie broken between two hands; below, the trays of dark cookies and chocolate chip ones.",
      "s.occhio": "Who we are",
      "s.p1": "Jana and Piero Armenti first met ten years ago in New York.",
      "s.p2": "Jana was just a tourist, looking for the authentic flavours of America, while Piero had long been exploring every corner of Manhattan in search of the Big Apple’s unmissable tastes.",
      "s.p3": "For both of them New York was a great school of taste, the perfect place to train the palate to real American flavours.",
      "s.p4": "Then life moved on, and we lost touch.",
      "s.idea": "But in 2024 a beautiful idea was born: “We have to make smashburgers the way they used to be made… and bring them to Italy.”",
      "s.p5": "We were at a friend’s wedding and by the end of the evening the plan was already crystal clear in our heads. And not only that: we decided to add American cookies too, the kind that delight your taste buds with every bite.",
      "s.p6": "A winning pair: smashburgers and cookies.",
      "s.p7": "With one clear ambition: to bring the real American taste all over Italy.",
      "g.occhio": "From the griddle",
      "g.titolo": "With the black gloves",
      "g.f1": "The sauce, poured over the tenders",
      "g.f2": "The wings, on our paper",
      "g.f3": "The fries: sweet, Vertigo and classic",
      "a.patate": "Three Bukies cups of fries: sweet potato fries, Vertigo fries with cheddar and bacon, classic fries; in front, melted cheddar and a sauce topped with chopped bacon.",
      "a.salsa": "Sauce poured over chicken tenders, in the white cup with the Bukies logo.",
      "a.ali": "Glazed chicken wings in the Bukies cup, on the paper with the logo.",
      "l.occhio": "Where we are",
      "l.titolo": "Six griddles on",
      "l.intro": "Aversa came first; you will also find us in Villaricca, Pomigliano d’Arco, the Vomero in Naples and Salerno, opened in July. And from today, in Milan.",
      "l.nuova": "Fired up on 5 October 2026",
      "l.mi": "Porta Venezia. Our first outside Campania.",
      "l.ind": "Directions",
      "l.primo": "The first",
      "l.acceso": "On",
      "l.vomero": "In the Vomero",
      "l.luglio": "On since July",
      "l.orari": "Opening hours vary from place to place and with the seasons: we keep them up to date on Instagram, <a href=\"https://www.instagram.com/bukies_burgercookies/\" target=\"_blank\" rel=\"noopener\">@bukies_burgercookies</a>.",
      "l.mappami": "Map: Bukies, Via Lecco 7, Milan",
      "l.mappaav": "Map: Bukies, Via Antonio Gramsci 62, Aversa",
      "l.mappavi": "Map: Bukies, Corso Europa 462, Villaricca",
      "l.mappapo": "Map: Bukies, Via Giuseppe Mazzini 30, Pomigliano d’Arco",
      "l.mappana": "Map: Bukies, Via Gian Lorenzo Bernini 39, Naples",
      "l.mappasa": "Map: Bukies, Via Torrione 28, Salerno",
      "r.occhio": "Reviews",
      "r.titolo": "What they say about Aversa, the first",
      "r.voto": "on Google, 1,548 reviews · Bukies Aversa",
      "r.g25": "Google, Aversa, 2025",
      "r.g26": "Google, Aversa, 2026",
      "r.nota": "From the Google reviews of Bukies Aversa, as they were written (in Italian); […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "k.titolo": "Come and see us!",
      "k.ig": "Follow us on Instagram",
      "k.mail": "Write to us",
      "p.slogan": "Bukies — Real American Smashburgers and Cookies",
      "p.cred": "Demo site made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · texts and photos from Bukies’ website and Instagram (October 2026), rating and reviews from the Google listing of Bukies Aversa. We drew the griddle ourselves.",
      "p.su": "Back to top",
      "b.menu": "Menu",
      "b.locali": "Places"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FIRMA «Lo smash» (Bukies) ══════════
     La palla di carne cade sulla piastra, la pressa la schiaccia (scintille, bordo a merletto), poi il condimento del modo
     scelto (0 = Cheese, 1 = Butter Onion) e il marchio Bukies timbrato sulla carta. Lo stato finale è l'HTML statico:
     a fine corsa si tolgono gli stili in linea. Reduced-motion: subito lo stato finale. Parte quando la firma entra in vista. */
  var fig = document.getElementById('smash-firma');
  if (fig) {
    var svgF = fig.querySelector('svg');
    var qF = function (s) { return svgF.querySelector(s); };
    var palla = qF('.sm-palla'), pressa = qF('.sm-pressa'), carneF = qF('.sm-carne'), scint = qF('.sm-scintille');
    var formaggio = qF('.sm-formaggio'), cipolle = qF('.sm-cipolle'), marchioF = qF('.sm-marchio'), fumo = qF('.sm-fumo');
    var leggi = document.getElementById('smashLeggi');
    var bottoni = fig.querySelectorAll('.smash__modi button');
    var animati = [palla, pressa, scint, carneF, formaggio, cipolle, marchioF, fumo];
    var tl = null, partita = false;
    var togliAttesa = function () { try { clearTimeout(window.__attesaSmash); } catch (e) {} root.classList.remove('firma-attesa'); };
    var modo = function (m) {
      fig.setAttribute('data-modo', String(m));
      bottoni.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-modo') === String(m) ? 'true' : 'false'); });
    };
    /* GSAP scrive le trasformazioni SVG nell'attributo transform (e data-svg-origin, transform-origin in linea): a fine corsa
       si rimette ogni elemento esattamente com'era nell'HTML statico */
    var originali = animati.map(function (el) { return el ? el.getAttribute('transform') : null; });
    var finale = function () {
      if (tl) { tl.kill(); tl = null; }
      if (hasGsap) gsap.set(animati, { clearProps: 'all' });
      animati.forEach(function (el, i) {
        if (!el) return;
        el.removeAttribute('style');
        el.removeAttribute('data-svg-origin');
        if (originali[i] === null) el.removeAttribute('transform'); else el.setAttribute('transform', originali[i]);
        if (el._gsap) { try { delete el._gsap; } catch (e) { el._gsap = undefined; } }
      });
    };
    var annuncia = function () {
      var d = fig.querySelector('.smash__d[data-m="' + fig.getAttribute('data-modo') + '"]');
      if (leggi && d) leggi.textContent = d.textContent;
    };
    var gioca = function (m) {
      modo(m);
      partita = true;
      if (!hasGsap || reducedMotion) { finale(); togliAttesa(); annuncia(); return; }
      finale();
      gsap.set(carneF, { svgOrigin: '320 214', scale: 0.42, opacity: 0 });
      gsap.set(palla, { opacity: 1, y: -340, svgOrigin: '320 278' });
      gsap.set(pressa, { opacity: 1, y: -440 });
      gsap.set(scint, { opacity: 0, svgOrigin: '320 214', scale: 0.7 });
      gsap.set(fumo, { opacity: 0 });
      gsap.set(formaggio, { opacity: 0, y: -70, svgOrigin: '320 200', scaleY: 0.5 });
      gsap.set(cipolle, { opacity: 0, stroke: '#F6EEDB' });
      gsap.set(marchioF, { opacity: 0, svgOrigin: '441 511', scale: 1.4 });
      togliAttesa();
      tl = gsap.timeline({ onComplete: function () { finale(); annuncia(); } });
      tl.to(palla, { y: 0, duration: 0.5, ease: 'power2.in' })
        .to(palla, { scaleY: 0.84, scaleX: 1.1, duration: 0.08, ease: 'power1.out' })
        .to(palla, { scaleY: 1, scaleX: 1, duration: 0.12 })
        .to(pressa, { y: 0, duration: 0.3, ease: 'power3.in' }, '+=0.1')
        .addLabel('smash')
        .set(palla, { opacity: 0 }, 'smash')
        .to(carneF, { opacity: 1, scale: 1, duration: 0.2, ease: 'power4.out' }, 'smash')
        .to(scint, { opacity: 1, scale: 1.3, duration: 0.25, ease: 'power2.out' }, 'smash')
        .to(scint, { opacity: 0, duration: 0.35 }, 'smash+=0.25')
        .to(pressa, { y: 7, duration: 0.06, yoyo: true, repeat: 1 }, 'smash')
        .to(pressa, { y: -460, opacity: 0, duration: 0.45, ease: 'power2.in' }, 'smash+=0.45')
        .to(fumo, { opacity: 1, duration: 0.8 }, 'smash+=0.2');
      if (m === 0) {
        tl.to(formaggio, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.in' }, 'smash+=0.85')
          .to(formaggio, { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.55)' });
      } else {
        tl.to(cipolle, { opacity: 1, duration: 0.15 }, 'smash')
          .to(cipolle, { stroke: '#E2A94E', duration: 1, ease: 'power1.inOut' }, 'smash+=0.5');
      }
      tl.to(marchioF, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, 'smash+=1.7');
    };
    bottoni.forEach(function (b) {
      b.addEventListener('click', function () { gioca(parseInt(b.getAttribute('data-modo'), 10) || 0); });
    });
    if (!hasGsap || reducedMotion) {
      finale(); togliAttesa();
    } else {
      try { clearTimeout(window.__attesaSmash); } catch (e) {}
      var parti = function () { if (!partita) gioca(0); };
      if ('IntersectionObserver' in window) {
        var ioF = new IntersectionObserver(function (en) {
          en.forEach(function (e) { if (e.isIntersecting) { ioF.disconnect(); parti(); } });
        }, { threshold: 0.3 });
        ioF.observe(svgF);
      } else { parti(); }
      /* guardia: se fra 1,5 s non è partita ed è già in vista, si parte; se non è in vista resta la piastra calda che aspetta */
      setTimeout(function () {
        if (partita) return;
        var r = svgF.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) parti();
      }, 1500);
    }
  }
})();
