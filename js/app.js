import { APP_STORAGE_KEY } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // Helper to safely add event listeners only if the target element exists
  const safeOn = (element, event, handler, options) => {
    const el = typeof element === 'string' ? $(element) : element;
    if (el) {
      el.addEventListener(event, handler, options);
    }
  };

  const KEY = APP_STORAGE_KEY || 'tasbih_pro_app_data';
  const todayKey = () => new Date().toISOString().slice(0, 10);

  const defaults = {
    settings: { theme: 'blue', dark: true, amoled: false, sound: false, vibrate: true, reminder: '' },
    dailyGoal: 1000,
    notes: {},
    achievements: [],
    currentId: 'subhanallah',
    lifetime: 0,
    history: {},
    tasbihs: [
      { id: 'subhanallah', name: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', count: 0, goal: 33, favorite: true },
      { id: 'alhamdulillah', name: 'Alhamdulillah', arabic: 'ٱلْـحَـمْـدُ للهِ', count: 0, goal: 33 },
      { id: 'allahuakbar', name: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', count: 0, goal: 34 },
      { id: 'istighfar', name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', count: 0, goal: 100 }
    ]
  };

  const library = [
    ['SubhanAllah', 'سُبْحَانَ ٱللَّٰهِ', 'Glory be to Allah', '33', 'Remembering Allah brings peace.'],
    ['Alhamdulillah', 'ٱلْـحَـمْـدُ للهِ', 'All praise is due to Allah', '33', 'A reminder of gratitude.'],
    ['Allahu Akbar', 'ٱللَّٰهُ أَكْبَرُ', 'Allah is the Greatest', '34', 'Affirms Allah’s greatness.'],
    ['La ilaha illallah', 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', 'There is no god but Allah', '100', 'The testimony of faith.'],
    ['Astaghfirullah', 'أَسْتَغْفِرُ ٱللَّٰهَ', 'I seek Allah’s forgiveness', '100', 'A dhikr of forgiveness.'],
    ['SubhanAllahi wa bihamdihi', 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ', 'Glory and praise to Allah', '100', 'A beloved daily remembrance.'],
    ['La hawla wa la quwwata illa billah', 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', 'There is no power except through Allah', '100', 'A treasure from Paradise.'],
    ['Allahumma salli ala Muhammad', 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', 'O Allah, send blessings upon Muhammad', '100', 'Send blessings upon the Prophet ﷺ.']
  ];

  // Extra built-ins for the library
  library.push(
    ...[
      ['SubhanAllahil Azeem', 'سُبْحَانَ اللَّهِ الْعَظِيمِ', 'Glory be to Allah, the Magnificent', 33],
      ['Hasbunallahu wa ni’mal wakeel', 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', 'Allah is sufficient for us', 100],
      ['Ya Rahman', 'يَا رَحْمَٰنُ', 'O Most Merciful', 100],
      ['Ya Raheem', 'يَا رَحِيمُ', 'O Most Compassionate', 100],
      ['Ya Kareem', 'يَا كَرِيمُ', 'O Most Generous', 100],
      ['Ya Latif', 'يَا لَطِيفُ', 'O Most Gentle', 100],
      ['Ya Ghaffar', 'يَا غَفَّارُ', 'O Ever-Forgiving', 100],
      ['Ya Malik', 'يَا مَلِكُ', 'O Sovereign', 100],
      ['Ya Salaam', 'يَا سَلَامُ', 'O Source of Peace', 100],
      ['Ya Noor', 'يَا نُورُ', 'O Light', 100],
      ['Ya Hadi', 'يَا هَادِي', 'O Guide', 100],
      ['Ya Wadud', 'يَا وَدُودُ', 'O Most Loving', 100],
      ['Ya Razzaq', 'يَا رَزَّاقُ', 'O Provider', 100],
      ['Rabbighfirli', 'رَبِّ اغْفِرْ لِي', 'My Lord, forgive me', 100],
      ['Rabbana Atina', 'رَبَّنَا آتِنَا', 'Our Lord, give us good', 40],
      ['Inna lillahi', 'إِنَّا لِلَّهِ', 'To Allah we belong', 100],
      ['Bismillah', 'بِسْمِ اللَّهِ', 'In the name of Allah', 100],
      ['Alhamdulillah Rabbil Aalameen', 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'Praise to the Lord of all worlds', 100],
      ['Allahumma inni as’aluka al-afiyah', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ', 'O Allah, grant me well-being', 100],
      ['Rabbi zidni ilma', 'رَبِّ زِدْنِي عِلْمًا', 'My Lord, increase me in knowledge', 100],
      ['La ilaha illa anta', 'لَا إِلَٰهَ إِلَّا أَنْتَ', 'There is no god except You', 100],
      ['Allahumma a’inni ala dhikrika', 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ', 'Help me remember You', 100],
      ['A’udhu billahi minash shaytan', 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ', 'I seek refuge in Allah', 100],
      ['La ilaha illallah wahdahu', 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ', 'None is worthy of worship but Allah alone', 100],
      ['Allahumma barik ala Muhammad', 'اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ', 'Bless Muhammad', 100],
      ['Subhanal Malikil Quddus', 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ', 'Glory to the Holy King', 33],
      ['Ya Hayyu Ya Qayyum', 'يَا حَيُّ يَا قَيُّومُ', 'O Ever-Living, Sustainer', 100],
      ['Allah Akbar Kabira', 'اللَّهُ أَكْبَرُ كَبِيرًا', 'Allah is greatly the Greatest', 100],
      ['Ya Muqallibal Quloob', 'يَا مُقَلِّبَ الْقُلُوبِ', 'O Turner of hearts', 100],
      ['Rabbi inni lima anzalta', 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ', 'My Lord, I am in need of Your good', 100],
      ['Allahumma innaka Afuwwun', 'اللَّهُمَّ إِنَّكَ عَفُوٌّ', 'O Allah, You are Pardoning', 100],
      ['Ya Dhal Jalali wal Ikram', 'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', 'O Possessor of Majesty and Honour', 100],
      ['La ilaha illallah al-Malik', 'لَا إِلَٰهَ إِلَّا اللَّهُ الْمَلِكُ', 'None is worthy except Allah, the King', 100],
      ['Ya Shafi', 'يَا شَافِي', 'O Healer', 100],
      ['Ya Tawwab', 'يَا تَوَّابُ', 'O Accepter of repentance', 100],
      ['Ya Hafeez', 'يَا حَفِيظُ', 'O Protector', 100],
      ['Ya Fattah', 'يَا فَتَّاحُ', 'O Opener', 100]
    ].map(([name, arabic, meaning, goal]) => [
      name,
      arabic,
      meaning,
      String(goal),
      'A beneficial remembrance for daily practice.'
    ])
  );

  let state, session = 0, lastTouchX = null, wakeLock = null;

  const clone = obj => JSON.parse(JSON.stringify(obj));

  const read = () => {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? JSON.parse(stored) : clone(defaults);
    } catch {
      return clone(defaults);
    }
  };

  function storeHistory() {
    if (!('indexedDB' in window)) return;
    try {
      const request = indexedDB.open('TasbihProHistory', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('days')) {
          db.createObjectStore('days', { keyPath: 'date' });
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('days', 'readwrite');
        const store = tx.objectStore('days');
        if (state.history) {
          Object.entries(state.history).forEach(([date, value]) => {
            store.put({ date, ...value });
          });
        }
        tx.oncomplete = () => db.close();
      };
    } catch (e) {
      console.warn('IndexedDB error:', e);
    }
  }

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storeHistory();
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const current = () => state.tasbihs.find(t => t.id === state.currentId) || state.tasbihs[0];
  const daily = () => Object.values(state.history[todayKey()]?.items || {}).reduce((a, b) => a + b, 0);
  const fmt = n => Number(n || 0).toLocaleString();
  const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function applySettings() {
    const s = state.settings || defaults.settings;
    document.body.className = `${s.dark ? 'dark' : ''} ${s.amoled ? 'amoled' : ''} ${
      s.theme === 'teal' ? 'teal-theme' : s.theme === 'green' ? 'green-theme' : s.theme === 'black' ? 'black-theme' : ''
    }`.trim();

    const darkModeEl = $('#darkMode');
    if (darkModeEl) darkModeEl.checked = !!s.dark;

    const amoledModeEl = $('#amoledMode');
    if (amoledModeEl) amoledModeEl.checked = !!s.amoled;

    const soundSettingEl = $('#soundSetting');
    if (soundSettingEl) soundSettingEl.checked = !!s.sound;

    const vibrateSettingEl = $('#vibrateSetting');
    if (vibrateSettingEl) vibrateSettingEl.checked = !!s.vibrate;

    $$('#themeChoices button').forEach(b => b.classList.toggle('active', b.dataset.theme === s.theme));
  }

  function renderHome() {
    const t = current();
    if (!t) return;

    const g = Number(t.goal) || 0;
    const p = g ? Math.min(100, (t.count / g) * 100) : 0;
    const dGoal = Number(state.dailyGoal) || 1000;
    const dCount = daily();
    const d = Math.min(100, (dCount / dGoal) * 100);

    if ($('#currentName')) $('#currentName').textContent = t.name;
    if ($('#arabic')) $('#arabic').textContent = t.arabic || '';
    if ($('#count')) $('#count').textContent = String(t.count).padStart(6, '0');
    if ($('#todayCount')) $('#todayCount').textContent = fmt(dCount);
    if ($('#sessionCount')) $('#sessionCount').textContent = fmt(session);
    if ($('#lifetimeCount')) $('#lifetimeCount').textContent = fmt(state.lifetime);
    if ($('#goalText')) $('#goalText').textContent = g ? `${fmt(t.count)} of ${fmt(g)}` : 'No goal set';
    if ($('#progressRing')) $('#progressRing').style.setProperty('--p', p);
    if ($('#dailyGoalLabel')) $('#dailyGoalLabel').textContent = `${fmt(dCount)} / ${fmt(dGoal)}`;
    if ($('#dailyGoalBar')) $('#dailyGoalBar').style.width = d + '%';
  }

  function renderLibrary(filter = '') {
    const libEl = $('#libraryList');
    if (!libEl) return;
    const f = filter.toLowerCase();
    const filtered = library.filter(x => x.join(' ').toLowerCase().includes(f));

    libEl.innerHTML =
      filtered
        .map(
          (x, i) => `<article class="library-item">
        <header><b>${escape(x[0])}</b><button class="star" data-fav="${i}">♡</button></header>
        <div class="lib-arabic">${escape(x[1])}</div>
        <p>${escape(x[2])}</p>
        <p>${escape(x[4])}</p>
        <footer><span>Target ${escape(x[3])}</span><button data-use="${i}">Use this dhikr</button></footer>
      </article>`
        )
        .join('') || '<div class="history-empty">No dhikr found.</div>';
  }

  function renderTasbihs() {
    const tasbihListEl = $('#tasbihList');
    const t = current();
    if (tasbihListEl) {
      tasbihListEl.innerHTML = state.tasbihs
        .map(
          x => `<div class="tasbih-item" data-id="${x.id}">
          <div class="circle">☾</div>
          <div class="name">${escape(x.name)}<div class="sub">${x.goal ? `Goal ${fmt(x.goal)}` : 'No goal'}</div></div>
          <div class="num">${fmt(x.count)}</div>
          <button class="star" aria-label="Favourite">${x.favorite ? '★' : '☆'}</button>
          <button class="choose">${x.id === t.id ? '✓' : '›'}</button>
        </div>`
        )
        .join('');
    }

    const presetListEl = $('#presetList');
    if (presetListEl) {
      const presets = [
        ['Morning Adhkar', 'SubhanAllah ×33'],
        ['After Salah', '33 · 33 · 34'],
        ['Darood', 'Allahumma Salli Ala Muhammad'],
        ['Kalima', 'La ilaha illallah'],
        ['Tahleel', 'La ilaha illallah wahdahu…'],
        ['Tasbih Fatima', '33 · 33 · 34']
      ];
      presetListEl.innerHTML = presets
        .map(p => `<button class="preset" data-name="${escape(p[0])}"><b>${escape(p[0])}</b><span>${escape(p[1])}</span></button>`)
        .join('');
    }
  }

  function renderHistory() {
    const historyListEl = $('#historyList');
    if (!historyListEl) return;

    const entries = Object.entries(state.history || {}).sort((a, b) => b[0].localeCompare(a[0]));
    historyListEl.innerHTML = entries.length
      ? entries
          .map(([date, v]) => {
            const total = Object.values(v.items || {}).reduce((a, b) => a + b, 0);
            return `<article class="history-card">
          <div class="date-total">
            <h3>${new Date(date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
            <b>${fmt(total)}</b>
          </div>
          ${Object.entries(v.items || {})
            .map(
              ([id, n]) =>
                `<div class="history-row"><span>${escape(state.tasbihs.find(t => t.id === id)?.name || 'Tasbih')}</span><b>${fmt(n)}</b></div>`
            )
            .join('')}
        </article>`;
          })
          .join('')
      : '<div class="history-empty">Your daily remembrance will appear here.<br>Start with one gentle tap.</div>';
  }

  function renderStats() {
    const statGridEl = $('#statGrid');
    const barChartEl = $('#barChart');
    if (!statGridEl && !barChartEl) return;

    const days = Object.entries(state.history || {}).sort((a, b) => a[0].localeCompare(b[0]));
    const totals = days.map(([d, v]) => [d, Object.values(v.items || {}).reduce((a, b) => a + b, 0)]);
    const values = totals.map(x => x[1]);
    const high = Math.max(0, ...values);
    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;

    let streak = 0;
    for (let d = new Date(); ; d.setDate(d.getDate() - 1)) {
      let k = d.toISOString().slice(0, 10);
      if (state.history[k] && Object.values(state.history[k].items || {}).reduce((a, b) => a + b, 0) > 0) {
        streak++;
      } else {
        break;
      }
    }

    const favorite = state.tasbihs.find(t => t.favorite)?.name || 'None';

    if (statGridEl) {
      statGridEl.innerHTML = [
        ['Total zikr', fmt(state.lifetime)],
        ['Longest streak', `${streak} days`],
        ['Highest day', fmt(high)],
        ['Daily average', fmt(avg)],
        ['Favourite', favorite]
      ]
        .map(([a, b]) => `<article><span>${escape(a)}</span><strong>${escape(b)}</strong></article>`)
        .join('');
    }

    if (barChartEl) {
      const recent = totals.slice(-7);
      const max = Math.max(1, ...recent.map(x => x[1]));
      barChartEl.innerHTML = recent.length
        ? recent
            .map(
              ([d, n]) =>
                `<div class="bar"><i style="height:${Math.max(3, (n / max) * 100)}%"></i><span>${new Date(
                  d + 'T00:00:00'
                ).toLocaleDateString(undefined, { weekday: 'narrow' })}</span></div>`
            )
            .join('')
        : '<p class="history-empty">Seven days of progress will bloom here.</p>';
    }
  }

  function render() {
    state.settings = state.settings || clone(defaults.settings);
    state.dailyGoal = state.dailyGoal || 1000;
    state.notes = state.notes || {};
    state.achievements = state.achievements || [];

    applySettings();
    renderHome();
    renderTasbihs();
    renderHistory();
    renderStats();
    renderLibrary($('#librarySearch')?.value || '');
  }

  function tap(ev) {
    const t = current();
    if (!t) return;

    t.count++;
    state.lifetime++;
    session++;

    const day = todayKey();
    state.history[day] = state.history[day] || { items: {} };
    state.history[day].items[t.id] = (state.history[day].items[t.id] || 0) + 1;

    if (state.lifetime >= 100 && !state.achievements.includes('First 100')) state.achievements.push('First 100');
    if (state.lifetime >= 1000 && !state.achievements.includes('First 1000')) state.achievements.push('First 1000');
    if (state.lifetime >= 10000 && !state.achievements.includes('10,000 Dhikr')) state.achievements.push('10,000 Dhikr');

    save();
    renderHome();

    const n = $('#count');
    if (n) {
      n.classList.remove('bump');
      void n.offsetWidth;
      n.classList.add('bump');
    }

    const b = $('#countButton');
    if (b) {
      const r = b.getBoundingClientRect();
      const x = (ev?.clientX || r.left + r.width / 2) - r.left;
      const y = (ev?.clientY || r.top + r.height / 2) - r.top;
      b.style.setProperty('--x', x + 'px');
      b.style.setProperty('--y', y + 'px');
      b.classList.remove('ripple');
      void b.offsetWidth;
      b.classList.add('ripple');
    }

    if (state.settings.vibrate && navigator.vibrate) {
      try { navigator.vibrate(12); } catch {}
    }
    if (state.settings.sound) {
      beep();
    }
    if (t.goal && t.count === t.goal) {
      setTimeout(() => message('Alhamdulillah!', 'Target completed. May this remembrance bring peace to your heart.'), 150);
    }
  }

  function beep() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const c = new AudioCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 530;
      g.gain.setValueAtTime(0.04, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07);
      o.start();
      o.stop(c.currentTime + 0.07);
    } catch {}
  }

  function modal(html) {
    const modalEl = $('#modal');
    const modalContent = $('#modalContent');
    if (modalEl && modalContent) {
      modalContent.innerHTML = html;
      if (typeof modalEl.showModal === 'function') {
        modalEl.showModal();
      } else {
        modalEl.setAttribute('open', 'true');
      }
    }
  }

  function closeModal() {
    const modalEl = $('#modal');
    if (modalEl) {
      if (typeof modalEl.close === 'function') {
        modalEl.close();
      } else {
        modalEl.removeAttribute('open');
      }
    }
  }

  function message(title, body) {
    modal(`<div class="modal-body">
      <h2>${escape(title)}</h2>
      <p>${escape(body)}</p>
      <div class="modal-actions">
        <button value="cancel" class="primary" data-action="close">Wonderful</button>
      </div>
    </div>`);
  }

  function choose(id) {
    state.currentId = id;
    save();
    show('home');
  }

  function show(v) {
    $$('.view').forEach(x => x.classList.toggle('active', x.id === v));
    $$('[data-view]').forEach(x => x.classList.toggle('active', x.dataset.view === v));
    $('#drawer')?.classList.remove('open');
    $('#backdrop')?.classList.remove('show');
    render();
    window.scrollTo(0, 0);
  }

  function makeCustom(name, goal = 0, arabic = '', translation = '', notes = '') {
    const id = 'custom-' + Date.now();
    state.tasbihs.push({ id, name, arabic, count: 0, goal: Number(goal) || 0, translation, notes });
    state.currentId = id;
    save();
    show('home');
  }

  // --- Initializing State & Render ---
  state = read();
  render();

  // --- Event Bindings with Safe Checks ---
  safeOn('#countButton', 'click', tap);

  safeOn('#menuBtn', 'click', () => {
    $('#drawer')?.classList.add('open');
    $('#backdrop')?.classList.add('show');
  });

  const closeDrawer = () => {
    $('#drawer')?.classList.remove('open');
    $('#backdrop')?.classList.remove('show');
  };
  safeOn('#closeDrawer', 'click', closeDrawer);
  safeOn('#backdrop', 'click', closeDrawer);

  $$('[data-view]').forEach(b => safeOn(b, 'click', () => show(b.dataset.view)));

  safeOn('#resetCurrent', 'click', () =>
    modal(`<div class="modal-body">
      <h2>Reset ${escape(current().name)}?</h2>
      <p>This resets only this tasbih counter.</p>
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="confirmReset" value="default" class="primary">Reset</button>
      </div>
    </div>`)
  );

  safeOn('#goalBtn', 'click', () =>
    modal(`<div class="modal-body">
      <h2>Set a goal</h2>
      <label>Goal for ${escape(current().name)}</label>
      <input id="goalInput" type="number" min="1" value="${current().goal || ''}" placeholder="e.g. 100">
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="saveGoal" value="default" class="primary">Save goal</button>
      </div>
    </div>`)
  );

  safeOn('#tasbihPicker', 'click', () => show('tasbihs'));

  safeOn('#tasbihList', 'click', e => {
    const row = e.target.closest('.tasbih-item');
    if (!row) return;
    let item = state.tasbihs.find(x => x.id === row.dataset.id);
    if (!item) return;
    if (e.target.closest('.star')) {
      item.favorite = !item.favorite;
      save();
      renderTasbihs();
    } else {
      choose(item.id);
    }
  });

  safeOn('#presetList', 'click', e => {
    const b = e.target.closest('.preset');
    if (b) makeCustom(b.dataset.name, 100);
  });

  safeOn('#addTasbih', 'click', () =>
    modal(`<div class="modal-body">
      <h2>New Tasbih</h2>
      <label>Name</label>
      <input id="newName" maxlength="40" placeholder="Morning Dhikr" required>
      <label>Arabic (optional)</label>
      <input id="newArabic" placeholder="Arabic text">
      <label>Translation (optional)</label>
      <input id="newTranslation" placeholder="Meaning">
      <label>Target count</label>
      <input id="newGoal" type="number" min="1" placeholder="e.g. 100">
      <label>Notes (optional)</label>
      <textarea id="newNotes" rows="2" placeholder="Personal note"></textarea>
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="saveCustom" value="default" class="primary">Save</button>
      </div>
    </div>`)
  );

  safeOn('#librarySearch', 'input', e => renderLibrary(e.target.value));

  safeOn('#libraryList', 'click', e => {
    const use = e.target.closest('[data-use]');
    if (!use) return;
    const l = library[use.dataset.use];
    if (!l) return;
    let existing = state.tasbihs.find(t => t.name === l[0]);
    if (!existing) {
      existing = {
        id: 'library-' + Date.now(),
        name: l[0],
        arabic: l[1],
        count: 0,
        goal: Number(l[3]),
        translation: l[2],
        benefit: l[4]
      };
      state.tasbihs.push(existing);
    }
    state.currentId = existing.id;
    save();
    show('home');
  });

  const openDailyGoalModal = () =>
    modal(`<div class="modal-body">
      <h2>Daily goal</h2>
      <label>Today’s target</label>
      <input id="dailyGoalInput" type="number" min="1" value="${state.dailyGoal}">
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="saveDailyGoal" value="default" class="primary">Save</button>
      </div>
    </div>`);

  safeOn('#dailyGoalBtn', 'click', openDailyGoalModal);
  safeOn('#dailyGoalLabel', 'click', openDailyGoalModal);

  safeOn('#noteBtn', 'click', () =>
    modal(`<div class="modal-body">
      <h2>Today’s note</h2>
      <label>A private reflection</label>
      <textarea id="noteInput" rows="4" placeholder="Today completed after Fajr…">${escape(state.notes[todayKey()] || '')}</textarea>
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="saveNote" value="default" class="primary">Save note</button>
      </div>
    </div>`)
  );

  safeOn('#fingerModeBtn', 'click', async () => {
    const overlay = document.createElement('div');
    overlay.className = 'finger-overlay';
    overlay.innerHTML = `<button aria-label="Exit finger mode">×</button>
      <div class="finger-count">${String(current().count).padStart(6, '0')}</div>
      <div class="finger-name">${escape(current().name)}</div>
      <p>Tap anywhere to count</p>`;
    document.body.append(overlay);

    try {
      if (navigator.wakeLock?.request) {
        wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch {}

    overlay.addEventListener('click', e => {
      if (e.target.closest('button')) {
        wakeLock?.release?.();
        overlay.remove();
        return;
      }
      tap(e);
      const fc = overlay.querySelector('.finger-count');
      if (fc) fc.textContent = String(current().count).padStart(6, '0');
    });
  });

  safeOn('#reminderBtn', 'click', async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch {}
    }
    modal(`<div class="modal-body">
      <h2>Daily reminder</h2>
      <label>Time (opens while the app is running)</label>
      <input id="reminderInput" type="time" value="${state.settings.reminder || ''}">
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="saveReminder" value="default" class="primary">Save</button>
      </div>
    </div>`);
  });

  setInterval(() => {
    if (
      state?.settings?.reminder &&
      new Date().toTimeString().slice(0, 5) === state.settings.reminder &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      new Notification('Tasbih Pro', { body: 'Remember Allah today.' });
    }
  }, 60000);

  // Settings Event Handlers
  safeOn('#darkMode', 'change', e => {
    state.settings.dark = e.target.checked;
    save();
    applySettings();
  });

  safeOn('#amoledMode', 'change', e => {
    state.settings.amoled = e.target.checked;
    save();
    applySettings();
  });

  safeOn('#soundSetting', 'change', e => {
    state.settings.sound = e.target.checked;
    save();
  });

  safeOn('#vibrateSetting', 'change', e => {
    state.settings.vibrate = e.target.checked;
    save();
  });

  safeOn('#soundBtn', 'click', () => {
    const s = $('#soundSetting');
    if (s) {
      s.click();
    }
  });

  safeOn('#themeChoices', 'click', e => {
    let b = e.target.closest('button');
    if (b) {
      state.settings.theme = b.dataset.theme;
      save();
      applySettings();
    }
  });

  // Export / Import / Reset All
  safeOn('#exportBtn', 'click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
    a.download = `tasbih-pro-backup-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  safeOn('#importInput', 'change', e => {
    let f = e.target.files?.[0];
    if (!f) return;
    let r = new FileReader();
    r.onload = () => {
      try {
        let x = JSON.parse(r.result);
        if (!x || !x.tasbihs) throw new Error('Invalid backup file structure');
        state = x;
        save();
        render();
        message('Backup restored', 'Your Tasbih Pro data is safely restored.');
      } catch {
        message('Could not restore', 'Please choose a valid Tasbih Pro backup file.');
      }
    };
    r.readAsText(f);
  });

  safeOn('#resetAll', 'click', () =>
    modal(`<div class="modal-body">
      <h2>Reset everything?</h2>
      <p>This permanently removes all tasbihs, history, and settings from this device.</p>
      <div class="modal-actions">
        <button value="cancel" class="secondary" data-action="close">Cancel</button>
        <button id="confirmAll" value="default" class="primary">Reset all</button>
      </div>
    </div>`)
  );

  // Reusable Single Event Listener for Dialog/Modal Actions
  safeOn('#modal', 'click', e => {
    const target = e.target;
    if (target.dataset.action === 'close') {
      closeModal();
      return;
    }

    switch (target.id) {
      case 'confirmReset':
        current().count = 0;
        save();
        render();
        closeModal();
        break;

      case 'saveGoal': {
        const goalInput = $('#goalInput');
        if (goalInput) {
          current().goal = Number(goalInput.value) || 0;
          save();
          render();
        }
        closeModal();
        break;
      }

      case 'saveCustom': {
        const newName = $('#newName')?.value.trim();
        if (newName) {
          makeCustom(
            newName,
            $('#newGoal')?.value,
            $('#newArabic')?.value,
            $('#newTranslation')?.value,
            $('#newNotes')?.value
          );
        }
        closeModal();
        break;
      }

      case 'saveDailyGoal': {
        const dailyInput = $('#dailyGoalInput');
        if (dailyInput) {
          state.dailyGoal = Number(dailyInput.value) || 1000;
          save();
          renderHome();
        }
        closeModal();
        break;
      }

      case 'saveNote': {
        const noteInput = $('#noteInput');
        if (noteInput) {
          state.notes[todayKey()] = noteInput.value.trim();
          save();
          closeModal();
          message('Note saved', 'Your reflection stays privately on this device.');
        }
        break;
      }

      case 'saveReminder': {
        const reminderInput = $('#reminderInput');
        if (reminderInput) {
          state.settings.reminder = reminderInput.value;
          save();
          closeModal();
          message('Reminder saved', 'Keep Tasbih Pro open at the selected time to receive a gentle reminder.');
        }
        break;
      }

      case 'confirmAll':
        state = clone(defaults);
        save();
        render();
        closeModal();
        break;
    }
  });

  // Swipe Gestures on Counter Button
  safeOn(
    '#countButton',
    'touchstart',
    e => {
      if (e.touches && e.touches[0]) {
        lastTouchX = e.touches[0].clientX;
      }
    },
    { passive: true }
  );

  safeOn(
    '#countButton',
    'touchend',
    e => {
      if (lastTouchX === null) return;
      if (e.changedTouches && e.changedTouches[0]) {
        let d = e.changedTouches[0].clientX - lastTouchX;
        if (Math.abs(d) > 50) {
          let i = state.tasbihs.findIndex(t => t.id === state.currentId);
          i = (i + (d < 0 ? 1 : -1) + state.tasbihs.length) % state.tasbihs.length;
          choose(state.tasbihs[i].id);
        }
      }
      lastTouchX = null;
    },
    { passive: true }
  );

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  }
});
