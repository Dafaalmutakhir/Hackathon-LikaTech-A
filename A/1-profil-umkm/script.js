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
const jamBuka = 8; // Batas awal jam operasional dalam format 24 jam.
const jamTutup = 17; // Batas akhir jam operasional, tidak termasuk pukul 17.00.

// Data produk diratakan dari kategori agar dipakai form dan pesanan.
const produk = menu.flatMap((kelompok) => // Gabungkan semua kategori menjadi satu daftar produk.
    kelompok.item.map((item) => ({ ...item, kategori: kelompok.kategori, simbol: kelompok.simbol })), // Tambahkan informasi kategori ke setiap produk.
);
const semuaMenu = produk; // Gunakan daftar yang sama untuk tabel dan formulir pemesanan.

function rupiah(angka) {
    // Ubah angka ke format Indonesia, misalnya 12000 menjadi 12.000.
    return `Rp${angka.toLocaleString('id-ID')}`; // Tampilkan harga dengan pemisah ribuan Indonesia.
}

function ambilNomorWhatsApp() {
    // Nomor diambil dari tautan utama supaya tombol pesan produk memakai nomor yang sama.
    // Cari elemen tautan pesan pada area hero berdasarkan id HTML-nya.
    const tombolPesan = document.getElementById('tombol-pesan-hero'); // Ambil tautan WhatsApp utama dari halaman.

    // Hentikan inisialisasi dengan pesan jelas jika tombol utama tidak ada.
    if (!tombolPesan) {
        throw new Error('Tombol WhatsApp utama tidak ditemukan.'); // Hentikan proses karena nomor tujuan tidak dapat diambil.
    }

    // Ubah href menjadi URL agar protokol, host, dan nomor bisa diperiksa terpisah.
    const tautan = new URL(tombolPesan.href); // Urai alamat tautan agar komponennya bisa divalidasi.
    // Cocokkan path yang hanya berisi angka, yaitu format nomor pada wa.me/nomor.
    const nomor = tautan.pathname.match(/^\/(\d+)$/); // Ambil nomor tujuan dari bagian path URL.

    // Pastikan tautan HTTPS, domain wa.me, dan path berisi nomor yang valid.
    if (tautan.protocol !== 'https:' || tautan.hostname !== 'wa.me' || !nomor) {
        throw new Error('Tautan WhatsApp pada tombol pesan hero tidak valid.'); // Hindari membuat pesanan dengan alamat yang salah.
    }

    // Ambil bagian angka dari hasil pencocokan regex.
    return nomor[1]; // Kembalikan angka nomor WhatsApp tanpa garis miring.
}

function buatTautanPesanan(item) {
    const tombol = document.createElement('button'); // Buat tombol untuk memilih produk pada kartu.
    tombol.type = 'button'; // Hindari tombol ini mengirim formulir secara tidak sengaja.
    tombol.className = 'tombol tombol-pesan'; // Pakai gaya tombol pemesanan yang sudah ada.
    tombol.setAttribute('aria-label', `Pilih ${item.nama} untuk dipesan`); // Jelaskan tindakan tombol ke pembaca layar.

    const simbol = document.createElement('span'); // Buat ikon dekoratif pada tombol.
    simbol.className = 'simbol-pesan'; // Kaitkan ikon dengan aturan CSS.
    simbol.setAttribute('aria-hidden', 'true'); // Abaikan ikon karena teks tombol sudah menjelaskan fungsinya.
    simbol.textContent = '+'; // Tampilkan tanda tambah sebagai ikon.

    tombol.append(simbol, document.createTextNode(' Pesan')); // Tampilkan ikon dan label tombol.
    return tombol; // Kembalikan tombol agar bisa dipasang di kartu produk.
}

function buatKartuProduk(item, simbolMenu) {
    // Kartu dibuat lewat DOM agar data menu ditampilkan sebagai teks, bukan markup HTML.
    // Artikel menjadi satu unit semantik untuk tiap produk.
    const kartu = document.createElement('article'); // Gunakan article untuk mewakili satu produk.
    kartu.className = 'kartu'; // Terapkan tampilan kartu dari CSS.

    // Area ini menampung foto produk dan simbol pengganti jika foto gagal dimuat.
    const areaFoto = document.createElement('div'); // Siapkan wadah gambar dan simbol pengganti.
    areaFoto.className = 'foto'; // Terapkan ukuran dan gaya area foto.

    // Buat simbol kategori sebagai placeholder foto yang dapat dibaca secara visual.
    const simbol = document.createElement('span'); // Buat simbol kategori sebagai placeholder foto.
    simbol.className = 'simbol-produk'; // Terapkan tampilan simbol dari CSS.
    simbol.setAttribute('aria-hidden', 'true'); // Sembunyikan simbol dekoratif dari pembaca layar.
    simbol.textContent = simbolMenu; // Isi simbol sesuai kategori produk.
    areaFoto.appendChild(simbol); // Tampilkan placeholder sebelum foto berhasil dimuat.

    // Ambil template gambar statis yang didefinisikan di index.html.
    const templateFoto = document.getElementById('template-foto-menu'); // Ambil template gambar yang disediakan di HTML.

    // Pastikan elemen yang ditemukan memang template sebelum menyalin isinya.
    if (!(templateFoto instanceof HTMLTemplateElement)) {
        throw new Error('Template foto menu tidak ditemukan.'); // Laporkan jika template wajib tidak ada di HTML.
    }

    // Salin elemen img dari template agar setiap produk memiliki gambar sendiri.
    const gambar = templateFoto.content.firstElementChild.cloneNode(true); // Salin elemen img agar template asli tetap utuh.
    // Teks alt memberi keterangan gambar untuk aksesibilitas.
    gambar.alt = `Foto ${item.nama}`; // Beri deskripsi gambar untuk aksesibilitas.
    // Simbol menu menjadi placeholder sampai foto berhasil dimuat; jika gagal, simbol tetap terlihat.
    // Saat gambar berhasil dimuat, sembunyikan simbol di belakangnya.
    gambar.addEventListener('load', () => {
        simbol.hidden = true; // Sembunyikan placeholder setelah foto berhasil dimuat.
    }, { once: true });
    // Jika URL foto gagal, sembunyikan elemen gambar yang rusak dan biarkan simbol tampil.
    gambar.addEventListener('error', () => {
        gambar.hidden = true; // Sembunyikan gambar rusak agar simbol pengganti terlihat.
    }, { once: true });
    // Atur alamat gambar berdasarkan URL pada data item.
    gambar.src = item.foto; // Mulai memuat foto produk dari URL data.
    // Masukkan gambar ke area foto setelah listener error/load sudah terpasang.
    areaFoto.appendChild(gambar); // Pasang gambar pada area foto setelah listener siap.

    // Tangani kemungkinan gambar sudah selesai dimuat sebelum pemeriksaan ini dijalankan.
    if (gambar.complete && gambar.naturalWidth > 0) { // Periksa juga gambar yang selesai dimuat lebih cepat.
        simbol.hidden = true; // Sembunyikan placeholder untuk gambar yang sudah berhasil dimuat.
    }

    // Buat judul produk dan isi dengan teks nama dari data.
    const nama = document.createElement('h3'); // Buat judul untuk nama produk.
    nama.textContent = item.nama; // Isi judul sebagai teks, bukan markup HTML.

    // Buat deskripsi singkat produk sebagai paragraf.
    const keterangan = document.createElement('p'); // Buat paragraf deskripsi produk.
    keterangan.textContent = item.keterangan; // Tampilkan keterangan produk dengan aman sebagai teks.

    // Buat elemen harga dan format nominalnya dalam rupiah.
    const harga = document.createElement('p'); // Buat elemen untuk menampilkan harga.
    harga.className = 'harga'; // Terapkan warna dan penekanan harga dari CSS.
    harga.textContent = rupiah(item.harga); // Format harga ke rupiah sebelum ditampilkan.

    // Susun elemen kartu dari foto sampai tombol pemesanan.
    kartu.append( // Susun isi kartu dalam urutan foto, nama, deskripsi, harga, dan tombol.
        areaFoto,
        nama,
        keterangan,
        harga,
        buatTautanPesanan(item),
    );

    // Kembalikan kartu untuk disisipkan ke dalam kelompok kategori.
    return kartu; // Kembalikan kartu untuk ditambahkan ke grid kategori.
}

function buatKelompokMenu(kelompok) {
    // Bungkus kartu berdasarkan kategori makanan atau minuman.
    // Section memisahkan satu kategori menu dari kategori lainnya.
    const bagian = document.createElement('section'); // Buat bagian semantik untuk satu kategori.
    bagian.className = 'kelompok-menu'; // Terapkan gaya kategori dari CSS.

    // Buat heading kategori, misalnya "Makanan" atau "Minuman".
    const judul = document.createElement('h3'); // Buat judul kategori menu.
    judul.className = 'judul-kategori'; // Terapkan gaya khusus judul kategori.
    judul.textContent = kelompok.kategori; // Isi judul dengan nama kategori.

    // Buat grid sebagai wadah kartu-kartu dalam kategori ini.
    const daftar = document.createElement('div'); // Siapkan wadah kartu untuk kategori ini.
    daftar.className = 'grid daftar-kategori'; // Atur kartu memakai tata letak grid.

    // Ubah setiap data item menjadi elemen kartu produk.
    const kartu = kelompok.item.map((item) => // Ubah setiap data menu kategori menjadi kartu.
        buatKartuProduk(item, kelompok.simbol),
    );

    // Isi grid sekaligus dengan semua kartu yang sudah dibuat.
    daftar.replaceChildren(...kartu); // Isi grid sekaligus dengan semua kartu kategori.
    // Letakkan heading sebelum grid, kemudian kembalikan section kategori.
    bagian.append(judul, daftar); // Letakkan judul di atas grid kartu.
    return bagian; // Kembalikan section kategori yang sudah lengkap.
}

function tampilkanProduk() {
    // Isi area produk menggunakan seluruh data menu yang sudah dikelompokkan.
    // Cari wadah kosong di HTML yang disediakan untuk kartu produk.
    const wadah = document.getElementById('daftar-produk'); // Cari elemen HTML tempat katalog akan ditampilkan.

    // Laporkan kesalahan jika elemen target tidak sengaja dihapus dari HTML.
    if (!wadah) {
        throw new Error('Wadah daftar produk tidak ditemukan.'); // Laporkan jika target render katalog tidak tersedia.
    }

    // Buat section kategori untuk seluruh kelompok menu.
    const kelompokMenu = menu.map(buatKelompokMenu); // Render seluruh kategori menjadi elemen halaman.

    // Tampilkan kategori yang dibentuk dan menggantikan isi lama jika ada.
    wadah.replaceChildren(...kelompokMenu); // Ganti isi wadah dengan katalog terbaru.
}

function tampilkanTabelMenu() {
    // Buat baris tabel dari data yang sama; judul kategori memakai colspan tiga kolom.
    // Temukan tbody yang akan diisi dengan baris menu.
    const isiTabel = document.getElementById('isi-tabel-menu'); // Ambil tbody sebagai tempat baris menu.

    // Gagal dengan jelas jika tbody tidak tersedia pada HTML.
    if (!isiTabel) {
        throw new Error('Isi tabel menu tidak ditemukan.'); // Laporkan jika tbody target tabel tidak tersedia.
    }

    // Untuk setiap kategori, buat satu baris judul dan beberapa baris produk.
    const baris = menu.flatMap((kelompok) => { // Buat baris kategori dan produk untuk tabel.
        // Baris kategori menggabungkan tiga kolom menggunakan colspan.
        const judulKategori = document.createElement('tr'); // Buat baris khusus nama kategori.
        const selKategori = document.createElement('th'); // Gunakan th agar kategori dikenali sebagai header.
        selKategori.scope = 'rowgroup'; // Hubungkan header dengan kelompok baris produk.
        selKategori.colSpan = 3; // Rentangkan nama kategori ke tiga kolom tabel.
        selKategori.textContent = kelompok.kategori; // Isi header kategori sebagai teks.
        judulKategori.appendChild(selKategori); // Masukkan header kategori ke barisnya.

        // Buat satu baris tabel untuk tiap produk dalam kategori ini.
        const barisMenu = kelompok.item.map((item) => { // Buat satu baris tabel untuk tiap produk.
            const tr = document.createElement('tr'); // Siapkan baris produk baru.

            // Isi kolom nama, kategori, dan harga dengan teks biasa.
            for (const teks of [item.nama, kelompok.kategori, rupiah(item.harga)]) {
                const td = document.createElement('td'); // Buat satu sel untuk nilai kolom.
                td.textContent = teks; // Tambahkan nama, kategori, atau harga sebagai teks.
                tr.appendChild(td); // Pasang sel ke baris produk.
            }

            return tr; // Kembalikan baris yang sudah berisi tiga sel.
        });

        // Gabungkan baris judul dan daftar produk untuk kategori saat ini.
        return [judulKategori, ...barisMenu]; // Gabungkan header kategori dengan semua baris produknya.
    });

    // Pasang semua baris ke tbody sekaligus agar tabel selaras dengan data menu.
    isiTabel.replaceChildren(...baris); // Perbarui isi tabel sekaligus dengan baris baru.
}

function validasiField(input, idPesan) {
    // Ubah status validitas HTML menjadi pesan yang mudah dipahami pengguna.
    // Cari elemen kecil tempat pesan kesalahan untuk input ini ditampilkan.
    const pesan = document.getElementById(idPesan); // Cari elemen yang menampilkan pesan untuk input ini.

    // Pesan validasi wajib tersedia agar error tidak disembunyikan diam-diam.
    if (!pesan) {
        throw new Error(`Pesan validasi "${idPesan}" tidak ditemukan.`); // Laporkan jika elemen pesan untuk input hilang.
    }

    // Nilai kosong berarti tidak ada pesan kesalahan.
    let teks = ''; // Kosong berarti tidak ada pesan kesalahan.

    // Periksa jenis kesalahan bawaan validasi HTML secara berurutan.
    if (input.validity.valueMissing) {
        teks = 'Bagian ini wajib diisi.'; // Beri pesan jika kontrol wajib masih kosong.
    } else if (input.validity.typeMismatch) {
        teks = 'Masukkan format data yang valid.'; // Jelaskan kesalahan format nilai.
    } else if (input.validity.rangeOverflow) {
        teks = 'Jumlah pesanan maksimal 20.'; // Jelaskan batas atas kuantitas.
    } else if (input.validity.rangeUnderflow) {
        teks = 'Jumlah pesanan minimal 1.'; // Jelaskan batas bawah kuantitas.
    } else if (input.validity.stepMismatch || input.validity.badInput) {
        teks = 'Masukkan jumlah pesanan berupa bilangan bulat.'; // Minta kuantitas berupa bilangan bulat.
    }

    // Tampilkan pesan dan beri tahu teknologi bantu apakah input invalid.
    pesan.textContent = teks; // Tampilkan pesan validasi di dekat input.
    input.setAttribute('aria-invalid', teks ? 'true' : 'false'); // Umumkan status input ke teknologi bantu.
    // Kembalikan true jika valid sehingga pemanggil bisa menentukan langkah berikutnya.
    return teks === ''; // Beri tahu pemanggil apakah input lolos validasi.
}

function pasangInteraksiPemesanan() {
    const form = document.getElementById('form-pemesanan'); // Ambil form utama untuk memasang event submit.
    const nama = document.getElementById('nama-pemesan'); // Ambil input nama pelanggan.
    const telepon = document.getElementById('telepon-pemesan'); // Ambil input nomor WhatsApp pelanggan.
    const daftarItem = document.getElementById('daftar-item-pesanan'); // Ambil wadah baris-baris pesanan.
    const tombolTambah = document.getElementById('tambah-item-pesanan'); // Ambil tombol penambah baris menu.
    const status = document.getElementById('status-pemesanan'); // Ambil area informasi dan hasil pesanan.

    if (!(form && nama && telepon && daftarItem && tombolTambah && status)) {
        throw new Error('Elemen formulir pemesanan tidak ditemukan.'); // Hentikan pemasangan event jika elemen wajib hilang.
    }

    let nomorBaris = 0; // Beri ID unik pada setiap baris menu yang dibuat.

    function pasangValidasi(input, idPesan) {
        input.addEventListener('invalid', () => { // Tampilkan pesan saat validasi browser menemukan input tidak sah.
            validasiField(input, idPesan); // Perbarui pesan untuk input yang tidak lolos validasi.
            status.textContent = 'Periksa kembali data pemesanan yang wajib diisi.'; // Beri ringkasan kesalahan form.
        });
        input.addEventListener('input', () => { // Validasi ulang ketika pengguna mengetik.
            validasiField(input, idPesan); // Periksa nilai terbaru setelah pengguna mengetik.
            status.textContent = ''; // Hapus pesan status lama setelah data berubah.
        });
        input.addEventListener('change', () => { // Validasi ulang ketika pilihan atau nilai berubah.
            validasiField(input, idPesan); // Periksa nilai terbaru setelah perubahan dikonfirmasi.
            status.textContent = ''; // Kosongkan status lama agar tidak menyesatkan.
        });
    }

    function tambahBarisPesanan(menuId = '') {
        nomorBaris += 1; // Naikkan nomor agar ID field baru tidak duplikat.
        const baris = document.createElement('div'); // Buat wadah untuk satu menu dan jumlahnya.
        baris.className = 'item-pesanan'; // Terapkan tata letak satu baris pesanan.

        const fieldMenu = document.createElement('div'); // Buat wadah untuk label, pilihan menu, dan pesan.
        fieldMenu.className = 'field-form'; // Pakai gaya field formulir yang konsisten.
        const labelMenu = document.createElement('label'); // Buat label yang menjelaskan dropdown.
        labelMenu.htmlFor = `pilihan-menu-${nomorBaris}`; // Hubungkan label dengan dropdown unik.
        labelMenu.textContent = 'Pilih menu'; // Tampilkan instruksi untuk memilih produk.
        const pilihanMenu = document.createElement('select'); // Buat dropdown pemilihan produk.
        pilihanMenu.id = labelMenu.htmlFor; // Tetapkan ID yang sama dengan tujuan label.
        pilihanMenu.name = 'menu[]'; // Tandai nilai sebagai daftar menu jika form dikirim.
        pilihanMenu.required = true; // Wajibkan pengguna memilih menu pada tiap baris.
        pilihanMenu.setAttribute('aria-describedby', `error-menu-${nomorBaris}`); // Hubungkan dropdown ke pesan kesalahan.
        const opsiAwal = document.createElement('option'); // Buat opsi instruksi sebelum menu dipilih.
        opsiAwal.value = ''; // Nilai kosong membuat opsi ini tidak lolos required.
        opsiAwal.textContent = 'Pilih menu'; // Tampilkan instruksi pada dropdown.
        pilihanMenu.appendChild(opsiAwal); // Masukkan opsi awal ke dropdown.

        for (const item of semuaMenu) {
            const opsi = document.createElement('option'); // Buat pilihan untuk satu produk.
            opsi.value = item.id; // Simpan ID produk agar mudah dicari saat submit.
            opsi.textContent = `${item.nama} — ${rupiah(item.harga)}`; // Tampilkan nama dan harga produk.
            pilihanMenu.appendChild(opsi); // Tambahkan pilihan produk ke dropdown.
        }

        const errorMenu = document.createElement('small'); // Siapkan tempat pesan error pilihan menu.
        errorMenu.className = 'error-field'; // Terapkan tampilan pesan validasi.
        errorMenu.id = `error-menu-${nomorBaris}`; // Buat ID pesan yang sesuai untuk baris ini.
        errorMenu.setAttribute('aria-live', 'polite'); // Umumkan pesan baru tanpa mengganggu pembaca layar.
        fieldMenu.append(labelMenu, pilihanMenu, errorMenu); // Susun label, dropdown, dan pesan dalam field.

        const fieldJumlah = document.createElement('div'); // Buat wadah untuk label jumlah, input, dan pesan.
        fieldJumlah.className = 'field-form'; // Pakai tata letak field yang sama dengan form lainnya.
        const labelJumlah = document.createElement('label'); // Buat label input jumlah pesanan.
        labelJumlah.htmlFor = `jumlah-menu-${nomorBaris}`; // Hubungkan label dengan input jumlah unik.
        labelJumlah.textContent = 'Jumlah'; // Tampilkan nama field untuk pelanggan.
        const jumlah = document.createElement('input'); // Buat input untuk kuantitas produk.
        jumlah.id = labelJumlah.htmlFor; // Tetapkan ID yang dirujuk label.
        jumlah.name = 'jumlah[]'; // Tandai nilai sebagai daftar jumlah pesanan.
        jumlah.type = 'number'; // Batasi masukan ke angka.
        jumlah.min = '1'; // Tolak kuantitas kurang dari satu.
        jumlah.max = '20'; // Batasi kuantitas per menu hingga dua puluh.
        jumlah.step = '1'; // Izinkan hanya jumlah berupa bilangan bulat.
        jumlah.value = '1'; // Awali kuantitas dengan satu porsi.
        jumlah.required = true; // Wajibkan jumlah pada setiap baris pesanan.
        jumlah.setAttribute('aria-describedby', `error-jumlah-${nomorBaris}`); // Hubungkan input ke pesan validasinya.
        const errorJumlah = document.createElement('small'); // Siapkan tempat pesan kesalahan kuantitas.
        errorJumlah.className = 'error-field'; // Terapkan tampilan pesan validasi.
        errorJumlah.id = `error-jumlah-${nomorBaris}`; // Beri ID unik untuk aksesibilitas.
        errorJumlah.setAttribute('aria-live', 'polite'); // Umumkan pembaruan pesan secara aksesibel.
        fieldJumlah.append(labelJumlah, jumlah, errorJumlah); // Susun label, input, dan pesan dalam field.

        const tombolHapus = document.createElement('button'); // Buat tombol penghapus baris menu.
        tombolHapus.type = 'button'; // Pastikan tombol tidak mengirim form.
        tombolHapus.className = 'tombol hapus-item'; // Terapkan gaya tombol umum.
        tombolHapus.textContent = 'Hapus'; // Tampilkan aksi yang dapat dilakukan.
        tombolHapus.setAttribute('aria-label', `Hapus menu nomor ${nomorBaris}`); // Jelaskan baris yang dihapus ke pembaca layar.
        tombolHapus.addEventListener('click', () => { // Hapus baris ketika tombol dipilih.
            if (daftarItem.children.length === 1) {
                pilihanMenu.value = ''; // Kosongkan menu jika baris terakhir tidak boleh dihapus.
                jumlah.value = '1'; // Kembalikan kuantitas baris terakhir ke nilai awal.
                validasiField(pilihanMenu, errorMenu.id); // Tampilkan validasi karena menu kini belum dipilih.
                status.textContent = 'Minimal satu menu harus tersedia.'; // Jelaskan mengapa baris tetap ada.
                return; // Hentikan agar baris terakhir tidak dihapus.
            }

            const barisBerikutnya = baris.nextElementSibling || baris.previousElementSibling; // Pilih baris tujuan fokus setelah penghapusan.
            baris.remove(); // Hapus item pesanan yang dipilih.
            barisBerikutnya.querySelector('select').focus(); // Pindahkan fokus agar navigasi keyboard tetap jelas.
            status.textContent = ''; // Hapus pesan status sebelumnya.
        });

        baris.append(fieldMenu, fieldJumlah, tombolHapus); // Gabungkan field menu, jumlah, dan tombol hapus.
        daftarItem.appendChild(baris); // Pasang baris baru pada daftar pesanan.
        pilihanMenu.value = menuId; // Pilih produk otomatis jika ID menu diberikan.
        pasangValidasi(pilihanMenu, errorMenu.id); // Aktifkan validasi untuk dropdown baru.
        pasangValidasi(jumlah, errorJumlah.id); // Aktifkan validasi untuk input jumlah baru.
        return { pilihanMenu, jumlah }; // Kembalikan kontrol agar bisa difokuskan pemanggil.
    }

    tombolTambah.addEventListener('click', () => { // Tambahkan baris saat pelanggan meminta menu lain.
        const { pilihanMenu } = tambahBarisPesanan(); // Buat baris baru dengan opsi menu.
        pilihanMenu.focus(); // Arahkan fokus ke dropdown yang baru dibuat.
        status.textContent = ''; // Bersihkan pesan status yang sudah tidak relevan.
    });

    tambahBarisPesanan(); // Sediakan satu baris kosong saat halaman dibuka.
    pasangValidasi(nama, 'error-nama'); // Aktifkan validasi input nama pelanggan.
    pasangValidasi(telepon, 'error-telepon'); // Aktifkan validasi nomor kontak pelanggan.

    document.querySelectorAll('.tombol-pesan').forEach((tombol) => { // Ambil semua tombol pesan pada kartu produk.
        tombol.addEventListener('click', () => { // Hubungkan setiap tombol dengan pemilihan produk.
            const item = semuaMenu.find((menuItem) =>
                tombol.getAttribute('aria-label') === `Pilih ${menuItem.nama} untuk dipesan`, // Cocokkan tombol dengan nama produk.
            );

            if (!item) {
                throw new Error('Produk pada tombol pesan tidak ditemukan.'); // Laporkan tombol kartu yang tidak cocok dengan data.
            }

            let baris = [...daftarItem.querySelectorAll('.item-pesanan')].find( // Cari baris yang belum memiliki menu.
                (itemBaris) => !itemBaris.querySelector('select').value, // Gunakan baris kosong terlebih dahulu.
            );
            if (!baris) {
                tambahBarisPesanan(); // Tambahkan baris jika semua baris sudah terisi.
                baris = daftarItem.lastElementChild; // Gunakan baris terbaru untuk produk ini.
            }

            const pilihanMenu = baris.querySelector('select'); // Ambil dropdown pada baris yang dipilih.
            pilihanMenu.value = item.id; // Isi dropdown dengan produk dari kartu.
            pilihanMenu.dispatchEvent(new Event('change', { bubbles: true })); // Jalankan validasi dan event perubahan pilihan.
            const jumlah = baris.querySelector('input[type="number"]'); // Ambil jumlah untuk produk ini.
            status.textContent = `${item.nama} ditambahkan ke pesanan. Tentukan jumlahnya.`; // Beri konfirmasi dan instruksi.
            form.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Gulirkan form ke area yang terlihat.
            jumlah.focus({ preventScroll: true }); // Minta pelanggan menentukan jumlah produk.
        });
    });

    form.addEventListener('submit', (event) => { // Tangani pemesanan agar dirangkum sebelum membuka WhatsApp.
        event.preventDefault(); // Cegah browser mengirim form dan memuat ulang halaman.
        if (!form.checkValidity()) {
            form.reportValidity(); // Minta browser menampilkan kontrol form yang belum valid.
            status.textContent = 'Periksa kembali data pemesanan yang wajib diisi.'; // Tampilkan panduan untuk memperbaiki form.
            return; // Jangan buat tautan pesanan sebelum semua input valid.
        }

        const barisPesanan = [...daftarItem.querySelectorAll('.item-pesanan')]; // Ambil semua baris yang diisi pelanggan.
        const itemPesanan = barisPesanan.map((baris) => { // Ubah tiap baris menjadi data produk dan jumlah.
            const pilihanMenu = baris.querySelector('select'); // Ambil produk yang dipilih pada baris ini.
            const jumlah = baris.querySelector('input[type="number"]'); // Ambil kuantitas dari baris ini.
            const item = semuaMenu.find((menuItem) => menuItem.id === pilihanMenu.value); // Cari data produk berdasarkan ID pilihan.

            if (!item) {
                throw new Error('Menu yang dipilih tidak ditemukan.'); // Hentikan pesanan jika data menu tidak valid.
            }

            return { item, jumlah: Number(jumlah.value) }; // Simpan produk dan kuantitas sebagai satu item pesanan.
        });

        const nomorWhatsApp = ambilNomorWhatsApp(); // Ambil nomor tujuan yang sama dengan tombol WhatsApp utama.
        const total = itemPesanan.reduce( // Hitung seluruh subtotal menjadi total akhir pesanan.
            (jumlahTotal, pesanan) => jumlahTotal + pesanan.item.harga * pesanan.jumlah, // Tambahkan harga dikali jumlah tiap produk.
            0, // Mulai penjumlahan dari nol rupiah.
        );
        const pesan = [ // Susun ringkasan yang akan dibuka pada WhatsApp.
            'Halo, saya ingin memesan:',
            ...itemPesanan.map(({ item, jumlah }) =>
                `${jumlah} x ${item.nama} — ${rupiah(item.harga * jumlah)}`, // Cantumkan kuantitas dan subtotal tiap menu.
            ),
            `Nama: ${nama.value.trim()}`, // Sertakan nama pelanggan tanpa spasi berlebih.
            `WhatsApp pelanggan: ${telepon.value.trim()}`, // Sertakan nomor kontak pelanggan.
            `Total: ${rupiah(total)}`, // Tampilkan total seluruh item.
        ].join('\n'); // Pisahkan bagian pesan ke baris-baris yang mudah dibaca.
        const tautanWhatsApp = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`; // Amankan pesan untuk dimasukkan ke URL.

        status.replaceChildren( // Tampilkan pesan dan tautan cadangan jika tab baru diblokir.
            document.createTextNode('Pesanan disiapkan. Jika WhatsApp tidak terbuka, '),
            Object.assign(document.createElement('a'), {
                href: tautanWhatsApp, // Arahkan tautan ke ringkasan pesanan.
                target: '_blank', // Buka WhatsApp pada tab baru.
                rel: 'noopener', // Cegah tab baru mengakses halaman asal.
                textContent: 'buka pesan pesanan ini', // Beri nama tautan yang mudah dipahami.
            }),
            document.createTextNode('.'),
        );
        window.open(tautanWhatsApp, '_blank', 'noopener,noreferrer'); // Coba buka WhatsApp langsung setelah form valid.
    });
}

function tampilkanStatusBuka() {
    // Bandingkan jam perangkat dengan jam operasional untuk menampilkan status usaha.
    // Ambil elemen status pada bagian hero.
    const status = document.getElementById('status-buka'); // Ambil elemen yang menampilkan status operasional.

    // Laporkan jika elemen status hilang sehingga masalah HTML mudah ditemukan.
    if (!status) {
        throw new Error('Elemen status buka tidak ditemukan.'); // Laporkan jika HTML tidak menyediakan tempat status.
    }

    // Baca jam lokal perangkat pengunjung dalam rentang 0 sampai 23.
    const jamSekarang = new Date().getHours(); // Baca jam lokal perangkat dalam rentang 0 sampai 23.
    // Usaha dianggap buka jika waktu sekarang mulai jam buka dan sebelum jam tutup.
    const sedangBuka = jamSekarang >= jamBuka && jamSekarang < jamTutup; // Bandingkan waktu dengan jam operasional.

    // Ubah tulisan dan class CSS supaya status juga memiliki warna yang sesuai.
    status.textContent = sedangBuka ? 'Buka sekarang' : 'Sedang tutup'; // Tampilkan status dalam bentuk teks.
    status.className = sedangBuka ? 'buka' : 'tutup'; // Pilih kelas CSS agar status diberi warna sesuai.
}

function sembunyikanGambarHeroJikaRusak() {
    // Sembunyikan gambar pembuka jika berkas lokal tidak ditemukan atau gagal dimuat.
    // Cari gambar hero yang alamatnya ditentukan langsung di HTML.
    const gambar = document.getElementById('hero-gambar'); // Ambil gambar utama yang ingin disembunyikan bila gagal.

    // Tidak ada pekerjaan yang perlu dilakukan jika elemen gambar tidak tersedia.
    if (!gambar) {
        return;
    }

    // Simpan aksi menyembunyikan gambar agar bisa dipakai pada dua kondisi error.
    const sembunyikan = () => { // Buat tindakan bersama untuk menangani gambar yang rusak.
        gambar.style.display = 'none'; // Sembunyikan gambar yang tidak bisa dimuat.
    };

    // Tangani error pemuatan gambar dan hapus listener setelah sekali dipanggil.
    gambar.addEventListener('error', sembunyikan, { once: true }); // Tangani kegagalan muat satu kali.

    // Cek juga gambar yang sudah selesai gagal dimuat sebelum listener terpasang.
    if (gambar.complete && gambar.naturalWidth === 0) { // Periksa gambar yang gagal sebelum listener dipasang.
        sembunyikan(); // Sembunyikan gambar yang sudah diketahui gagal.
    }
}

// Inisialisasi halaman setelah file script dimuat di bagian akhir body.
// Urutan ini menampilkan katalog, tabel, status buka, dan perilaku form.
tampilkanProduk(); // Render kartu produk ke dalam halaman.
tampilkanTabelMenu(); // Isi tabel harga dari data menu yang sama.
tampilkanStatusBuka(); // Perbarui informasi buka atau tutup.
sembunyikanGambarHeroJikaRusak(); // Tangani gambar hero yang gagal dimuat.
pasangInteraksiPemesanan(); // Aktifkan validasi dan alur pemesanan WhatsApp.
