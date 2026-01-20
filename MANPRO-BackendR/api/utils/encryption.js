/**
 * Encryption Utility Module
 * Provides AES-256-CBC encryption and decryption for sensitive data.
 * 
 * @module utils/encryption
 */

const crypto = require('crypto');

// Configuration
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size is 16 bytes

/**
 * Derives a 32-byte key from the environment variable ENCRYPTION_KEY.
 * Uses SHA-256 to ensure the key is exactly 32 bytes.
 * 
 * @returns {Buffer} The derived encryption key.
 * @throws {Error} If ENCRYPTION_KEY is not set in production.
 */
function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY is missing in production environment variables.');
    }
    // Fallback for development only
    console.warn('[WARN] ENCRYPTION_KEY not set. Using insecure default for development.');
    return crypto.createHash('sha256').update('dev-secret-key-do-not-use-in-prod').digest();
  }

  return crypto.createHash('sha256').update(String(secret)).digest();
}

/**
 * Encrypts a text string using AES-256-CBC.
 * 
 * @param {string} text - The text to encrypt.
 * @returns {string} The encrypted text in format "iv:encryptedData" (hex encoded).
 */
function encrypt(text) {
  if (!text) return text;
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption failed:', error.message);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypts an encrypted string using AES-256-CBC.
 * 
 * @param {string} text - The encrypted text in format "iv:encryptedData".
 * @returns {string} The decrypted original text.
 */
function decrypt(text) {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = textParts[1];
    const key = getEncryptionKey();
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    // Return original text or throw depending on security requirements. 
    // Returning null or throwing is safer to avoid leaking invalid data.
    throw new Error('Decryption failed');
  }
}

module.exports = {
  encrypt,
  decrypt
};