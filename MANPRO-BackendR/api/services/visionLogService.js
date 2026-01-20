const { getFirestore } = require('../utils/firebase');

// Fallback: use existing Mongoose model when Firebase is not enabled or unavailable
let VisionLogModel = null;
try {
  VisionLogModel = require('../models/visionLog');
} catch (err) {
  // ignore if model not present
}

const useFirebase = String(process.env.USE_FIREBASE_APP_DB || '').toLowerCase() === 'true';

/**
 * Save a vision log either to Firestore (if enabled) or Mongo (default).
 * @param {Object} payload - { userId, fruit, disease, confidence, reasons, imagePath }
 */
async function saveVisionLog(payload) {
  const { userId, fruit, disease, confidence, reasons, imagePath } = payload || {};

  if (useFirebase) {
    const db = getFirestore();
    if (db) {
      const doc = {
        userId: userId || null,
        fruit: fruit || 'unknown',
        disease: disease || 'unknown',
        confidence: Number(confidence || 0),
        reasons: Array.isArray(reasons) ? reasons : [],
        imagePath: imagePath || null,
        createdAt: new Date(),
      };
      try {
        await db.collection('visionlogs').add(doc);
        return { ok: true, backend: 'firebase' };
      } catch (err) {
        console.warn('[WARN] Firestore saveVisionLog failed:', err?.message || err);
        // fall through to Mongo if available
      }
    }
  }

  if (VisionLogModel) {
    try {
      await VisionLogModel.create({
        userId,
        fruit,
        disease,
        confidence: Number(confidence || 0),
        reasons: Array.isArray(reasons) ? reasons : [],
        imagePath,
      });
      return { ok: true, backend: 'mongo' };
    } catch (err) {
      console.warn('[WARN] Mongo saveVisionLog failed:', err?.message || err);
      return { ok: false, error: err?.message || String(err) };
    }
  }

  return { ok: false, error: 'No backend available for VisionLog' };
}

module.exports = {
  saveVisionLog,
};
