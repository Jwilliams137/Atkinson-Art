import cloudinary from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parser to handle file uploads manually
  },
};

// Handle the file upload
const handler = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./"; // Temporary folder for the file
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed' });
    }

    const resumeFile = files.resume[0]; // The uploaded resume file
    const filePath = resumeFile.filepath;

    try {
      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'resumes', // Optional folder for organization
        resource_type: 'auto', // Automatically detect the file type (PDF, image, etc.)
      });

      // Clean up the temporary file
      fs.unlinkSync(filePath);

      // Return the Cloudinary URL for the uploaded file
      res.status(200).json({ url: result.secure_url });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).json({ message: 'Error uploading to Cloudinary' });
    }
  });
};

export default handler;
