const cloudinary = require('../config/cloudinary');

// @desc    Generate Cloudinary signed upload parameters
// @route   POST /api/admin/upload-signature
// @access  Private
const getUploadSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body.folder || 'for_you_app';

    const paramsToSign = {
      timestamp,
      folder
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || 'sample_secret'
    );

    res.json({
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY || '1234567890',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'demo'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUploadSignature };
