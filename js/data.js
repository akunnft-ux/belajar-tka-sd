/* ============================================================
   DATA MATERI & SOAL TKA SD/MI
   Format merujuk app.js:
   - materi: id, mapel, judul, emoji, warna, deskripsi,
             slide[], pertanyaan[]
   - slide: title/judul/sub/emoji | konten | mini
   - soal: type 'pg'|'pgk'|'kategori', teks, opsi, jawaban/
           jawaban_multi/pernyataan, penjelasan, gambar, gambarA
   ============================================================ */
"use strict";

/* ---------------- BANTUAN GAMBAR SVG ---------------- */
function svgBentuk(kunci) {
  const s = [];
  s.push("<svg viewBox='0 0 120 80' class='svg-bentuk'><title>bangun datar</title>");
  s.push("<g fill='#fff6d9' stroke='#f4a340' stroke-width='4' stroke-linejoin='round'>");
  switch (kunci) {
    case 'persegi': s.push("<rect x='35' y='15' width='50' height='50' rx='3'/>"); break;
    case 'pp': s.push("<rect x='15' y='20' width='90' height='40' rx='3'/>"); break;
    case 'segitiga': s.push("<polygon points='60,15 15,65 105,65'/>"); break;
    case 'lingkaran': s.push("<circle cx='60' cy='40' r='30'/>"); break;
    case 'jajar': s.push("<polygon points='20,60 50,20 100,20 70,60'/>"); break;
    case 'trapesium': s.push("<polygon points='25,60 40,25 80,25 95,60'/>"); break;
    case 'layang': s.push("<polygon points='60,10 100,60 60,70 20,60'/>"); break;
    default: s.push("<rect x='30' y='20' width='60' height='40' rx='3'/>");
  }
  s.push("</g></svg>");
  return s.join("");
}
function svgJam(jam, menit) {
  const s = [];
  s.push("<svg viewBox='0 0 100 100' class='svg-jam'><title>jam</title>");
  s.push("<circle cx='50' cy='50' r='44' fill='#fff' stroke='#1e2a47' stroke-width='5'/>");
  for (let n = 1; n <= 12; n++) {
    const a = n * 30;
    s.push("<text x='" + (50 + 34 * Math.sin(a * Math.PI / 180) - 4).toFixed(1) + "' y='" + (50 - 34 * Math.cos(a * Math.PI / 180) + 5).toFixed(1) + "' font-size='11' fill='#1e2a47'>" + n + "</text>");
  }
  const jamA = ((jam % 12) + menit / 60) * 30, menitA = menit * 6;
  s.push("<line x1='50' y1='50' x2='" + (50 + 18 * Math.sin(jamA * Math.PI / 180)).toFixed(1) + "' y2='" + (50 - 18 * Math.cos(jamA * Math.PI / 180)).toFixed(1) + "' stroke='#e4572e' stroke-width='5' stroke-linecap='round'/>");
  s.push("<line x1='50' y1='50' x2='" + (50 + 30 * Math.sin(menitA * Math.PI / 180)).toFixed(1) + "' y2='" + (50 - 30 * Math.cos(menitA * Math.PI / 180)).toFixed(1) + "' stroke='#1e2a47' stroke-width='3' stroke-linecap='round'/>");
  s.push("</svg>");
  return s.join("");
}
function svgDiagram(data) {
  const s = [];
  let maks = 1;
  for (let i = 0; i < data.length; i++) if (data[i].nilai > maks) maks = data[i].nilai;
  s.push("<svg viewBox='0 0 200 120' class='svg-diagram'><title>diagram batang</title>");
  s.push("<rect width='200' height='120' fill='#f3f9ff' rx='8'/>");
  s.push("<text x='10' y='18' font-size='10' fill='#64748b'>" + (maks) + "</text>");
  const bw = 30, gap = (200 - data.length * bw) / (data.length + 1);
  for (let i = 0; i < data.length; i++) {
    const h = (data[i].nilai / maks) * 82;
    const x = gap + i * (bw + gap);
    s.push("<rect x='" + x.toFixed(1) + "' y='" + (105 - h).toFixed(1) + "' width='" + bw + "' rx='5' height='" + h.toFixed(1) + "' fill='#4f6ef7'/>");
    s.push("<text x='" + (x + bw / 2 - 3).toFixed(1) + "' y='118' font-size='9' fill='#334155'>" + data[i].label.charAt(0) + "</text>");
    s.push("<text x='" + (x + bw / 2 - 4).toFixed(1) + "' y='" + (100 - h).toFixed(1) + "' font-size='9' fill='#0f172a'>" + data[i].nilai + "</text>");
  }
  s.push("</svg>");
  return s.join("");
}
function svgPizza(dimakan, total, label, judul) {
  dimakan = dimakan || 3; total = total || 4;
  const s = [];
  s.push("<svg viewBox='0 0 100 100' class='svg-pizza'><title>pizza</title>");
  s.push("<circle cx='50' cy='50' r='44' fill='#ffd166' stroke='#f59e0b' stroke-width='4'/>");
  const rad = (2 - (dimakan / total)) * Math.PI;
  const a0 = Math.PI / 2;
  s.push("<path d='M50 50 L " + (50 + 44 * Math.cos(a0)).toFixed(1) + " " + (50 - 44 * Math.sin(a0)).toFixed(1) + " A 44 44 0 " + (rad > Math.PI ? 1 : 0) + " 1 " + (50 + 44 * Math.cos(a0 - rad)).toFixed(1) + " " + (50 - 44 * Math.sin(a0 - rad)).toFixed(1) + " Z' fill='#e4572e' stroke='#b0351d' stroke-width='2'/>");
  if (label) s.push("<text x='50' y='88' font-size='12' text-anchor='middle' fill='#1e2a47' font-weight='bold'>" + label + "</text>");
  if (judul) s.push("<text x='50' y='14' font-size='11' text-anchor='middle' fill='#1e2a47'>" + judul + "</text>");
  s.push("</svg>");
  return s.join("");
}
function svgCatur() {
  const s = [];
  s.push("<svg viewBox='0 0 120 120' class='svg-catur'><title>gambar</title>");
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      s.push("<rect x='" + (6 + c * 18) + "' y='" + (6 + r * 18) + "' width='18' height='18' fill='" + ((r + c) % 2 ? '#3b4a7a' : '#f5e6c8') + "'/>");
    }
  }
  s.push("</svg>");
  return s.join("");
}

/* ---------------- INFORMASI MAPEL ---------------- */
const INFO_MAPEL = {
  matematika: { nama: 'Matematika', emoji: '🧮', grad: 'linear-gradient(135deg,#4f6ef7,#7c3aed)', desk: 'Bilangan, pecahan, bangun datar & data' },
  bahasa: { nama: 'Bahasa Indonesia', emoji: '📖', grad: 'linear-gradient(135deg,#f97316,#ef476f)', desk: 'Membaca teks, kosakata & kalimat efektif' }
};

/* ============================================================
   MATERI UTAMA
   ============================================================ */
const MATERI = [
/* -------------- MATERI 1 : BILANGAN -------------- */
{
  id: 1,
  mapel: 'matematika',
  judul: 'Bilangan Bulat & Operasi Hitung',
  emoji: '🔢',
  warna: '#4f6ef7',
  deskripsi: 'Urutan operasi, bilangan bulat, dan pola bilangan. Sering keluar di TKA!',
  slide: [
    { tipe: 'title', judul: 'Bilangan Bulat & Operasi Hitung', sub: 'Kita bahas urutan operasi, bilangan bulat, dan pola bilangan. Yuk, mulai!', emoji: '🔢' },
    {
      tipe: 'konten', emoji: '🧮', judul: 'Aturan Urutan Operasi',
      teks: ['Satu aturan emas agar tidak salah hitung:',
        '1. Kerjakan dulu yang di dalam tanda kurung ( )',
        '2. Lalu perkalian (×) dan pembagian (÷), dari kiri ke kanan',
        '3. Terakhir baru penjumlahan (+) dan pengurangan (−), dari kiri ke kanan'],
      tip: 'Contoh: 8 + 4 × 3 = 8 + 12 = 20, BUKAN 36!'
    },
    {
      tipe: 'konten', emoji: '🧮', judul: 'Bilangan Bulat: Positif & Negatif',
      teks: ['Bilangan bulat terdiri dari bilangan negatif, nol, dan positif.',
        'Di garis bilangan, semakin ke kiri semakin KECIL nilainya.',
        'Contoh: −3 lebih kecil dari −1, karena −3 berada di sebelah kiri.'],
      tip: 'Naik 5 dari −2 artinya −2 + 5 = 3.'
    },
    {
      tipe: 'konten', emoji: '🧮', judul: 'Soal Cerita Dua Langkah',
      teks: ['Soal TKA suka memakai cerita santai:',
        'Contoh: "Ibu membeli 5 bungkus permen, tiap bungkus berisi 4 permen. Permen dibagikan kepada 2 anak sama banyak."',
        'Langkah: 5 × 4 = 20, lalu 20 ÷ 2 = 10. Jadi tiap anak mendapat 10 permen.'],
      tip: 'Buat cerita menjadi bentuk hitung dulu, baru kerjakan.'
    },
    {
      tipe: 'konten', emoji: '🧮', judul: 'Pola Bilangan',
      teks: ['Perhatikan SELISIH antar bilangan untuk menemukan polanya.',
        'Contoh: 2, 4, 6, 8, ... → beda 2. Bilangan selanjutnya 10.',
        'Contoh lain: 1, 2, 4, 8, ... → tiap bilangan dikali 2, selanjutnya 16.'],
      tip: 'Dua pola paling umum: bertambah tetap dan dikali tetap.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Hasil dari 12 + 8 : 4 adalah …',
      opsi: ['5', '20', '14', '8'],
      jwb: 2,
      penjelasan: 'Kerjakan dulu 8 : 4 = 2, lalu 12 + 2 = 14.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Sekarang mari uji pemahamanmu di kuis!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Hasil dari 45 + 28 − 15 adalah …',
      opsi: ['68', '58', '48', '88'],
      jawaban: 1,
      penjelasan: 'Kerjakan berurutan dari kiri: 45 + 28 = 73, lalu 73 − 15 = 58. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Di bawah ini yang hasilnya sama dengan 20 adalah …',
      opsi: ['5 × 4', '15 + 5', '30 − 5', '2 × 10', '45 ÷ 9'],
      jawaban_multi: [0, 1, 3],
      penjelasan: '5×4 = 20 ✓, 15+5 = 20 ✓, 2×10 = 20 ✓. Sedangkan 30−5 = 25 dan 45÷9 = 5.'
    },
    {
      type: 'pg',
      teks: 'Suhu di puncak gunung malam hari −6°C. Siangnya naik 10°C. Suhu siang hari adalah …',
      opsi: ['4°C', '−4°C', '16°C', '−16°C'],
      jawaban: 0,
      penjelasan: 'Naik 10 dari −6: −6 + 10 = 4°C. Jawaban: A.'
    },
    {
      type: 'kategori',
      teks: 'Tentukan benar/salah setiap pernyataan berikut!',
      pernyataan: [
        { teks: '2 + 3 × 4 = 20', benar: false },
        { teks: '−7 lebih kecil daripada −2', benar: true },
        { teks: '12 − 8 + 2 = 6', benar: true },
        { teks: '8 × 3 ÷ 6 = 4', benar: true }
      ],
      penjelasan: '(1) 3×4=12, 2+12=14, bukan 20 → Salah. (2) −7 di kiri garis bilangan → benar. (3) 12−8=4, 4+2=6 → Benar. (4) 8×3=24, 24÷6=4 → Benar.'
    },
    {
      type: 'pg',
      teks: 'Candra membeli 6 bungkus kelereng. Tiap bungkus berisi 5 kelereng. Kelereng itu dibagikan sama rata kepada 3 temannya. Tiap teman mendapat … kelereng.',
      opsi: ['10', '15', '30', '5'],
      jawaban: 0,
      penjelasan: 'Total = 6 × 5 = 30. Dibagi 3 = 30 ÷ 3 = 10. Jawaban: A.'
    },
    {
      type: 'pgk',
      teks: 'Bilangan selanjutnya dari pola 3, 7, 11, 15, ... adalah … TIAP BILANGAN BERTAMBAH 4: (19) dan (23).',
      opsi: ['19', '14', '20', '23', '18'],
      jawaban_multi: [0, 3],
      penjelasan: 'Pola bertambah 4: 3, 7, 11, 15, 19, 23. Jadi 19 dan 23 benar.'
    },
    {
      type: 'pg',
      teks: 'Lima buah kartu bernomor: −4, −1, 0, 2, 3. Urutan kartu dari bilangan terkecil adalah …',
      opsi: ['−4, −1, 0, 2, 3', '3, 2, 0, −1, −4', '0, −1, −4, 2, 3', '−1, −4, 0, 2, 3'],
      jawaban: 0,
      penjelasan: 'Urutan naik garis bilangan: −4, −1, 0, 2, 3. Jawaban: A.'
    }
  ]
}
,

/* -------------- MATERI 2 : PECAHAN -------------- */
{
  id: 2,
  mapel: 'matematika',
  judul: 'Pecahan, Desimal & Persen',
  emoji: '🍕',
  warna: '#7c3aed',
  deskripsi: 'Pecahan senilai, desimal, persen, dan operasi pecahan. Materi TKA favorit!',
  slide: [
    { tipe: 'title', judul: 'Pecahan, Desimal & Persen', sub: 'Pahami hubungan tiga bentuk angka ini — dijamin lancar mengerjakan soal!', emoji: '🍕' },
    {
      tipe: 'konten', emoji: '🍕', judul: 'Pecahan Senilai',
      teks: ['Pecahan senilai adalah pecahan yang nilainya sama meski angkanya beda.',
        '1/2 = 2/4 = 4/8. Cara mendapatkannya: kalikan pembilang & penyebut dengan angka yang sama.'],
      tip: 'Kalikan atas dan bawah sekali, hasilnya tetap senilai.'
    },
    {
      tipe: 'konten', emoji: '🍕', judul: 'Pecahan → Desimal → Persen',
      teks: ['Ubah pecahan menjadi per seratus:',
        '3/4 = 75/100 = 0,75 = 75%',
        '1/2 = 50/100 = 0,50 = 50%'],
      tip: 'Persen artinya "per seratus". 0,75 dibaca "nol koma tujuh lima".'
    },
    {
      tipe: 'konten', emoji: '🍕', judul: 'Penjumlahan & Pengurangan Pecahan',
      teks: ['Samakan penyebut dulu sebelum menjumlahkan.',
        'Contoh: 1/4 + 1/2 = 1/4 + 2/4 = 3/4',
        'Contoh: 3/4 − 1/2 = 3/4 − 2/4 = 1/4'],
      tip: 'Jika penyebut sudah sama, tinggal jumlahkan pembilangnya.'
    },
    {
      tipe: 'konten', emoji: '🍕', judul: 'Perkalian & Pembagian Pecahan',
      teks: ['Perkalian: kalikan pembilang × pembilang, penyebut × penyebut.',
        'Contoh: 1/2 × 2/3 = 2/6 = 1/3',
        'Pembagian: balik pecahan kedua, lalu kalikan.',
        'Contoh: 1/2 ÷ 3/4 = 1/2 × 4/3 = 4/6 = 2/3'],
      tip: 'Selalu sederhanakan hasil di akhir ya!'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Bentuk desimal dari 1/2 adalah …',
      opsi: ['0,2', '0,5', '2,0', '0,05'],
      jwb: 1,
      penjelasan: '1/2 = 50/100 = 0,5.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Coba kuis pecahan, desimal, dan persen!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Bentuk persen dari 3/4 adalah …',
      opsi: ['30%', '75%', '34%', '35%'],
      jawaban: 1,
      penjelasan: '3/4 = 75/100 = 75%. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Pecahan yang senilai dengan 1/2 adalah …',
      opsi: ['2/4', '3/6', '2/3', '1/4', '5/10'],
      jawaban_multi: [0, 1, 4],
      penjelasan: '2/4 = 1/2 ✓, 3/6 = 1/2 ✓, 5/10 = 1/2 ✓. Sedangkan 2/3 dan 1/4 tidak senilai.'
    },
    {
      type: 'pg',
      teks: 'Hasil dari 1/4 + 1/2 adalah …',
      opsi: ['2/6', '3/4', '2/4', '1/6'],
      jawaban: 1,
      penjelasan: 'Samakan penyebut: 1/4 + 2/4 = 3/4. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Tentukan benar/salah pernyataan berikut!',
      pernyataan: [
        { teks: '0,5 = 50%', benar: true },
        { teks: '1/3 lebih besar daripada 1/2', benar: false },
        { teks: '3/5 = 0,6', benar: true },
        { teks: '2/4 senilai dengan 1/2', benar: true }
      ],
      penjelasan: '(1) 0,5 = 50% → Benar. (2) 1/3 < 1/2 → Salah. (3) 3/5 = 0,6 → Benar. (4) 2/4 = 1/2 → Benar.'
    },
    {
      type: 'pg',
      teks: 'Harga buku Rp10.000 mendapat diskon 25%. Besar potongan harganya adalah …',
      opsi: ['Rp1.500', 'Rp2.500', 'Rp5.000', 'Rp2.000'],
      jawaban: 1,
      penjelasan: '25% × 10.000 = 25/100 × 10.000 = 2.500. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Hasil hitung yang BENAR adalah …',
      opsi: ['1/2 + 1/2 = 1', '1/3 + 1/3 = 2/3', '1/4 × 2 = 1/2', '1/2 × 1/2 = 1/4', '1/2 ÷ 1/2 = 1/4'],
      jawaban_multi: [0, 1, 2, 3],
      penjelasan: '1/2+1/2=1 ✓, 1/3+1/3=2/3 ✓, 1/4×2=1/2 ✓, 1/2×1/2=1/4 ✓. Sedangkan 1/2÷1/2 = 1, bukan 1/4.'
    },
    {
      type: 'pg',
      teks: 'Sasa memiliki 2/3 liter susu, lalu membeli lagi 1/6 liter. Total susu Sasa adalah … liter.',
      opsi: ['3/9', '5/6', '3/6', '1/2'],
      jawaban: 1,
      penjelasan: '2/3 = 4/6, lalu 4/6 + 1/6 = 5/6. Jawaban: B.'
    }
  ]
}
,

/* -------------- MATERI 3 : BANGUN DATAR -------------- */
{
  id: 3,
  mapel: 'matematika',
  judul: 'Bangun Datar & Pengukuran',
  emoji: '📐',
  warna: '#06d6a0',
  deskripsi: 'Luas & keliling bangun datar, sudut, dan konversi satuan. Rutin keluar dalam ujian!',
  slide: [
    { tipe: 'title', judul: 'Bangun Datar & Pengukuran', sub: 'Kenali rumus luas & keliling, lalu belajar mengubah satuan. Semangat!', emoji: '📐' },
    {
      tipe: 'konten', emoji: '📐', judul: 'Rumus Luas & Keliling',
      gambar: 'bangun-datar',
      teks: ['Hafalkan rumus berikut:',
        'Persegi: L = s × s, K = 4 × s',
        'Persegi panjang: L = p × l, K = 2 × (p + l)',
        'Segitiga: L = 1/2 × alas × tinggi'],
      tip: 'Keliling = jumlah semua sisi. Luas = isi area dalam bangun.'
    },
    {
      tipe: 'konten', emoji: '📐', judul: 'Mengenal Sudut',
      gambar: 'jam-sudut',
      teks: ['Sudut adalah daerah antara dua garis yang bertemu.',
        'Sudut lancip < 90°',
        'Sudut siku-siku = 90°',
        'Sudut tumpul > 90° dan < 180°',
        'Sudut lurus = 180°'],
      tip: 'Bayangkan jarum jam: pukul 3 membentuk sudut siku-siku.'
    },
    {
      tipe: 'konten', emoji: '📐', judul: 'Tangga Satuan Panjang',
      teks: ['Satuan panjang: km, hm, dam, m, dm, cm, mm.',
        'Tiap turun satu tangga → dikali 10.',
        'Tiap naik satu tangga → dibagi 10.',
        'Contoh: 2 km = 2000 m. 300 cm = 3 m.'],
      tip: '400 cm = 4 m (naik 2 tangga: 400 ÷ 100).'
    },
    {
      tipe: 'konten', emoji: '📐', judul: 'Satuan Waktu',
      teks: ['1 jam = 60 menit',
        '1 menit = 60 detik',
        '1 hari = 24 jam',
        '1 minggu = 7 hari'],
      tip: '2,5 jam = 150 menit, karena 2×60 + 0,5×60.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah …',
      opsi: ['40 cm²', '26 cm²', '13 cm²', '35 cm²'],
      jwb: 0,
      penjelasan: 'L = 8 × 5 = 40 cm².',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Ayo kerjakan kuis bangun datar & pengukuran!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Keliling persegi dengan panjang sisi 9 cm adalah …',
      opsi: ['36 cm', '18 cm', '81 cm', '27 cm'],
      jawaban: 0,
      penjelasan: 'K = 4 × 9 = 36 cm. Jawaban: A.'
    },
    {
      type: 'pg',
      teks: 'Luas persegi panjang yang panjangnya 12 cm dan lebarnya 7 cm adalah …',
      opsi: ['84 cm²', '38 cm²', '19 cm²', '76 cm²'],
      jawaban: 0,
      penjelasan: 'L = 12 × 7 = 84 cm². Jawaban: A.'
    },
    {
      type: 'pgk',
      teks: 'Pernyataan tentang sudut yang BENAR adalah …',
      opsi: ['Sudut lancip besarnya kurang dari 90°', 'Sudut tumpul besarnya 180°', 'Sudut siku-siku besarnya 90°', 'Sudut lurus besarnya 180°', 'Sudut lancip besarnya lebih dari 90°'],
      jawaban_multi: [0, 2, 3],
      penjelasan: 'Lancip < 90° ✓, siku-siku = 90° ✓, lurus = 180° ✓. Sudut tumpul justru antara 90°–180°.'
    },
    {
      type: 'pg',
      teks: 'Sebuah taman berbentuk persegi panjang dengan panjang 25 m dan lebar 15 m. Keliling taman adalah …',
      opsi: ['40 m', '80 m', '375 m', '60 m'],
      jawaban: 1,
      penjelasan: 'K = 2 × (25 + 15) = 2 × 40 = 80 m. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Tentukan benar/salah pernyataan berikut!',
      pernyataan: [
        { teks: '2 km = 2.000 m', benar: true },
        { teks: '500 cm = 5 m', benar: true },
        { teks: '1 jam = 60 detik', benar: false },
        { teks: '1/2 jam = 30 menit', benar: true }
      ],
      penjelasan: '(1) 2×1000 = 2.000 ✓. (2) 500÷100 = 5 ✓. (3) 1 jam = 3.600 detik ✗. (4) 1/2×60 = 30 ✓.'
    },
    {
      type: 'pg',
      teks: 'Luas segitiga dengan alas 12 cm dan tinggi 8 cm adalah …',
      opsi: ['96 cm²', '48 cm²', '24 cm²', '20 cm²'],
      jawaban: 1,
      penjelasan: 'L = 1/2 × 12 × 8 = 48 cm². Jawaban: B.'
    },
    {
      type: 'pg',
      teks: 'Dito mengukur panjang meja 150 cm. Dalam satuan meter, panjang meja itu … m.',
      opsi: ['1,5', '15', '0,15', '1500'],
      jawaban: 0,
      penjelasan: '150 cm ÷ 100 = 1,5 m. Jawaban: A.'
    }
  ]
}
,

/* -------------- MATERI 4 : DATA -------------- */
{
  id: 4,
  mapel: 'matematika',
  judul: 'Data & Statistik',
  emoji: '📊',
  warna: '#118ab2',
  deskripsi: 'Membaca diagram, rata-rata, median, dan modus. Soal cerita TKA kesukaan!',
  slide: [
    { tipe: 'title', judul: 'Data & Statistik', sub: 'Belajar membaca diagram dan menghitung rata-rata, median, modus.', emoji: '📊' },
    {
      tipe: 'konten', emoji: '📊', judul: 'Rata-rata (Mean)',
      teks: ['Rata-rata = jumlah semua data ÷ banyaknya data.',
        'Contoh: Nilai 70, 80, 90 → (70+80+90) ÷ 3 = 240 ÷ 3 = 80.',
        'Jadi rata-ratanya adalah 80.'],
      tip: 'Cek logika: rata-rata selalu berada di antara data terkecil dan terbesar.'
    },
    {
      tipe: 'konten', emoji: '📊', judul: 'Median & Modus',
      teks: ['Median = nilai TENGGAH setelah data diurutkan.',
        'Contoh genap: 3, 5, 5, 7 → median (5+5) ÷ 2 = 5.',
        'Modus = data yang PALING SERING muncul.',
        'Contoh: 3, 5, 5, 7 → modus = 5.'],
      tip: 'Urutkan data dulu sebelum mencari median! Jangan lupa.'
    },
    {
      tipe: 'konten', emoji: '📊', judul: 'Membaca Diagram',
      gambar: 'diagram-hobi',
      teks: ['Diagram membantu kita melihat data sekilas.',
        'Tinggi batang menunjukkan besar nilai.',
        'Bandingkan tinggi batang untuk menjawab pertanyaan.'],
      tip: 'Baca label sumbu dengan teliti.' 
    },
    {
      tipe: 'konten', emoji: '📊', judul: 'Cara Menjumlahkan Cepat',
      teks: ['Jumlahkan data satu per satu, lalu bagi dengan banyak data.',
        'Trik soal cerita: Total = rata-rata × banyak data.',
        'Total = 8 × 6, jika rata-rata 8 dan ada 6 data.'],
      tip: 'Gunakan trik Total = rata-rata × banyak data.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Rata-rata dari 4, 6, 8, 10 adalah …',
      opsi: ['7', '5', '8', '28'],
      jwb: 0,
      penjelasan: 'Jumlah = 4+6+8+10 = 28. 28 ÷ 4 = 7.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Kerjakan kuis data & statistik!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Nilai ulangan Bila: 70, 80, 90, 100. Rata-rata nilai Bila adalah …',
      opsi: ['85', '80', '90', '75'],
      jawaban: 0,
      penjelasan: 'Jumlah = 340, ada 4 data: 340 ÷ 4 = 85. Jawaban: A.'
    },
    {
      type: 'pgk',
      teks: 'Pernyataan yang BENAR tentang data: 2, 4, 4, 6, 8 adalah …',
      opsi: ['Modus data adalah 4', 'Jumlah data ada 4', 'Data paling sering muncul adalah 4', 'Seluruh data berjumlah 24', 'Median data adalah 6'],
      jawaban_multi: [0, 2, 3],
      penjelasan: 'Modus = 4 (muncul 2 kali) ✓. Jumlah nilai = 24 ✓. Ada 5 data, bukan 4 ✗. Median (nilai tengah) = 4, bukan 6 ✗.'
    },
    {
      type: 'pg',
      teks: 'Bacalah teks berikut!\n\nDiagram batang menunjukkan banyak buku yang dibaca 5 siswa: Andi 6 buku, Budi 8 buku, Cinta 4 buku, Dini 7 buku, Edo 5 buku.\n\nSiswa yang paling banyak membaca buku adalah …',
      opsi: ['Andi', 'Budi', 'Cinta', 'Dini'],
      jawaban: 1,
      penjelasan: 'Budi membaca 8 buku — paling banyak. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Berikut data nilai ulangan: 6, 8, 5, 6, 9. Tentukan benar/salah pernyataan!',
      pernyataan: [
        { teks: 'Modus data tersebut adalah 6', benar: true },
        { teks: 'Rata-rata (mean) data tersebut adalah 7', benar: false },
        { teks: 'Nilai 6 muncul paling sering', benar: true },
        { teks: 'Jumlah seluruh data adalah 34', benar: true }
      ],
      penjelasan: 'Modus = 6 (muncul 2×) ✓. Mean = 34÷5 = 6,8 ✗. Nilai 6 paling sering ✓. Jumlah = 6+8+5+6+9 = 34 ✓.'
    },
    {
      type: 'pg',
      teks: 'Median dari data: 4, 9, 6, 7, 5, 8 adalah …',
      opsi: ['6,5', '6', '7', '5,5'],
      jawaban: 0,
      penjelasan: 'Urutkan: 4, 5, 6, 7, 8, 9. Data genap → median = (6+7) ÷ 2 = 6,5. Jawaban: A.'
    },
    {
      type: 'pg',
      teks: 'Rata-rata 5 data adalah 74. Jika jumlah 4 data pertama adalah 296, maka data kelima adalah …',
      opsi: ['74', '76', '80', '70'],
      jawaban: 0,
      penjelasan: 'Total = 74 × 5 = 370. Data kelima = 370 − 296 = 74. Jawaban: A.'
    },
    {
      type: 'pg',
      teks: 'Nilai ulangan Rani: 75, 80, 85. Agar rata-rata menjadi 82, nilai ulangan keempat minimal …',
      opsi: ['88', '85', '90', '86'],
      jawaban: 0,
      penjelasan: 'Total 4 data = 82 × 4 = 328. Nilai ke-4 = 328 − (75+80+85=240) = 88. Jawaban: A.'
    }
  ]
}
,

/* -------------- MATERI 5 : MEMBACA -------------- */
{
  id: 5,
  mapel: 'bahasa',
  judul: 'Membaca & Menangkap Isi Teks',
  emoji: '📖',
  warna: '#f97316',
  deskripsi: 'Ide pokok, informasi penting, dan simpulan teks. Cakupan utama TKA Bahasa!',
  slide: [
    { tipe: 'title', judul: 'Membaca & Menangkap Isi Teks', sub: 'Belajar menemukan ide pokok dan informasi penting dalam bacaan.', emoji: '📖' },
    {
      tipe: 'konten', emoji: '📖', judul: 'Ide Pokok Paragraf',
      teks: ['Ide pokok = gagasan UTAMA sebuah paragraf.',
        'Biasanya ada di kalimat pertama atau kalimat terakhir.',
        'Ide pokok menjawab: "Paragraf ini membicarakan apa?"'],
      tip: 'Kalimat lain dalam paragraf hanyalah penjelas ide pokok.'
    },
    {
      tipe: 'konten', emoji: '📖', judul: 'Informasi Tersurat & Tersirat',
      teks: ['Tersurat: tertulis JELAS di teks (angka, nama, tempat, waktu).',
        'Tersirat: tidak tertulis, harus DISIMPULKAN dari bacaannya.',
        'Kata kunci: "dapat kita ketahui", "tersirat", "simpulan".'],
      tip: 'Gunakan kata tanya 5W+1H: Apa, Siapa, Kapan, di Mana, Mengapa, Bagaimana.'
    },
    {
      tipe: 'konten', emoji: '📖', judul: 'Menarik Kesimpulan',
      teks: ['Kesimpulan = rangkuman inti dari isi teks.',
        'Tidak boleh memasukkan hal yang tidak ada di teks.',
        'Cocokkan kesimpulan dengan seluruh isi bacaan.'],
      tip: 'Jika ada pilihan terlalu "lebar" atau "sempit", pasti bukan yang benar.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Perhatikan kalimat: "Matahari terbit di sebelah timur dan tenggelam di sebelah barat." Simpulan yang tepat adalah …',
      opsi: ['Matahari mengelilingi bumi', 'Bumi berputar dari barat ke timur', 'Matahari bergerak cepat', 'Bumi diam saja'],
      jwb: 1,
      penjelasan: 'Karena timur ke barat, bumi berputar dari barat ke timur (rotasi).',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Uji pemahaman membaca teksmu!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Bacalah teks berikut!\n\n"Petani membutuhkan air untuk menyiram tanaman. Musim kemarau membuat tanah kering dan tanaman layu. Oleh karena itu, petani membuat saluran irigasi agar sawah tetap mendapat air."\n\nKalimat yang menjadi ide pokok paragraf adalah …',
      opsi: ['Sawah harus selalu disiram', 'Petani membuat saluran irigasi agar sawah tetap mendapat air', 'Musim kemarau membuat tanah kering', 'Tanaman layu di musim kemarau'],
      jawaban: 1,
      penjelasan: 'Kalimat terakhir merangkum seluruh gagasan: petani membuat irigasi untuk mengatasi kekeringan. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Bacalah teks berikut!\n\n"Ronda malam diadakan setiap hari Jumat pukul 21.00. Warga bergiliran menjaga keamanan kampung. Mereka membawa senter dan tongkat pemukul kentongan."\n\nInformasi yang TERSURAT dalam teks adalah …',
      opsi: ['Ronda diadakan tiap Jumat pukul 21.00', 'Warga membawa senter dan kentongan', 'Ronda dimulai pukul 20.00', 'Ronda hanya untuk laki-laki', 'Warga menjaga kampung secara bergiliran'],
      jawaban_multi: [0, 1, 4],
      penjelasan: 'Tersurat: "Ronda malam diadakan setiap hari Jumat pukul 21.00" ✓, membawa senter & kentongan ✓, dan "bergiliran" ✓. Pukul 20.00 dan khusus laki-laki tidak ada di teks.'
    },
    {
      type: 'pg',
      teks: 'Bacalah teks berikut!\n\n"Buah mangga mengandung vitamin A dan C. Vitamin ini baik untuk kesehatan mata dan daya tahan tubuh, sehingga banyak orang gemar mengonsumsi mangga."\n\nPertanyaan yang jawabannya TERSEDIA di teks adalah …',
      opsi: ['Kapan musim mangga berbuah?', 'Vitamin apa yang terkandung dalam mangga?', 'Di mana pohon mangga ditanam?', 'Siapa yang menjual buah mangga?'],
      jawaban: 1,
      penjelasan: 'Teks menyebut "mengandung vitamin A dan C" — jawaban tersedia untuk pertanyaan tentang kandungan vitamin. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Bacalah teks berikut!\n\n"Limbah plastik sulit diuraikan tanah. Jika dibuang sembarangan, plastik akan mencemari tanah dan laut. Mengurangi pemakaian kantong plastik adalah salah satu cara menyelamatkan lingkungan."\n\nTentukan benar/salah pernyataan berikut!',
      pernyataan: [
        { teks: 'Plastik sulit diuraikan tanah', benar: true },
        { teks: 'Membuang plastik sembarangan mencemari lingkungan', benar: true },
        { teks: 'Plastik mudah terurai oleh tanah', benar: false },
        { teks: 'Mengurangi kantong plastik membantu lingkungan', benar: true }
      ],
      penjelasan: 'Sesuai teks: plastik sulit diuraikan ✓, mencemari ✓, dan mengurangi kantong plastik membantu ✓. "Mudah terurai" bertentangan dengan teks.'
    },
    {
      type: 'pg',
      teks: 'Bacalah teks berikut!\n\n"Setiap pagi, pedagang sayur berangkat sebelum matahari terbit. Mereka membawa dagangan ke pasar agar masih segar ketika dibeli pembeli. Kegiatan ini sudah lama menjadi mata pencaharian warga desa."\n\nSimpulan yang tepat dari teks adalah …',
      opsi: ['Berjualan sayur adalah mata pencaharian warga desa', 'Pedagang sayur berangkat siang hari', 'Sayuran dijual di supermarket', 'Warga desa tidak suka sayuran'],
      jawaban: 0,
      penjelasan: 'Kesimpulan utuh: berjualan sayur menjadi mata pencaharian warga desa. Jawaban: A.'
    },
    {
      type: 'pg',
      teks: 'Bacalah teks berikut!\n\n"Berita tentang bencana banjir cepat menyebar melalui ponsel. Foto dan video aliran air langsung dibagikan warga. Laporan dari telepon genggam membuat tim penolong datang lebih cepat."\n\nKalimat tanya yang tepat untuk isi paragraf tersebut adalah …',
      opsi: ['Kapan banjir pertama kali terjadi?', 'Bagaimana berita banjir cepat menyebar?', 'Mengapa bencana terjadi di desa?', 'Berapa biaya membeli ponsel?'],
      jawaban: 1,
      penjelasan: 'Teks menjelaskan PROSES penyebaran berita melalui ponsel → pertanyaan "Bagaimana..." paling tepat. Jawaban: B.'
    }
  ]
}
,

/* -------------- MATERI 6 : KOSAKATA -------------- */
{
  id: 6,
  mapel: 'bahasa',
  judul: 'Kosakata: Sinonim & Antonim',
  emoji: '🗂️',
  warna: '#ef476f',
  deskripsi: 'Mencari persamaan dan lawan kata. Wajib dikuasai untuk soal kalimat rumpang!',
  slide: [
    { tipe: 'title', judul: 'Kosakata: Sinonim & Antonim', sub: 'Perluas kosakata dan pahami makna kata. Sering muncul di TKA!', emoji: '🗂️' },
    {
      tipe: 'konten', emoji: '🗂️', judul: 'Sinonim (Persamaan Kata)',
      teks: ['Sinonim = kata yang maknanya sama atau hampir sama.',
        'Contoh: pandai = cerdas, gembira = senang.',
        'Ganti kata sulit dengan sinonimnya agar kalimat tetap bermakna.'],
      tip: 'Jika ragu, masukkan kandidat sinonim ke kalimat — rasakan cocok atau tidak.'
    },
    {
      tipe: 'konten', emoji: '🗂️', judul: 'Antonim (Lawan Kata)',
      teks: ['Antonim = kata yang maknanya berlawanan.',
        'Contoh: tinggi × pendek, maju × mundur.',
        'Soal antonim sering memakai kata sehari-hari.'],
      tip: 'Ingat pasangan "berlawanan" yang umum, misal besar-kecil.'
    },
    {
      tipe: 'konten', emoji: '🗂️', judul: 'Makna Kata dalam Konteks',
      teks: ['Arti sebuah kata bisa berubah tergantung KONTEKS kalimat.',
        'Contoh: "tangan kanan" bisa berarti orang kepercayaan.',
        'Selalu perhatikan kalimat pendukung di sekitar kata.'],
      tip: 'Jangan terpaku arti harfiah — lihat makna di kalimat.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Sinonim dari kata "gembira" adalah …',
      opsi: ['sedih', 'senang', 'marah', 'lapar'],
      jwb: 1,
      penjelasan: 'Gembira = senang (persamaan makna). Sedih justru antonimnya.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Mainkan kuis kosakata!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Sinonim dari kata "hebat" adalah …',
      opsi: ['lemah', 'kuat', 'pelan', 'takut'],
      jawaban: 1,
      penjelasan: 'Hebat searti dengan kuat/tangguh. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Sinonim yang tepat untuk kata-kata berikut adalah …',
      opsi: ['pandai = cerdas', 'gembira = sedih', 'kaya = makmur', 'malu = senang', 'rajin = giat'],
      jawaban_multi: [0, 2, 4],
      penjelasan: 'pandai=cerdas ✓, kaya=makmur ✓, rajin=giat ✓. Gembira bukan sedih (antonim), malu bukan senang.'
    },
    {
      type: 'pg',
      teks: 'Antonim dari kata "boros" adalah …',
      opsi: ['mewah', 'hemat', 'banyak', 'murah'],
      jawaban: 1,
      penjelasan: 'Boros berlawanan dengan hemat. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Tentukan benar/salah pasangan berikut!',
      pernyataan: [
        { teks: 'Kaya adalah sinonim dari makmur', benar: true },
        { teks: 'Antonim dari tinggi adalah pendek', benar: true },
        { teks: 'Besar adalah sinonim dari kecil', benar: false },
        { teks: 'Cepat adalah antonim dari lambat', benar: true }
      ],
      penjelasan: 'kaya=makmur ✓, tinggi×pendek ✓, besar≠kecil ✗ (malah antonim), cepat×lambat ✓.'
    },
    {
      type: 'pg',
      teks: 'Bacalah kalimat berikut!\n\n"Andi adalah tangan kanan Pak Lurah, sehingga ia dipercaya mengelola kas desa."\n\nMakna ungkapan "tangan kanan" pada kalimat tersebut adalah …',
      opsi: ['anggota tubuh', 'orang kepercayaan', 'orang yang bertangan kuat', 'penjaga kantor'],
      jawaban: 1,
      penjelasan: '"Tangan kanan" bermakna orang kepercayaan. Jawaban: B.'
    },
    {
      type: 'pg',
      teks: 'Antonim dari kata "rajin" dalam kalimat berikut adalah …\n\n"Amir anak yang rajin membantu orang tuanya berjualan."',
      opsi: ['giat', 'malas', 'tekun', 'semangat'],
      jawaban: 1,
      penjelasan: 'Lawan kata rajin adalah malas. Jawaban: B.'
    },
    {
      type: 'pg',
      teks: 'Sinonim dari kata "membeli" adalah …',
      opsi: ['meminjam', 'membayar', 'menukar dengan uang', 'menjual'],
      jawaban: 2,
      penjelasan: 'Membeli = menukar barang dengan uang. Jawaban: C.'
    }
  ]
}
,

/* -------------- MATERI 7 : KALIMAT -------------- */
{
  id: 7,
  mapel: 'bahasa',
  judul: 'Kalimat Efektif & Ejaan',
  emoji: '✍️',
  warna: '#ffb703',
  deskripsi: 'Kalimat efektif, tanda baca, dan kata hubung. Kunci skor Bahasa!',
  slide: [
    { tipe: 'title', judul: 'Kalimat Efektif & Ejaan', sub: 'Buat kalimat padat, jelas, dan benar. Yuk intip caranya!', emoji: '✍️' },
    {
      tipe: 'konten', emoji: '✍️', judul: 'Kalimat Efektif',
      teks: ['Kalimat efektif = padat, jelas, dan tidak bertele-tele.',
        'Ciri: tidak ada kata yang diulang-ulang (boros).',
        'Contoh salah: "Para para siswa sedang belajar."',
        'Contoh benar: "Para siswa sedang belajar."'],
      tip: 'Buang kata yang tidak perlu — kalimat jadi lebih enak dibaca.'
    },
    {
      tipe: 'konten', emoji: '✍️', judul: 'Kata Hubung',
      teks: ['Kata hubung menyambungkan dua kalimat.',
        'dan = menambah; tetapi = berlawanan',
        'karena = sebab; sehingga = akibat',
        'Contoh: "Dia sakit, tetapi tetap sekolah."'],
      tip: 'Pilih kata hubung sesuai hubungan makna antarkalimat.'
    },
    {
      tipe: 'konten', emoji: '✍️', judul: 'Penggunaan Ejaan',
      teks: ['Hurut kapital dipakai di awal kalimat dan nama orang/tempat.',
        'Tanda titik (.) di akhir kalimat berita.',
        'Tanda tanya (?) di akhir kalimat tanya.',
        'Tanda seru (!) untuk kalimat perintah/seruan.'],
      tip: 'Perhatikan ejaan yang "jomplang" pada pilihan jawaban.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: 'Bentuk kalimat yang PALING efektif adalah …',
      opsi: ['Para para murid sedang membersihkan kelas', 'Murid sedang kebersihan kelas bersama', 'Para murid sedang membersihkan kelas', 'Murid para membersihkan'],
      jwb: 2,
      penjelasan: '"Para murid sedang membersihkan kelas" padat, jelas, dan tidak boros kata.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Kerjakan kuis kalimat efektif & ejaan!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Kalimat berikut yang paling efektif adalah …',
      opsi: ['Doni dan Andi keduanya saling membantu satu sama lain', 'Doni dan Andi saling membantu', 'Doni membantu dan saling menolong kepada Andi', 'Antara Doni dengan Andi mereka membantu'],
      jawaban: 1,
      penjelasan: '"Doni dan Andi saling membantu" ringkas dan padat. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Kalimat berikut yang menggunakan kata hubung dengan TEPAT adalah …',
      opsi: ['Ia pandai sehingga ia sombong', 'Ia pandai tetapi ia sombong', 'Ia pandai dan malas', 'Ia bekerja keras karena ingin sukses', 'Hujan turun sehingga jalanan basah'],
      jawaban_multi: [1, 3, 4],
      penjelasan: '"tetapi" untuk pertentangan ✓, "karena" sebab ✓, "sehingga" akibat ✓. Opsi 0 dan 2 maknanya rancu.'
    },
    {
      type: 'pg',
      teks: 'Penulisan kalimat yang sudah benar sesuai ejaan adalah …',
      opsi: ['jangan membuang sampah disembarang tempat.', 'Jangan membuang sampah disembarang tempat', 'Jangan membuang sampah disembarang tempat.', 'jangan membuang sampah disembarang tempat'],
      jawaban: 2,
      penjelasan: 'Awal kalimat memakai huruf kapital dan diakhiri titik — tepat pada opsi C.'
    },
    {
      type: 'kategori',
      teks: 'Tentukan benar/salah pernyataan berikut!',
      pernyataan: [
        { teks: 'Kalimat efektif bertele-tele dan panjang', benar: false },
        { teks: 'Kalimat tanya diakhiri tanda tanya (?)', benar: true },
        { teks: '"tetapi" menghubungkan makna yang bertentangan', benar: true },
        { teks: 'Tanda titik dipakai di akhir kalimat berita', benar: true }
      ],
      penjelasan: 'Kalimat efektif justru padat, bukan bertele-tele ✗. Lainnya benar ✓✓✓.'
    },
    {
      type: 'pg',
      teks: 'Kalimat berikut yang menggunakan huruf kapital dengan BENAR adalah …',
      opsi: ['Dayu sekolah di jakarta', 'dayu sekolah di Jakarta', 'Dayu sekolah di Jakarta', 'dayu Sekolah di jakarta'],
      jawaban: 2,
      penjelasan: 'Huruf kapital untuk nama orang (Dayu) dan nama tempat (Jakarta). Jawaban: C.'
    },
    {
      type: 'pg',
      teks: 'Kata hubung yang tepat untuk kalimat rumpang berikut adalah …\n\n"Ayah lelah bekerja di sawah, (…) ia tetap menyapa kami dengan senyum."',
      opsi: ['karena', 'dan', 'tetapi', 'atau'],
      jawaban: 2,
      penjelasan: 'Lelah bertolak belakang dengan senyum → gunakan "tetapi". Jawaban: C.'
    },
    {
      type: 'pg',
      teks: 'Gabungan kalimat yang benar adalah …\n\n"Siti rajin belajar kosakata baru. Siti hafal banyak sinonim."',
      opsi: ['Siti rajin belajar kosakata baru tetapi hafal banyak sinonim', 'Siti rajin belajar kosakata baru sehingga hafal banyak sinonim', 'Karena Siti hafal sinonim, ia rajin belajar', 'Siti rajin belajar kosakata atau hafal banyak sinonim'],
      jawaban: 1,
      penjelasan: 'Rajin belajar AKIBATNYA hafal → kata hubung "sehingga". Jawaban: B.'
    }
  ]
}
,

/* -------------- MATERI 8 : PENGUMUMAN -------------- */
{
  id: 8,
  mapel: 'bahasa',
  judul: 'Pengumuman & Teks Singkat',
  emoji: '📣',
  warna: '#06d6a0',
  deskripsi: 'Membaca pengumuman, iklan, dan pesan singkat. Ragam teks fungsional TKA!',
  slide: [
    { tipe: 'title', judul: 'Pengumuman & Teks Singkat', sub: 'Belajar membaca pengumuman, iklan, dan pesan dengan cermat.', emoji: '📣' },
    {
      tipe: 'konten', emoji: '📣', judul: 'Bagian Penting Sebuah Pengumuman',
      teks: ['Pengumuman memuat: siapa yang mengumumkan, apa yang diumumkan, kapan, dan di mana.',
        'Contoh: "Siswa kelas 6, kumpul besok pukul 07.00 di lapangan untuk upacara."',
        'Informasi penting: kelas 6, besok pukul 07.00, lapangan.'],
      tip: 'Baca perlahan: siapa, apa, kapan, di mana — empat ini kunci.'
    },
    {
      tipe: 'konten', emoji: '📣', judul: 'Membedah Iklan',
      teks: ['Iklan = ajakan untuk membeli atau memakai barang.',
        'Biasanya memuat keunggulan produk dan ajakan ("ayo", "beli sekarang").',
        'Contoh iklan: "Hanya hari ini, diskon 20% untuk semua tas kulit!"'],
      tip: 'Cari kata ajakan di iklan untuk menemukan tujuannya.'
    },
    {
      tipe: 'konten', emoji: '📣', judul: 'Pesan Singkat',
      teks: ['Pesan singkat berisi informasi yang padat.',
        'Hafalkan cara menulis pesan yang jelas: pembuka, isi (apa/kapan/di mana), penutup.',
        'Contoh: "Bu, Sinta bantu mengantar kue ke rumah Bu Rina ya, acara arisan nanti sore."'],
      tip: 'Perhatikan siapa pengirim dan penerima pesan.'
    },
    {
      tipe: 'mini', emoji: '💡', judul: 'Tantangan Kecil',
      pertanyaan: '"Kelas 6 mohon berkumpul besok pukul 07.00 di aula."\n\nKapan siswa kelas 6 berkumpul?',
      opsi: ['hari ini', 'besok pukul 07.00', 'pukul 08.00', 'minggu depan'],
      jwb: 1,
      penjelasan: 'Teks menyebut "besok pukul 07.00 di aula". Jawaban: B.',
      gambar: ''
    },
    { tipe: 'title', judul: 'Sudah Siap?', sub: 'Kerjakan kuis teks pengumuman & singkat!', emoji: '🚀' }
  ],
  pertanyaan: [
    {
      type: 'pg',
      teks: 'Bacalah pengumuman berikut!\n\n"Kepada seluruh siswa, besok hari Senin dilaksanakan upacara bendera pukul 07.30 di lapangan. Kehadiran siswa sangat diharapkan. Kepala Sekolah."\n\nSiapa yang ditujukan dalam pengumuman tersebut?',
      opsi: ['Guru', 'Seluruh siswa', 'Kepala sekolah', 'Wali kelas'],
      jawaban: 1,
      penjelasan: 'Pengumuman ditujukan kepada seluruh siswa. Jawaban: B.'
    },
    {
      type: 'pgk',
      teks: 'Bacalah iklan berikut!\n\n"Hadiri Festival Batik Anak! Tampilkan hasil karyamu dan menangkan hadiah menarik. Ayo daftar sebelum 10 Mei di kantor kepala sekolah."\n\nInformasi yang terdapat dalam iklan adalah …',
      opsi: ['Festival diadakan tanggal 10 Mei', 'Peserta memamerkan karya batik', 'Hadiahnya menarik', 'Daftar di kantor kepala sekolah', 'Festival diadakan di Jakarta'],
      jawaban_multi: [1, 2, 3],
      penjelasan: 'Teks: memamerkan karya ✓, hadiah menarik ✓, daftar di kantor kepala sekolah ✓. Tanggal 10 Mei adalah batas daftar, bukan tanggal festival. Lokasi Jakarta tidak disebut.'
    },
    {
      type: 'pg',
      teks: 'Bacalah pesan berikut!\n\n"Dik, ibu titip belikan kecap dan garam di warung. Ibu sudah menunggu di dapur untuk memasak. Terima kasih, adik!"\n\nIsi pesan tersebut adalah …',
      opsi: ['Mengajak adik makan', 'Menyuruh adik membeli kecap dan garam', 'Mengajak adik ke warung', 'Meminta adik memasak'],
      jawaban: 1,
      penjelasan: 'Ibu menitipkan/meminta adik membelikan kecap dan garam. Jawaban: B.'
    },
    {
      type: 'kategori',
      teks: 'Bacalah pengumuman berikut!\n\n"Libur sekolah dimulai 20 Juni dan kembali masuk 15 Juli. Selama libur, seluruh siswa wajib mengisi kegiatan positif dan mencatatnya dalam buku harian."\n\nTentukan benar/salah pernyataan berikut!',
      pernyataan: [
        { teks: 'Libur sekolah dimulai 20 Juni', benar: true },
        { teks: 'Siswa masuk kembali tanggal 15 Juli', benar: true },
        { teks: 'Siswa wajib mengisi buku harian kegiatan', benar: true },
        { teks: 'Selama libur siswa dilarang beraktivitas', benar: false }
      ],
      penjelasan: 'Tiga pernyataan sesuai isi pengumuman ✓. Siswa malah DIAJAK beraktivitas positif, bukan dilarang.'
    },
    {
      type: 'pg',
      teks: 'Bacalah iklan berikut!\n\n"Ayo ikut lomba menulis cerita anak! Tingkatkan kreativitasmu. Pendaftaran gratis."\n\nTujuan iklan tersebut adalah …',
      opsi: ['Menjual buku cerita', 'Mengajak mengikuti lomba menulis', 'Mengumumkan nilai lomba', 'Memberi tahu profesi penulis'],
      jawaban: 1,
      penjelasan: 'Kalimat ajakan "Ayo ikut lomba menulis" → tujuan mengajak. Jawaban: B.'
    },
    {
      type: 'pg',
      teks: 'Bacalah pesan berikut!\n\n"Bu, saya izin terlambat ke sekolah karena ban sepeda bocor. Rina."\n\nPesan tersebut berisi tentang …',
      opsi: ['Permintaan maaf karena rusak', 'Informasi izin terlambat sekolah', 'Ajakan memperbaiki sepeda', 'Laporan membeli sepeda'],
      jawaban: 1,
      penjelasan: 'Pesan berisi izin terlambat dengan alasan ban bocor. Jawaban: B.'
    },
    {
      type: 'pg',
      teks: 'Bacalah pengumuman berikut!\n\n"Diberitahukan kepada semua siswa bahwa perpustakaan buka setiap hari pukul 08.00–15.00. Peminjam wajib mengembalikan buku paling lambat satu minggu."\n\nJam buka perpustakaan adalah …',
      opsi: ['08.00–12.00', '08.00–15.00', '07.00–15.00', '08.00–14.00'],
      jawaban: 1,
      penjelasan: 'Teks menyebut perpustakaan buka 08.00–15.00. Jawaban: B.'
    }
  ]
}
];

/* ---------------- FUNGSI BANTU (dipakai app.js) ---------------- */
function materiByMapel(mapel) {
  return MATERI.filter(function (m) { return m.mapel === mapel; });
}
function semuaMateri() {
  return MATERI;
}
function cariMateri(id) {
  for (var i = 0; i < MATERI.length; i++) if (MATERI[i].id === Number(id)) return MATERI[i];
  return null;
}
function kumpulkanSoalTryOut() {
  var hasil = [];
  MATERI.forEach(function (m) {
    m.pertanyaan.forEach(function (q) {
      var salinan = JSON.parse(JSON.stringify(q));
      salinan.mapel = m.mapel;
      salinan.materiId = m.id;
      salinan.materiJudul = m.judul;
      salinan.nomor = hasil.length + 1;
      hasil.push(salinan);
    });
  });
  return hasil;
}