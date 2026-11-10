/* app.js – logika JavaScript Catat Servis (dipakai semua halaman).
   Data disimpan di localStorage browser, jadi tidak butuh server. */
(function () {
  'use strict';

  /* ---------- Penyimpanan ---------- */
  var KEY = 'catatServis.v1', SESSION = 'catatServis.user';

  function seed() {
    var S = function (id, date, type, km, cost, ket, shop, work, note) {
      return { id: id, vid: 'v1', date: date, type: type, km: km, cost: cost, ket: ket, shop: shop, work: work, note: note };
    };
    return {
      vehicles: [{ id: 'v1', name: 'Honda Beat 2021', type: 'Sepeda motor', plat: 'B 1234 XYZ' }],
      services: [
        S('s12', '2026-09-12', 'Ganti oli mesin', 24380, 65000, 'Oli mesin diganti dengan oli baru', 'Bengkel Resmi AHASS', 'Kuras oli lama, isi oli baru 0,8 L (SAE 10W-30), cek kebocoran mesin', 'Ganti oli berikutnya sekitar 2.000–3.000 km lagi.'),
        S('s11', '2026-07-02', 'Ganti kampas rem', 22900, 85000, 'Kampas rem depan dan belakang diganti', 'Bengkel Jaya Motor', 'Ganti kampas rem depan & belakang, bersihkan kaliper, setel tuas rem', 'Kampas lama sudah tipis (kurang dari 1 mm).'),
        S('s10', '2026-04-18', 'Servis berkala', 21150, 150000, 'Servis berkala rutin', 'Bengkel Resmi AHASS', 'Ganti oli, bersihkan filter udara dan injektor, cek CVT, setel rem dan cek kelistrikan', 'Semua komponen dalam kondisi baik.'),
        S('s9', '2026-02-05', 'Ganti ban belakang', 19600, 240000, 'Ban belakang diganti baru', 'Toko Ban Sentosa', 'Pasang ban belakang 90/90-14 tubeless, balancing, atur tekanan angin', 'Ban lama aus tidak rata.'),
        S('s8', '2026-01-10', 'Ganti filter udara', 18900, 35000, 'Filter udara diganti', 'Bengkel Jaya Motor', 'Ganti filter udara baru dan bersihkan rumah filter', 'Filter lama kotor dan berdebu.'),
        S('s7', '2025-11-22', 'Ganti busi', 17800, 25000, 'Busi diganti', 'Bengkel Jaya Motor', 'Ganti busi baru dan cek celah elektroda', 'Tarikan mesin kembali halus.'),
        S('s6', '2025-10-05', 'Ganti oli mesin', 17200, 65000, 'Ganti oli mesin rutin', 'Bengkel Resmi AHASS', 'Kuras oli lama, isi oli baru 0,8 L', 'Tidak ada temuan lain.'),
        S('s5', '2025-08-14', 'Servis CVT', 16000, 120000, 'Servis CVT', 'Bengkel Resmi AHASS', 'Bersihkan ruang CVT, cek roller dan V-belt, beri pelumas', 'V-belt masih layak pakai.'),
        S('s4', '2025-07-01', 'Ganti aki', 15100, 180000, 'Aki diganti baru', 'Toko Aki Makmur', 'Ganti aki 12V 3,5Ah dan cek sistem pengisian', 'Sebelumnya starter terasa berat.'),
        S('s3', '2025-05-20', 'Servis berkala', 13900, 150000, 'Servis berkala rutin', 'Bengkel Resmi AHASS', 'Ganti oli, bersihkan filter udara, cek kelistrikan dan rem', 'Kondisi kendaraan baik.'),
        S('s2', '2025-03-08', 'Ganti oli mesin', 12600, 60000, 'Ganti oli mesin rutin', 'Bengkel Jaya Motor', 'Kuras oli lama, isi oli baru 0,8 L', 'Tidak ada temuan lain.'),
        S('s1', '2025-01-15', 'Ganti kampas rem', 11000, 80000, 'Kampas rem depan diganti', 'Bengkel Jaya Motor', 'Ganti kampas rem depan dan setel rem', 'Kampas lama sudah aus.')
      ],
      reminders: [
        { id: 'r1', title: 'Ganti oli mesin', date: '2026-11-12', km: 27000 },
        { id: 'r2', title: 'Servis berkala', date: '2027-01-18', km: 30000 }
      ]
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var d = JSON.parse(raw); if (d && d.vehicles && d.services && d.reminders) return d; }
    } catch (e) {}
    var s = seed(); save(s); return s;
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  var db = load();

  /* ---------- Pembantu ---------- */
  var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parts(iso) { var p = iso.split('-'); return { y: +p[0], m: +p[1] - 1, d: +p[2] }; }
  function fmtDate(iso, noYear) {
    var p = parts(iso), d = (p.d < 10 ? '0' : '') + p.d;
    return d + ' ' + BULAN[p.m] + (noYear ? '' : ' ' + p.y);
  }
  function idr(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
  function km(n) { return Number(n).toLocaleString('id-ID') + ' km'; }
  function todayISO() {
    var t = new Date(), m = t.getMonth() + 1, d = t.getDate();
    return t.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  }
  function dayNum(iso) { var p = parts(iso); return Date.UTC(p.y, p.m, p.d) / 86400000; }
  function daysUntil(iso) { return Math.round(dayNum(iso) - dayNum(todayISO())); }
  function shortName(v) { return v ? v.name.replace(/\s+\d{4}$/, '') : '—'; }
  function vehicle(id) { return db.vehicles.filter(function (v) { return v.id === id; })[0]; }
  function sortedServices() {
    return db.services.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.km - a.km; });
  }
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  function flash(msg) { try { sessionStorage.setItem('catatServis.flash', msg); } catch (e) {} }
  var BELL = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>';
  var CAR = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M3 11h18v5H3zM6 16v2M18 16v2"/></svg>';

  /* ---------- Sesi / login ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var user = null;
  try { user = sessionStorage.getItem(SESSION); } catch (e) {}

  if (page !== 'login' && page !== 'index' && !user) { location.replace('login.html'); return; }

  function initLogin() {
    if (user) { location.replace('dashboard.html'); return; }
    var f = document.querySelector('form'), err = $('err');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var u = f.elements.user.value.trim(), p = f.elements.pass.value;
      if (u.length < 3) { err.textContent = 'Nama pengguna minimal 3 karakter.'; return; }
      if (p.length < 4) { err.textContent = 'Kata sandi minimal 4 karakter.'; return; }
      try { sessionStorage.setItem(SESSION, u); } catch (x) {}
      location.href = 'dashboard.html';
    });
  }

  function initShell() {
    var name = document.querySelector('.user b');
    if (name && user) { name.textContent = user; var av = document.querySelector('.av'); if (av) av.textContent = user.charAt(0).toUpperCase(); }
    var out = document.querySelector('.user a');
    if (out) out.addEventListener('click', function () { try { sessionStorage.removeItem(SESSION); } catch (e) {} });
    var msg; try { msg = sessionStorage.getItem('catatServis.flash'); sessionStorage.removeItem('catatServis.flash'); } catch (e) {}
    if (msg) toast(msg);
  }

  /* ---------- Pencarian ---------- */
  function initSearch() {
    var input = $('q'); if (!input) return;
    var empty = $('nf');
    function filter() {
      var v = input.value.trim().toLowerCase(), n = 0;
      [].slice.call(document.querySelectorAll('tbody tr, .rem, .grid3 > .card')).forEach(function (el) {
        var ok = !v || el.textContent.toLowerCase().indexOf(v) > -1;
        el.style.display = ok ? '' : 'none'; if (ok) n++;
      });
      if (empty) empty.hidden = !(v && n === 0);
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && page !== 'riwayat') location.href = 'riwayat.html?q=' + encodeURIComponent(input.value.trim());
    });
    var q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; filter(); }
  }

  /* ---------- Halaman ---------- */
  function initDashboard() {
    var list = sortedServices(), last = list[0];
    var odo = db.services.reduce(function (m, s) { return Math.max(m, s.km); }, 0);
    var upcoming = db.reminders.filter(function (r) { return daysUntil(r.date) >= 0; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var next = upcoming[0], v = db.vehicles[0];
    var nextN = next ? fmtDate(next.date, true) : '—';
    var nextE = next ? (daysUntil(next.date) === 0 ? 'hari ini' : daysUntil(next.date) + ' hari lagi') : 'belum ada pengingat';

    var recent = list.slice(0, 4).map(function (s) {
      return '<tr><td>' + fmtDate(s.date) + '</td><td><b>' + esc(shortName(vehicle(s.vid))) + '</b></td><td>' + esc(s.type) + '</td><td class="r">' + km(s.km) + '</td></tr>';
    }).join('') || '<tr><td colspan="4" class="mut">Belum ada catatan servis.</td></tr>';

    var rems = upcoming.slice(0, 3).map(function (r, i) {
      return '<div class="rem"><div class="ic ' + (i ? 't' : '') + '">' + BELL + '</div><div><b>' + esc(r.title) + '</b><span>' + fmtDate(r.date) + ' atau ' + Number(r.km).toLocaleString('id-ID') + ' km</span></div></div>';
    }).join('') || '<p class="mut">Tidak ada pengingat mendatang.</p>';

    $('view').innerHTML =
      '<div class="stats">' +
      '<div class="card stat"><small>Total servis</small><div class="n">' + db.services.length + '</div><small>sejak pertama dicatat</small></div>' +
      '<div class="card stat"><small>Servis terakhir</small><div class="n">' + (last ? fmtDate(last.date, true) : '—') + '</div><small>' + (last ? esc(last.type) : 'belum ada data') + '</small></div>' +
      '<div class="card stat"><small>Odometer digital</small><div class="n">' + odo.toLocaleString('id-ID') + '</div><small>kilometer</small></div>' +
      '<div class="card stat dark"><small>Servis berikutnya</small><div class="n">' + nextN + '</div><em>' + nextE + '</em></div></div>' +
      '<div class="cols"><div class="card"><div class="row" style="margin-bottom:12px"><h2 style="margin:0">Riwayat terbaru</h2><a class="lnk" href="riwayat.html">Lihat semua</a></div>' +
      '<div class="tw"><table><thead><tr><th>Tanggal</th><th>Kendaraan</th><th>Jenis perawatan</th><th class="r">Odometer</th></tr></thead><tbody>' + recent + '</tbody></table></div></div>' +
      '<div class="stack"><div class="card"><h2>Pengingat mendatang</h2>' + rems + '</div>' +
      '<div class="card"><h2>Kendaraan aktif</h2>' + (v ? '<b style="font-size:20px">' + esc(v.name) + '</b><div class="mut">' + esc(v.type) + ', ' + esc(v.plat) + '</div>' : '<p class="mut">Belum ada kendaraan.</p>') + '</div></div></div>' +
      '<p style="margin-top:22px"><button type="button" class="lnk" id="reset">Kembalikan data contoh</button></p>';

    $('reset').addEventListener('click', function () {
      if (confirm('Semua data yang Anda tambahkan akan diganti dengan data contoh. Lanjutkan?')) {
        db = seed(); save(db); initDashboard(); toast('Data contoh dipulihkan');
      }
    });
  }

  function initCatat() {
    var f = $('fs'), sel = f.elements.v;
    sel.innerHTML = db.vehicles.map(function (v) { return '<option value="' + esc(v.id) + '">' + esc(v.name) + '</option>'; }).join('');
    if (!db.vehicles.length) {
      sel.innerHTML = '<option value="">Tambahkan kendaraan dulu</option>';
    }
    f.elements.date.value = todayISO();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!sel.value) { alert('Tambahkan kendaraan terlebih dahulu di halaman Kendaraan Saya.'); return; }
      var x = f.elements, work = x.work.value.trim();
      db.services.push({
        id: uid('s'), vid: sel.value, date: x.date.value, type: x.type.value,
        km: parseInt(x.km.value, 10) || 0, cost: parseInt(x.cost.value, 10) || 0,
        ket: work ? work.split(/[.,\n]/)[0].trim() : x.type.value,
        shop: x.shop.value.trim(), work: work, note: x.note.value.trim()
      });
      save(db); flash('Catatan servis tersimpan'); location.href = 'riwayat.html';
    });
  }

  function initRiwayat() {
    var box = $('riwayat');
    function draw() {
      var rows = sortedServices().map(function (s) {
        var det = '';
        if (s.shop) det += '<dt>Bengkel</dt><dd>' + esc(s.shop) + '</dd>';
        if (s.work) det += '<dt>Yang dikerjakan</dt><dd>' + esc(s.work) + '</dd>';
        if (s.note) det += '<dt>Catatan</dt><dd>' + esc(s.note) + '</dd>';
        return '<tr><td>' + fmtDate(s.date) + '</td><td><b>' + esc(shortName(vehicle(s.vid))) + '</b></td><td>' + esc(s.type) +
          '</td><td class="r">' + km(s.km) + '</td><td class="r">' + idr(s.cost) + '</td><td class="ket"><span class="ketr">' + esc(s.ket || s.type) +
          '</span><details><summary>Lihat rincian</summary><dl>' + (det || '<dt>Tidak ada rincian</dt>') + '</dl><button type="button" class="del" data-id="' + esc(s.id) + '">Hapus catatan</button></details></td></tr>';
      }).join('');
      box.innerHTML = '<table class="wide"><thead><tr><th>Tanggal</th><th>Kendaraan</th><th>Jenis perawatan</th><th class="r">Odometer</th><th class="r">Biaya</th><th>Keterangan</th></tr></thead><tbody>' +
        (rows || '<tr><td colspan="6" class="mut">Belum ada catatan servis.</td></tr>') + '</tbody></table>';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.del'); if (!b) return;
      if (!confirm('Hapus catatan servis ini?')) return;
      db.services = db.services.filter(function (s) { return s.id !== b.dataset.id; });
      save(db); draw(); toast('Catatan dihapus');
      var q = $('q'); if (q && q.value) q.dispatchEvent(new Event('input'));
    });
    draw();
  }

  function initKendaraan() {
    var box = $('vlist');
    function draw() {
      box.innerHTML = db.vehicles.map(function (v) {
        var n = db.services.filter(function (s) { return s.vid === v.id; }).length;
        return '<div class="card"><div class="ic" style="margin-bottom:14px">' + CAR + '</div><b style="font-size:20px">' + esc(v.name) +
          '</b><div class="mut">' + esc(v.type) + ' · ' + esc(v.plat) + '</div><p>' + n + ' catatan servis</p>' +
          '<button type="button" class="del" data-id="' + esc(v.id) + '">Hapus kendaraan</button></div>';
      }).join('') || '<p class="mut">Belum ada kendaraan. Tambahkan di bawah.</p>';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.del'); if (!b) return;
      var n = db.services.filter(function (s) { return s.vid === b.dataset.id; }).length;
      if (!confirm('Hapus kendaraan ini' + (n ? ' beserta ' + n + ' catatan servisnya' : '') + '?')) return;
      db.vehicles = db.vehicles.filter(function (v) { return v.id !== b.dataset.id; });
      db.services = db.services.filter(function (s) { return s.vid !== b.dataset.id; });
      save(db); draw(); toast('Kendaraan dihapus');
    });
    $('fv').addEventListener('submit', function (e) {
      e.preventDefault();
      var x = this.elements;
      db.vehicles.push({ id: uid('v'), name: x.name.value.trim(), type: x.type.value, plat: x.plat.value.trim().toUpperCase() });
      save(db); this.reset(); draw(); toast('Kendaraan tersimpan');
    });
    draw();
  }

  function initPengingat() {
    var box = $('rlist');
    function draw() {
      var list = db.reminders.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      box.innerHTML = list.map(function (r, i) {
        var d = daysUntil(r.date);
        var st = d < 0 ? 'terlambat ' + (-d) + ' hari' : d === 0 ? 'hari ini' : d + ' hari lagi';
        return '<div class="rem"><div class="ic ' + (i % 2 ? 't' : '') + '">' + BELL + '</div><div><b>' + esc(r.title) + '</b><span>' + fmtDate(r.date) +
          ' atau ' + Number(r.km).toLocaleString('id-ID') + ' km · ' + st + '</span></div>' +
          '<button type="button" class="del" style="margin-left:auto" data-id="' + esc(r.id) + '">Hapus</button></div>';
      }).join('') || '<p class="mut">Belum ada pengingat.</p>';
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.del'); if (!b) return;
      db.reminders = db.reminders.filter(function (r) { return r.id !== b.dataset.id; });
      save(db); draw(); toast('Pengingat dihapus');
    });
    var f = $('fr'); f.elements.date.min = todayISO();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var x = f.elements;
      db.reminders.push({ id: uid('r'), title: x.title.value.trim(), date: x.date.value, km: parseInt(x.km.value, 10) || 0 });
      save(db); f.reset(); draw(); toast('Pengingat tersimpan');
    });
    draw();
  }

  function initLaporan() {
    var years = {};
    db.services.forEach(function (s) { years[parts(s.date).y] = 1; });
    var ys = Object.keys(years).map(Number).sort(function (a, b) { return b - a; });
    var year = ys[0] || new Date().getFullYear();

    function short(n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'jt' : Math.round(n / 1000) + 'rb'; }

    function draw() {
      var total = db.services.reduce(function (t, s) { return t + s.cost; }, 0), n = db.services.length;
      var perMonth = {};
      db.services.forEach(function (s) { var p = parts(s.date); if (p.y === year) perMonth[p.m] = (perMonth[p.m] || 0) + s.cost; });
      var months = Object.keys(perMonth).map(Number).sort(function (a, b) { return a - b; });
      var max = months.reduce(function (m, k) { return Math.max(m, perMonth[k]); }, 0) || 1;
      var bars = months.map(function (m) {
        return '<div class="bar"><span>' + short(perMonth[m]) + '</span><i style="height:' + Math.max(4, Math.round(perMonth[m] / max * 90)) + '%"></i><span>' + BULAN[m] + ' ' + String(year).slice(2) + '</span></div>';
      }).join('');
      var opts = (ys.length ? ys : [year]).map(function (y) { return '<option' + (y === year ? ' selected' : '') + '>' + y + '</option>'; }).join('');
      $('view').innerHTML =
        '<div class="stats" style="grid-template-columns:repeat(3,1fr)">' +
        '<div class="card stat"><small>Total biaya</small><div class="n" style="font-size:30px">' + idr(total) + '</div></div>' +
        '<div class="card stat"><small>Rata-rata per servis</small><div class="n" style="font-size:30px">' + idr(n ? total / n : 0) + '</div></div>' +
        '<div class="card stat"><small>Jumlah servis</small><div class="n" style="font-size:30px">' + n + '</div></div></div>' +
        '<div class="card"><div class="row" style="margin-bottom:12px"><h2 style="margin:0">Biaya per bulan (' + year + ')</h2>' +
        '<select id="yr" aria-label="Tahun" style="width:auto">' + opts + '</select></div>' +
        (bars ? '<div class="bars">' + bars + '</div>' : '<p class="mut">Belum ada data pada tahun ini.</p>') + '</div>';
      $('yr').addEventListener('change', function () { year = +this.value; draw(); });
    }
    draw();
  }

  /* ---------- Mulai ---------- */
  var routes = {
    login: initLogin, dashboard: initDashboard, 'catat-servis': initCatat, riwayat: initRiwayat,
    kendaraan: initKendaraan, pengingat: initPengingat, laporan: initLaporan
  };
  if (routes[page]) routes[page]();
  initShell();
  initSearch();
})();
