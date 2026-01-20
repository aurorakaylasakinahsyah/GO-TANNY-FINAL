const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { getAuth } = require('../utils/firebase');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Register attempt:', email);
    const useFirebase = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email dan password harus diisi' });
    }

    if (useFirebase) {
      // Create Firebase user via Admin SDK
      const auth = getAuth();
      try {
        const userRecord = await auth.createUser({ email, password });
        // Client should signInWithEmailAndPassword; optionally return custom token
        const customToken = await auth.createCustomToken(userRecord.uid);
        return res.json({ message: 'Registrasi (Firebase) berhasil', uid: userRecord.uid, customToken });
      } catch (e) {
        return res.status(400).json({ msg: 'Firebase createUser gagal', error: e?.message });
      }
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ msg: 'Email sudah terdaftar' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashed });
    await user.save();
    
    console.log('User registered successfully:', email);

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
    res.json({ token, message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', email);
    const useFirebase = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email dan password harus diisi' });
    }

    if (useFirebase) {
      // In Firebase mode, password auth happens on the client.
      // This endpoint can accept an ID token to exchange for payload.
      const idToken = req.header('Authorization')?.split(' ')[1];
      if (!idToken) {
        return res.status(400).json({ msg: 'Gunakan Firebase Auth di frontend untuk login, atau kirim ID token pada Authorization header' });
      }
      try {
        const auth = getAuth();
        const decoded = await auth.verifyIdToken(idToken);
        return res.json({ message: 'Login (Firebase) berhasil', uid: decoded.uid, email: decoded.email, firebase: true });
      } catch (e) {
        return res.status(401).json({ msg: 'ID token invalid', error: e?.message });
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ msg: 'Email atau password salah' });
    }

    console.log('Login successful:', email);
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
    res.json({ token, message: 'Login berhasil' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Simple placeholder implementations for password reset flow.
// Integrate with your email provider and secure token storage as needed.
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const useFirebase = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';

  try {
    // --- FIREBASE FLOW ---
    if (useFirebase) {
      const auth = getAuth();
      try {
        // Generate Firebase Password Reset Link
        const link = await auth.generatePasswordResetLink(email);
        
        // Send email via Nodemailer
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Reset Password - GoTanny (Firebase)',
          text: `Anda meminta reset password untuk akun GoTanny (Firebase).\n\n` +
                `Silakan klik tautan berikut untuk mereset password Anda:\n\n` +
                `${link}\n\n` +
                `Tautan ini akan mengarahkan Anda ke halaman reset password aman dari Firebase.\n`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
           await transporter.sendMail(mailOptions);
           console.log(`[EMAIL SENT] Firebase Reset link sent to ${email}`);
           return res.json({ message: 'Link reset password telah dikirim ke email Anda.' });
        } else {
           console.log(`[MOCK EMAIL] Firebase Link: ${link}`);
           return res.json({ 
             message: 'Link reset password telah dikirim (Mock Mode - Cek Console Server)',
             token: 'firebase-link-sent' 
           });
        }
      } catch (e) {
        console.error('Firebase forgot password error:', e);
        return res.status(400).json({ msg: 'Email tidak ditemukan atau terjadi kesalahan pada Firebase', error: e.message });
      }
    }

    // --- MONGODB FLOW ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiration (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`; // Adjust frontend URL if needed

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password - GoTanny',
      text: `Anda menerima email ini karena Anda (atau orang lain) meminta reset password untuk akun Anda.\n\n` +
            `Silakan klik tautan berikut, atau paste ke browser Anda untuk menyelesaikan proses:\n\n` +
            `${resetUrl}\n\n` +
            `Jika Anda tidak meminta ini, abaikan email ini dan password Anda akan tetap aman.\n`
    };

    // Try sending email, but don't block if it fails (just log it for dev)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-app-password') {
         await transporter.sendMail(mailOptions);
         console.log(`[EMAIL SENT] Reset link sent to ${email}`);
         res.json({ message: 'Email reset password telah dikirim.' });
      } else {
         console.log(`[MOCK EMAIL] Email config missing. Token: ${resetToken}`);
         console.log(`[MOCK EMAIL] Link: ${resetUrl}`);
         res.json({ 
           message: 'Email reset password telah dikirim (Mock Mode - Cek Console Server)',
           token: resetToken 
         });
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Fallback to mock if email fails
      res.json({ 
        message: 'Gagal mengirim email, namun token telah dibuat (Cek Console Server)',
        token: resetToken 
      });
    }

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const useFirebase = String(process.env.USE_FIREBASE_AUTH || '').toLowerCase() === 'true';

  if (useFirebase) {
    return res.status(400).json({ 
      msg: 'Untuk akun Firebase, silakan gunakan link yang dikirim ke email Anda untuk mereset password. Endpoint ini hanya untuk database lokal.' 
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token tidak valid atau kadaluarsa' });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};