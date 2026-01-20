const jwt = require('jsonwebtoken');
const { getAuth } = require('../utils/firebase');
require('dotenv').config();

module.exports = async function(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  const devBypass = String(process.env.DEV_ALLOW_NO_AUTH || '').toLowerCase() === 'true';
  if (!token) {
    if (devBypass) {
      req.user = { id: 'dev-user', email: 'dev@example.com', devBypass: true };
      return next();
    }
    return res.status(401).json({ msg: 'No token' });
  }

  const useFirebase = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';

  if (useFirebase) {
    try {
      const auth = getAuth();
      const decoded = await auth.verifyIdToken(token);
      req.user = { id: decoded.uid, email: decoded.email, firebase: true };
      return next();
    } catch (err) {
      return res.status(401).json({ msg: 'Invalid Firebase ID token', error: err?.message });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};