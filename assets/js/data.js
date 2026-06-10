window.CSSLabData = (() => ({
  "lessons": [
    {
      "id": "apa-itu-css",
      "icon": "bi-palette",
      "title": "Apa itu CSS?",
      "duration": "10 menit",
      "prerequisite": "Kamu sudah pernah melihat file HTML sederhana berisi h1, p, link, atau gambar.",
      "overview": "Kamu memahami bahwa CSS bertugas mengatur tampilan HTML: warna, ukuran, jarak, layout, dan responsif.",
      "goal": "Membedakan tugas HTML dan CSS sebelum mulai menulis selector pertama.",
      "problem": "Banyak pemula ingin langsung membuat halaman cantik, tetapi belum tahu bagian mana yang harus ditulis di HTML dan mana yang harus ditulis di CSS.",
      "analogy": "HTML seperti kerangka rumah. CSS seperti cat, ukuran ruangan, jarak furnitur, dan tata letak agar rumah nyaman dilihat.",
      "explanation": "CSS adalah bahasa stylesheet. Browser membaca HTML sebagai struktur, lalu membaca CSS sebagai aturan tampilan untuk elemen yang dipilih.",
      "steps": [
        "Ingat kembali bahwa HTML menyusun isi halaman.",
        "Tambahkan CSS untuk mengubah tampilan tanpa mengganti makna HTML.",
        "Mulai dari satu aturan kecil seperti warna judul.",
        "Lihat perubahan di browser setiap kali menulis CSS."
      ],
      "terms": [
        {
          "term": "CSS",
          "meaning": "Cascading Style Sheets, bahasa untuk mengatur tampilan web."
        },
        {
          "term": "Rule",
          "meaning": "Satu aturan CSS yang terdiri dari selector dan deklarasi."
        },
        {
          "term": "Declaration",
          "meaning": "Pasangan property dan value, misalnya color: blue."
        }
      ],
      "html": "<h1>Halo CSS</h1>\n<p>HTML memberi isi, CSS mengatur tampilannya.</p>",
      "css": "h1 {\n  color: #2563eb;\n}\n\np {\n  color: #475569;\n}",
      "filename": "style.css",
      "lineNotes": [
        "h1 memilih judul utama di HTML.",
        "color mengubah warna teks.",
        "p memilih paragraf agar warna teksnya lebih lembut."
      ],
      "exercise": "Ubah warna h1 menjadi warna favoritmu, lalu amati bagian mana yang berubah.",
      "commonMistakes": [
        "Mengira CSS bisa mengganti struktur HTML.",
        "Menulis CSS di file terpisah tetapi belum dihubungkan ke HTML.",
        "Mengubah terlalu banyak hal sekaligus sehingga sulit tahu aturan mana yang bekerja."
      ],
      "checkpoint": "Kamu bisa menjelaskan bahwa HTML berisi struktur, sedangkan CSS mengatur tampilan struktur itu.",
      "recall": "Jelaskan hubungan HTML dan CSS dengan analogi benda sehari-hari.",
      "debug": {
        "question": "Kenapa paragraf belum berubah warna padahal CSS sudah ditulis?",
        "hint": "Pastikan selector memilih elemen yang benar.",
        "solution": "Jika CSS menulis h1 tetapi yang ingin diubah adalah p, aturan tidak akan mengenai paragraf. Gunakan selector p."
      },
      "quiz": {
        "question": "Tugas utama CSS dalam halaman web adalah...",
        "options": [
          "Mengatur tampilan elemen HTML",
          "Menyimpan database",
          "Menjalankan server",
          "Mengganti browser"
        ],
        "answer": 0,
        "explanation": "CSS mengatur visual seperti warna, ukuran, jarak, dan layout."
      }
    },
    {
      "id": "hubungkan-css-ke-html",
      "icon": "bi-link-45deg",
      "title": "Menghubungkan CSS ke HTML",
      "duration": "12 menit",
      "prerequisite": "Kamu punya file index.html dan bisa membuat file baru bernama style.css.",
      "overview": "Kamu belajar tiga cara memakai CSS, lalu memilih file eksternal sebagai kebiasaan utama.",
      "goal": "Menghubungkan file style.css ke index.html dengan tag link di dalam head.",
      "problem": "CSS sering tidak bekerja bukan karena aturannya salah, tetapi karena file CSS belum terhubung atau path-nya keliru.",
      "analogy": "File CSS seperti buku aturan desain. HTML perlu diberi tahu lokasi buku aturan itu agar browser bisa membacanya.",
      "explanation": "Cara yang paling rapi untuk project kecil adalah CSS eksternal. Tulis tag link rel=\"stylesheet\" di dalam head dan arahkan href ke file CSS.",
      "steps": [
        "Buat file index.html.",
        "Buat file style.css di folder yang sama.",
        "Tambahkan link rel stylesheet di dalam head.",
        "Tulis satu aturan CSS dan refresh browser."
      ],
      "terms": [
        {
          "term": "External CSS",
          "meaning": "CSS yang disimpan di file terpisah."
        },
        {
          "term": "href",
          "meaning": "Alamat file CSS yang ingin dibaca browser."
        },
        {
          "term": "rel",
          "meaning": "Menjelaskan hubungan file, dalam hal ini stylesheet."
        }
      ],
      "html": "<!DOCTYPE html>\n<html lang=\"id\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Belajar CSS</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n  </head>\n  <body>\n    <h1>CSS sudah terhubung</h1>\n  </body>\n</html>",
      "css": "body {\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #2563eb;\n}",
      "filename": "style.css",
      "lineNotes": [
        "link ditulis di dalam head.",
        "rel=\"stylesheet\" memberi tahu browser bahwa file ini berisi CSS.",
        "href=\"style.css\" berarti file CSS berada di folder yang sama."
      ],
      "exercise": "Buat style.css lalu ubah warna h1. Jika tidak berubah, cek nama file dan lokasi folder.",
      "commonMistakes": [
        "Menulis scr atau src pada tag link.",
        "Menyimpan CSS dengan nama style.css.txt.",
        "Meletakkan style.css di folder lain tetapi href masih style.css."
      ],
      "checkpoint": "Kamu bisa menghubungkan file CSS eksternal dan melihat perubahan sederhana di browser.",
      "recall": "Apa fungsi rel dan href pada tag link stylesheet?",
      "debug": {
        "question": "File CSS tidak terbaca. Apa yang paling pertama dicek?",
        "hint": "Nama file dan lokasi folder harus sama dengan href.",
        "solution": "Pastikan file bernama style.css, bukan style.css.txt, dan berada di lokasi yang sesuai dengan href."
      },
      "quiz": {
        "question": "Tag untuk menghubungkan CSS eksternal adalah...",
        "options": [
          "<style src=\"style.css\">",
          "<link rel=\"stylesheet\" href=\"style.css\">",
          "<script href=\"style.css\">",
          "<css file=\"style.css\">"
        ],
        "answer": 1,
        "explanation": "CSS eksternal dihubungkan memakai link rel=\"stylesheet\"."
      }
    },
    {
      "id": "selector-dasar",
      "icon": "bi-crosshair",
      "title": "Selector Dasar",
      "duration": "13 menit",
      "prerequisite": "Kamu sudah tahu contoh elemen HTML seperti h1, p, a, dan button.",
      "overview": "Kamu memilih elemen berdasarkan nama tag, class, dan id.",
      "goal": "Menulis selector yang tepat agar aturan CSS mengenai elemen yang dimaksud.",
      "problem": "Pemula sering menulis aturan CSS yang benar, tetapi selector-nya tidak cocok dengan HTML.",
      "analogy": "Selector seperti alamat. Jika alamatnya salah, aturan desain dikirim ke rumah yang berbeda.",
      "explanation": "Selector tag memilih semua elemen dengan nama itu. Selector class memakai titik dan bisa dipakai banyak kali. Selector id memakai tanda pagar dan sebaiknya unik.",
      "steps": [
        "Gunakan selector tag untuk gaya umum.",
        "Tambahkan class pada HTML untuk gaya yang bisa dipakai ulang.",
        "Gunakan id untuk target unik jika memang perlu.",
        "Cek kembali titik dan tanda pagar pada CSS."
      ],
      "terms": [
        {
          "term": "Selector tag",
          "meaning": "Memilih elemen berdasarkan nama tag, misalnya p."
        },
        {
          "term": "Class",
          "meaning": "Penanda yang bisa dipakai banyak elemen, dipilih dengan titik."
        },
        {
          "term": "ID",
          "meaning": "Penanda unik, dipilih dengan tanda pagar."
        }
      ],
      "html": "<h1 class=\"judul\">Profil Saya</h1>\n<p class=\"teks\">Saya sedang belajar CSS.</p>\n<p id=\"catatan\">Hari ini belajar selector.</p>",
      "css": "p {\n  color: #475569;\n}\n\n.judul {\n  color: #2563eb;\n}\n\n#catatan {\n  background: #eff6ff;\n  padding: 12px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "p memilih semua paragraf.",
        ".judul memilih elemen dengan class judul.",
        "#catatan memilih elemen dengan id catatan."
      ],
      "exercise": "Buat dua paragraf dengan class sama, lalu beri warna yang sama lewat satu selector class.",
      "commonMistakes": [
        "Lupa titik saat memilih class.",
        "Memakai id yang sama pada banyak elemen.",
        "Menulis nama class berbeda antara HTML dan CSS."
      ],
      "checkpoint": "Kamu bisa membedakan selector tag, class, dan id.",
      "recall": "Kapan kamu memilih class dibanding id?",
      "debug": {
        "question": "Class di HTML sudah ada, tetapi CSS tidak bekerja. Apa kemungkinan salahnya?",
        "hint": "Class di CSS harus diawali titik.",
        "solution": "Jika HTML menulis class=\"judul\", CSS harus memakai .judul, bukan judul atau #judul."
      },
      "quiz": {
        "question": "Selector untuk class bernama kartu adalah...",
        "options": [
          "kartu",
          "#kartu",
          ".kartu",
          "<kartu>"
        ],
        "answer": 2,
        "explanation": "Class dipilih dengan tanda titik di CSS."
      }
    },
    {
      "id": "warna-dan-background",
      "icon": "bi-droplet-half",
      "title": "Warna dan Background",
      "duration": "12 menit",
      "prerequisite": "Kamu sudah bisa memilih elemen dengan selector sederhana.",
      "overview": "Kamu mengatur warna teks, warna latar, dan kontras agar halaman mudah dibaca.",
      "goal": "Menggunakan color dan background-color secara aman untuk teks dan area halaman.",
      "problem": "Warna yang menarik belum tentu nyaman dibaca. Kontras yang buruk membuat halaman sulit dipakai.",
      "analogy": "Warna seperti spidol di papan tulis. Spidol bagus tetap sulit dibaca jika warna papan dan spidol terlalu mirip.",
      "explanation": "Property color mengubah warna teks. background-color mengubah warna latar. Gunakan kombinasi yang cukup kontras.",
      "steps": [
        "Pilih warna latar yang tenang.",
        "Pilih warna teks yang kontras.",
        "Gunakan warna utama untuk tombol atau judul penting.",
        "Cek apakah teks tetap jelas di layar kecil."
      ],
      "terms": [
        {
          "term": "color",
          "meaning": "Property untuk warna teks."
        },
        {
          "term": "background-color",
          "meaning": "Property untuk warna latar."
        },
        {
          "term": "Hex color",
          "meaning": "Kode warna seperti #2563eb."
        }
      ],
      "html": "<section class=\"hero\">\n  <h1>Belajar CSS</h1>\n  <p>Warna membantu pengguna melihat bagian penting.</p>\n  <a href=\"#mulai\">Mulai</a>\n</section>",
      "css": ".hero {\n  background-color: #eff6ff;\n  padding: 32px;\n}\n\nh1 {\n  color: #1d4ed8;\n}\n\np {\n  color: #475569;\n}\n\na {\n  color: #ffffff;\n  background-color: #2563eb;\n  padding: 10px 14px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "background-color memberi latar biru muda.",
        "color pada h1 memakai biru yang lebih kuat.",
        "Link diberi warna teks putih dan latar biru agar terlihat seperti tombol."
      ],
      "exercise": "Buat kartu sederhana dengan latar biru muda, judul biru tua, dan paragraf abu-abu.",
      "commonMistakes": [
        "Memakai warna teks terlalu muda di latar putih.",
        "Mengubah background tetapi lupa mengecek warna teks.",
        "Mengandalkan warna saja tanpa struktur heading yang jelas."
      ],
      "checkpoint": "Kamu bisa memilih warna teks dan latar yang tetap mudah dibaca.",
      "recall": "Apa bedanya color dan background-color?",
      "debug": {
        "question": "Teks tombol tidak terlihat setelah background dibuat biru. Apa penyebabnya?",
        "hint": "Cek warna teks tombol.",
        "solution": "Tambahkan color: #ffffff; pada tombol agar teks kontras dengan background biru."
      },
      "quiz": {
        "question": "Property untuk mengubah warna teks adalah...",
        "options": [
          "text-color",
          "font-color",
          "color",
          "background"
        ],
        "answer": 2,
        "explanation": "CSS memakai property color untuk warna teks."
      }
    },
    {
      "id": "typography-css",
      "icon": "bi-type",
      "title": "Typography Dasar",
      "duration": "13 menit",
      "prerequisite": "Kamu sudah bisa mengubah warna teks.",
      "overview": "Kamu mengatur font, ukuran, ketebalan, dan tinggi baris agar teks nyaman dibaca.",
      "goal": "Membuat teks halaman lebih rapi tanpa mengubah struktur HTML.",
      "problem": "Halaman bisa punya isi yang benar, tetapi tetap melelahkan jika ukuran teks dan jarak baris tidak pas.",
      "analogy": "Typography seperti tulisan di buku. Isi yang sama terasa berbeda jika ukuran, tebal, dan jaraknya rapi.",
      "explanation": "Gunakan font-family untuk jenis huruf, font-size untuk ukuran, font-weight untuk ketebalan, dan line-height untuk jarak antar baris.",
      "steps": [
        "Atur font umum di body.",
        "Buat heading lebih tebal.",
        "Gunakan line-height yang lega untuk paragraf.",
        "Batasi lebar teks agar tidak terlalu panjang."
      ],
      "terms": [
        {
          "term": "font-family",
          "meaning": "Jenis huruf yang dipakai."
        },
        {
          "term": "font-size",
          "meaning": "Ukuran teks."
        },
        {
          "term": "line-height",
          "meaning": "Tinggi baris teks untuk kenyamanan baca."
        }
      ],
      "html": "<article class=\"artikel\">\n  <h1>Catatan Belajar CSS</h1>\n  <p>Typography yang rapi membuat halaman lebih mudah dipahami.</p>\n</article>",
      "css": "body {\n  font-family: Arial, sans-serif;\n}\n\n.artikel {\n  max-width: 640px;\n}\n\nh1 {\n  font-size: 32px;\n  font-weight: 800;\n}\n\np {\n  font-size: 16px;\n  line-height: 1.7;\n}",
      "filename": "style.css",
      "lineNotes": [
        "font-family di body menjadi gaya dasar.",
        "max-width mencegah baris teks terlalu panjang.",
        "line-height 1.7 membuat paragraf lebih lega."
      ],
      "exercise": "Buat artikel pendek dan atur body, h1, dan p seperti contoh.",
      "commonMistakes": [
        "Memakai terlalu banyak jenis font dalam satu halaman.",
        "Font terlalu kecil di layar mobile.",
        "Line-height terlalu rapat sehingga paragraf terasa padat."
      ],
      "checkpoint": "Kamu bisa membuat paragraf lebih nyaman dibaca dengan font-size dan line-height.",
      "recall": "Kenapa line-height penting untuk paragraf?",
      "debug": {
        "question": "Paragraf terlihat rapat dan sulit dibaca. Property apa yang dicek?",
        "hint": "Jarak antar baris diatur oleh line-height.",
        "solution": "Tambahkan line-height: 1.6 atau 1.7 pada paragraf."
      },
      "quiz": {
        "question": "Property untuk jarak antar baris teks adalah...",
        "options": [
          "line-height",
          "font-gap",
          "text-space",
          "letter-size"
        ],
        "answer": 0,
        "explanation": "line-height mengatur tinggi baris teks."
      }
    },
    {
      "id": "box-model",
      "icon": "bi-bounding-box",
      "title": "Box Model",
      "duration": "15 menit",
      "prerequisite": "Kamu sudah pernah melihat elemen seperti section, div, dan button.",
      "overview": "Kamu memahami bahwa setiap elemen adalah kotak yang punya content, padding, border, dan margin.",
      "goal": "Mengatur ruang di dalam dan luar elemen dengan benar.",
      "problem": "Pemula sering bingung kenapa kotak menjadi lebih besar dari yang dibayangkan setelah diberi padding dan border.",
      "analogy": "Kotak paket punya isi, busa pelindung, kardus, dan jarak dengan paket lain. Itulah box model.",
      "explanation": "Content adalah isi. Padding adalah ruang di dalam border. Border adalah garis tepi. Margin adalah jarak di luar elemen.",
      "steps": [
        "Mulai dari satu kotak sederhana.",
        "Tambahkan padding untuk ruang dalam.",
        "Tambahkan border untuk melihat batas.",
        "Tambahkan margin untuk jarak dengan elemen lain."
      ],
      "terms": [
        {
          "term": "Content",
          "meaning": "Isi utama elemen."
        },
        {
          "term": "Padding",
          "meaning": "Jarak antara isi dan border."
        },
        {
          "term": "Margin",
          "meaning": "Jarak luar antara elemen dan elemen lain."
        }
      ],
      "html": "<div class=\"kartu\">\n  <h2>Box Model</h2>\n  <p>Setiap elemen HTML bisa dianggap sebagai kotak.</p>\n</div>",
      "css": ".kartu {\n  background: #ffffff;\n  border: 2px solid #bfdbfe;\n  margin: 24px;\n  padding: 20px;\n}\n\nbody {\n  background: #eff6ff;\n}",
      "filename": "style.css",
      "lineNotes": [
        "padding memberi ruang di dalam kartu.",
        "border membuat batas kartu terlihat.",
        "margin memberi jarak kartu dari tepi halaman."
      ],
      "exercise": "Buat dua kartu. Ubah padding dan margin, lalu bedakan efek keduanya.",
      "commonMistakes": [
        "Memakai margin padahal ingin memberi ruang di dalam kotak.",
        "Memakai padding padahal ingin memberi jarak antar elemen.",
        "Lupa bahwa border ikut mempengaruhi ukuran visual kotak."
      ],
      "checkpoint": "Kamu bisa menjelaskan perbedaan padding, border, dan margin.",
      "recall": "Apa bedanya padding dan margin?",
      "debug": {
        "question": "Isi kartu terlalu menempel ke tepi. Property apa yang ditambahkan?",
        "hint": "Ruang dalam kotak adalah padding.",
        "solution": "Tambahkan padding pada kartu, misalnya padding: 20px."
      },
      "quiz": {
        "question": "Jarak di dalam border elemen disebut...",
        "options": [
          "margin",
          "padding",
          "outline",
          "gap"
        ],
        "answer": 1,
        "explanation": "Padding adalah jarak antara content dan border."
      }
    },
    {
      "id": "margin-padding",
      "icon": "bi-arrows-expand",
      "title": "Margin dan Padding",
      "duration": "12 menit",
      "prerequisite": "Kamu sudah memahami box model secara umum.",
      "overview": "Kamu melatih penggunaan shorthand margin dan padding untuk mengatur jarak dengan cepat.",
      "goal": "Menulis spacing yang konsisten dan tidak membuat layout berantakan.",
      "problem": "Jarak halaman sering tampak acak karena setiap elemen diberi nilai margin dan padding berbeda tanpa pola.",
      "analogy": "Spacing seperti jarak antar paragraf di buku. Jika jaraknya konsisten, mata lebih mudah mengikuti isi.",
      "explanation": "Shorthand margin dan padding bisa memakai satu, dua, tiga, atau empat nilai. Nilai dua berarti atas-bawah dan kiri-kanan.",
      "steps": [
        "Gunakan padding untuk ruang dalam section.",
        "Gunakan margin-bottom untuk jarak antar blok teks.",
        "Coba shorthand dua nilai.",
        "Gunakan nilai yang berulang seperti 8, 16, 24, 32."
      ],
      "terms": [
        {
          "term": "Shorthand",
          "meaning": "Cara ringkas menulis beberapa sisi sekaligus."
        },
        {
          "term": "margin-bottom",
          "meaning": "Jarak luar bagian bawah."
        },
        {
          "term": "padding-inline",
          "meaning": "Ruang dalam sisi kiri dan kanan."
        }
      ],
      "html": "<section class=\"panel\">\n  <h1>Spacing Rapi</h1>\n  <p>Jarak yang konsisten membuat halaman terasa tenang.</p>\n</section>",
      "css": ".panel {\n  background: #eff6ff;\n  padding: 32px 24px;\n}\n\nh1 {\n  margin: 0 0 12px;\n}\n\np {\n  margin: 0;\n}",
      "filename": "style.css",
      "lineNotes": [
        "padding: 32px 24px berarti atas-bawah 32px dan kiri-kanan 24px.",
        "margin pada h1 diberi jarak bawah 12px.",
        "margin p dibuat 0 agar jarak tidak dobel."
      ],
      "exercise": "Buat section dengan padding 32px dan beri jarak 12px antara judul dan paragraf.",
      "commonMistakes": [
        "Memberi margin pada semua sisi tanpa tahu efeknya.",
        "Jarak dobel karena heading dan paragraf sama-sama punya margin.",
        "Memakai angka acak sehingga spacing tidak konsisten."
      ],
      "checkpoint": "Kamu bisa membaca shorthand margin dan padding dua nilai.",
      "recall": "Apa arti padding: 20px 12px?",
      "debug": {
        "question": "Jarak antar judul dan paragraf terlalu jauh. Apa yang perlu dicek?",
        "hint": "Heading dan paragraf punya margin bawaan browser.",
        "solution": "Atur margin h1 dan p secara eksplisit agar jaraknya sesuai."
      },
      "quiz": {
        "question": "padding: 16px 24px berarti...",
        "options": [
          "Semua sisi 16px",
          "Atas-bawah 16px, kiri-kanan 24px",
          "Atas 16px saja",
          "Kiri-kanan 16px, atas-bawah 24px"
        ],
        "answer": 1,
        "explanation": "Pada shorthand dua nilai, nilai pertama untuk atas-bawah dan nilai kedua untuk kiri-kanan."
      }
    },
    {
      "id": "border-radius-shadow",
      "icon": "bi-app-indicator",
      "title": "Border, Radius, dan Shadow",
      "duration": "12 menit",
      "prerequisite": "Kamu sudah bisa membuat kartu sederhana dengan padding.",
      "overview": "Kamu menambahkan garis, sudut, dan bayangan dengan porsi yang wajar.",
      "goal": "Membuat elemen terlihat terkelompok tanpa berlebihan.",
      "problem": "Card yang terlalu datar sulit dibedakan, tetapi shadow berlebihan membuat desain terlihat berat.",
      "analogy": "Border seperti garis buku, radius seperti sudut yang sedikit dibulatkan, shadow seperti bayangan meja.",
      "explanation": "Gunakan border untuk batas ringan, border-radius untuk sudut, dan box-shadow untuk kedalaman visual.",
      "steps": [
        "Mulai dengan border tipis.",
        "Tambahkan border-radius secukupnya.",
        "Gunakan shadow lembut.",
        "Cek hasil di latar terang dan gelap."
      ],
      "terms": [
        {
          "term": "border",
          "meaning": "Garis tepi elemen."
        },
        {
          "term": "border-radius",
          "meaning": "Kelenturan sudut elemen."
        },
        {
          "term": "box-shadow",
          "meaning": "Bayangan pada kotak elemen."
        }
      ],
      "html": "<article class=\"card\">\n  <h2>Kartu Materi</h2>\n  <p>Satu konsep, satu latihan kecil.</p>\n</article>",
      "css": ".card {\n  background: #ffffff;\n  border: 1px solid #dbeafe;\n  border-radius: 12px;\n  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.12);\n  padding: 20px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "border memberi batas halus.",
        "border-radius 12px membuat sudut tidak tajam.",
        "box-shadow memakai warna transparan agar lembut."
      ],
      "exercise": "Buat card dengan border, radius 12px, dan shadow tipis.",
      "commonMistakes": [
        "Shadow terlalu gelap.",
        "Radius terlalu besar untuk elemen kecil.",
        "Border dan shadow membuat desain terlalu ramai jika dipakai pada semua elemen."
      ],
      "checkpoint": "Kamu bisa membuat card sederhana yang tetap mudah dibaca.",
      "recall": "Apa fungsi box-shadow pada card?",
      "debug": {
        "question": "Shadow tidak terlihat. Apa kemungkinan penyebabnya?",
        "hint": "Shadow terlihat lebih jelas jika latar card berbeda dari latar halaman.",
        "solution": "Pastikan card punya background dan shadow memakai blur serta alpha yang cukup."
      },
      "quiz": {
        "question": "Property untuk membulatkan sudut elemen adalah...",
        "options": [
          "corner",
          "border-radius",
          "box-round",
          "radius-box"
        ],
        "answer": 1,
        "explanation": "border-radius mengatur sudut elemen."
      }
    },
    {
      "id": "display-block-inline",
      "icon": "bi-layout-three-columns",
      "title": "Display: Block, Inline, Inline-Block",
      "duration": "14 menit",
      "prerequisite": "Kamu sudah memahami elemen sebagai kotak.",
      "overview": "Kamu mengenal perilaku dasar elemen sebelum masuk ke flexbox dan grid.",
      "goal": "Membedakan elemen yang mengambil satu baris penuh dan elemen yang mengikuti alur teks.",
      "problem": "Tombol, link, dan judul sering susah diberi ukuran karena display bawaannya berbeda.",
      "analogy": "Block seperti meja yang mengambil satu baris ruang. Inline seperti kata di dalam kalimat. Inline-block seperti label kecil yang tetap bisa punya ukuran.",
      "explanation": "display: block membuat elemen mengambil baris penuh. inline mengikuti alur teks. inline-block tetap sebaris tetapi bisa diberi padding dan ukuran lebih stabil.",
      "steps": [
        "Lihat perilaku h1 sebagai block.",
        "Lihat a sebagai inline.",
        "Ubah a menjadi inline-block saat ingin dibuat seperti tombol.",
        "Gunakan margin dan padding setelah display sesuai."
      ],
      "terms": [
        {
          "term": "block",
          "meaning": "Elemen mengambil lebar baris dan mulai di baris baru."
        },
        {
          "term": "inline",
          "meaning": "Elemen mengikuti alur teks."
        },
        {
          "term": "inline-block",
          "meaning": "Tetap sebaris tetapi bisa diberi ukuran dan padding. "
        }
      ],
      "html": "<h1>Display CSS</h1>\n<p>Link di bawah dibuat seperti tombol.</p>\n<a class=\"button\" href=\"#mulai\">Mulai belajar</a>",
      "css": ".button {\n  background: #2563eb;\n  color: white;\n  display: inline-block;\n  padding: 10px 14px;\n  text-decoration: none;\n}\n\nh1, p {\n  margin-bottom: 12px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "a bawaan browser adalah inline.",
        "display: inline-block membuat padding tombol lebih stabil.",
        "text-decoration: none menghapus garis bawah link."
      ],
      "exercise": "Ubah link biasa menjadi tombol dengan display inline-block dan padding.",
      "commonMistakes": [
        "Memberi width pada inline lalu bingung tidak berpengaruh.",
        "Memakai block untuk tombol kecil sehingga mengambil satu baris penuh.",
        "Lupa menghapus underline saat link dijadikan tombol."
      ],
      "checkpoint": "Kamu tahu kapan memakai inline-block untuk link tombol.",
      "recall": "Kenapa link tombol sering diberi display: inline-block?",
      "debug": {
        "question": "Padding vertikal link terasa tidak rapi. Display apa yang bisa membantu?",
        "hint": "Link bawaan adalah inline.",
        "solution": "Tambahkan display: inline-block agar padding atas-bawah pada link lebih stabil."
      },
      "quiz": {
        "question": "Elemen yang mengambil satu baris penuh biasanya berperilaku...",
        "options": [
          "inline",
          "block",
          "hidden",
          "absolute"
        ],
        "answer": 1,
        "explanation": "Elemen block mulai di baris baru dan mengambil lebar baris."
      }
    },
    {
      "id": "flexbox-dasar",
      "icon": "bi-columns-gap",
      "title": "Flexbox Dasar",
      "duration": "16 menit",
      "prerequisite": "Kamu sudah mengenal display dasar.",
      "overview": "Kamu menyusun item dalam satu arah dengan flexbox.",
      "goal": "Membuat navbar atau baris kartu sederhana yang rapi dan responsif dasar.",
      "problem": "Menyusun item sejajar dengan margin manual cepat berantakan saat ukuran layar berubah.",
      "analogy": "Flexbox seperti rak yang bisa merapikan item dalam satu baris atau kolom dan memberi jarak otomatis.",
      "explanation": "display: flex mengaktifkan flexbox pada container. gap memberi jarak antar item. justify-content mengatur arah utama, align-items mengatur arah silang.",
      "steps": [
        "Tentukan container yang membungkus item.",
        "Tambahkan display: flex.",
        "Gunakan gap untuk jarak.",
        "Gunakan justify-content dan align-items sesuai kebutuhan."
      ],
      "terms": [
        {
          "term": "Flex container",
          "meaning": "Elemen yang diberi display: flex."
        },
        {
          "term": "gap",
          "meaning": "Jarak antar item flex."
        },
        {
          "term": "justify-content",
          "meaning": "Pengaturan posisi di arah utama."
        }
      ],
      "html": "<nav class=\"navbar\">\n  <strong>CSSLab</strong>\n  <a href=\"#materi\">Materi</a>\n  <a href=\"#project\">Project</a>\n</nav>",
      "css": ".navbar {\n  align-items: center;\n  display: flex;\n  gap: 16px;\n}\n\n.navbar strong {\n  margin-right: auto;\n}\n\na {\n  color: #2563eb;\n  font-weight: bold;\n  text-decoration: none;\n}",
      "filename": "style.css",
      "lineNotes": [
        "display: flex menyusun anak nav dalam satu baris.",
        "gap memberi jarak antar item.",
        "margin-right: auto mendorong link ke kanan."
      ],
      "exercise": "Buat navbar sederhana dengan brand di kiri dan dua link di kanan.",
      "commonMistakes": [
        "Memberi display flex pada item, bukan container.",
        "Mengatur gap dengan margin manual pada setiap item.",
        "Lupa bahwa flexbox bekerja pada anak langsung container."
      ],
      "checkpoint": "Kamu bisa membuat item sejajar dengan display flex dan gap.",
      "recall": "Elemen mana yang diberi display: flex?",
      "debug": {
        "question": "Item tidak sejajar walaupun sudah menulis display: flex. Apa yang perlu dicek?",
        "hint": "display: flex harus berada pada parent item.",
        "solution": "Pastikan container yang membungkus item diberi display: flex, bukan itemnya satu per satu."
      },
      "quiz": {
        "question": "Property untuk memberi jarak antar item flex adalah...",
        "options": [
          "space",
          "gap",
          "margin-all",
          "distance"
        ],
        "answer": 1,
        "explanation": "gap memberi jarak antar item pada flex dan grid."
      }
    },
    {
      "id": "grid-dasar",
      "icon": "bi-grid-3x3-gap",
      "title": "CSS Grid Dasar",
      "duration": "16 menit",
      "prerequisite": "Kamu sudah bisa membuat beberapa card HTML.",
      "overview": "Kamu menyusun card dalam baris dan kolom dengan CSS Grid.",
      "goal": "Membuat layout kartu yang mudah menyesuaikan lebar layar.",
      "problem": "Membuat banyak card dengan lebar manual membuat layout sulit dirawat.",
      "analogy": "Grid seperti rak buku berkotak. Kamu menentukan ukuran kolom, browser membantu menaruh item.",
      "explanation": "display: grid mengaktifkan grid. grid-template-columns menentukan kolom. repeat dan minmax membantu membuat kolom responsif.",
      "steps": [
        "Buat container grid.",
        "Tambahkan display: grid.",
        "Gunakan gap.",
        "Gunakan repeat(auto-fit, minmax(...)) untuk card responsif."
      ],
      "terms": [
        {
          "term": "Grid container",
          "meaning": "Elemen yang diberi display: grid."
        },
        {
          "term": "grid-template-columns",
          "meaning": "Aturan jumlah dan ukuran kolom."
        },
        {
          "term": "minmax",
          "meaning": "Fungsi untuk batas ukuran minimum dan maksimum."
        }
      ],
      "html": "<section class=\"grid\">\n  <article>HTML</article>\n  <article>CSS</article>\n  <article>JavaScript</article>\n</section>",
      "css": ".grid {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n}\n\narticle {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  padding: 20px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "display: grid membuat container memakai layout grid.",
        "gap memberi jarak antar card.",
        "auto-fit dan minmax membuat jumlah kolom menyesuaikan ruang."
      ],
      "exercise": "Buat grid tiga kartu materi yang turun otomatis saat layar sempit.",
      "commonMistakes": [
        "Menaruh grid-template-columns pada card, bukan container.",
        "Membuat kolom fixed terlalu besar untuk mobile.",
        "Lupa gap sehingga card terlalu menempel."
      ],
      "checkpoint": "Kamu bisa membuat grid card dasar yang responsif.",
      "recall": "Apa fungsi repeat(auto-fit, minmax(...))?",
      "debug": {
        "question": "Card tetap satu kolom padahal ingin grid. Apa yang dicek?",
        "hint": "Cek selector container.",
        "solution": "Pastikan display: grid dan grid-template-columns ditulis pada container yang membungkus card."
      },
      "quiz": {
        "question": "Property untuk mengatur kolom grid adalah...",
        "options": [
          "grid-template-columns",
          "flex-columns",
          "column-count-only",
          "grid-gap-columns"
        ],
        "answer": 0,
        "explanation": "grid-template-columns menentukan ukuran kolom grid."
      }
    },
    {
      "id": "position-css",
      "icon": "bi-pin-map",
      "title": "Position Dasar",
      "duration": "15 menit",
      "prerequisite": "Kamu sudah memahami layout normal dengan block, flex, atau grid.",
      "overview": "Kamu mengenal static, relative, absolute, dan fixed secara aman.",
      "goal": "Memakai position hanya ketika memang perlu menggeser atau menempelkan elemen.",
      "problem": "Pemula sering memakai position absolute untuk semua layout, lalu halaman rusak di layar berbeda.",
      "analogy": "Position seperti menaruh sticky note di papan. Ada yang tetap mengikuti alur, ada yang ditempel pada titik tertentu.",
      "explanation": "static adalah posisi normal. relative bisa digeser dari posisi normal. absolute mencari parent ber-position. fixed menempel pada viewport.",
      "steps": [
        "Mulai dari layout normal.",
        "Beri parent position: relative jika anak absolute butuh acuan.",
        "Gunakan top, right, bottom, left secukupnya.",
        "Hindari absolute untuk layout utama."
      ],
      "terms": [
        {
          "term": "static",
          "meaning": "Posisi bawaan elemen."
        },
        {
          "term": "relative",
          "meaning": "Tetap punya ruang normal tetapi bisa menjadi acuan absolute."
        },
        {
          "term": "absolute",
          "meaning": "Keluar dari alur normal dan diposisikan terhadap acuan terdekat."
        }
      ],
      "html": "<div class=\"card\">\n  <span class=\"badge\">Baru</span>\n  <h2>Materi CSS</h2>\n  <p>Badge ditempatkan di pojok kartu.</p>\n</div>",
      "css": ".card {\n  border: 1px solid #bfdbfe;\n  padding: 24px;\n  position: relative;\n}\n\n.badge {\n  background: #2563eb;\n  color: white;\n  padding: 6px 10px;\n  position: absolute;\n  right: 12px;\n  top: 12px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "card menjadi acuan karena position: relative.",
        "badge diposisikan absolute terhadap card.",
        "right dan top menentukan jarak dari pojok card."
      ],
      "exercise": "Buat badge kecil di pojok kanan atas sebuah card.",
      "commonMistakes": [
        "Lupa memberi parent position: relative.",
        "Memakai absolute untuk menyusun seluruh halaman.",
        "Elemen absolute menutupi teks karena padding card terlalu kecil."
      ],
      "checkpoint": "Kamu bisa membuat badge absolute dengan parent relative.",
      "recall": "Kenapa parent sering diberi position: relative sebelum anak absolute?",
      "debug": {
        "question": "Badge muncul di pojok halaman, bukan pojok card. Apa penyebabnya?",
        "hint": "Absolute butuh acuan parent.",
        "solution": "Tambahkan position: relative pada card agar badge absolute mengacu ke card."
      },
      "quiz": {
        "question": "Agar anak absolute mengacu ke card, card biasanya diberi...",
        "options": [
          "display: inline",
          "position: relative",
          "font-weight: bold",
          "overflow: text"
        ],
        "answer": 1,
        "explanation": "position: relative membuat parent menjadi acuan positioning untuk anak absolute."
      }
    },
    {
      "id": "responsive-media-query",
      "icon": "bi-phone",
      "title": "Responsive dan Media Query",
      "duration": "17 menit",
      "prerequisite": "Kamu sudah membuat layout sederhana dengan grid atau flex.",
      "overview": "Kamu membuat tampilan yang tetap nyaman di layar kecil.",
      "goal": "Mengubah layout dan ukuran tertentu berdasarkan lebar layar.",
      "problem": "Halaman yang bagus di laptop bisa terlalu sempit atau teksnya pecah di handphone.",
      "analogy": "Responsive seperti meja lipat. Saat ruang besar, meja melebar. Saat ruang kecil, susunannya menyesuaikan.",
      "explanation": "Media query menjalankan aturan CSS hanya saat kondisi tertentu terpenuhi, misalnya max-width: 600px.",
      "steps": [
        "Buat layout desktop sederhana.",
        "Cek tampilan di lebar kecil.",
        "Tambahkan media query untuk perubahan penting.",
        "Utamakan satu kolom di mobile."
      ],
      "terms": [
        {
          "term": "Responsive",
          "meaning": "Tampilan menyesuaikan ukuran layar."
        },
        {
          "term": "Media query",
          "meaning": "Aturan CSS bersyarat berdasarkan karakteristik perangkat."
        },
        {
          "term": "max-width",
          "meaning": "Kondisi berlaku sampai lebar tertentu."
        }
      ],
      "html": "<section class=\"layout\">\n  <aside>Menu</aside>\n  <main>Konten utama</main>\n</section>",
      "css": ".layout {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: 220px 1fr;\n}\n\naside, main {\n  background: #eff6ff;\n  padding: 20px;\n}\n\n@media (max-width: 600px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}",
      "filename": "style.css",
      "lineNotes": [
        "Desktop memakai dua kolom.",
        "aside dan main diberi padding agar terlihat.",
        "Pada layar maksimal 600px, layout menjadi satu kolom."
      ],
      "exercise": "Buat layout dua kolom yang berubah menjadi satu kolom di bawah 600px.",
      "commonMistakes": [
        "Menulis media query sebelum aturan dasar lalu tertimpa aturan lain.",
        "Lupa kurung kurawal penutup media query.",
        "Mengatur font terlalu kecil untuk mobile."
      ],
      "checkpoint": "Kamu bisa membuat satu perubahan layout dengan media query.",
      "recall": "Apa arti @media (max-width: 600px)?",
      "debug": {
        "question": "Media query tidak berpengaruh. Apa yang dicek?",
        "hint": "Cek kurung kurawal dan urutan aturan.",
        "solution": "Pastikan media query ditulis setelah aturan dasar dan semua kurung kurawal tertutup."
      },
      "quiz": {
        "question": "Aturan CSS bersyarat untuk lebar layar ditulis dengan...",
        "options": [
          "@screen",
          "@media",
          "@device",
          "@responsive"
        ],
        "answer": 1,
        "explanation": "@media dipakai untuk media query."
      }
    },
    {
      "id": "pseudo-class-hover-focus",
      "icon": "bi-cursor",
      "title": "Pseudo-class Hover dan Focus",
      "duration": "13 menit",
      "prerequisite": "Kamu sudah pernah membuat link atau button.",
      "overview": "Kamu memberi feedback visual saat elemen disentuh, diarahkan, atau difokuskan keyboard.",
      "goal": "Membuat tombol terasa interaktif dan tetap ramah aksesibilitas.",
      "problem": "Tanpa state hover dan focus, pengguna sulit tahu elemen mana yang sedang aktif.",
      "analogy": "Pseudo-class seperti lampu indikator. Saat tombol disentuh atau dipilih, lampunya berubah.",
      "explanation": ":hover aktif saat pointer berada di elemen. :focus-visible membantu pengguna keyboard melihat posisi fokus.",
      "steps": [
        "Buat gaya dasar tombol.",
        "Tambahkan :hover untuk mouse.",
        "Tambahkan :focus-visible untuk keyboard.",
        "Pastikan warna fokus jelas."
      ],
      "terms": [
        {
          "term": ":hover",
          "meaning": "State saat pointer berada di elemen."
        },
        {
          "term": ":focus-visible",
          "meaning": "State fokus yang biasanya terlihat untuk navigasi keyboard."
        },
        {
          "term": "State",
          "meaning": "Kondisi elemen saat digunakan."
        }
      ],
      "html": "<button class=\"button\">Simpan</button>\n<a class=\"link\" href=\"#lanjut\">Lanjut materi</a>",
      "css": ".button, .link {\n  background: #2563eb;\n  border: 0;\n  color: white;\n  display: inline-block;\n  padding: 10px 14px;\n}\n\n.button:hover, .link:hover {\n  background: #1d4ed8;\n}\n\n.button:focus-visible, .link:focus-visible {\n  outline: 3px solid #93c5fd;\n  outline-offset: 3px;\n}",
      "filename": "style.css",
      "lineNotes": [
        ":hover membuat warna berubah saat pointer diarahkan.",
        ":focus-visible memberi outline untuk navigasi keyboard.",
        "outline-offset memberi jarak antara outline dan elemen."
      ],
      "exercise": "Tambahkan hover dan focus-visible pada link yang dibuat seperti tombol.",
      "commonMistakes": [
        "Menghapus outline tanpa pengganti.",
        "Hover terlalu halus sehingga tidak terasa.",
        "Hanya memikirkan pengguna mouse dan melupakan keyboard."
      ],
      "checkpoint": "Kamu bisa membuat state hover dan focus yang terlihat jelas.",
      "recall": "Kenapa focus-visible penting untuk aksesibilitas?",
      "debug": {
        "question": "Tombol tidak punya tanda saat dipilih dengan keyboard. Apa yang kurang?",
        "hint": "Keyboard butuh state focus.",
        "solution": "Tambahkan aturan :focus-visible dengan outline yang jelas."
      },
      "quiz": {
        "question": "Pseudo-class saat pointer berada di elemen adalah...",
        "options": [
          ":active",
          ":hover",
          ":checked",
          ":visited"
        ],
        "answer": 1,
        "explanation": ":hover aktif saat pointer berada di elemen."
      }
    },
    {
      "id": "specificity-cascade",
      "icon": "bi-layers",
      "title": "Cascade dan Specificity",
      "duration": "16 menit",
      "prerequisite": "Kamu sudah menulis beberapa selector CSS.",
      "overview": "Kamu memahami kenapa satu aturan menang atas aturan lain.",
      "goal": "Membaca konflik CSS tanpa langsung memakai !important.",
      "problem": "Pemula sering bingung karena warna sudah ditulis tetapi hasilnya tetap mengikuti aturan lain.",
      "analogy": "Cascade seperti aturan kelas. Jika ada dua instruksi, instruksi yang lebih spesifik atau datang lebih akhir bisa menang.",
      "explanation": "CSS memilih aturan berdasarkan cascade, specificity, dan urutan. Selector id lebih spesifik dari class, class lebih spesifik dari tag.",
      "steps": [
        "Cari aturan yang sama-sama mengubah property.",
        "Bandingkan specificity selector.",
        "Lihat urutan aturan di file CSS.",
        "Hindari !important saat masih bisa memperbaiki selector."
      ],
      "terms": [
        {
          "term": "Cascade",
          "meaning": "Cara CSS menentukan aturan yang berlaku."
        },
        {
          "term": "Specificity",
          "meaning": "Bobot selector."
        },
        {
          "term": "!important",
          "meaning": "Penanda yang memaksa aturan, sebaiknya jarang dipakai. "
        }
      ],
      "html": "<p class=\"teks utama\">Paragraf penting</p>",
      "css": "p {\n  color: #475569;\n}\n\n.teks {\n  color: #0f766e;\n}\n\n.utama {\n  color: #2563eb;\n}",
      "filename": "style.css",
      "lineNotes": [
        "Selector p memberi warna umum.",
        ".teks lebih spesifik dari p.",
        ".utama punya bobot sama dengan .teks tetapi datang lebih akhir, jadi menang."
      ],
      "exercise": "Buat dua class yang mengubah warna sama, lalu ubah urutannya dan lihat hasilnya.",
      "commonMistakes": [
        "Langsung memakai !important.",
        "Tidak sadar ada aturan yang datang lebih akhir.",
        "Mengira selector yang lebih panjang selalu pasti lebih baik."
      ],
      "checkpoint": "Kamu bisa menjelaskan kenapa warna akhir pada contoh menjadi biru.",
      "recall": "Apa yang terjadi jika dua selector punya specificity sama?",
      "debug": {
        "question": "Warna .teks tidak muncul karena .utama menang. Kenapa?",
        "hint": "Bobot sama, urutan menentukan.",
        "solution": "Karena .utama ditulis setelah .teks dan specificity-nya sama, aturan .utama menang."
      },
      "quiz": {
        "question": "Jika dua aturan punya specificity sama, biasanya yang menang adalah...",
        "options": [
          "Yang ditulis lebih awal",
          "Yang ditulis lebih akhir",
          "Yang hurufnya paling panjang",
          "Yang memakai warna biru"
        ],
        "answer": 1,
        "explanation": "Dalam cascade, urutan akhir menang jika specificity sama."
      }
    },
    {
      "id": "variable-css",
      "icon": "bi-sliders",
      "title": "CSS Variable",
      "duration": "14 menit",
      "prerequisite": "Kamu sudah memakai warna dan spacing beberapa kali.",
      "overview": "Kamu menyimpan nilai berulang seperti warna utama dan radius dalam custom properties.",
      "goal": "Membuat CSS lebih mudah diubah tanpa mencari nilai yang sama berkali-kali.",
      "problem": "Saat warna brand berubah, kamu harus mengganti banyak baris jika tidak memakai variable.",
      "analogy": "Variable seperti catatan resep. Jika takaran utama berubah, semua masakan yang memakai resep itu ikut konsisten.",
      "explanation": "CSS variable biasanya ditulis di :root dengan awalan --, lalu dipakai dengan var(--nama-variable).",
      "steps": [
        "Tulis variable di :root.",
        "Pakai variable dengan var().",
        "Gunakan untuk warna, radius, atau shadow.",
        "Ubah nilai variable dan lihat semua elemen ikut berubah."
      ],
      "terms": [
        {
          "term": ":root",
          "meaning": "Selector level dokumen untuk menyimpan variable global."
        },
        {
          "term": "Custom property",
          "meaning": "Nama lain CSS variable yang diawali --."
        },
        {
          "term": "var()",
          "meaning": "Fungsi untuk memakai nilai variable."
        }
      ],
      "html": "<article class=\"card\">\n  <h2>Variable CSS</h2>\n  <p>Satu warna utama dipakai berulang.</p>\n</article>",
      "css": ":root {\n  --primary: #2563eb;\n  --soft: #eff6ff;\n  --radius: 12px;\n}\n\n.card {\n  background: var(--soft);\n  border-radius: var(--radius);\n  padding: 20px;\n}\n\nh2 {\n  color: var(--primary);\n}",
      "filename": "style.css",
      "lineNotes": [
        ":root menyimpan variable global.",
        "var(--soft) mengambil warna latar.",
        "Mengubah --primary akan mengubah warna h2."
      ],
      "exercise": "Buat variable --primary dan pakai pada judul serta tombol.",
      "commonMistakes": [
        "Lupa dua tanda minus di nama variable.",
        "Menulis var(primary) tanpa --.",
        "Memakai nama variable terlalu umum dan membingungkan."
      ],
      "checkpoint": "Kamu bisa membuat dan memakai satu CSS variable.",
      "recall": "Bagaimana cara memakai variable bernama --primary?",
      "debug": {
        "question": "Warna dari variable tidak muncul. Apa yang dicek?",
        "hint": "Nama variable harus sama dan diawali --.",
        "solution": "Pastikan ditulis var(--primary), bukan var(primary), dan variable didefinisikan di :root atau scope yang tepat."
      },
      "quiz": {
        "question": "Cara memakai CSS variable --primary adalah...",
        "options": [
          "use(--primary)",
          "var(--primary)",
          "$primary",
          "css(primary)"
        ],
        "answer": 1,
        "explanation": "CSS memakai fungsi var() untuk mengambil custom property."
      }
    },
    {
      "id": "form-button-style",
      "icon": "bi-ui-checks",
      "title": "Styling Form dan Button",
      "duration": "15 menit",
      "prerequisite": "Kamu sudah mengenal label, input, textarea, dan button dari HTML.",
      "overview": "Kamu membuat form lebih nyaman tanpa menghilangkan aksesibilitas dasar.",
      "goal": "Menata label, input, textarea, dan button dengan spacing serta focus state yang jelas.",
      "problem": "Form bawaan browser sering terlihat kasar, tetapi styling yang salah bisa membuat input sulit dipakai.",
      "analogy": "Form seperti lembar pendaftaran. Label jelas, kotak isian rapi, dan tombol mudah ditemukan.",
      "explanation": "Gunakan display grid pada form, font: inherit agar input mengikuti font halaman, dan focus-visible untuk tanda fokus.",
      "steps": [
        "Susun form dengan display grid.",
        "Beri label yang jelas.",
        "Atur input dan textarea dengan padding dan border.",
        "Tambahkan focus-visible pada field dan tombol."
      ],
      "terms": [
        {
          "term": "font: inherit",
          "meaning": "Mewarisi font dari elemen induk."
        },
        {
          "term": "textarea",
          "meaning": "Input teks panjang."
        },
        {
          "term": "focus state",
          "meaning": "Tampilan saat field sedang aktif. "
        }
      ],
      "html": "<form class=\"form\">\n  <label for=\"nama\">Nama</label>\n  <input id=\"nama\" type=\"text\">\n  <label for=\"pesan\">Pesan</label>\n  <textarea id=\"pesan\"></textarea>\n  <button type=\"submit\">Kirim</button>\n</form>",
      "css": ".form {\n  display: grid;\n  gap: 10px;\n  max-width: 420px;\n}\n\ninput, textarea, button {\n  border: 1px solid #cbd5e1;\n  font: inherit;\n  padding: 10px;\n}\n\nbutton {\n  background: #2563eb;\n  color: white;\n}\n\ninput:focus-visible, textarea:focus-visible, button:focus-visible {\n  outline: 3px solid #93c5fd;\n}",
      "filename": "style.css",
      "lineNotes": [
        "Form memakai grid agar field tersusun rapi.",
        "font: inherit menyamakan font input dengan halaman.",
        "focus-visible membuat field aktif mudah terlihat."
      ],
      "exercise": "Style form kontak HTML yang pernah kamu buat dengan grid, padding, dan focus state.",
      "commonMistakes": [
        "Menghapus outline tanpa mengganti focus state.",
        "Placeholder dipakai sebagai pengganti label.",
        "Button tidak punya kontras warna yang cukup."
      ],
      "checkpoint": "Kamu bisa membuat form sederhana yang rapi dan tetap mudah digunakan.",
      "recall": "Kenapa label tidak boleh diganti hanya dengan placeholder?",
      "debug": {
        "question": "Saat input aktif, tidak ada tanda visual. Apa yang perlu ditambahkan?",
        "hint": "Gunakan focus-visible.",
        "solution": "Tambahkan input:focus-visible dengan outline yang jelas."
      },
      "quiz": {
        "question": "Agar input mengikuti font halaman, property ringkas yang bisa dipakai adalah...",
        "options": [
          "font: inherit",
          "font: copy",
          "text: inherit",
          "input-font: body"
        ],
        "answer": 0,
        "explanation": "font: inherit membuat input memakai font dari induknya."
      }
    },
    {
      "id": "layout-card-navbar",
      "icon": "bi-window-sidebar",
      "title": "Membuat Card dan Navbar",
      "duration": "18 menit",
      "prerequisite": "Kamu sudah mengenal flexbox, grid, spacing, dan warna.",
      "overview": "Kamu merakit komponen kecil yang sering muncul di website: navbar dan card.",
      "goal": "Menggabungkan beberapa konsep CSS menjadi tampilan halaman sederhana.",
      "problem": "Belajar property satu per satu belum cukup. Kamu perlu melatih cara menyusunnya menjadi komponen nyata.",
      "analogy": "Komponen seperti blok LEGO. Navbar, card, tombol, dan section bisa disusun menjadi halaman utuh.",
      "explanation": "Navbar cocok memakai flexbox. Daftar card cocok memakai grid. Gunakan warna, padding, border, dan radius untuk merapikan setiap komponen.",
      "steps": [
        "Buat header nav dengan flexbox.",
        "Buat section utama dengan max-width.",
        "Buat grid untuk card.",
        "Rapikan card dengan border, padding, dan radius."
      ],
      "terms": [
        {
          "term": "Component",
          "meaning": "Bagian UI yang bisa dipakai ulang."
        },
        {
          "term": "max-width",
          "meaning": "Batas lebar maksimum konten."
        },
        {
          "term": "container",
          "meaning": "Pembungkus konten agar layout rapi."
        }
      ],
      "html": "<header class=\"nav\">\n  <strong>CSSLab</strong>\n  <a href=\"#materi\">Materi</a>\n</header>\n\n<main class=\"container\">\n  <section class=\"cards\">\n    <article>Warna</article>\n    <article>Spacing</article>\n    <article>Layout</article>\n  </section>\n</main>",
      "css": ".nav {\n  align-items: center;\n  border-bottom: 1px solid #dbeafe;\n  display: flex;\n  justify-content: space-between;\n  padding: 16px 24px;\n}\n\n.container {\n  margin: auto;\n  max-width: 920px;\n  padding: 32px 24px;\n}\n\n.cards {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n}\n\n.cards article {\n  border: 1px solid #bfdbfe;\n  border-radius: 12px;\n  padding: 20px;\n}",
      "filename": "style.css",
      "lineNotes": [
        "Navbar memakai flexbox untuk memisahkan brand dan link.",
        "container membatasi lebar konten.",
        "cards memakai grid responsif."
      ],
      "exercise": "Rakit halaman kecil berisi navbar, judul, dan tiga card materi.",
      "commonMistakes": [
        "Membuat semua section menjadi card besar.",
        "Tidak membatasi lebar konten sehingga teks terlalu panjang.",
        "Mengulang style card dengan selector yang tidak konsisten."
      ],
      "checkpoint": "Kamu bisa menggabungkan flexbox dan grid dalam satu halaman.",
      "recall": "Kenapa navbar cocok memakai flexbox sedangkan daftar card cocok memakai grid?",
      "debug": {
        "question": "Card melebar penuh dan tidak berjajar. Apa yang perlu dicek?",
        "hint": "Grid harus berada pada pembungkus card.",
        "solution": "Pastikan .cards diberi display: grid dan setiap article berada langsung di dalam .cards."
      },
      "quiz": {
        "question": "Layout daftar card dua dimensi lebih cocok memakai...",
        "options": [
          "Grid",
          "Audio",
          "Meta",
          "Title"
        ],
        "answer": 0,
        "explanation": "CSS Grid cocok untuk menyusun item dalam baris dan kolom."
      }
    },
    {
      "id": "debugging-css",
      "icon": "bi-bug",
      "title": "Debugging CSS",
      "duration": "16 menit",
      "prerequisite": "Kamu sudah menulis beberapa file CSS dan pernah mengalami style tidak bekerja.",
      "overview": "Kamu melatih cara membaca masalah CSS secara berurutan.",
      "goal": "Menemukan penyebab style tidak muncul tanpa menebak terlalu banyak.",
      "problem": "CSS bisa gagal karena selector salah, file belum terhubung, property salah ketik, atau aturan lain menimpa.",
      "analogy": "Debugging seperti mencari kebocoran pipa. Ikuti alurnya dari sumber air sampai titik yang bermasalah.",
      "explanation": "Mulai dari koneksi file, lalu selector, lalu property dan value, lalu cascade. Gunakan DevTools browser jika tersedia.",
      "steps": [
        "Pastikan CSS terhubung.",
        "Cek selector cocok dengan HTML.",
        "Cek ejaan property dan value.",
        "Cari aturan lain yang menimpa.",
        "Tes satu perubahan kecil."
      ],
      "terms": [
        {
          "term": "DevTools",
          "meaning": "Alat browser untuk memeriksa HTML dan CSS."
        },
        {
          "term": "Computed style",
          "meaning": "Hasil akhir style yang dipakai browser."
        },
        {
          "term": "Override",
          "meaning": "Aturan yang menimpa aturan lain. "
        }
      ],
      "html": "<h1 class=\"judul\">Belajar Debug CSS</h1>",
      "css": ".title {\n  color: #2563eb;\n}\n\n/* Selector salah karena HTML memakai class judul */",
      "filename": "style.css",
      "lineNotes": [
        "HTML memakai class judul.",
        "CSS memilih .title sehingga tidak cocok.",
        "Perbaiki selector menjadi .judul."
      ],
      "exercise": "Sengaja buat selector salah, lalu temukan dan perbaiki dengan membaca HTML.",
      "commonMistakes": [
        "Mengubah banyak baris sekaligus.",
        "Tidak mengecek apakah file CSS benar-benar terbaca.",
        "Menyalahkan browser sebelum mengecek typo."
      ],
      "checkpoint": "Kamu punya urutan cek saat CSS tidak bekerja.",
      "recall": "Sebutkan empat hal yang perlu dicek saat CSS tidak muncul.",
      "debug": {
        "question": "Judul tidak biru karena selector .title tidak cocok. Apa perbaikannya?",
        "hint": "Samakan selector dengan class di HTML.",
        "solution": "Ubah .title menjadi .judul, atau ubah class HTML menjadi title. Yang penting keduanya sama."
      },
      "quiz": {
        "question": "Langkah awal saat CSS tidak bekerja adalah...",
        "options": [
          "Langsung pakai !important",
          "Cek koneksi file dan selector",
          "Hapus semua HTML",
          "Ganti browser terus-menerus"
        ],
        "answer": 1,
        "explanation": "Koneksi file dan selector adalah penyebab umum style tidak muncul."
      }
    },
    {
      "id": "publish-css-project",
      "icon": "bi-cloud-upload",
      "title": "Menyiapkan Project CSS untuk Publish",
      "duration": "14 menit",
      "prerequisite": "Kamu sudah punya halaman HTML dan file style.css yang bekerja lokal.",
      "overview": "Kamu merapikan struktur folder dan path sebelum halaman dipublish.",
      "goal": "Membuat project HTML + CSS siap diunggah ke GitHub Pages atau hosting statis.",
      "problem": "Website lokal bisa terlihat benar, tetapi online rusak karena path CSS atau gambar salah.",
      "analogy": "Publish seperti pindah rumah. Semua barang harus ikut dan alamat antar barang harus tetap benar.",
      "explanation": "Gunakan relative path, simpan CSS di folder yang jelas, dan pastikan nama file huruf besar kecilnya sama persis.",
      "steps": [
        "Rapikan folder project.",
        "Pastikan index.html ada di root project.",
        "Pastikan link CSS memakai relative path.",
        "Cek nama file dan folder sebelum upload.",
        "Buka halaman online dan uji CSS."
      ],
      "terms": [
        {
          "term": "Relative path",
          "meaning": "Alamat file berdasarkan lokasi file saat ini."
        },
        {
          "term": "Root project",
          "meaning": "Folder utama project."
        },
        {
          "term": "GitHub Pages",
          "meaning": "Layanan hosting statis dari GitHub."
        }
      ],
      "html": "<!-- Struktur folder -->\n<!-- index.html -->\n<!-- assets/css/style.css -->\n<link rel=\"stylesheet\" href=\"assets/css/style.css\">\n<h1>Project siap publish</h1>",
      "css": "h1 {\n  color: #2563eb;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n}",
      "filename": "assets/css/style.css",
      "lineNotes": [
        "href memakai path relatif ke assets/css/style.css.",
        "index.html sebaiknya berada di root project.",
        "Nama folder dan file harus sama persis saat online."
      ],
      "exercise": "Rapikan project kecilmu menjadi index.html dan assets/css/style.css, lalu cek link CSS.",
      "commonMistakes": [
        "Memakai path lokal seperti C:\\Users\\...",
        "Huruf besar kecil nama file tidak sama.",
        "Mengunggah index.html tetapi lupa folder assets."
      ],
      "checkpoint": "Kamu bisa menjelaskan kenapa relative path penting saat publish.",
      "recall": "Kenapa CSS bisa bekerja lokal tetapi hilang saat website online?",
      "debug": {
        "question": "Website online tampil polos tanpa CSS. Apa penyebab umum?",
        "hint": "Hosting sensitif pada path dan huruf besar kecil.",
        "solution": "Periksa href CSS, lokasi folder, nama file, dan huruf besar kecilnya di repository."
      },
      "quiz": {
        "question": "Path yang aman untuk publish biasanya...",
        "options": [
          "C:\\Users\\Nama\\style.css",
          "assets/css/style.css",
          "Desktop/style.css saja",
          "file:///style.css"
        ],
        "answer": 1,
        "explanation": "Relative path seperti assets/css/style.css tetap bekerja saat project dipindah atau dipublish."
      }
    }
  ],
  "quizQuestions": [
    {
      "question": "Tugas utama CSS dalam halaman web adalah...",
      "options": [
        "Mengatur tampilan elemen HTML",
        "Menyimpan database",
        "Menjalankan server",
        "Mengganti browser"
      ],
      "answer": 0,
      "explanation": "CSS mengatur visual seperti warna, ukuran, jarak, dan layout."
    },
    {
      "question": "Tag untuk menghubungkan CSS eksternal adalah...",
      "options": [
        "<style src=\"style.css\">",
        "<link rel=\"stylesheet\" href=\"style.css\">",
        "<script href=\"style.css\">",
        "<css file=\"style.css\">"
      ],
      "answer": 1,
      "explanation": "CSS eksternal dihubungkan memakai link rel=\"stylesheet\"."
    },
    {
      "question": "Selector untuk class bernama kartu adalah...",
      "options": [
        "kartu",
        "#kartu",
        ".kartu",
        "<kartu>"
      ],
      "answer": 2,
      "explanation": "Class dipilih dengan tanda titik di CSS."
    },
    {
      "question": "Property untuk mengubah warna teks adalah...",
      "options": [
        "text-color",
        "font-color",
        "color",
        "background"
      ],
      "answer": 2,
      "explanation": "CSS memakai property color untuk warna teks."
    },
    {
      "question": "Property untuk jarak antar baris teks adalah...",
      "options": [
        "line-height",
        "font-gap",
        "text-space",
        "letter-size"
      ],
      "answer": 0,
      "explanation": "line-height mengatur tinggi baris teks."
    },
    {
      "question": "Jarak di dalam border elemen disebut...",
      "options": [
        "margin",
        "padding",
        "outline",
        "gap"
      ],
      "answer": 1,
      "explanation": "Padding adalah jarak antara content dan border."
    },
    {
      "question": "padding: 16px 24px berarti...",
      "options": [
        "Semua sisi 16px",
        "Atas-bawah 16px, kiri-kanan 24px",
        "Atas 16px saja",
        "Kiri-kanan 16px, atas-bawah 24px"
      ],
      "answer": 1,
      "explanation": "Pada shorthand dua nilai, nilai pertama untuk atas-bawah dan nilai kedua untuk kiri-kanan."
    },
    {
      "question": "Property untuk membulatkan sudut elemen adalah...",
      "options": [
        "corner",
        "border-radius",
        "box-round",
        "radius-box"
      ],
      "answer": 1,
      "explanation": "border-radius mengatur sudut elemen."
    },
    {
      "question": "Elemen yang mengambil satu baris penuh biasanya berperilaku...",
      "options": [
        "inline",
        "block",
        "hidden",
        "absolute"
      ],
      "answer": 1,
      "explanation": "Elemen block mulai di baris baru dan mengambil lebar baris."
    },
    {
      "question": "Property untuk memberi jarak antar item flex adalah...",
      "options": [
        "space",
        "gap",
        "margin-all",
        "distance"
      ],
      "answer": 1,
      "explanation": "gap memberi jarak antar item pada flex dan grid."
    },
    {
      "question": "Property untuk mengatur kolom grid adalah...",
      "options": [
        "grid-template-columns",
        "flex-columns",
        "column-count-only",
        "grid-gap-columns"
      ],
      "answer": 0,
      "explanation": "grid-template-columns menentukan ukuran kolom grid."
    },
    {
      "question": "Agar anak absolute mengacu ke card, card biasanya diberi...",
      "options": [
        "display: inline",
        "position: relative",
        "font-weight: bold",
        "overflow: text"
      ],
      "answer": 1,
      "explanation": "position: relative membuat parent menjadi acuan positioning untuk anak absolute."
    },
    {
      "question": "Aturan CSS bersyarat untuk lebar layar ditulis dengan...",
      "options": [
        "@screen",
        "@media",
        "@device",
        "@responsive"
      ],
      "answer": 1,
      "explanation": "@media dipakai untuk media query."
    },
    {
      "question": "Pseudo-class saat pointer berada di elemen adalah...",
      "options": [
        ":active",
        ":hover",
        ":checked",
        ":visited"
      ],
      "answer": 1,
      "explanation": ":hover aktif saat pointer berada di elemen."
    }
  ],
  "recallChallenges": [
    {
      "id": "recall-css-html",
      "icon": "bi-palette",
      "title": "HTML dan CSS",
      "question": "Jelaskan perbedaan peran HTML dan CSS dengan bahasa sendiri.",
      "answer": "HTML menyusun struktur dan isi halaman, sedangkan CSS mengatur tampilan seperti warna, jarak, ukuran, dan layout."
    },
    {
      "id": "recall-selector",
      "icon": "bi-crosshair",
      "title": "Selector",
      "question": "Apa bedanya selector tag, class, dan id?",
      "answer": "Selector tag memilih elemen berdasarkan nama tag. Class memakai titik dan bisa dipakai banyak elemen. ID memakai tanda pagar dan sebaiknya unik."
    },
    {
      "id": "recall-box-model",
      "icon": "bi-bounding-box",
      "title": "Box Model",
      "question": "Jelaskan content, padding, border, dan margin.",
      "answer": "Content adalah isi, padding ruang dalam, border garis tepi, dan margin jarak luar antar elemen."
    },
    {
      "id": "recall-flex-grid",
      "icon": "bi-columns-gap",
      "title": "Flexbox dan Grid",
      "question": "Kapan memakai flexbox dan kapan memakai grid?",
      "answer": "Flexbox cocok untuk menyusun item dalam satu arah seperti navbar. Grid cocok untuk baris dan kolom seperti daftar card."
    },
    {
      "id": "recall-responsive",
      "icon": "bi-phone",
      "title": "Responsive",
      "question": "Apa fungsi media query dalam CSS?",
      "answer": "Media query membuat aturan CSS hanya berlaku pada kondisi tertentu, misalnya saat layar lebih kecil dari 600px."
    },
    {
      "id": "recall-cascade",
      "icon": "bi-layers",
      "title": "Cascade",
      "question": "Kenapa satu aturan CSS bisa kalah oleh aturan lain?",
      "answer": "Karena CSS menentukan pemenang dari specificity, urutan aturan, inheritance, dan kadang !important."
    },
    {
      "id": "recall-variable",
      "icon": "bi-sliders",
      "title": "Variable",
      "question": "Bagaimana cara membuat dan memakai CSS variable?",
      "answer": "Buat custom property seperti --primary di :root, lalu pakai dengan var(--primary)."
    },
    {
      "id": "recall-debug",
      "icon": "bi-bug",
      "title": "Debugging",
      "question": "Sebutkan urutan cek saat CSS tidak bekerja.",
      "answer": "Cek file CSS terhubung, selector cocok, property dan value tidak typo, lalu cek aturan lain yang menimpa."
    }
  ],
  "debugChallenges": [
    {
      "id": "debug-file-link",
      "title": "CSS Tidak Terhubung",
      "level": "Dasar",
      "error": "HTML tampil polos tanpa warna dari style.css.",
      "brokenCode": "<head>\n  <link rel=\"style\" href=\"style.css\">\n</head>",
      "fixedCode": "<head>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>",
      "hint": "Nilai rel harus stylesheet.",
      "explanation": "Browser mengenali file CSS eksternal saat link memakai rel=\"stylesheet\"."
    },
    {
      "id": "debug-class-dot",
      "title": "Class Tanpa Titik",
      "level": "Dasar",
      "error": "Elemen dengan class tombol tidak berubah menjadi biru.",
      "brokenCode": "<button class=\"tombol\">Kirim</button>\n\ntombol {\n  background: #2563eb;\n}",
      "fixedCode": "<button class=\"tombol\">Kirim</button>\n\n.tombol {\n  background: #2563eb;\n}",
      "hint": "Selector class diawali titik.",
      "explanation": "Class tombol di CSS harus dipilih dengan .tombol."
    },
    {
      "id": "debug-typo-property",
      "title": "Property Salah Ketik",
      "level": "Dasar",
      "error": "Warna judul tidak berubah.",
      "brokenCode": "h1 {\n  colour: #2563eb;\n}",
      "fixedCode": "h1 {\n  color: #2563eb;\n}",
      "hint": "CSS memakai ejaan Amerika untuk color.",
      "explanation": "Property yang benar adalah color, bukan colour."
    },
    {
      "id": "debug-missing-brace",
      "title": "Kurung Kurawal Hilang",
      "level": "Dasar",
      "error": "Aturan setelah card ikut kacau.",
      "brokenCode": ".card {\n  padding: 20px;\n  background: #eff6ff;\n\nh1 {\n  color: #2563eb;\n}",
      "fixedCode": ".card {\n  padding: 20px;\n  background: #eff6ff;\n}\n\nh1 {\n  color: #2563eb;\n}",
      "hint": "Setiap block CSS butuh kurung penutup.",
      "explanation": "Kurung penutup setelah .card membuat aturan h1 berdiri sendiri."
    },
    {
      "id": "debug-flex-parent",
      "title": "Flex di Elemen yang Salah",
      "level": "Menengah",
      "error": "Tiga link nav tetap turun ke bawah.",
      "brokenCode": "nav a {\n  display: flex;\n  gap: 16px;\n}",
      "fixedCode": "nav {\n  display: flex;\n  gap: 16px;\n}",
      "hint": "Flex diberikan ke container.",
      "explanation": "display: flex harus berada pada parent yang membungkus item, yaitu nav."
    },
    {
      "id": "debug-absolute-parent",
      "title": "Badge Keluar dari Card",
      "level": "Menengah",
      "error": "Badge muncul di pojok halaman, bukan pojok card.",
      "brokenCode": ".badge {\n  position: absolute;\n  right: 12px;\n  top: 12px;\n}",
      "fixedCode": ".card {\n  position: relative;\n}\n\n.badge {\n  position: absolute;\n  right: 12px;\n  top: 12px;\n}",
      "hint": "Anak absolute butuh parent relative.",
      "explanation": "position: relative pada card membuat badge mengacu ke card."
    },
    {
      "id": "debug-media-query",
      "title": "Media Query Tidak Jalan",
      "level": "Menengah",
      "error": "Layout tidak berubah di layar kecil.",
      "brokenCode": "@media max-width: 600px {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}",
      "fixedCode": "@media (max-width: 600px) {\n  .layout {\n    grid-template-columns: 1fr;\n  }\n}",
      "hint": "Kondisi media query perlu tanda kurung.",
      "explanation": "Format yang benar adalah @media (max-width: 600px)."
    },
    {
      "id": "debug-variable",
      "title": "Variable Tidak Terbaca",
      "level": "Menengah",
      "error": "Warna utama dari variable tidak muncul.",
      "brokenCode": ":root {\n  --primary: #2563eb;\n}\n\nh1 {\n  color: var(primary);\n}",
      "fixedCode": ":root {\n  --primary: #2563eb;\n}\n\nh1 {\n  color: var(--primary);\n}",
      "hint": "Nama variable tetap memakai dua minus saat dipanggil.",
      "explanation": "Gunakan var(--primary), bukan var(primary)."
    }
  ],
  "editorTemplates": [
    {
      "id": "profil-css",
      "icon": "bi-person",
      "title": "Profil Card",
      "html": "<main class=\"profile-card\">\n  <h1>Halo, saya Rina</h1>\n  <p>Saya sedang melanjutkan belajar dari HTML ke CSS.</p>\n  <a href=\"#kontak\">Hubungi saya</a>\n</main>",
      "css": "body {\n  background: #eff6ff;\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 32px;\n}\n\n.profile-card {\n  background: white;\n  border: 1px solid #bfdbfe;\n  border-radius: 16px;\n  max-width: 520px;\n  padding: 24px;\n}\n\nh1 {\n  color: #2563eb;\n}\n\na {\n  color: #2563eb;\n  font-weight: bold;\n}"
    },
    {
      "id": "navbar-card",
      "icon": "bi-window-sidebar",
      "title": "Navbar + Card",
      "html": "<header>\n  <strong>CSSLab</strong>\n  <nav>\n    <a href=\"#materi\">Materi</a>\n    <a href=\"#project\">Project</a>\n  </nav>\n</header>\n\n<section class=\"hero\">\n  <h1>Belajar CSS bertahap</h1>\n  <p>Mulai dari warna, spacing, sampai layout responsif.</p>\n</section>",
      "css": "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n}\n\nheader {\n  align-items: center;\n  border-bottom: 1px solid #dbeafe;\n  display: flex;\n  justify-content: space-between;\n  padding: 16px 28px;\n}\n\nnav {\n  display: flex;\n  gap: 16px;\n}\n\n.hero {\n  background: #eff6ff;\n  padding: 56px 28px;\n}\n\nh1 {\n  color: #1d4ed8;\n}"
    },
    {
      "id": "grid-card",
      "icon": "bi-grid-3x3-gap",
      "title": "Grid Card",
      "html": "<section class=\"grid\">\n  <article>Warna</article>\n  <article>Spacing</article>\n  <article>Flexbox</article>\n  <article>Responsive</article>\n</section>",
      "css": "body {\n  font-family: Arial, sans-serif;\n  padding: 32px;\n}\n\n.grid {\n  display: grid;\n  gap: 16px;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n}\n\narticle {\n  background: #eff6ff;\n  border: 1px solid #bfdbfe;\n  border-radius: 12px;\n  color: #1e3a8a;\n  font-weight: bold;\n  padding: 22px;\n}"
    },
    {
      "id": "form-css",
      "icon": "bi-ui-checks",
      "title": "Form Rapi",
      "html": "<form>\n  <label for=\"nama\">Nama</label>\n  <input id=\"nama\" type=\"text\">\n  <label for=\"pesan\">Pesan</label>\n  <textarea id=\"pesan\"></textarea>\n  <button type=\"submit\">Kirim</button>\n</form>",
      "css": "body {\n  font-family: Arial, sans-serif;\n  padding: 32px;\n}\n\nform {\n  display: grid;\n  gap: 10px;\n  max-width: 420px;\n}\n\ninput, textarea, button {\n  border: 1px solid #cbd5e1;\n  font: inherit;\n  padding: 10px;\n}\n\nbutton {\n  background: #2563eb;\n  color: white;\n  font-weight: bold;\n}"
    }
  ],
  "projects": [
    {
      "title": "Style Ulang Halaman Profil HTML",
      "level": "Pemula",
      "goal": "Mengambil halaman profil HTML lama lalu menambahkan warna, spacing, card, dan typography.",
      "features": [
        "Card profil",
        "Warna utama",
        "Button link",
        "Spacing rapi"
      ],
      "steps": [
        "Buka project profil HTML.",
        "Hubungkan style.css.",
        "Buat wrapper card.",
        "Style heading, paragraf, dan link."
      ],
      "hint": "Jangan ubah struktur terlalu banyak. Fokus pada CSS.",
      "extra": "Tambahkan focus-visible pada link kontak.",
      "example": {
        "type": "profile",
        "name": "Rina",
        "role": "CSS learner",
        "description": "Saya melanjutkan belajar HTML dengan mempercantik halaman memakai CSS.",
        "hobbies": [
          "Warna",
          "Spacing",
          "Layout"
        ],
        "link": "Kontak"
      }
    },
    {
      "title": "Landing Page Kelas CSS",
      "level": "Pemula",
      "goal": "Membuat hero, navbar, tombol, dan section fitur dengan CSS biru.",
      "features": [
        "Navbar",
        "Hero",
        "CTA",
        "Fitur"
      ],
      "steps": [
        "Buat HTML semantic.",
        "Style navbar dengan flexbox.",
        "Buat hero biru muda.",
        "Buat tombol utama."
      ],
      "hint": "Gunakan satu warna utama dan satu warna aksen.",
      "extra": "Buat versi mobile satu kolom.",
      "example": {
        "type": "landing",
        "brand": "CSSLab",
        "headline": "Belajar CSS dari nol",
        "description": "Lanjutkan HTML dengan warna, spacing, dan layout yang rapi.",
        "cta": "Mulai CSS"
      }
    },
    {
      "title": "Grid Kartu Materi",
      "level": "Pemula",
      "goal": "Membuat daftar kartu materi dengan CSS Grid responsif.",
      "features": [
        "Grid",
        "Card",
        "Gap",
        "Responsive"
      ],
      "steps": [
        "Buat section berisi beberapa article.",
        "Aktifkan display grid.",
        "Gunakan repeat auto-fit minmax.",
        "Style card dengan border dan radius."
      ],
      "hint": "Grid diterapkan pada pembungkus card.",
      "extra": "Tambahkan hover ringan pada card.",
      "example": {
        "type": "gallery",
        "title": "Materi CSS",
        "description": "Topik yang sudah dipelajari.",
        "items": [
          {
            "title": "Selector",
            "label": "Dasar"
          },
          {
            "title": "Box Model",
            "label": "Spacing"
          },
          {
            "title": "Flexbox",
            "label": "Layout"
          },
          {
            "title": "Responsive",
            "label": "Mobile"
          }
        ]
      }
    },
    {
      "title": "Form Kontak Rapi",
      "level": "Pemula",
      "goal": "Memberi style pada form kontak HTML agar nyaman diisi.",
      "features": [
        "Label",
        "Input",
        "Textarea",
        "Focus"
      ],
      "steps": [
        "Buat form dengan label.",
        "Susun form dengan grid.",
        "Style field dengan padding.",
        "Tambahkan focus-visible."
      ],
      "hint": "Jangan menghapus label.",
      "extra": "Tambahkan pesan bantuan kecil di bawah input.",
      "example": {
        "type": "form",
        "title": "Kontak CSSLab",
        "fields": [
          "Nama",
          "Email",
          "Pesan"
        ],
        "button": "Kirim"
      }
    },
    {
      "title": "Dashboard Progress Belajar",
      "level": "Menengah",
      "goal": "Membuat dashboard statis dengan card statistik dan progress bar.",
      "features": [
        "Stat card",
        "Progress bar",
        "Grid",
        "Variable"
      ],
      "steps": [
        "Buat tiga kartu statistik.",
        "Buat progress bar dengan div.",
        "Gunakan CSS variable warna.",
        "Rapikan dengan grid."
      ],
      "hint": "Progress bar bisa dibuat dari dua div bertumpuk.",
      "extra": "Buat media query untuk mobile.",
      "example": {
        "type": "dashboard",
        "subtitle": "Progress CSS",
        "title": "Belajar minggu ini",
        "progress": 58,
        "stats": [
          {
            "value": "7",
            "label": "materi"
          },
          {
            "value": "4",
            "label": "latihan"
          },
          {
            "value": "2",
            "label": "project"
          }
        ],
        "tasks": [
          "Latih flexbox",
          "Coba grid",
          "Debug CSS"
        ]
      }
    },
    {
      "title": "Halaman Artikel Responsif",
      "level": "Menengah",
      "goal": "Membuat artikel dengan typography nyaman dan layout responsif.",
      "features": [
        "Typography",
        "Max width",
        "Media query",
        "Link style"
      ],
      "steps": [
        "Buat article semantic.",
        "Atur font dan line-height.",
        "Batasi max-width.",
        "Tambahkan media query spacing mobile."
      ],
      "hint": "Teks panjang sebaiknya tidak selebar layar desktop.",
      "extra": "Tambahkan kotak ringkasan artikel.",
      "example": {
        "type": "article",
        "brand": "Catatan CSS",
        "nav": [
          "Warna",
          "Layout"
        ],
        "title": "Kenapa spacing penting?",
        "description": "Spacing yang konsisten membantu pengguna membaca struktur halaman.",
        "related": "Baca flexbox"
      }
    }
  ],
  "badges": [
    {
      "id": "mulai",
      "title": "Mulai CSS",
      "icon": "bi-flag"
    },
    {
      "id": "lima-materi",
      "title": "5 Materi CSS",
      "icon": "bi-journal-check"
    },
    {
      "id": "semua-materi",
      "title": "CSS Finisher",
      "icon": "bi-trophy"
    },
    {
      "id": "quiz-70",
      "title": "Quiz 70+",
      "icon": "bi-patch-check"
    },
    {
      "id": "recall-3",
      "title": "Recall Aktif",
      "icon": "bi-arrow-repeat"
    },
    {
      "id": "debug-3",
      "title": "Bug CSS Reader",
      "icon": "bi-bug"
    },
    {
      "id": "konsisten",
      "title": "Konsisten",
      "icon": "bi-lightning-charge"
    }
  ]
}))();
