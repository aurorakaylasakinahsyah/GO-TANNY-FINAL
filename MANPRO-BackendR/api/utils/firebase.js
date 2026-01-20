const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using either a service account JSON string
// in FIREBASE_SERVICE_ACCOUNT_JSON or the GOOGLE_APPLICATION_CREDENTIALS path.
let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  try {
    if (!admin.apps.length) {
      const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (svcJson) {
        const creds = JSON.parse(svcJson);
        admin.initializeApp({
          credential: admin.credential.cert(creds),
          projectId: creds.project_id,
        });
      } else {
        // Fallback to GOOGLE_APPLICATION_CREDENTIALS env var if set
        const config = {
          credential: admin.credential.applicationDefault(),
        };
        if (process.env.GOOGLE_CLOUD_PROJECT) {
          config.projectId = process.env.GOOGLE_CLOUD_PROJECT;
        }
        admin.initializeApp(config);
      }
    }
    initialized = true;
  } catch (err) {
    console.warn('[WARN] Firebase init failed:', err?.message || err);
  }

  return admin;
}

function getFirestore() {
  initFirebase();
  try {
    return admin.firestore();
  } catch (err) {
    console.warn('[WARN] Firestore unavailable:', err?.message || err);
    return null;
  }
}

module.exports = {
  initFirebase,
  getFirestore,
  getAdmin: () => { initFirebase(); return admin; },
  getAuth: () => { initFirebase(); return admin.auth(); },
  isInitialized: () => initialized,
};
