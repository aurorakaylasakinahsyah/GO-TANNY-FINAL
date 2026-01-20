const { spawn } = require('child_process');
const path = require('path');


/**
 * Controller untuk klasifikasi penyakit buah berbasis gambar (LLM Vision)
 * Menggunakan upload file (field name: 'image') dan spawn Python LLM_vision.py
 */
exports.analyzeFruitVision = async (req, res) => {
    try {
        console.log('[INFO] Menerima request klasifikasi penyakit buah (vision)');

        // Validasi file upload dari multer
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: 'File gambar tidak ditemukan. Pastikan field name adalah "image".'
            });
        }

        const imagePath = req.file.path;
        console.log('[INFO] Image path:', imagePath);

        
        let pythonPath = 'python';
        const path = require('path');
        const fs = require('fs');
        const possiblePaths = [
            path.join(__dirname, '../../.venv/Scripts/python.exe'),
            path.join(__dirname, '../../.venv/bin/python'),
            path.join(__dirname, '../../../../.venv/Scripts/python.exe'),
            path.join(__dirname, '../../../../.venv/bin/python'),
            'python.exe',
            'python'
        ];
        for (let p of possiblePaths) {
            try {
                if (fs.existsSync(p)) {
                    pythonPath = p;
                    console.log('[INFO] Found Python at:', pythonPath);
                    break;
                }
            } catch {}
        }

        const scriptPath = path.join(__dirname, '../../python_service/LLM_vision.py');
        console.log('[INFO] Python path:', pythonPath);
        console.log('[INFO] Script path:', scriptPath);

        const { spawn } = require('child_process');
        const pythonProcess = spawn(pythonPath, [
            scriptPath,
            imagePath,
        ]);

        let dataString = '';
        let errorString = '';
        let responseSent = false;

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            const message = data.toString();
            console.log('[PYTHON]', message.trim());
            errorString += message;
        });

        pythonProcess.on('error', (error) => {
            if (responseSent) return;
            responseSent = true;
            console.error('[ERROR] Gagal menjalankan Python process:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal menjalankan Python vision script',
                error: error.message
            });
        });

        pythonProcess.on('close', async (code) => {
            if (responseSent) return;
            responseSent = true;
            console.log(`[INFO] Python process selesai dengan code: ${code}`);

            if (code !== 0) {
                console.error('[ERROR] Python process error:', errorString);
                return res.status(500).json({
                    success: false,
                    message: 'Error saat klasifikasi vision',
                    error: errorString,
                    code
                });
            }

            try {
                console.log('[INFO] Raw output dari Python:', dataString);
                const result = JSON.parse(dataString);
                if (result.success) {
                    // Simpan log ke Firebase Firestore atau Mongo (abstraksi service)
                    try {
                        const { saveVisionLog } = require('../services/visionLogService');
                        const saveResp = await saveVisionLog({
                            userId: req.user?.id,
                            fruit: result.result?.fruit || 'unknown',
                            disease: result.result?.disease || 'unknown',
                            confidence: Number(result.result?.confidence || 0),
                            reasons: Array.isArray(result.result?.reasons) ? result.result.reasons : [],
                            imagePath,
                        });
                        if (saveResp?.ok) {
                            console.log(`[INFO] VisionLog tersimpan via ${saveResp.backend}`);
                        } else {
                            console.warn('[WARN] Gagal menyimpan VisionLog:', saveResp?.error || 'unknown error');
                        }
                    } catch (logErr) {
                        console.warn('[WARN] Gagal menyimpan VisionLog:', logErr?.message || logErr);
                    }
                    return res.status(200).json({
                        success: true,
                        data: result.result
                    });
                } else {
                    return res.status(500).json({
                        success: false,
                        message: 'Vision analisis gagal',
                        error: result.error
                    });
                }
            } catch (parseError) {
                console.error('[ERROR] Parse error:', parseError);
                return res.status(500).json({
                    success: false,
                    message: 'Error parsing hasil vision',
                    error: parseError.message,
                    rawOutput: dataString
                });
            }
        });

    } catch (error) {
        console.error('[ERROR] Exception:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error (vision)',
            error: error.message
        });
    }
};
