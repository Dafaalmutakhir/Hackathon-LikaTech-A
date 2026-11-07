// Data utama menu menjadi sumber untuk kartu produk, tabel harga, dan pilihan pada formulir.
// Nama serta harga adalah contoh; sesuaikan dengan produk dan harga resmi usaha.
// Setiap objek menu memiliki id unik, nama, harga, URL foto, dan keterangan.
// Properti kategori dan simbol di tingkat kelompok berlaku untuk semua item di dalamnya.
const menu = [
    {
        kategori: 'Makanan',
        simbol: '🍜',
        item: [
            { id: 'mi-goreng', nama: 'Mi Goreng', harga: 8000, foto: 'https://i.pinimg.com/736x/3c/35/bc/3c35bcd537ab7b5a700a884c1c6306c3.jpg', keterangan: 'Mi goreng gurih dengan racikan bumbu khas Warmindo.' },
            { id: 'mi-rebus', nama: 'Mi Rebus', harga: 8000, foto: 'https://i.pinimg.com/736x/fe/e6/5c/fee65c63a04342a12f8c65ff7c28b66c.jpg', keterangan: 'Mi berkuah hangat, pilihan pas untuk santap nyaman.' },
            { id: 'mi-goreng-telur', nama: 'Mi Goreng Telur', harga: 12000, foto: 'https://i.pinimg.com/736x/03/3b/4f/033b4f22eef614336ca806689396a284.jpg', keterangan: 'Mi goreng favorit dengan tambahan telur.' },
            { id: 'mi-rebus-telur', nama: 'Mi Rebus Telur', harga: 12000, foto: 'https://i.pinimg.com/736x/61/76/3b/61763bffeb6ccf5c48e6e91e1c5d9a77.jpg', keterangan: 'Mi kuah hangat dengan telur sebagai pelengkap.' },
            { id: 'mi-dok-dok', nama: 'Mi Dok-Dok', harga: 15000, foto: 'https://i.pinimg.com/736x/78/60/d4/7860d4c579e91eeb785ef4f6063d38f0.jpg', keterangan: 'Mi kuah kental yang dimasak bersama telur dan sayuran.' },
            { id: 'nasi-goreng', nama: 'Nasi Goreng', harga: 15000, foto: 'https://i.pinimg.com/1200x/d3/7b/f1/d37bf17c96e03b533f0f4b1c9b130011.jpg', keterangan: 'Nasi goreng berbumbu, disajikan hangat dan mengenyangkan.' },
        ],
    },
    {
        kategori: 'Minuman',
        simbol: '🥤',
        item: [
            { id: 'es-teh-manis', nama: 'Es Teh Manis', harga: 4000, foto: 'https://i.pinimg.com/736x/3d/e1/73/3de1738c8404b6423d2e3601a16e2bdb.jpg', keterangan: 'Teh manis dingin yang menyegarkan teman makan.' },
            { id: 'es-jeruk', nama: 'Es Jeruk', harga: 5000, foto: 'https://i.pinimg.com/736x/3a/61/bc/3a61bc4bf11ec1f1d9df3cb75b604d38.jpg', keterangan: 'Minuman jeruk segar dengan rasa manis dan asam seimbang.' },
            { id: 'kopi-hitam', nama: 'Kopi Hitam', harga: 5000, foto: 'https://i.pinimg.com/736x/4b/ec/09/4bec09bf9ae097c51c7e5d1d1c740ac3.jpg', keterangan: 'Kopi hitam hangat untuk teman makan dan bersantai.' },
        ],
    },
];

// Jam operasional menggunakan angka 24 jam agar status buka dapat dihitung otomatis.
const jamBuka = 8;
const jamTutup = 17;

// Menu diratakan agar fungsi form dan tabel dapat mencari produk dengan mudah.
// map menyalin properti item sambil menambahkan kategori dan simbol dari kelompok.
const semuaMenu = menu.flatMap((kelompok) =>
    kelompok.item.map((item) => ({ ...item, kategori: kelompok.kategori, simbol: kelompok.simbol })),
);

function rupiah(angka) {
    // Ubah angka ke format Indonesia, misalnya 12000 menjadi 12.000.
    return `Rp${angka.toLocaleString('id-ID')}`;
}

function ambilNomorWhatsApp() {
    // Nomor diambil dari tautan utama supaya tombol pesan produk memakai nomor yang sama.
    // Cari elemen tautan pesan pada area hero berdasarkan id HTML-nya.
    const tombolPesan = document.getElementById('tombol-pesan-hero');

    // Hentikan inisialisasi dengan pesan jelas jika tombol utama tidak ada.
    if (!tombolPesan) {
        throw new Error('Tombol WhatsApp utama tidak ditemukan.');
    }

    // Ubah href menjadi URL agar protokol, host, dan nomor bisa diperiksa terpisah.
    const tautan = new URL(tombolPesan.href);
    // Cocokkan path yang hanya berisi angka, yaitu format nomor pada wa.me/nomor.
    const nomor = tautan.pathname.match(/^\/(\d+)$/);

    // Pastikan tautan HTTPS, domain wa.me, dan path berisi nomor yang valid.
    if (tautan.protocol !== 'https:' || tautan.hostname !== 'wa.me' || !nomor) {
        throw new Error('Tautan WhatsApp pada tombol pesan hero tidak valid.');
    }

    // Ambil bagian angka dari hasil pencocokan regex.
    return nomor[1];
}

function buatTautanPesanan(nomorWhatsApp, item) {
    // Susun pesan dengan nama dan harga produk, lalu encode agar aman menjadi URL.
    const pesan = `Halo, saya ingin memesan ${item.nama} seharga ${rupiah(item.harga)}.`;
    // Buat elemen tautan baru untuk tombol pesan pada satu kartu produk.
    const tautan = document.createElement('a');

    // Tambahkan class untuk tampilan CSS dan susun URL WhatsApp beserta teks pesanan.
    tautan.className = 'tombol tombol-pesan';
    tautan.href = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
    // Buka WhatsApp di tab baru dan cegah tab baru mengakses halaman asal.
    tautan.target = '_blank';
    tautan.rel = 'noopener';
    // Beri nama aksesibel yang menjelaskan produk yang dipesan.
    tautan.setAttribute('aria-label', `Pesan ${item.nama} melalui WhatsApp`);

    // Buat ikon plus dekoratif pada tombol.
    const simbol = document.createElement('span');
    simbol.className = 'simbol-pesan';
    // Sembunyikan ikon dari pembaca layar karena teks tombol sudah menjelaskan fungsinya.
    simbol.setAttribute('aria-hidden', 'true');
    simbol.textContent = '+';

    // Gabungkan ikon dan teks, lalu kembalikan tautan agar dipasang pada kartu produk.
    tautan.append(simbol, document.createTextNode(' Pesan'));
    return tautan;
}

function buatKartuProduk(item, simbolMenu, nomorWhatsApp) {
    // Kartu dibuat lewat DOM agar data menu ditampilkan sebagai teks, bukan markup HTML.
    // Artikel menjadi satu unit semantik untuk tiap produk.
    const kartu = document.createElement('article');
    kartu.className = 'kartu';

    // Area ini menampung foto produk dan simbol pengganti jika foto gagal dimuat.
    const areaFoto = document.createElement('div');
    areaFoto.className = 'foto';

    // Buat simbol kategori sebagai placeholder foto yang dapat dibaca secara visual.
    const simbol = document.createElement('span');
    simbol.className = 'simbol-produk';
    simbol.setAttribute('aria-hidden', 'true');
    simbol.textContent = simbolMenu;
    areaFoto.appendChild(simbol);

    // Ambil template gambar statis yang didefinisikan di index.html.
    const templateFoto = document.getElementById('template-foto-menu');

    // Pastikan elemen yang ditemukan memang template sebelum menyalin isinya.
    if (!(templateFoto instanceof HTMLTemplateElement)) {
        throw new Error('Template foto menu tidak ditemukan.');
    }

    // Salin elemen img dari template agar setiap produk memiliki gambar sendiri.
    const gambar = templateFoto.content.firstElementChild.cloneNode(true);
    // Teks alt memberi keterangan gambar untuk aksesibilitas.
    gambar.alt = `Foto ${item.nama}`;
    // Simbol menu menjadi placeholder sampai foto berhasil dimuat; jika gagal, simbol tetap terlihat.
    // Saat gambar berhasil dimuat, sembunyikan simbol di belakangnya.
    gambar.addEventListener('load', () => {
        simbol.hidden = true;
    }, { once: true });
    // Jika URL foto gagal, sembunyikan elemen gambar yang rusak dan biarkan simbol tampil.
    gambar.addEventListener('error', () => {
        gambar.hidden = true;
    }, { once: true });
    // Atur alamat gambar berdasarkan URL pada data item.
    gambar.src = item.foto;
    // Masukkan gambar ke area foto setelah listener error/load sudah terpasang.
    areaFoto.appendChild(gambar);

    // Tangani kemungkinan gambar sudah selesai dimuat sebelum pemeriksaan ini dijalankan.
    if (gambar.complete && gambar.naturalWidth > 0) {
        simbol.hidden = true;
    }

    // Buat judul produk dan isi dengan teks nama dari data.
    const nama = document.createElement('h3');
    nama.textContent = item.nama;

    // Buat deskripsi singkat produk sebagai paragraf.
    const keterangan = document.createElement('p');
    keterangan.textContent = item.keterangan;

    // Buat elemen harga dan format nominalnya dalam rupiah.
    const harga = document.createElement('p');
    harga.className = 'harga';
    harga.textContent = rupiah(item.harga);

    // Susun elemen kartu dari foto sampai tombol pemesanan.
    kartu.append(
        areaFoto,
        nama,
        keterangan,
        harga,
        buatTautanPesanan(nomorWhatsApp, item),
    );

    // Kembalikan kartu untuk disisipkan ke dalam kelompok kategori.
    return kartu;
}

function buatKelompokMenu(kelompok, nomorWhatsApp) {
    // Bungkus kartu berdasarkan kategori makanan atau minuman.
    // Section memisahkan satu kategori menu dari kategori lainnya.
    const bagian = document.createElement('section');
    bagian.className = 'kelompok-menu';

    // Buat heading kategori, misalnya "Makanan" atau "Minuman".
    const judul = document.createElement('h3');
    judul.className = 'judul-kategori';
    judul.textContent = kelompok.kategori;

    // Buat grid sebagai wadah kartu-kartu dalam kategori ini.
    const daftar = document.createElement('div');
    daftar.className = 'grid daftar-kategori';

    // Ubah setiap data item menjadi elemen kartu produk.
    const kartu = kelompok.item.map((item) =>
        buatKartuProduk(item, kelompok.simbol, nomorWhatsApp),
    );

    // Isi grid sekaligus dengan semua kartu yang sudah dibuat.
    daftar.replaceChildren(...kartu);
    // Letakkan heading sebelum grid, kemudian kembalikan section kategori.
    bagian.append(judul, daftar);
    return bagian;
}

function tampilkanProduk() {
    // Isi area produk menggunakan seluruh data menu yang sudah dikelompokkan.
    // Cari wadah kosong di HTML yang disediakan untuk kartu produk.
    const wadah = document.getElementById('daftar-produk');

    // Laporkan kesalahan jika elemen target tidak sengaja dihapus dari HTML.
    if (!wadah) {
        throw new Error('Wadah daftar produk tidak ditemukan.');
    }

    // Ambil nomor tujuan satu kali untuk dipakai pada semua tombol produk.
    const nomorWhatsApp = ambilNomorWhatsApp();
    // Buat section kategori untuk seluruh kelompok menu.
    const kelompokMenu = menu.map((kelompok) =>
        buatKelompokMenu(kelompok, nomorWhatsApp),
    );

    // Tampilkan kategori yang dibentuk dan menggantikan isi lama jika ada.
    wadah.replaceChildren(...kelompokMenu);
}

function tampilkanTabelMenu() {
    // Buat baris tabel dari data yang sama; judul kategori memakai colspan tiga kolom.
    // Temukan tbody yang akan diisi dengan baris menu.
    const isiTabel = document.getElementById('isi-tabel-menu');

    // Gagal dengan jelas jika tbody tidak tersedia pada HTML.
    if (!isiTabel) {
        throw new Error('Isi tabel menu tidak ditemukan.');
    }

    // Untuk setiap kategori, buat satu baris judul dan beberapa baris produk.
    const baris = menu.flatMap((kelompok) => {
        // Baris kategori menggabungkan tiga kolom menggunakan colspan.
        const judulKategori = document.createElement('tr');
        const selKategori = document.createElement('th');
        selKategori.scope = 'rowgroup';
        selKategori.colSpan = 3;
        selKategori.textContent = kelompok.kategori;
        judulKategori.appendChild(selKategori);

        // Buat satu baris tabel untuk tiap produk dalam kategori ini.
        const barisMenu = kelompok.item.map((item) => {
            const tr = document.createElement('tr');

            // Isi kolom nama, kategori, dan harga dengan teks biasa.
            for (const teks of [item.nama, kelompok.kategori, rupiah(item.harga)]) {
                const td = document.createElement('td');
                td.textContent = teks;
                tr.appendChild(td);
            }

            return tr;
        });

        // Gabungkan baris judul dan daftar produk untuk kategori saat ini.
        return [judulKategori, ...barisMenu];
    });

    // Pasang semua baris ke tbody sekaligus agar tabel selaras dengan data menu.
    isiTabel.replaceChildren(...baris);
}

function validasiField(input, idPesan) {
    // Ubah status validitas HTML menjadi pesan yang mudah dipahami pengguna.
    // Cari elemen kecil tempat pesan kesalahan untuk input ini ditampilkan.
    const pesan = document.getElementById(idPesan);

    // Pesan validasi wajib tersedia agar error tidak disembunyikan diam-diam.
    if (!pesan) {
        throw new Error(`Pesan validasi "${idPesan}" tidak ditemukan.`);
    }

    // Nilai kosong berarti tidak ada pesan kesalahan.
    let teks = '';

    // Periksa jenis kesalahan bawaan validasi HTML secara berurutan.
    if (input.validity.valueMissing) {
        teks = 'Bagian ini wajib diisi.';
    } else if (input.validity.typeMismatch) {
        teks = 'Masukkan format data yang valid.';
    } else if (input.validity.rangeOverflow) {
        teks = 'Jumlah pesanan maksimal 20.';
    } else if (input.validity.rangeUnderflow) {
        teks = 'Jumlah pesanan minimal 1.';
    } else if (input.validity.stepMismatch || input.validity.badInput) {
        teks = 'Masukkan jumlah pesanan berupa bilangan bulat.';
    }

    // Tampilkan pesan dan beri tahu teknologi bantu apakah input invalid.
    pesan.textContent = teks;
    input.setAttribute('aria-invalid', teks ? 'true' : 'false');
    // Kembalikan true jika valid sehingga pemanggil bisa menentukan langkah berikutnya.
    return teks === '';
}

function tampilkanPilihanMenu() {
    // Isi dropdown dengan menu dan harga supaya pilihan selalu cocok dengan katalog.
    // Ambil elemen select dari formulir pemesanan.
    const pilihanMenu = document.getElementById('pilihan-menu');

    // Pastikan dropdown ada sebelum mencoba menambahkan opsi.
    if (!pilihanMenu) {
        throw new Error('Pilihan menu pada formulir tidak ditemukan.');
    }

    // Buat satu option untuk setiap produk pada data menu.
    const opsi = semuaMenu.map((item) => {
        const option = document.createElement('option');
        // Simpan id sebagai nilai form dan tampilkan nama plus harga kepada pengguna.
        option.value = item.id;
        option.textContent = `${item.nama} — ${rupiah(item.harga)}`;
        return option;
    });

    // Tambahkan semua pilihan sesudah opsi awal "Pilih menu".
    pilihanMenu.append(...opsi);
}

function pasangInteraksiPemesanan() {
    // Validasi saat input berubah, lalu cek seluruh field ketika form dikirim.
    // Ambil form, setiap input, dropdown, dan area pesan status berdasarkan id HTML.
    const form = document.getElementById('form-pemesanan');
    const nama = document.getElementById('nama-pemesan');
    const telepon = document.getElementById('telepon-pemesan');
    const pilihanMenu = document.getElementById('pilihan-menu');
    const jumlah = document.getElementById('jumlah-menu');
    const status = document.getElementById('status-pemesanan');

    // Pastikan semua elemen penting ada sebelum memasang event.
    if (!(form && nama && telepon && pilihanMenu && jumlah && status)) {
        throw new Error('Elemen formulir pemesanan tidak ditemukan.');
    }

    // Pasangkan setiap kontrol form dengan id elemen pesan kesalahannya.
    const fieldForm = [
        [nama, 'error-nama'],
        [telepon, 'error-telepon'],
        [pilihanMenu, 'error-menu'],
        [jumlah, 'error-jumlah'],
    ];

    // Validasi ulang ketika pengguna mengetik atau memilih nilai baru.
    for (const [input, idPesan] of fieldForm) {
        input.addEventListener('input', () => {
            // Perbarui pesan validasi langsung saat isi teks berubah.
            validasiField(input, idPesan);
            // Hapus pesan sukses lama karena data sedang diubah.
            status.textContent = '';
        });
        input.addEventListener('change', () => {
            // Event change menangani pilihan dropdown dan nilai yang baru dikonfirmasi.
            validasiField(input, idPesan);
            status.textContent = '';
        });
    }

    // Jalankan pemeriksaan ketika tombol submit ditekan.
    form.addEventListener('submit', (event) => {
        // Demo tidak mengirim data ke server; cegah perpindahan halaman saat tombol ditekan.
        event.preventDefault();
        // Validasi semua input dan simpan hasil true/false dalam urutan fieldForm.
        const valid = fieldForm.map(([input, idPesan]) =>
            validasiField(input, idPesan),
        );
        // Cari indeks input invalid pertama agar fokus bisa diarahkan ke sana.
        const fieldTidakValid = valid.findIndex((hasil) => !hasil);

        if (fieldTidakValid !== -1) {
            // Fokus diarahkan ke input invalid pertama agar pengguna tahu yang perlu diperbaiki.
            status.textContent = 'Periksa kembali data pemesanan yang wajib diisi.';
            fieldForm[fieldTidakValid][0].focus();
            return;
        }

        // Temukan data produk yang cocok dengan id yang dipilih di dropdown.
        const item = semuaMenu.find((menuItem) => menuItem.id === pilihanMenu.value);

        // Cegah pesan sukses jika pilihan tidak cocok dengan data menu.
        if (!item) {
            throw new Error('Menu yang dipilih tidak ditemukan.');
        }

        // Tampilkan hasil simulasi; server belum dihubungkan pada proyek ini.
        status.textContent = `Demo berhasil: ${nama.value.trim()} memesan ${jumlah.value} ${item.nama}. Form ini menggunakan method POST; pesanan belum dikirim ke server.`;
    });
}

function tampilkanStatusBuka() {
    // Bandingkan jam perangkat dengan jam operasional untuk menampilkan status usaha.
    // Ambil elemen status pada bagian hero.
    const status = document.getElementById('status-buka');

    // Laporkan jika elemen status hilang sehingga masalah HTML mudah ditemukan.
    if (!status) {
        throw new Error('Elemen status buka tidak ditemukan.');
    }

    // Baca jam lokal perangkat pengunjung dalam rentang 0 sampai 23.
    const jamSekarang = new Date().getHours();
    // Usaha dianggap buka jika waktu sekarang mulai jam buka dan sebelum jam tutup.
    const sedangBuka = jamSekarang >= jamBuka && jamSekarang < jamTutup;

    // Ubah tulisan dan class CSS supaya status juga memiliki warna yang sesuai.
    status.textContent = sedangBuka ? 'Buka sekarang' : 'Sedang tutup';
    status.className = sedangBuka ? 'buka' : 'tutup';
}

function sembunyikanGambarHeroJikaRusak() {
    // Sembunyikan gambar pembuka jika berkas lokal tidak ditemukan atau gagal dimuat.
    // Cari gambar hero yang alamatnya ditentukan langsung di HTML.
    const gambar = document.getElementById('hero-gambar');

    // Tidak ada pekerjaan yang perlu dilakukan jika elemen gambar tidak tersedia.
    if (!gambar) {
        return;
    }

    // Simpan aksi menyembunyikan gambar agar bisa dipakai pada dua kondisi error.
    const sembunyikan = () => {
        gambar.style.display = 'none';
    };

    // Tangani error pemuatan gambar dan hapus listener setelah sekali dipanggil.
    gambar.addEventListener('error', sembunyikan, { once: true });

    // Cek juga gambar yang sudah selesai gagal dimuat sebelum listener terpasang.
    if (gambar.complete && gambar.naturalWidth === 0) {
        sembunyikan();
    }
}

// Inisialisasi halaman setelah file script dimuat di bagian akhir body.
// Urutan ini menampilkan katalog, tabel, pilihan form, status buka, dan perilaku form.
tampilkanProduk();
tampilkanTabelMenu();
tampilkanPilihanMenu();
tampilkanStatusBuka();
sembunyikanGambarHeroJikaRusak();
pasangInteraksiPemesanan();
