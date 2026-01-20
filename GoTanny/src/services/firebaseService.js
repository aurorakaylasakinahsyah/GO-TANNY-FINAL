import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'

// ============ DISEASE SERVICES ============

// Get all diseases
export const getAllDiseases = async () => {
  try {
    const diseasesRef = collection(db, 'diseases')
    const q = query(diseasesRef, orderBy('title'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching diseases:', error)
    throw error
  }
}

// Get disease by ID
export const getDiseaseById = async (id) => {
  try {
    const docRef = doc(db, 'diseases', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching disease:', error)
    throw error
  }
}

// Get diseases by type (Serangga, Jamur, Bakteri, Virus)
export const getDiseasesByType = async (type) => {
  try {
    const diseasesRef = collection(db, 'diseases')
    const q = query(diseasesRef, where('type', '==', type))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching diseases by type:', error)
    throw error
  }
}

// Get diseases by plant
export const getDiseasesByPlant = async (plant) => {
  try {
    const diseasesRef = collection(db, 'diseases')
    const q = query(diseasesRef, where('plant', '==', plant))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching diseases by plant:', error)
    throw error
  }
}

// Search diseases
export const searchDiseases = async (searchTerm) => {
  try {
    // Firestore doesn't support full-text search, so we fetch all and filter
    const diseases = await getAllDiseases()
    const lowercaseSearch = searchTerm.toLowerCase()
    
    return diseases.filter(disease => 
      disease.title.toLowerCase().includes(lowercaseSearch) ||
      disease.plant.toLowerCase().includes(lowercaseSearch) ||
      disease.type.toLowerCase().includes(lowercaseSearch)
    )
  } catch (error) {
    console.error('Error searching diseases:', error)
    throw error
  }
}

// ============ SCAN HISTORY SERVICES ============

// Save scan result
export const saveScanResult = async (userId, scanData) => {
  try {
    const scansRef = collection(db, 'users', userId, 'scanHistory')
    const docRef = await addDoc(scansRef, {
      ...scanData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving scan result:', error)
    throw error
  }
}

// Get user's scan history
export const getScanHistory = async (userId, limitCount = 10) => {
  try {
    const scansRef = collection(db, 'users', userId, 'scanHistory')
    const q = query(scansRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching scan history:', error)
    throw error
  }
}

// ============ IMAGE UPLOAD SERVICES ============

// Upload scan image
export const uploadScanImage = async (userId, file) => {
  try {
    const timestamp = Date.now()
    const fileName = `scans/${userId}/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// ============ USER SERVICES ============

// Update user profile
export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

// Save disease to favorites
export const saveDiseaseToFavorites = async (userId, diseaseId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const savedDiseases = userDoc.data().savedDiseases || []
      if (!savedDiseases.includes(diseaseId)) {
        await updateDoc(userRef, {
          savedDiseases: [...savedDiseases, diseaseId],
          updatedAt: serverTimestamp()
        })
      }
    }
    return true
  } catch (error) {
    console.error('Error saving to favorites:', error)
    throw error
  }
}

// Remove disease from favorites
export const removeDiseaseFromFavorites = async (userId, diseaseId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const savedDiseases = userDoc.data().savedDiseases || []
      await updateDoc(userRef, {
        savedDiseases: savedDiseases.filter(id => id !== diseaseId),
        updatedAt: serverTimestamp()
      })
    }
    return true
  } catch (error) {
    console.error('Error removing from favorites:', error)
    throw error
  }
}

// ============ SEED DATA ============
// Use this function to populate initial disease data
export const seedDiseaseData = async () => {
  const diseases = [
    {
      title: "Ulat Penggulung Daun Kapas",
      type: "Serangga",
      plant: "Kapas",
      image: "https://www.vegetables.cornell.edu/files/2020/11/Scab-fruit.jpg",
      description: "Ulat penggulung daun kapas adalah hama yang menyerang tanaman kapas dengan cara menggulung daun dan memakan jaringan daun dari dalam.",
      symptoms: ["Daun menggulung", "Lubang pada daun", "Pertumbuhan terhambat"],
      prevention: ["Rotasi tanaman", "Penggunaan insektisida alami", "Pemasangan perangkap feromon"],
      treatment: ["Aplikasi insektisida sistemik", "Pemangkasan daun terinfeksi", "Pengendalian hayati dengan predator alami"],
      severity: "Tinggi",
      tags: ["Serangga", "Kapas", "Berbahaya"]
    },
    {
      title: "Antraknosa pada Kedelai",
      type: "Jamur",
      plant: "Kedelai",
      image: "https://www.vegetables.cornell.edu/files/2020/11/Phytophthora-blight-fruit-1024x768.jpg",
      description: "Antraknosa adalah penyakit jamur yang menyebabkan bercak coklat kehitaman pada daun, batang, dan polong kedelai.",
      symptoms: ["Bercak coklat pada daun", "Lesi pada batang", "Polong busuk"],
      prevention: ["Gunakan benih bersertifikat", "Jaga kelembaban", "Aplikasi fungisida"],
      treatment: ["Fungisida berbahan aktif mankozeb", "Pemangkasan bagian terinfeksi", "Perbaikan drainase"],
      severity: "Sedang",
      tags: ["Jamur", "Kedelai"]
    },
    {
      title: "Hawar Daun Kentang",
      type: "Jamur",
      plant: "Kentang",
      image: "https://s.hdnux.com/photos/01/34/05/54/24140594/6/rawImage.jpg",
      description: "Penyakit jamur yang menyebabkan kerusakan parah pada daun dan umbi kentang, dikenal juga sebagai late blight.",
      symptoms: ["Bercak hitam pada daun", "Daun layu cepat", "Umbi busuk"],
      prevention: ["Fungisida preventif", "Varietas tahan", "Rotasi tanaman"],
      treatment: ["Aplikasi fungisida tembaga", "Cabut tanaman terinfeksi", "Jangan siram dari atas"],
      severity: "Tinggi",
      tags: ["Jamur", "Kentang", "Berbahaya"]
    },
    {
      title: "Spotted Wilt Virus",
      type: "Virus",
      plant: "Tomat",
      image: "https://bioprotectionportal.com/wp-content/uploads/2025/04/tomato-spotted-wilt-virus_symptom-1024x763.jpg",
      description: "Virus yang ditularkan oleh thrips menyebabkan bercak dan layu pada tanaman tomat.",
      symptoms: ["Bercak cincin pada daun", "Buah deformasi", "Tanaman layu"],
      prevention: ["Kontrol thrips", "Varietas tahan", "Mulsa reflektif"],
      treatment: ["Tidak ada obat untuk virus", "Cabut tanaman terinfeksi", "Kontrol vektor thrips"],
      severity: "Tinggi",
      tags: ["Virus", "Tomat", "Serius"]
    },
    {
      title: "Trips Cabai",
      type: "Serangga",
      plant: "Cabai",
      image: "https://assets.corteva.com/is/image/Corteva/ar4-26jun20",
      description: "Hama trips yang menyerang daun dan bunga cabai menyebabkan kerusakan dan penurunan produksi.",
      symptoms: ["Daun keperakan", "Bunga rontok", "Buah cacat"],
      prevention: ["Perangkap warna biru", "Musuh alami", "Rotasi tanaman"],
      treatment: ["Insektisida sistemik", "Penyemprotan minyak neem", "Predator alami"],
      severity: "Sedang",
      tags: ["Serangga", "Cabai"]
    },
    {
      title: "Wereng Coklat",
      type: "Serangga",
      plant: "Padi",
      image: "https://assets.corteva.com/is/image/Corteva/ar4-26jun20",
      description: "Hama utama padi yang mengisap cairan tanaman dan menularkan virus tungro.",
      symptoms: ["Tanaman menguning", "Hopperburn", "Gagal panen"],
      prevention: ["Varietas tahan", "Pengaturan air", "Penanaman serempak"],
      treatment: ["Insektisida selektif", "Pengaturan jarak tanam", "Pengendalian terpadu"],
      severity: "Tinggi",
      tags: ["Serangga", "Padi", "Berbahaya"]
    },
    {
      title: "Bercak Daun Padi",
      type: "Bakteri",
      plant: "Padi",
      image: "https://ipm-cahnr.media.uconn.edu/wp-content/uploads/sites/3216/2023/11/bacterial-speck-gary-e-vallad-university-of-florida.jpeg",
      description: "Penyakit bakteri yang menyebabkan bercak-bercak pada daun padi dan menurunkan hasil panen.",
      symptoms: ["Bercak coklat pada daun", "Daun mengering", "Gabah hampa"],
      prevention: ["Varietas tahan", "Pengaturan air", "Sanitasi lahan"],
      treatment: ["Antibiotik pertanian", "Pemupukan berimbang", "Perbaikan drainase"],
      severity: "Sedang",
      tags: ["Bakteri", "Padi"]
    },
    {
      title: "Layu Fusarium",
      type: "Jamur",
      plant: "Tomat",
      image: "https://assets.corteva.com/is/image/Corteva/ar4-26jun20",
      description: "Penyakit jamur tanah yang menyebabkan layu dan kematian tanaman tomat.",
      symptoms: ["Daun menguning satu sisi", "Pembuluh coklat", "Tanaman layu permanen"],
      prevention: ["Varietas tahan", "Solarisasi tanah", "Drainase baik"],
      treatment: ["Fungisida tanah", "Rotasi tanaman 3-4 tahun", "Sterilisasi media tanam"],
      severity: "Tinggi",
      tags: ["Jamur", "Tomat", "Serius"]
    }
  ]

  try {
    const diseasesRef = collection(db, 'diseases')
    
    for (const disease of diseases) {
      await addDoc(diseasesRef, {
        ...disease,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    
    console.log('Disease data seeded successfully!')
    return true
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}
