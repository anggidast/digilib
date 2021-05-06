# digilib

Pair Project Hactive8 Phase 1

MVP: kirim email dan notifikasi

Terdapat 2 role: reader dan admin

Route:
/ menampilkan page login \n
/home menampilkan home page \n
/accounts menampilkan table readers \n
/accounts/add menampilkan form tambah readers \n
/accounts/edit/:id menampilkan form edit readers \n
/accounts/reminder/:id memberikan peringatan kepada readers via email bahwa masa pinjam buku sudah habis \n
/accounts/rollback/:id mengembalikan buku yang dipinjam dan menambahkan jumlah copies pada ebook \n
/accounts/details/:id menampilkan table buku yang dipinjam oleh reader berdasarkan id \n
/ebooks menampilkan table books \n
/ebooks/add manampikan form tambah books \n
/ebooks/edit/:id menampilkan form edit books \n
/ebooks/details/:id menampilkan table peminjam buku berdasarkan id books \n

Role reader hanya bisa melihat profilnya sendiri pada /accounts dan hanya bisa melakukan edit
Pada /books role reader tidak bisa add dan edit tapi bisa pinjam buku

Table accounts akan menampilkan nama, email, dan see borrowed book yang akan menampilkan table buku yang dipinjam dan hari buku dipinjam dan hari buku harus dikembalikan

Table books akan menampilkan judul, author, jumlah copy, dan see borrowers (admin) yang akan menampilkan table peminjam dari buku tersebut

Yang belum dikerjakan:

- page belum selesai (terutama bagian edit, datanya belum terpopulate)
- validasi data null/empty belum dibuat
- fungsi reminder email belum dibuat
- days pada table borrow_log belum berfungsi (helpernya sudah dibuat)
- rollback pada account/details belum berfungsi (untuk mengembalikan ebooks dan menambahkan copies pada table ebooks)
