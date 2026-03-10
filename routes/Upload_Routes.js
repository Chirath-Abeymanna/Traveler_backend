const express = require('express');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload — Upload base64 image to Cloudinary (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { image } = req.body; // expects a base64 data URL string

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'travel-buddy',
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ],
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
