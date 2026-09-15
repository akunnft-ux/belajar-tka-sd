/* ============================================================
 * TKA QUEST — Logika Aplikasi
 * Materi + kuis format TKA SD/MI (PG, PGK multi, PGK kategori)
 * ============================================================ */
(function () {
  'use strict';

  /* ---------------- UTIL ---------------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const acak = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const STS = 'tkaquest_';

  let state = {
    nama: localStorage.getItem(STS + 'nama') || '',
    xp: parseInt(localStorage.getItem(STS + 'xp') || '0', 10),
    progres: JSON.parse(localStorage.getItem(STS + 'progres') || '{}'),
    modePeta: 'belajar'
  };

  let ses = null; // sesi runtime

  function simpan() {
    localStorage.setItem(STS + 'nama', state.nama);
    localStorage.setItem(STS + 'xp', String(state.xp));
    localStorage.setItem(STS + 'progres', JSON.stringify(state.progres));
  }

  function levelDariXP(xp) { return Math.floor(xp / 180) + 1; }
  function xpDalamLevel(xp) { return xp % 180; }

  /* ---------------- AUDIO (WebAudio) ---------------- */
  let ctx = null;
  function bunyi(nama) {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      const catat = (freq, mul, dur, tipo, vol, delay) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = tipo || 'sine';
        o.frequency.value = freq * mul;
        g.gain.setValueAtTime(vol || 0.18, t + delay);
        g.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(t + delay); o.stop(t + delay + dur + 0.02);
      };
      if (nama === 'klik') catat(500, 1, 0.08, 'triangle', 0.1, 0);
      if (nama === 'benar') { catat(523, 1, 0.15, 'sine', 0.18, 0); catat(659, 1, 0.15, 'sine', 0.18, 0.12); catat(784, 1, 0.25, 'sine', 0.18, 0.24); }
      if (nama === 'salah') { catat(330, 1, 0.2, 'sawtooth', 0.08, 0); catat(262, 1, 0.3, 'sawtooth', 0.08, 0.15); }
      if (nama === 'menang') { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => catat(f, 1, 0.22, 'triangle', 0.16, i * 0.15)); }
      if (nama === 'level') { [392, 523, 659, 784].forEach((f, i) => catat(f, 1, 0.2, 'triangle', 0.15, i * 0.12)); }
    } catch (e) { /* abaikan */ }
  }



  /* ---------------- KONFETI ---------------- */
  function hujanKonfeti(durasiMs) {
    const canvas = $('#kanvas-konfeti'), ctxg = canvas.getContext('2d');
    canvas.width = innerWidth; canvas.height = innerHeight;
    const warna = ['#7c3aed', '#ef476f', '#06d6a0', '#ffb703', '#118ab2', '#a17aff'];
    let butir = [];
    for (let i = 0; i < 140; i++) {
      butir.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        w: 6 + Math.random() * 8, h: 10 + Math.random() * 12,
        vy: 2 + Math.random() * 4, vx: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI, vr: -0.2 + Math.random() * 0.4,
        c: warna[i % warna.length]
      });
    }
    const mulai = performance.now();
    function langkah(now) {
      ctxg.clearRect(0, 0, canvas.width, canvas.height);
      butir.forEach(b => {
        b.y += b.vy; b.x += b.vx; b.rot += b.vr;
        ctxg.save(); ctxg.translate(b.x, b.y); ctxg.rotate(b.rot);
        ctxg.fillStyle = b.c; ctxg.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctxg.restore();
      });
      if (now - mulai < durasiMs) requestAnimationFrame(langkah);
      else { ctxg.clearRect(0, 0, canvas.width, canvas.height); butir = []; }
    }
    requestAnimationFrame(langkah);
  }

  /* ---------------- DATA GAMBAR ---------------- */
  const HOBI = [
    { label: 'Olahraga', nilai: 15 },
    { label: 'Membaca', nilai: 12 },
    { label: 'Menari', nilai: 8 },
    { label: 'Menggambar', nilai: 10 }
  ];

  function gambarUntuk(kunci, extra) {
    switch (kunci) {
      case 'pizza': return svgPizza(extra && extra.dimakan != null ? extra.dimakan : 3, extra && extra.total ? extra.total : 4, extra && extra.label, extra && extra.judul);
      case 'pizza-mini': return svgPizza(2, 4, '2/4');
      case 'jam': return svgJam(extra.jam || 7, extra.menit || 30);
      case 'jam-sudut': return `<span class="gambar-blok">${svgJam(4, 0)}${svgJam(3, 0)}</span>`;
      case 'bangun-datar': return `<span class="gambar-blok" style="flex-wrap:wrap;gap:8px">${['persegi', 'pp', 'segitiga', 'lingkaran', 'jajar', 'trapesium', 'layang'].map(svgBentuk).join('')}</span>`;
      case 'diagram-hobi': return `<span class="gambar-blok">${svgDiagram(HOBI)}</span>`;
      case 'catur': return `<span class="gambar-blok">${svgCatur()}</span>`;
      default: return '';
    }
  }

  /* ---------------- HUD ---------------- */
  function perbaruiHUD(judul) {
    const hud = $('#hud');
    if (!judul) { hud.hidden = true; return; }
    hud.hidden = false;
    $('#hudJudul').innerHTML = judul;
    $('#hudAvatar').textContent = state.nama ? state.nama.charAt(0).toUpperCase() : '👧';
    $('#xlvl').textContent = 'Lv.' + levelDariXP(state.xp);
    $('#xxp').textContent = state.xp + ' XP';
    $('#xpBar').style.width = (xpDalamLevel(state.xp) / 180) * 100 + '%';
  }

  /* ---------------- NAVIGASI ---------------- */
  function bukaLayar(id) {
    $$('.layar').forEach(l => l.classList.remove('aktif'));
    const el = $('#' + id);
    el.classList.remove('aktif'); void el.offsetWidth; el.classList.add('aktif');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function pergi(ke) {
    if (ke === 'splash') { bukaLayar('screen-splash'); perbaruiHUD(null); muatSplash(); }
    else if (ke === 'peta') { bukaLayar('screen-peta'); muatPeta(); }
    else if (ke === 'belajar') { bukaLayar('screen-belajar'); muatBelajar(); }
    else if (ke === 'kuis') { bukaLayar('screen-kuis'); muatKuis(); }
    else if (ke === 'hasil') { bukaLayar('screen-hasil'); muatHasil(); }
  }

  function aturKembali(tujuan) {
    $('#btnKembali').onclick = () => pergi(tujuan);
  }

  /* ================= SPLASH ================= */
  function muatSplash() {
    const s = $('#screen-splash');
    s.innerHTML = `
      <div class="splash-wrap">
        <div class="logo-blok">🦉💨</div>
        <h1 class="judul-besar">TKA&nbsp;Quest</h1>
        <p class="sub-judul">Ayo siap-siap hadapi ujian TKA SD/MI dengan seru!</p>
        <div class="badan-splash">
          <div class="blok-nama">
            <label for="nama">👧👦 Siapa namamu?</label>
            <input id="nama" type="text" maxlength="18" placeholder="Ketik namamu..." value="${esc(state.nama)}">
          </div>
          <div class="mode-grid">
            <button class="mode-card pilih" data-mode="belajar">
              <span class="mode-emoji">✨</span>
              <span class="mode-nama">Belajar Materi</span>
              <span class="mode-desk">Sambil kuis per bab</span>
            </button>
            <button class="mode-card" data-mode="acak">
              <span class="mode-emoji">🎲</span>
              <span class="mode-nama">Soal Acak</span>
              <span class="mode-desk">5 soal campuran</span>
            </button>
            <button class="mode-card" data-mode="tryout">
              <span class="mode-emoji">🏆</span>
              <span class="mode-nama">Try Out</span>
              <span class="mode-desk">10 soal + waktu</span>
            </button>
          </div>
          <button class="tombol-utama" id="btnMulai">Lanjut, Ayo! 🚀</button>
        </div>
      </div>`;
    const pilihMode = (btn) => {
      $$('.mode-card', s).forEach(b => b.classList.toggle('pilih', b === btn));
      state.modePeta = btn.dataset.mode;
    };
    $$('.mode-card', s).forEach(b => b.addEventListener('click', () => { bunyi('klik'); pilihMode(b); }));
    $('#nama').addEventListener('input', (e) => {
      state.nama = e.target.value.trim();
      simpan();
    });
    $('#btnMulai').addEventListener('click', () => {
      if (!state.nama) { state.nama = 'Kak Misterius'; }
      bunyi('klik');
      if (state.modePeta === 'tryout') bukaTryOut();
      else if (state.modePeta === 'acak') mulaiAcak();
      else { state.modePeta = 'belajar'; pergi('peta'); }
    });
  }

  /* ================= PETA MATERI ================= */
  function bintangHTML(skor) {
    const b = skor >= 60 ? 3 : skor >= 40 ? 2 : skor > 0 ? 1 : 0;
    return '<span class="bintang">' + '⭐'.repeat(b) + '☆'.repeat(3 - b) + '</span>';
  }
  function skorTerbaik(id) {
    const p = state.progres[id];
    return p ? p.skorTerbaik || 0 : 0;
  }

  function muatPeta() {
    berhentiSemuaTimer();
    const s = $('#screen-peta');
    let html = '';
    const grup = (mapel, list) => {
      const info = INFO_MAPEL[mapel];
      html += `
        <div class="bab-section">
          <div class="bab-header">
            <div class="bab-ikon" style="background:${info.grad}">${info.emoji}</div>
            <div><h2>${info.nama}</h2><p>${info.desk}</p></div>
          </div>
          <div class="grid-materi">`;
      list.forEach(m => {
        const skor = skorTerbaik(m.id);
        html += `
          <button class="kartu-materi" data-id="${m.id}" style="border-color:${m.warna}55">
            <div class="stripe" style="background:${m.warna}"></div>
            <span class="emoji">${m.emoji}</span>
            <h3>${m.judul}</h3>
            <p>${m.pertanyaan.length} soal kuis</p>
            <div class="kartu-stats">
              ${bintangHTML(skor)}
              <span class="persen-blok">${skor > 0 ? skor + '%' : 'Baru'}</span>
            </div>
          </button>`;
      });
      html += '</div></div>';
    };
    grup('matematika', materiByMapel('matematika'));
    grup('bahasa', materiByMapel('bahasa'));
    s.innerHTML = html;
    const total = semuaMateri().length;
    const selesai = Object.values(state.progres).filter(p => p.selesai).length;
    $('.master-kunjungan') && $('.master-kunjungan').remove();
    const info = document.createElement('div');
    info.className = 'master-kunjungan';
    info.innerHTML = `
      <div class="mode-card"><b class="rincian-nilai">${selesai}/${total}</b><span class="rincian-label">Materi selesai</span></div>
      <div class="mode-card"><b class="rincian-nilai">${levelDariXP(state.xp)}</b><span class="rincian-label">Level kamu</span></div>
      <button class="mode-card" id="btnTry"><span class="mode-emoji">🏆</span><span class="mode-nama">Try Out</span></button>`;
    s.insertBefore(info, s.firstChild);
    $('#btnTry').addEventListener('click', () => { bunyi('klik'); bukaTryOut(); });

    $$('.kartu-materi', s).forEach(k => k.addEventListener('click', () => {
      bunyi('klik');
      mulaiBelajar(k.dataset.id);
    }));
    perbaruiHUD(state.nama ? 'Halo, ' + state.nama + '! 👋' : 'Pilih Materi');
    aturKembali('splash');
  }

  /* ================= BELAJAR ================= */
  function mulaiBelajar(id) {
    const m = cariMateri(id);
    if (!m) return;
    ses = { mode: 'belajar', materi: m, slideIdx: 0 };
    pergi('belajar');
  }

  function muatBelajar() {
    const m = ses.materi, s = $('#screen-belajar');
    aturKembali('peta');
    perbaruiHUD('📖 ' + m.judul);
    tampilSlide(m.slide[ses.slideIdx]);
  }

  function tampilSlide(sl) {
    const s = $('#screen-belajar');
    const total = ses.materi.slide.length;
    const terakhir = ses.slideIdx === total - 1;
    let isi = '';
    if (sl.tipe === 'title') {
      isi = `<div class="slide-title"><span class="emoji">${sl.emoji}</span><h1>${sl.judul}</h1><p>${sl.sub}</p></div>`;
    } else if (sl.tipe === 'konten') {
      isi = `<div class="panggung-judul">${sl.emoji} ${sl.judul}</div>`;
      if (sl.gambar) isi += `<div style="text-align:center">${gambarUntuk(sl.gambar, sl.gambarA)}</div>`;
      isi += `<div class="teks-belajar">${sl.teks.map(t => t.includes('\n') ? `<span class="kutipan">${esc(t)}</span>` : esc(t)).join('<br>')}</div>`;
      if (sl.kartu) {
        isi += '<div class="grid-kartu">' + sl.kartu.map((k, i) => `
          <div class="kartu-info" style="animation-delay:${i * 0.08}s">
            <div class="kartu-ket">${esc(k.label)}</div>
            <div class="isi">${esc(k.nilai)}</div>
            <div class="kecil">${esc(k.ket)}</div>
          </div>`).join('') + '</div>';
      }
      if (sl.tip) isi += `<div class="kotak-tip"><span class="ic">💡</span><div class="isi">${esc(sl.tip)}</div></div>`;
    } else if (sl.tipe === 'mini') {
      isi = `<div class="mini-blok">
        <div class="panggung-judul">${sl.emoji} ${sl.judul}</div>`;
      if (sl.gambar) isi += `<div style="text-align:center">${gambarUntuk(sl.gambar, sl.gambarA)}</div>`;
      isi += `<div class="q">${esc(sl.pertanyaan)}</div>
        <div class="opsi-grid">${sl.opsi.map((o, i) => `
          <button class="opsi-pilih" data-i="${i}"><span class="abjad">${'ABCD'[i]}</span>${esc(o)}</button>`).join('')}</div>
        <div class="feedback-mini" hidden></div>
      </div>`;
    }
    s.innerHTML = `
      <div class="panggung" id="panggungSlide">${isi}</div>
      <div class="navigasi-belajar">
        <button class="tombol-nav" id="navPrev" ${ses.slideIdx === 0 ? 'disabled style="opacity:.4"' : ''}>⬅ Kembali</button>
        ${terakhir
          ? `<button class="tombol-nav utama" id="navKuis">Mulai Kuis 🎉</button>`
          : `<button class="tombol-nav utama" id="navNext">Lanjut ➡</button>`}
      </div>
      <button class="tombol-nav" id="skipKuis" style="width:100%;margin-top:8px">Lewati belajar, langsung kuis 🚀</button>
      <div class="dots">${ses.materi.slide.map((_, i) => `<i class="${i === ses.slideIdx ? 'aktif' : ''}"></i>`).join('')}</div>`;

    if (sl.tipe === 'mini') {
      let dipilih = -1;
      $$('.opsi-pilih', s).forEach(b => b.addEventListener('click', () => {
        bunyi('klik');
        dipilih = parseInt(b.dataset.i, 10);
        $$('.opsi-pilih', s).forEach(x => { x.classList.remove('dipilih'); });
        b.classList.add('dipilih');
        const fb = $('.feedback-mini', s);
        const ok = dipilih === sl.jwb;
        fb.hidden = false;
        fb.className = 'feedback-mini ' + (ok ? 'ok' : 'no');
        fb.textContent = (ok ? '👍 Betul! ' : '👀 Belum pas. ') + sl.penjelasan;
        if (ok) bunyi('benar'); else bunyi('salah');
        b.classList.add(ok ? 'benar' : 'salah');
        if (!ok) { $$('.opsi-pilih', s)[sl.jwb].classList.add('benar'); }
      }));
    }
    $('#navPrev').addEventListener('click', () => { bunyi('klik'); ses.slideIdx--; muatBelajar(); });
    const lanjut = () => { bunyi('klik'); ses.slideIdx++; muatBelajar(); };
    if (terakhir) $('#navKuis').addEventListener('click', mulaiKuisMateri);
    else $('#navNext').addEventListener('click', lanjut);
    $('#skipKuis').addEventListener('click', mulaiKuisMateri);
  }

  /* ================= KUIS ================= */
  function mulaiKuisMateri() {
    bunyi('klik');
    bukaKuis({
      mode: 'materi',
      materi: ses.materi,
      soal: ses.materi.pertanyaan.slice(),
      perSoalWaktu: 60
    });
  }

  function mulaiAcak() {
    const pool = kumpulkanSoalTryOut();
    bukaKuis({
      mode: 'acak',
      judul: '🎲 Soal Acak',
      soal: acak(pool).slice(0, 5),
      perSoalWaktu: 60
    });
  }

  function bukaKuis(k) {
    ses = { kuis: k, qIdx: 0, benar: 0, salah: 0, lewat: 0, jawab: null };
    pergi('kuis');
  }

  function muatKuis() {
    const k = ses.kuis, s = $('#screen-kuis');
    const m = k.mode === 'materi' ? k.materi : null;
    aturKembali(m ? 'peta' : 'peta');
    perbaruiHUD(m ? '📝 Kuis: ' + m.judul : '🎲 ' + (k.judul || 'Soal Acak'));
    renderSoalKe(ses.qIdx);
  }

  function teksBentuk(soal) {
    if (soal.type === 'pg') return 'PG — satu jawaban';
    if (soal.type === 'pgk') return 'PGK — boleh lebih dari satu';
    return 'PGK — Benar/Salah';
  }

  function renderSoalKe(idx) {
    const k = ses.kuis, s = $('#screen-kuis');
    const soal = k.soal[idx];
    const nomor = idx + 1;
    const total = k.soal.length;
    ses.jawab = null;
    const soalAdaStimulus = /Bacalah teks berikut!/.test(soal.teks) && soal.teks.includes('\n');

    let html = `
      <div class="kuis-info">
        <span class="kuis-soal-ke">Soal ${nomor}/${total}</span>
        ${k.mode === 'tryout'
          ? '<span class="timer">⏱ <span id="waktuTRY">--:--</span></span>'
          : `<span class="timer">⏱ <span id="waktuPer">60</span></span>`}
        <span class="kategori-bentuk">${teksBentuk(soal)}</span>
      </div>`;

    if (k.mode !== 'materi' && soal.materiJudul) {
      html += `<div class="kategori-bentuk" style="margin:0 0 8px auto;display:inline-block">${esc(soal.materiJudul)}</div>`;
    }

    if (soalAdaStimulus) {
      const [stim, tanya] = soal.teks.split('\n\n');
      html += `<div class="stimulus-box">${esc(stim)}</div>`;
      html += `<div class="kuis-pertanyaan">${esc(tanya)}</div>`;
    } else {
      html += `<div class="kuis-pertanyaan">${esc(soal.teks)}</div>`;
    }
    if (soal.gambar) {
      const extra = { jam: soal.gambarA && soal.gambarA.jam, menit: soal.gambarA && soal.gambarA.menit };
      html += `<div style="text-align:center">${gambarUntuk(soal.gambar, soal.gambarA)}</div>`;
    }

    if (soal.type === 'pg' || soal.type === 'pgk') {
      html += `<div class="opsi-grid" id="opsiBox">${soal.opsi.map((o, i) => `
        <button class="opsi-pilih" data-i="${i}"><span class="abjad">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
      html += `<button class="tombol-utama sekunder" id="btnPeriksa" disabled style="margin-top:14px">Periksa Jawaban ✅</button>`;
    } else {
      html += `<div class="tabel-kategori-wrap"><table class="tabel-kategori"><tr><th>Pernyataan</th><th>Benar</th><th>Salah</th></tr>`;
      soal.pernyataan.forEach((p, i) => {
        html += `<tr data-i="${i}">
          <td>${esc(p.teks)}</td>
          <td><div class="pilih-bs"><button class="pilih-b" data-bs="B" data-i="${i}">✅</button></div></td>
          <td><div class="pilih-bs"><button class="pilih-s" data-bs="S" data-i="${i}">❌</button></div></td>
        </tr>`;
      });
      html += `</table></div>`;
      html += `<button class="tombol-utama sekunder" id="btnPeriksa" disabled style="margin-top:14px">Periksa Jawaban ✅</button>`;
    }

    html += `<div class="feedback-kuis" id="feedKuis"></div>`;
    s.innerHTML = html;

    /* Per penyataan kategori: pilih B/S */
    if (soal.type === 'kategori') {
      const jawabKategori = {};
      const cekSiap = () => {
        const semua = soal.pernyataan.every((_, i) => jawabKategori[i] != null);
        $('#btnPeriksa').disabled = !semua;
      };
      $$('.tabel-kategori tr[data-i]', s).forEach(tr => {
        $$('button', tr).forEach(b => b.addEventListener('click', () => {
          bunyi('klik');
          const i = b.dataset.i;
          jawabKategori[i] = b.dataset.bs;
          $$('button', tr).forEach(x => { x.classList.remove('pilih-b', 'pilih-s'); });
          b.classList.add(b.dataset.bs === 'B' ? 'pilih-b' : 'pilih-s');
          cekSiap();
        }));
      });
      $('#btnPeriksa').addEventListener('click', () => {
        const benarRow = soal.pernyataan.map(p => p.benar);
        const jawabRow = soal.pernyataan.map((_, i) => jawabKategori[i] === 'B');
        const ok = benarRow.every((v, i) => v === jawabRow[i]);
        tampilFeedbackSoal(ok, soal, () => {
          ses.jawab = { pgk: null, kategori: jawabKategori, benarRow };
        });
      });
    } else {
      const dipilih = new Set();
      const banyak = soal.type === 'pgk';
      $$('#opsiBox .opsi-pilih', s).forEach(b => b.addEventListener('click', () => {
        bunyi('klik');
        const i = b.dataset.i;
        if (!banyak) {
          $$('#opsiBox .opsi-pilih', s).forEach(x => x.classList.remove('dipilih'));
          dipilih.clear(); dipilih.add(i);
          b.classList.add('dipilih');
        } else {
          b.classList.toggle('dipilih');
          if (dipilih.has(i)) dipilih.delete(i); else dipilih.add(i);
        }
        $('#btnPeriksa').disabled = dipilih.size === 0;
      }));
      $('#btnPeriksa').addEventListener('click', () => {
        const jwbTerpilih = Array.from(dipilih).map(Number);
        let ok;
        if (soal.type === 'pg') ok = jwbTerpilih.length === 1 && jwbTerpilih[0] === soal.jawaban;
        else ok = jwbTerpilih.length === soal.jawaban_multi.length && soal.jawaban_multi.every(v => jwbTerpilih.includes(v));
        tampilFeedbackSoal(ok, soal, () => {
          ses.jawab = { pgk: jwbTerpilih, kategori: null };
        });
      });
    }

    mulaiTimerPerSoal();
  }

  function tampilFeedbackSoal(ok, soal, setJawab) {
    bunyi(ok ? 'benar' : 'salah');
    setJawab();
    if (ok) ses.benar++; else ses.salah++;
    const fb = $('#feedKuis');
    fb.className = 'feedback-kuis tampil ' + (ok ? 'ok' : 'no');
    let isi = `<h3>${ok ? '🎉 Hebat, benar!' : '😅 Belum tepat'}</h3>
      <p>${esc(soal.penjelasan)}</p>`;
    if (!ok && soal.type === 'pg') {
      isi += `<div class="jawab-benar-teks">Jawaban yang benar: ${'ABCD'[soal.jawaban]}. ${esc(soal.opsi[soal.jawaban])}</div>`;
    }
    if (!ok && soal.type === 'pgk') {
      const betul = soal.jawaban_multi.map(i => soal.opsi[i]);
      isi += `<div class="jawab-benar-teks">Jawaban yang benar: ${betul.join(', ')}</div>`;
    }
    if (!ok && soal.type === 'kategori') {
      const salahRows = soal.pernyataan.map((p, i) => ({ p, i, benar: p.benar })).filter(x => !ses.jawab.kategori || (ses.jawab.kategori[x.i] === 'B') !== x.benar);
      isi += `<div class="jawab-benar-teks">Cek kembali: ${salahRows.map(r => '"' + r.p.teks + '" → ' + (r.benar ? 'Benar' : 'Salah')).join('; ')}</div>`;
    }
    const terakhirSoal = ses.qIdx === ses.kuis.soal.length - 1;
    isi += `<button class="tombol-lanjut" id="btnLanjutKuis">${terakhirSoal ? 'Lihat Hasil 🏁' : 'Soal Berikutnya ➡'}</button>`;
    fb.innerHTML = isi;
    $('#btnLanjutKuis').addEventListener('click', () => {
      bunyi('klik');
      if (terakhirSoal) {
        if (ses.kuis.mode === 'tryout') hentikanTimerTryOut();
        if (timerSoal) { clearInterval(timerSoal); timerSoal = null; }
        bukaHasil();
      } else {
        ses.qIdx++;
        if (timerSoal) { clearInterval(timerSoal); timerSoal = null; }
        muatKuis();
      }
    });
  }

  /* ---- timer per soal (mode materi & acak) ---- */
  let timerSoal = null;
  let timerTry = null;
  function berhentiSemuaTimer() {
    if (timerSoal) { clearInterval(timerSoal); timerSoal = null; }
    if (timerTry) { clearInterval(timerTry); timerTry = null; }
  }
  function mulaiTimerPerSoal() {
    if (ses.kuis.perSoalWaktu && ses.kuis.mode !== 'tryout') {
      if (timerSoal) { clearInterval(timerSoal); timerSoal = null; }
      let sisa = ses.kuis.perSoalWaktu;
      timerSoal = setInterval(() => {
        const el = $('#waktuPer');
        if (el) {
          el.textContent = sisa;
          el.style.color = sisa <= 10 ? '#ef4444' : '';
        }
        sisa--;
        if (sisa <= 0) { clearInterval(timerSoal); timerSoal = null; waktuHabis(); }
      }, 1000);
    }
  }
  function waktuHabis() {
    const fb = $('#feedKuis');
    if (!fb || fb.classList.contains('tampil')) return;
    bunyi('salah');
    ses.lewat++; ses.salah++;
    const soal = ses.kuis.soal[ses.qIdx];
    fb.className = 'feedback-kuis tampil no';
    let isi = `<h3>⏰ Waktu habis!</h3><p>Tenang, yang penting tetap semangat. ${esc(soal.penjelasan)}</p>`;
    if (soal.type === 'pg') isi += `<div class="jawab-benar-teks">Jawaban: ${'ABCD'[soal.jawaban]}. ${esc(soal.opsi[soal.jawaban])}</div>`;
    if (soal.type === 'pgk') isi += `<div class="jawab-benar-teks">Jawaban: ${soal.jawaban_multi.map(i => soal.opsi[i]).join(', ')}</div>`;
    const terakhirSoal = ses.qIdx === ses.kuis.soal.length - 1;
    isi += `<button class="tombol-lanjut" id="btnLanjutKuis">${terakhirSoal ? 'Lihat Hasil 🏁' : 'Soal Berikutnya ➡'}</button>`;
    fb.innerHTML = isi;
    $('#btnLanjutKuis').addEventListener('click', () => {
      ses.qIdx++;
      if (terakhirSoal) bukaHasil();
      else muatKuis();
    });
  }

  /* ================= TRY OUT ================= */
  function bukaTryOut() {
    bunyi('klik');
    const konfirmasi = document.createElement('div');
    konfirmasi.className = 'modal';
    konfirmasi.innerHTML = `
      <span class="emoji-besar">🏆</span>
      <h3>Try Out Ujian TKA</h3>
      <p>10 soal campuran Matematika & Bahasa Indonesia.<br>Waktu 15 menit. Ayo buktikan kemampuanmu!</p>
      <button id="btnMulaiTO">Mulai Sekarang 🚀</button>`;
    $('#modalBox').innerHTML = '';
    $('#modalBox').appendChild(konfirmasi);
    $('#overlay').hidden = false;
    $('#overlay').classList.add('tampil');
    $('#btnMulaiTO').addEventListener('click', () => {
      $('#overlay').hidden = true;
      $('#overlay').classList.remove('tampil');
      let pool = kumpulkanSoalTryOut();
      pool = acak(pool).slice(0, 10);
      bukaKuis({ mode: 'tryout', judul: '🏆 Try Out Ujian', soal: pool, perSoalWaktu: null });
      mulaiTimerTryOut();
    });
  }

  function mulaiTimerTryOut() {
    if (timerTry) clearInterval(timerTry);
    let sisa = 15 * 60;
    const tampil = () => {
      const el = $('#waktuTRY');
      if (!el) return;
      const m = Math.floor(sisa / 60), d = sisa % 60;
      el.textContent = String(m).padStart(2, '0') + ':' + String(d).padStart(2, '0');
      el.style.color = sisa <= 60 ? '#ef4444' : '';
    };
    tampil();
    timerTry = setInterval(() => {
      sisa--;
      if (sisa < 0) { hentikanTimerTryOut(); selesaiTryOutPaksa(); return; }
      tampil();
    }, 1000);
  }
  function hentikanTimerTryOut() { if (timerTry) { clearInterval(timerTry); timerTry = null; } }
  function selesaiTryOutPaksa() {
    const sisaSoal = ses.kuis.soal.length - ses.qIdx - 1;
    ses.lewat += sisaSoal; ses.salah += sisaSoal;
    bukaHasil();
  }

  /* ================= HASIL ================= */
  function bukaHasil() {
    if (ses.kuis.mode === 'materi') {
      const m = ses.kuis.materi;
      const skor = Math.round((ses.benar / ses.kuis.soal.length) * 100);
      const lama = state.progres[m.id] || { bintang: 0, skorTerbaik: 0, selesai: false };
      const bintang = skor >= 60 ? 3 : skor >= 40 ? 2 : skor > 0 ? 1 : 0;
      const bonus = [30, 20, 10, 5][bintang];
      const gainXP = ses.benar * 20 + bonus;
      state.xp += gainXP; state.progres[m.id] = { bintang: Math.max(lama.bintang, bintang), skorTerbaik: Math.max(lama.skorTerbaik, skor), selesai: true };
      simpan();
      ses.hasil = { skor, benar: ses.benar, salah: ses.salah, gainXP, bintang, stat: 'materi', judul: m.judul, emoji: m.emoji };
    } else if (ses.kuis.mode === 'acak') {
      const skor = Math.round((ses.benar / ses.kuis.soal.length) * 100);
      const gainXP = ses.benar * 15;
      const bintang = skor >= 60 ? 3 : skor >= 40 ? 2 : skor > 0 ? 1 : 0;
      state.xp += gainXP; simpan();
      ses.hasil = { skor, benar: ses.benar, salah: ses.salah, gainXP, bintang, stat: 'acak', judul: 'Soal Acak', emoji: '🎲' };
    } else {
      const total = ses.kuis.soal.length;
      const skor = Math.round((ses.benar / total) * 100);
      const gainXP = ses.benar * 15;
      state.xp += gainXP; simpan();
      const predikat = skor >= 90 ? { t: '🏆 Juara Akademik!', p: 'Luar biasa, hampir sempurna!' }
        : skor >= 75 ? { t: '🥇 Hebat Sekali!', p: 'Kamu sudah siap menghadapi ujian!' }
        : skor >= 60 ? { t: '🥈 Keren!', p: 'Sedikit lagi menuju sempurna!' }
        : skor >= 40 ? { t: '🥉 Semangat!', p: 'Terus berlatih, pasti bisa!' }
        : { t: '💪 Terus Berlatih!', p: 'Jangan menyerah. Coba lagi, yuk!' };
      ses.hasil = { skor, benar: ses.benar, salah: ses.salah, gainXP, predikat, stat: 'tryout', judul: 'Try Out', emoji: '🏆' };
    }
    pergi('hasil');
  }

  function muatHasil() {
    const h = ses.hasil, s = $('#screen-hasil');
    aturKembali('peta');
    perbaruiHUD('🎉 Hasil ' + h.judul);
    const R = 76, CIRC = 2 * Math.PI * R;
    const offset = CIRC - (h.skor / 100) * CIRC;
    const predikatHtml = h.stat === 'tryout'
      ? `<div style="margin-top:2px"><div class="predikat">${h.predikat.t}</div><p class="pesan-semangat">${h.predikat.p}</p></div>`
      : `<h2 class="predikat">${h.skor >= 60 ? 'Keren!' : h.skor >= 40 ? 'Semangat!' : 'Ayo Coba Lagi!'}</h2>`;

    s.innerHTML = `
      <div class="hasil-wrap">
        <span class="maskot-hasil">${h.skor >= 60 ? '🦉' : '🦉'}</span>
        ${predikatHtml}
        <div class="rincian-hasil">
          <div class="mode-card"><div class="rincian-nilai" style="color:var(--teal)">${h.benar}</div><div class="rincian-label">Benar ✅</div></div>
          <div class="mode-card"><div class="rincian-nilai" style="color:var(--pink)">${h.salah}</div><div class="rincian-label">Salah ❌</div></div>
          <div class="mode-card"><div class="rincian-nilai" style="color:var(--kuning)">+${h.gainXP}</div><div class="rincian-label">XP baru ⚡</div></div>
        </div>
        <div class="lingkaran-skor">
          <svg width="190" height="190" viewBox="0 0 190 190">
            <circle class="track" cx="95" cy="95" r="${R}"/>
            <circle class="progres" cx="95" cy="95" r="${R}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/>
          </svg>
          <div class="skor-angka">${h.skor}<span style="font-size:16px">%</span></div>
        </div>
        <div class="star-line" aria-label="bintang">${h.stat === 'materi' ? '⭐'.repeat(h.bintang) + '☆'.repeat(3 - h.bintang) : '⭐'.repeat(h.bintang) + '☆'.repeat(3 - h.bintang)}</div>
        <p class="pesan-semangat">${h.stat === 'materi' ? 'Skor tersimpang: ' + state.progres[ses.kuis.materi.id].skorTerbaik + '% terbaik. Sampai di sini kamu sudah ' + (h.bintang >= 2 ? 'juara! 🎖️' : 'bertambah pintar! 🌱') : h.stat === 'acak' ? 'Latihan teratur bikin kamu makin jago!' : 'Hasil Try Out menentukan kesiapanmu. Ayo ulangi sampai juara!'}</p>
        <div class="aksi-hasil">
          ${h.stat === 'materi'
            ? `<button class="tombol-utama" id="btnUlang">🔄 Coba Lagi</button>
               <button class="tombol-utama sekunder" id="btnKePeta">Buka Materi Lain →</button>`
            : `<button class="tombol-utama" id="btnUlang">🔄 Ulangi ${h.stat === 'tryout' ? 'Try Out' : 'Soal'}</button>
               <button class="tombol-utama sekunder" id="btnKePeta">Keluar →</button>`}
        </div>
      </div>`;

    /* predikat ring animasi */
    setTimeout(() => {
      const c = $('.lingkaran-skor .progres', s);
      if (c) { c.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.34,1.4,.64,1)'; c.style.strokeDashoffset = offset; }
    }, 60);

    if (h.skor >= 60) { hujanKonfeti(2500); bunyi('menang'); } else { bunyi('salah'); }
    if (levelDariXP(state.xp) !== levelDariXP(state.xp - h.gainXP)) {
      setTimeout(() => { bunyi('level'); tampilkanLevelUp(levelDariXP(state.xp)); }, 1000);
    }

    $('#btnUlang').addEventListener('click', () => {
      bunyi('klik');
      if (h.stat === 'materi') { mulaiKuisMateri(); }
      else if (h.stat === 'acak') { mulaiAcak(); }
      else { bukaTryOut(); }
    });
    $('#btnKePeta').addEventListener('click', () => { bunyi('klik'); pergi('peta'); });
  }

  function tampilkanLevelUp(lvl) {
    const box = document.createElement('div');
    box.className = 'toast-level';
    box.innerHTML = `<span class="ic">🎉</span><div><b>Level ${lvl}!</b><small>Kamu makin jago, ${esc(state.nama || 'Pahlawan')}!</small></div>`;
    document.body.appendChild(box);
    setTimeout(() => { box.style.transition = 'opacity .5s, transform .5s'; box.style.opacity = '0'; box.style.transform = 'translate(-50%,-40px)'; }, 2600);
    setTimeout(() => box.remove(), 3200);
  }

  /* ---------------- INISIALISASI ---------------- */
  function isiLatar() {
    const em = ['⭐', '✨', '📚', '✏️', '🔢', '🔤', '🦉', '🎈', '🧮', '✅', '🍎', '🚀'];
    const h = $('#latar');
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.textContent = em[i % em.length];
      s.style.left = (Math.random() * 94) + 'vw';
      s.style.fontSize = (18 + Math.random() * 30) + 'px';
      s.style.animationDuration = (14 + Math.random() * 22) + 's';
      s.style.animationDelay = (-Math.random() * 30) + 's';
      h.appendChild(s);
    }
  }

  function init() {
    berhentiSemuaTimer();
    isiLatar();
    muatSplash();
    bukaLayar('screen-splash');
    perbaruiHUD(null);
  }

  document.addEventListener('DOMContentLoaded', init);
})();