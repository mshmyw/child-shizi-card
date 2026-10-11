/* ============================================================================
   识字卡片 · 游戏逻辑
   ----------------------------------------------------------------------------
   依赖 data/cards.js 暴露的 window.HANZI_CARDS（DATA / CATS / motionOf）。
   刻意用普通 script 而不是 ES module：这样双击 index.html（file://）也能直接玩。
   ============================================================================ */

(function () {
  'use strict';

  const { DATA, CATS, motionOf } = window.HANZI_CARDS;


  /* =======================================================================
     游戏逻辑
     ======================================================================= */
  const $ = id => document.getElementById(id);
  const card = $('card');
  const swipeEl = $('swipe');   // 专门负责横向位移/透明度的外层
  const elBig = $('big'), elWords = $('words');
  const elPic = $('picbox'), elExplain = $('explain'), elBackChar = $('backchar');
  const toast = $('toast');

  let filter = '全部';
  let customOrder = false;             // 是否处于「字表顺序」浏览状态
  let order = DATA.map((_, i) => i);   // 当前牌组在 DATA 中的下标
  let pos = 0;
  let flipped = false;
  const cur = () => DATA[order[pos]];

  /* ---------------- 牌组 / 分类 ---------------- */
  const catCount = label =>
    label === '全部' ? DATA.length : DATA.filter(d => d.cat === label).length;

  /* customOrder=true 表示当前牌组是「从字表点进来的」，翻页不按分类重置 */
  function buildDeck(keepOrder) {
    if (!keepOrder) {
      customOrder = false;
      order = DATA.map((d, i) => i).filter(i => filter === '全部' || DATA[i].cat === filter);
      pos = 0;
    }
    renderMenuBtn();
  }

  /* 左上角按钮显示「当前看的是哪一组 + 第几张」，代替原来那排分类胶囊 */
  function renderMenuBtn() {
    const n = cur();
    $('menuLabel').textContent = (filter === '全部' ? '字表' : filter) + ' ' + (pos + 1) + '/' + order.length;
    $('menuBtn').title = (filter === '全部' ? '全部汉字' : filter + '分类') + ' · 点开查看字表';
    if (n) $('menuBtn').setAttribute('aria-label', $('menuBtn').title);
  }

  /* ---------------- 抽屉：全部汉字一览 ---------------- */
  const drawer = $('drawer'), backdrop = $('backdrop'), dbody = $('dbody');

  let chipSeq = 0;
  function renderDrawer() {
    const curChar = cur() && cur().char;
    const all = order.map(i => DATA[i].char);          // 当前牌组顺序（打乱后也如实反映）
    $('dcount').textContent = `${all.length} 个字`;

    // 顶部：分类筛选（原来那排胶囊搬进来了）
    const chips = CATS.map(c =>
      `<button class="dsel${c.label === filter && !customOrder ? ' on' : ''}" data-cat="${c.label}">`
      + `${c.icon} ${c.label}<span class="n">${catCount(c.label)}</span></button>`).join('');

    // 正文：按分类分组；点组名就切到该分类
    const groups = CATS.filter(c => c.label !== '全部').map(c => {
      const chars = all.filter(ch => DATA.find(d => d.char === ch).cat === c.label);
      if (!chars.length) return '';
      const head = `<button class="dglabel${c.label === filter ? ' on' : ''}" data-cat="${c.label}">`
                 + `${c.icon} ${c.label}<span class="n">${chars.length}</span><span class="line"></span>`
                 + `<span class="go">只看这组 ›</span></button>`;
      const grid = chars.map(ch => {
        const i = chipSeq++ % 24;
        return `<button class="dchip${ch === curChar ? ' cur' : ''}" `
             + `style="animation-delay:${i * 16}ms" data-char="${ch}">${ch}</button>`;
      }).join('');
      return `<div class="dgroup">${head}<div class="dgrid">${grid}</div></div>`;
    }).join('');

    dbody.innerHTML = `<div class="dselbar">${chips}</div>` + groups;
    chipSeq = 0;
  }
  function openDrawer() {
    renderDrawer();
    // 抽屉是模态的：让背景不可聚焦也不可点（纯键盘用户不会掉进"能聚焦但按不动"的死区）
    document.body.classList.add('drawer-open');
    drawer.classList.add('open');
    backdrop.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    $('menuBtn').setAttribute('aria-expanded', 'true');
    setTimeout(() => { try { $('drawerClose').focus(); } catch (e) {} }, 60);
    const curChip = dbody.querySelector('.dchip.cur');
    if (curChip) curChip.scrollIntoView({ block: 'center' });
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    // 焦点还在抽屉里时设 aria-hidden=true 是违规的，先还回按钮
    if (drawer.contains(document.activeElement)) $('menuBtn').focus();
    drawer.setAttribute('aria-hidden', 'true');
    $('menuBtn').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  }
  const drawerOpen = () => drawer.classList.contains('open');

  /* 点字表里的字：切到「字表」牌组并定位过去（安静翻页，不发音） */
  function selectChar(ch) {
    stopSpeech();
    if (!customOrder) {
      order = order.slice();          // 把当前牌组顺序固定下来，翻页时不会跳回分类开头
      customOrder = true;
    }
    const i = order.findIndex(idx => DATA[idx].char === ch);
    if (i < 0) return;
    pos = i;
    setFlip(false);
    render(true);
    const chip = dbody.querySelector(`.dchip[data-char="${ch}"]`);
    if (chip) {
      dbody.querySelectorAll('.dchip.cur').forEach(el => el.classList.remove('cur'));
      chip.classList.add('cur');
      chip.scrollIntoView({ block: 'nearest' });
    }
  }
  dbody.addEventListener('click', e => {
    // ① 顶部分类胶囊 或 ② 组名 → 切换分类
    const sel = e.target.closest('[data-cat]');
    if (sel) {
      const label = sel.dataset.cat;
      if (label !== filter || customOrder) {
        stopSpeech();
        filter = label;
        customOrder = false;
        sfx.tap();
        buildDeck();
        setFlip(false);
        render(true);
      }
      closeDrawer();
      scrollTop();
      return;
    }
    // ③ 汉字 → 跳到那一张
    const chip = e.target.closest('.dchip');
    if (!chip) return;
    stopSpeech();
    sfx.tap();
    selectChar(chip.dataset.char);
    closeDrawer();
    scrollTop();
  });
  $('menuBtn').addEventListener('click', () => drawerOpen() ? closeDrawer() : openDrawer());

  /* 抽屉上沿往下拖 = 关闭（手机上的自然手势） */
  (function bindDrawerDrag() {
    const head = document.querySelector('.dhead');
    let y0 = 0, dy = 0, dragging = false;
    head.addEventListener('pointerdown', e => {
      dragging = true; y0 = e.clientY; dy = 0;
      // 不捕获的话，手指一旦滑出标题栏（往下拖必然如此）move 事件就收不到了
      try { head.setPointerCapture(e.pointerId); } catch (err) {}
    });
    head.addEventListener('pointermove', e => {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - y0);
      drawer.style.transform = 'translateY(' + dy + 'px)';
    });
    const finish = () => {
      if (!dragging) return;
      dragging = false;
      drawer.style.removeProperty('transform');   // 别留内联值覆盖 .drawer.open 的 transform
      if (dy > 64) closeDrawer();
      dy = 0;
    };
    head.addEventListener('pointerup', finish);
    head.addEventListener('pointercancel', finish);
    head.addEventListener('lostpointercapture', finish);
  })();
  $('drawerClose').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  /* ---------------- 护眼主题（白天 / 夜间） ---------------- */
  const THEME_KEY = 'hanzi-theme';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;   // day | night
    const btn = $('themeBtn');
    // 白天显示「月亮」= 点一下去夜间；夜间显示「太阳」= 点一下回白天
    btn.textContent = t === 'night' ? '☀️' : '🌙';
    btn.title = t === 'night' ? '现在是夜间护眼底色，点一下回到白天' : '护眼：切换白天 / 夜间';
    // 同步浏览器地址栏 / iOS 状态栏颜色，避免亮色条在夜里刺眼
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = t === 'night' ? '#181310' : '#fbf4e6';
    document.head.appendChild(meta);
  }
  function initTheme() {
    const saved = store.get(THEME_KEY);
    if (saved === 'day' || saved === 'night') { applyTheme(saved); return; }
    // 没设置过：如果设备正处于夜间时段或系统是深色，直接给夜间底色
    const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const h = new Date().getHours();
    applyTheme(dark || h >= 20 || h < 7 ? 'night' : 'day');
  }
  $('themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    applyTheme(next);
    store.set(THEME_KEY, next);
    showToast(next === 'night' ? '夜间护眼模式 🌙' : '白天模式 ☀️');
  });

  /* ---------------- 用眼提醒（每 25 分钟一次） ---------------- */
  const BREAK_MS = 25 * 60 * 1000;
  let breakTimer = null;
  function startBreakTimer() {
    clearInterval(breakTimer);
    breakTimer = setInterval(() => {
      showToast('已经看了 25 分钟啦，让眼睛看看窗外吧 🌳', 9000);
    }, BREAK_MS);
  }
  // 页面被切到后台时暂停计时，回来重新开始（避免放着不动也在计时）
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(breakTimer);
    else startBreakTimer();
  });

  /* ---------------- 轻音效（纯代码合成，不需要任何音频文件） ---------------- */
  const SFX_KEY = 'hanzi-sfx';
  let sfxCtx = null;
  let sfxOn = store.get(SFX_KEY) !== 'off';

  function sfxInit() {
    if (sfxCtx) return sfxCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { sfxCtx = new AC(); } catch (e) { sfxCtx = null; }
    return sfxCtx;
  }
  /* 一段很轻的“叮”：正弦波 + 指数衰减，音量压得很低 */
  function tone(freq, dur = 0.16, delay = 0, vol = 0.05) {
    const ac = sfxInit();
    if (!ac) return;
    if (ac.state === 'suspended') ac.resume();
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator(), g = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }
  const sfx = {
    tap()  { if (sfxOn) tone(680, 0.09, 0, 0.035); },                   // 翻页：极轻
    flip() { if (sfxOn) { tone(520, 0.14, 0, 0.05); tone(780, 0.18, 0.05, 0.04); } },  // 翻面
    right(){ if (sfxOn) { tone(784, 0.16, 0, 0.05); tone(1046, 0.22, 0.08, 0.045); } },// 揭晓
    whoosh(){ if (sfxOn) tone(300, 0.22, 0, 0.04); },                   // 打乱
  };
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

  function syncSfxBtn() {
    const b = $('sfxBtn');
    b.textContent = sfxOn ? '🔔' : '🔕';
    b.title = sfxOn ? '音效已开，点一下静音' : '音效已静音，点一下打开';
    b.setAttribute('aria-label', b.title);
  }
  $('sfxBtn').addEventListener('click', () => {
    sfxOn = !sfxOn;
    store.set(SFX_KEY, sfxOn ? 'on' : 'off');
    syncSfxBtn();
    if (sfxOn) { sfxInit(); sfx.flip(); }
    showToast(sfxOn ? '音效打开 🔔' : '音效关闭 🔕');
  });

  /* ---------------- 卡片跟随手指的轻微倾斜 ---------------- */
  function bindTilt() {
    const rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm || !window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    const MAX = 5;   // 最多 5 度，很轻
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ty', (dx * MAX * 2).toFixed(2) + 'deg');
      card.style.setProperty('--tx', (-dy * MAX * 2).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tx', '0deg');
      card.style.setProperty('--ty', '0deg');
    });
  }

  /* ---------------- 语音 ---------------- */
  let zhVoice = null;
  const speechOK = 'speechSynthesis' in window;
  function pickVoice() {
    if (!speechOK) return;
    const vs = speechSynthesis.getVoices() || [];
    const zh = vs.filter(v => /zh|cmn|Chinese|中文|普通话/i.test(v.lang + ' ' + v.name));
    zhVoice = zh.find(v => /PingFang|Tingting|婷婷|Meijia|Xiaoxiao|Google 普通话|Chinese \(China\)|zh-CN/i.test(v.name))
              || zh[0] || null;
  }
  if (speechOK) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  /* 每次朗读递增；旧朗读的 onend / 兜底定时器靠它判断自己是否已经过时。
     没有这个令牌，快速切卡时上一张的解释会被兜底定时器念出来。 */
  let speakSeq = 0;

  /* 停止朗读，并让所有还没触发的回调（onend、兜底定时器）失效。
     换卡片/切分类/关抽屉时都要调用——否则上一张的解释会被兜底定时器念出来。 */
  function stopSpeech() {
    speakSeq++;
    try { if (speechOK) speechSynthesis.cancel(); } catch (e) {}
  }

  function say(text, opts = {}) {
    speakSeq++;
    if (!speechOK) { showToast('这个浏览器不支持朗读，可以换成 Chrome / Safari 试试'); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      if (zhVoice) u.voice = zhVoice;
      u.rate = opts.rate ?? 0.8;
      u.pitch = opts.pitch ?? 1.1;
      speechSynthesis.speak(u);
    } catch (err) { showToast('朗读失败：' + err.message); }
  }

  /* 连着念两段：把第二段挂在第一段的 onend 上，避免被 cancel 掉或抢着一起念 */
  function sayClick(first, second) {
    if (!speechOK) { showToast('这个浏览器不支持朗读，可以换成 Chrome / Safari 试试'); return; }
    try {
      speechSynthesis.cancel();
      const a = new SpeechSynthesisUtterance(first);
      a.lang = 'zh-CN'; if (zhVoice) a.voice = zhVoice;
      a.rate = 0.72; a.pitch = 1.15;
      const b = new SpeechSynthesisUtterance(second);
      b.lang = 'zh-CN'; if (zhVoice) b.voice = zhVoice;
      b.rate = 0.82; b.pitch = 1.12;
      // iOS Safari 上 onend 有时不触发，加一个超时兜底，否则第二段永远读不出来。
      // 同时用序号令牌把过时的回调作废，避免快速切卡后念出上一张的内容。
      const mySeq = ++speakSeq;
      let said = false;
      const saySecond = () => {
        if (said || mySeq !== speakSeq) return;
        said = true;
        try { speechSynthesis.speak(b); } catch (e) {}
      };
      a.onend = saySecond;
      a.onerror = saySecond;
      setTimeout(saySecond, Math.max(1800, first.length * 620));
      speechSynthesis.speak(a);
    } catch (err) { showToast('朗读失败：' + err.message); }
  }
  const sayChar  = () => say(cur().char, { rate: 0.72, pitch: 1.15 });
  const sayWords = () => say(cur().words.join('，'), { rate: 0.85 });

  /* 把背面的解释句念出来。
     tip 里带 <b> 高亮标签，要去掉；顿号「、」在语音里会变成很明显的小停顿，
     听着像卡顿，所以统一换成逗号，读起来更顺。 */
  function tipText(d) {
    return d.tip.replace(/<[^>]+>/g, '').replace(/、/g, '，').replace(/。$/, '');
  }
  const sayExplain = () => say(tipText(cur()), { rate: 0.82, pitch: 1.12 });

  /* ---------------- 提示 ---------------- */
  let toastTimer = null;
  function showToast(msg, ms = 2200) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
  }

  /* ---------------- 渲染 ---------------- */
  /* 提示文案跟着设备形态走：触摸/窄屏说"左右滑动"，桌面说"点卡片"
     （只在启动时判断一次是不够的——窗口拉宽、或轮换屏幕方向后就对不上了） */
  function adaptHint() {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const touchLike = coarse || window.innerWidth <= 560;
    const t = document.querySelector('.cta-text');
    if (t) t.textContent = touchLike
      ? '左右滑动换一张 · 点卡片看图画'
      : '点卡片翻到背面，看看它像什么';
  }
  let hintTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(adaptHint, 150);
  });
  window.addEventListener('orientationchange', () => setTimeout(adaptHint, 250));

  function render(animate) {
    const d = cur();
    if (!d) return;                     // 空牌组：不要抛错把整个应用带死
    elBig.textContent = d.char;
    elWords.innerHTML = d.words.map(w => `<span class="word">${w}</span>`).join('');
    elPic.innerHTML = d.pic;   // data 层已经给出完整 SVG
    const svg = elPic.firstElementChild;          // 数据缺 pic 时不要抛错
    if (svg) svg.classList.add('m-' + motionOf(d.char));
    elExplain.innerHTML = d.tip;
    elBackChar.textContent = d.char;
    renderMenuBtn();
    if (animate) { elBig.classList.remove('pop'); void elBig.offsetWidth; elBig.classList.add('pop'); }
  }

  function setFlip(v) {
    flipped = v;
    card.classList.toggle('flipped', flipped);
    $('flip').innerHTML = flipped
      ? '🔄<span class="btn-txt"> 翻回正面</span>'
      : '🔄<span class="btn-txt"> 翻面看图画</span>';
    // 背面时这个按钮改成「读解释」，正面时读汉字和组词
    $('speak').innerHTML = flipped
      ? '💬<span class="btn-txt"> 读解释</span>'
      : '🔊<span class="btn-txt"> 听一听</span>';
    if (flipped) {
      sfx.right();                   // 揭晓的小铃声
      buzz(18);
      // 先报字，再把画面解释念一遍（翻页仍然完全不发音）
      sayClick(cur().char, tipText(cur()));
    } else {
      sfx.tap();
    }
  }

  function sparkle() {
    const box = card.getBoundingClientRect();
    const chars = ['⭐', '✨', '🌟'];
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.textContent = chars[(Math.random() * chars.length) | 0];
      s.style.left = (box.left + box.width * (0.25 + Math.random() * 0.5)) + 'px';
      s.style.top = (box.top + box.height * (0.35 + Math.random() * 0.3)) + 'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  /* ---------------- 左右滑动切换卡片（手机上主要靠这个） ---------------- */
  const threshold = () => Math.max(52, card.getBoundingClientRect().width * 0.18);

  function bindSwipe() {
    let active = false, decided = false, horiz = false;
    let sx = 0, sy = 0, dx = 0, t0 = 0, isSwipe = false;
    let pid = null;              // 只认第一根手指，否则小孩多指点屏幕会误翻

    const setMove = (px, opacity) => {
      swipeEl.style.transform = 'translateX(' + Math.round(px) + 'px)';
      if (opacity !== undefined) swipeEl.style.opacity = String(opacity);
    };
    const springBack = () => {                 // 回弹
      swipeEl.classList.remove('leaving', 'entering');
      swipeEl.classList.add('spring');
      setMove(0, 1);
      setTimeout(() => {
        swipeEl.classList.remove('spring');
        swipeEl.style.transform = '';
        swipeEl.style.opacity = '';
      }, 340);
    };

    card.addEventListener('pointerdown', e => {
      if (e.button !== undefined && e.button !== 0) return;   // 只响应主键
      if (active) return;                                     // 第二根手指直接忽略
      active = true; pid = e.pointerId; decided = false; horiz = false; isSwipe = false;
      sx = e.clientX; sy = e.clientY; dx = 0; t0 = Date.now();
    });

    card.addEventListener('pointermove', e => {
      if (!active || e.pointerId !== pid) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!decided) {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;      // 位移太小，先不判断
        decided = true;
        horiz = Math.abs(mx) > Math.abs(my) * 1.2;             // 以横向为主才算滑动
        // 刻意不调用 setPointerCapture：触摸指针本来就有隐式捕获，
        // 再显式捕获一次，浏览器会立刻补发 lostpointercapture 把手势打断。
        // 鼠标拖出卡片的情况由 window 上的 pointerup 兜底。
        if (horiz) {
          swipeEl.classList.remove('leaving', 'entering', 'spring');
          swipeEl.style.transform = 'translateX(0px)';         // 清掉遗留值再跟手
        }
      }
      if (!horiz) return;                                      // 纵向滑动 → 交给页面滚动
      dx = mx;
      const cap = threshold() * 2.2;
      if (Math.abs(dx) > cap) dx = Math.sign(dx) * (cap + (Math.abs(dx) - cap) * 0.35);   // 橡皮筋阻尼
      setMove(dx);
    });

    const end = e => {
      if (!active) return;
      if (e && e.pointerId !== undefined && e.pointerId !== pid) return;
      active = false; pid = null;
      if (!horiz) { dx = 0; return; }

      const quick = (Date.now() - t0) < 320 && Math.abs(dx) > 26;   // 快速轻扫也算数
      if (Math.abs(dx) > threshold() || quick) {
        isSwipe = true;
        const dir  = dx < 0 ? 1 : -1;        // 翻页方向：往左滑 = 下一张
        const exit = Math.sign(dx) || 1;     // 退出方向：必须跟着手指，不能复用 dir
        const w = swipeEl.getBoundingClientRect().width;
        swipeEl.classList.remove('spring', 'entering');
        swipeEl.classList.add('leaving');
        setMove(exit * w * 1.02, 0);         // 顺着手指滑出去并淡出

        setTimeout(() => {
          go(dir);                            // 换卡片（安静翻页）
          swipeEl.classList.remove('leaving');
          swipeEl.style.transition = 'none';
          setMove(-exit * 46, 0);             // 无过渡地落到另一侧
          void swipeEl.offsetWidth;           // 强制重排，确保这一帧不被看见
          swipeEl.style.transition = '';
          swipeEl.classList.add('entering');
          setMove(0, 1);                      // 平滑滑入
          setTimeout(() => {
            swipeEl.classList.remove('entering');
            swipeEl.style.transform = '';
            swipeEl.style.opacity = '';
          }, 360);
        }, 240);
      } else {
        springBack();
      }
      dx = 0;
    };
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
    // 兜底：万一 pointerup 没落在卡片上（比如鼠标拖出卡片），也能正常收尾
    window.addEventListener('pointerup', e => { if (active) end(e); });
    window.addEventListener('pointercancel', e => { if (active) end(e); });

    // 滑动结束后浏览器还会补一个 click，不能让它变成"点一下翻面"。
    // 注意不移除监听（否则会永久破坏"点卡片翻面"）——只把这一次拦掉。
    card.addEventListener('click', e => {
      if (!isSwipe) return;
      // 关键：翻面的监听器也挂在同一个元素上，
      // 只用 stopPropagation 拦不住同元素上的其它监听器，必须用 stopImmediatePropagation
      e.stopImmediatePropagation();
      e.preventDefault();
      isSwipe = false;        // 只拦这一次补发的 click，不要用时间窗去吞正常点击
    }, true);

    // 新手势开始时清零标记：否则标记会一直挂着，把后面的正常点击也吞掉
    card.addEventListener('pointerdown', () => { isSwipe = false; }, true);
  }

  /* 换卡片：安静翻页（不朗读、只有一声极轻的“嗒”）；顺手同步字表里的小标记 */
  function go(step) {
    stopSpeech();
    sfx.tap();
    buzz(10);
    pos = (pos + step + order.length) % order.length;
    setFlip(false);
    render(true);
    if (drawerOpen()) {
      dbody.querySelectorAll('.dchip.cur').forEach(el => el.classList.remove('cur'));
      const chip = dbody.querySelector(`.dchip[data-char="${cur().char}"]`);
      if (chip) { chip.classList.add('cur'); chip.scrollIntoView({ block: 'nearest' }); }
    }
  }

  /* ---------------- 事件 ---------------- */
  // 翻面：补发的 click 已由上面的捕获阶段拦掉，这里不再需要时间窗
  card.addEventListener('click', () => {
    setFlip(!flipped);
    if (flipped) sparkle();
  });
  elBig.addEventListener('click', e => {
    e.stopPropagation();
    sfx.tap(); buzz(12);
    sayChar();
    elBig.classList.remove('pop'); void elBig.offsetWidth; elBig.classList.add('pop');
  });
  $('flip').addEventListener('click', () => { setFlip(!flipped); if (flipped) sparkle(); });
  // 正面：读汉字 + 组词；背面：读那幅图画的解释
  $('speak').addEventListener('click', () => {
    if (flipped) { sfx.tap(); sayExplain(); return; }
    sfx.tap();
    const d = cur();                                 // 先抓住这张卡，别等定时器再取
    sayChar();
    setTimeout(() => {
      // 这 900ms 里换过卡就不能再读了，否则会念出新卡的组词、还会掐断新卡的朗读
      if (cur() !== d) return;
      say(d.words.join('，'), { rate: 0.85 });
    }, 900);
  });
  $('speakWords').addEventListener('click', sayWords);
  $('prev').addEventListener('click', () => go(-1));
  $('next').addEventListener('click', () => go(1));
  $('shuffle').addEventListener('click', () => {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    pos = 0; setFlip(false); render(true);
    sfx.whoosh();
    showToast('顺序已打乱 🎲');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (drawerOpen()) closeDrawer(); return; }
    if (e.key.toLowerCase() === 'i') { drawerOpen() ? closeDrawer() : openDrawer(); return; }
    // 焦点在按钮上时，浏览器自己会把空格/回车变成 click，
    // 再走一遍全局快捷键就会"翻两次面""跳两张"，所以直接让浏览器处理
    if (e.target && e.target.closest && e.target.closest('button')) return;
    // 抽屉打开时不让快捷键穿透到背景
    if (drawerOpen()) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlip(!flipped); if (flipped) sparkle(); }
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key.toLowerCase() === 'r') sayChar();
    else if (e.key.toLowerCase() === 's') $('shuffle').click();
  });

  /* ---------------- PWA：注册 Service Worker（离线可用 + 自动更新） ---------------- */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    // file:// 直接打开时不注册（会报错），放到 http(s) 上才启用
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    window.addEventListener('load', () => {
      // 用相对路径注册：GitHub Pages 子路径（/仓库名/）下也能正确限定作用域
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
    // 新版本的 SW 接管后自动刷新一次，这样改完代码用户不用手动清缓存
    // 只有"本来就有 SW 在管、现在被新版替换"时才刷新；
    // 首次安装也会触发 controllerchange，那时没必要打断正在玩的孩子
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return;
      reloaded = true;
      location.reload();
    });
  }

  /* ---------------- 启动 ---------------- */
  /* 数据是本地固定的，但分层加载后 data/cards.js 有可能 404。
     这里不静默白屏，给一条能看懂的提示。 */
  function dataOK() {
    if (!window.HANZI_CARDS || !Array.isArray(DATA) || !DATA.length) return false;
    return DATA.every(d => d && d.char && Array.isArray(d.words) && d.words.length && d.tip && d.pic);
  }
  if (!dataOK()) {
    document.body.innerHTML = '<div style="padding:32px;font:16px/1.7 -apple-system,'
      + '\'PingFang SC\',sans-serif;color:#6b5a3e;text-align:center">'
      + '<h2 style="font-size:20px">字卡没有加载成功</h2>'
      + '<p>请确认 <code>data/cards.js</code> 和本页面在同一个目录下，然后刷新。</p></div>';
    return;
  }

  initTheme();
  syncSfxBtn();
  adaptHint();
  bindTilt();
  bindSwipe();
  registerSW();
  buildDeck();
  render(false);
  setFlip(false);
  startBreakTimer();
  document.addEventListener('pointerdown', function once() {
    document.removeEventListener('pointerdown', once);
    if (speechOK && !zhVoice) pickVoice();
    sfxInit();
  }, { once: true });
})();
