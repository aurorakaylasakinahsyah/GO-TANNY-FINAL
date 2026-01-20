const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../../uploads'));
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname) || '.jpg';
		cb(null, 'fruit-' + uniqueSuffix + ext);
	}
});
const upload = multer({ storage });

// Diabetes analysis endpoints dihapus

/**
 * @swagger
 * tags:
 *   name: Analysis
 *   description: Image analysis endpoints
 */

/**
 * @swagger
 * /api/analysis/fruit-vision:
 *   post:
 *     summary: Analyze fruit image for disease
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Analysis result
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/fruit-vision', auth, upload.single('image'), analysisController.analyzeFruitVision);

module.exports = router;
