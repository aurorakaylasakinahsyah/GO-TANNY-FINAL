const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Presentation progress management
 */

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get all progress items
 *     tags: [Progress]
 *     responses:
 *       200:
 *         description: List of progress items
 */
router.get('/', progressController.getAllProgress);

/**
 * @swagger
 * /api/progress:
 *   post:
 *     summary: Create a new progress item
 *     tags: [Progress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               percentage:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Not Started, In Progress, Completed]
 *     responses:
 *       201:
 *         description: Progress created
 */
router.post('/', progressController.createProgress);

/**
 * @swagger
 * /api/progress/{id}:
 *   put:
 *     summary: Update a progress item
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Progress ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               percentage:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.put('/:id', progressController.updateProgress);

/**
 * @swagger
 * /api/progress/{id}:
 *   delete:
 *     summary: Delete a progress item
 *     tags: [Progress]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Progress ID
 *     responses:
 *       200:
 *         description: Progress deleted
 */
router.delete('/:id', progressController.deleteProgress);

module.exports = router;
