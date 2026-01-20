const mongoose = require('mongoose');

// Create a dedicated connection for app data using MONGO_URI_APP
const appUri = process.env.MONGO_URI_APP;
let appConnection = null;
if (appUri) {
  appConnection = mongoose.createConnection(appUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  appConnection.on('error', (e) => console.error('VisionLog app DB error:', e));
}

const visionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fruit: { type: String, required: true },
  disease: { type: String, required: true },
  confidence: { type: Number, required: true },
  reasons: { type: [String], default: [] },
  imagePath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Export model bound to appConnection if available, else fallback to default
module.exports = (appConnection || mongoose).model('VisionLog', visionLogSchema);
