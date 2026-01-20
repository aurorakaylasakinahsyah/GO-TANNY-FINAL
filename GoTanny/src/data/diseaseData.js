import kudisApel from '../../gambar/KudisApel.png';
import busukHitam from '../../gambar/BusukHitam.png';
import karatApel from '../../gambar/KaratApel.png';
import hawarJagung from '../../gambar/HawarJagung.png';
import karatJagung from '../../gambar/KaratJagung.png';
import busukHitamAnggur from '../../gambar/BusukHitamAnggur.png';
import escaGrape from '../../gambar/EscaGrape.png';
import bercakDaunKentang from '../../gambar/BercakDaunKentang.png';
import busukDaunKentang from '../../gambar/BusukDaunKentang1.png';
import bercakTomat from '../../gambar/BercakTomat.png';
import leafCurl from '../../gambar/LeafCurl.png';
import hangusDaunStoberi from '../../gambar/HangusDaunStoberi.png';
import bercakBakteriPepper from '../../gambar/BercakBakteriPepper.png';

export const diseaseData = [
    // APPLE
    {
        id: 1,
        title: 'Apple Scab',
        type: 'Apple Scab',
        plant: 'Apple',
        image: kudisApel,
        description: 'Penyakit jamur yang menyebabkan bercak gelap pada daun dan buah apel, mengurangi kualitas buah.',
        symptoms: ['Bercak hijau zaitun atau hitam pada daun', 'Buah memiliki bercak berkudis dan retak', 'Daun menguning dan rontok dini'],
        prevention: ['Pilih varietas tahan', 'Bersihkan daun gugur di musim gugur', 'Jaga sirkulasi udara tajuk'],
        treatment: ['Fungisida Captan atau Myclobutanil', 'Penyemprotan preventif saat kuncup pecah'],
        tags: [{ icon: 'fas fa-bug', text: 'Jamur' }, { icon: 'fas fa-exclamation-triangle', text: 'Umum' }]
    },
    {
        id: 2,
        title: 'Black Rot pada Apple',
        type: 'Black Rot',
        plant: 'Apple',
        image: busukHitam,
        description: 'Penyakit jamur yang menyebabkan pembusukan buah, bercak daun (frog-eye), dan kanker batang.',
        symptoms: ['Bercak ungu pada daun yang menjadi coklat', 'Buah membusuk dengan cincin konsentris', 'Luka kanker pada dahan'],
        prevention: ['Pangkas bagian mati/kanker', 'Buang buah mumi', 'Sanitasi kebun ketat'],
        treatment: ['Fungisida berbahan aktif Captan atau Thiophanate-methyl'],
        tags: [{ icon: 'fas fa-skull', text: 'Berbahaya' }, { icon: 'fas fa-bug', text: 'Jamur' }]
    },
    {
        id: 3,
        title: 'Cedar Apple Rust',
        type: 'Rust',
        plant: 'Apple',
        image: karatApel,
        description: 'Penyakit karat yang membutuhkan dua inang: pohon apel dan pohon cedar (juniper).',
        symptoms: ['Bercak oranye terang pada daun apel', 'Struktur seperti tabung di bawah daun', 'Galls pada pohon cedar'],
        prevention: ['Hapus pohon cedar di sekitar kebun', 'Pilih varietas tahan karat'],
        treatment: ['Fungisida Myclobutanil atau Mancozeb pada musim semi'],
        tags: [{ icon: 'fas fa-wind', text: 'Spora Udara' }, { icon: 'fas fa-bug', text: 'Jamur' }]
    },

    // CORN (JAGUNG)
    {
        id: 4,
        title: 'Northern Leaf Blight',
        type: 'Leaf Blight',
        plant: 'Corn',
        image: hawarJagung,
        description: 'Penyakit jamur yang menyebabkan lesi panjang berbentuk cerutu pada daun jagung.',
        symptoms: ['Lesi abu-abu kehijauan berbentuk cerutu', 'Dimulai dari daun bawah', 'Tanaman layu jika parah'],
        prevention: ['Rotasi tanaman', 'Gunakan varietas tahan', 'Bajak sisa tanaman'],
        treatment: ['Fungisida foliar jika infeksi dini'],
        tags: [{ icon: 'fas fa-leaf', text: 'Daun' }, { icon: 'fas fa-bug', text: 'Jamur' }]
    },
    {
        id: 5,
        title: 'Common Rust pada Jagung',
        type: 'Rust',
        plant: 'Corn',
        image: karatJagung,
        description: 'Pustula karat berwarna merah bata pada kedua sisi daun.',
        symptoms: ['Bintik-bintik merah kecoklatan', 'Daun menguning dan mati', 'Pertumbuhan terhambat'],
        prevention: ['Varietas tahan karat', 'Hindari penanaman terlambat'],
        treatment: ['Fungisida golongan triazol atau strobilurin'],
        tags: [{ icon: 'fas fa-bug', text: 'Jamur' }]
    },

    // GRAPE (ANGGUR)
    {
        id: 6,
        title: 'Black Rot pada Anggur',
        type: 'Black Rot',
        plant: 'Grape',
        image: busukHitamAnggur,
        description: 'Penyakit paling merusak pada anggur, menyerang buah dan daun.',
        symptoms: ['Buah mengerut menjadi mumi hitam', 'Bercak coklat kemerahan pada daun', 'Lesi pada batang'],
        prevention: ['Sanitasi buah mumi', 'Sirkulasi udara yang baik', 'Sinar matahari cukup'],
        treatment: ['Fungisida Mancozeb atau Myclobutanil'],
        tags: [{ icon: 'fas fa-wine-bottle', text: 'Buah' }, { icon: 'fas fa-skull', text: 'Destruktif' }]
    },
    {
        id: 7,
        title: 'Esca (Black Measles)',
        type: 'Esca',
        plant: 'Grape',
        image: escaGrape,
        description: 'Penyakit kompleks jamur batang yang menyebabkan garis-garis pada daun ("tiger stripes") dan bintik pada buah.',
        symptoms: ['Daun bergaris kuning/merah (tiger stripes)', 'Bintik hitam pada buah (measles)', 'Kematian mendadak tanaman'],
        prevention: ['Hindari luka pada batang', 'Pangkas saat kering'],
        treatment: ['Tidak ada obat kuratif, pencegahan adalah kunci'],
        tags: [{ icon: 'fas fa-tree', text: 'Batang' }, { icon: 'fas fa-exclamation-circle', text: 'Kronis' }]
    },

    // POTATO (KENTANG)
    {
        id: 8,
        title: 'Early Blight pada Kentang',
        type: 'Early Blight',
        plant: 'Potato',
        image: bercakDaunKentang,
        description: 'Penyakit bercak daun yang umum pada kentang dan tomat.',
        symptoms: ['Bercak coklat dengan cincin konsentris (target board)', 'Daun bawah menguning', 'Umbi busuk kering'],
        prevention: ['Rotasi tanaman', 'Irigasi tetes (hindari daun basah)', 'Pemupukan seimbang'],
        treatment: ['Fungisida Chlorothalonil atau Mancozeb'],
        tags: [{ icon: 'fas fa-bullseye', text: 'Target Spot' }, { icon: 'fas fa-bug', text: 'Jamur' }]
    },
    {
        id: 9,
        title: 'Late Blight pada Kentang',
        type: 'Late Blight',
        plant: 'Potato',
        image: busukDaunKentang,
        description: 'Penyakit penyebab kelaparan kentang Irlandia, sangat cepat menyebar.',
        symptoms: ['Bercak basah besar pada daun', 'Jamur putih di bawah daun', 'Umbi busuk basah dan bau'],
        prevention: ['Gunakan benih bebas penyakit', 'Musnahkan tanaman terinfeksi segera', 'Fungisida preventif'],
        treatment: ['Fungisida Metalaxyl (jika belum resisten)', 'Pemusnahan total area terinfeksi'],
        tags: [{ icon: 'fas fa-biohazard', text: 'Wabah' }, { icon: 'fas fa-water', text: 'Lembab' }]
    },

    // TOMATO (TOMAT)
    {
        id: 10,
        title: 'Bacterial Spot pada Tomat',
        type: 'Bacterial Spot',
        plant: 'Tomato',
        image: bercakTomat,
        description: 'Penyakit bakteri yang menyebabkan bercak pada daun dan buah tomat.',
        symptoms: ['Bercak kecil berair yang menjadi hitam', 'Daun menguning dan rontok', 'Bercak berkudis pada buah'],
        prevention: ['Benih bebas bakteri', 'Rotasi tanaman', 'Hindari irigasi overhead'],
        treatment: ['Semprotan tembaga (Copper)', 'Antibiotik pertanian (terbatas)'],
        tags: [{ icon: 'fas fa-bacteria', text: 'Bakteri' }, { icon: 'fas fa-tint', text: 'Air' }]
    },
    {
        id: 11,
        title: 'Tomato Yellow Leaf Curl Virus',
        type: 'Virus',
        plant: 'Tomato',
        image: leafCurl,
        description: 'Virus mematikan yang disebarkan oleh kutu kebul (whitefly).',
        symptoms: ['Daun mengeriting ke atas dan menguning', 'Tanaman kerdil', 'Gagal berbuah'],
        prevention: ['Kendalikan kutu kebul', 'Gunakan varietas tahan virus', 'Cabut tanaman sakit'],
        treatment: ['Tidak ada obat untuk virus, cabut dan bakar'],
        tags: [{ icon: 'fas fa-virus', text: 'Virus' }, { icon: 'fas fa-spider', text: 'Vektor Serangga' }]
    },

    // STRAWBERRY
    {
        id: 12,
        title: 'Leaf Scorch pada Strawberry',
        type: 'Leaf Scorch',
        plant: 'Strawberry',
        image: hangusDaunStoberi,
        description: 'Penyakit jamur yang menyebabkan bercak ungu tidak beraturan pada daun.',
        symptoms: ['Bercak ungu gelap tak beraturan', 'Daun terlihat hangus/kering', 'Tanaman melemah'],
        prevention: ['Sanitasi daun tua', 'Sirkulasi udara baik', 'Drainase tanah yang baik'],
        treatment: ['Fungisida jika serangan parah'],
        tags: [{ icon: 'fas fa-fire', text: 'Hangus' }, { icon: 'fas fa-bug', text: 'Jamur' }]
    },

    // PEPPER (PAPRIKA/CABAI)
    {
        id: 13,
        title: 'Bacterial Spot pada Paprika',
        type: 'Bacterial Spot',
        plant: 'Pepper',
        image: bercakBakteriPepper,
        description: 'Mirip dengan tomat, menyebabkan bercak pada daun dan buah paprika.',
        symptoms: ['Bercak nekrotik pada daun', 'Daun gugur', 'Bercak kasar pada buah'],
        prevention: ['Benih sehat', 'Rotasi tanaman', 'Sanitasi alat'],
        treatment: ['Semprotan tembaga'],
        tags: [{ icon: 'fas fa-bacteria', text: 'Bakteri' }]
    }
];

export const getDiseaseById = (id) => {
  return diseaseData.find(disease => disease.id === parseInt(id));
};
