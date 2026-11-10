// ============================================================
// EduVault - Simple Student Portfolio Backend (Express + Multer)
// ============================================================

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const UPLOAD_LIMIT_MB = parseInt(process.env.UPLOAD_LIMIT_MB || '25', 10);

// AWS S3 Client setup (Uses IAM Role automatically on EC2)
const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || 'eu-north-1';
const s3 = new S3Client({ region: AWS_REGION });

// Helper to upload certificate file to AWS S3
async function uploadToS3(file) {
  const fileStream = fs.createReadStream(file.path);
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: file.filename,
    Body: fileStream,
    ContentType: file.mimetype
  });
  await s3.send(command);
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${file.filename}`;
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder paths
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'achievements.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

// Make sure data & uploads folders exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploaded certificates / PDFs directly
app.use('/uploads', express.static(UPLOADS_DIR));

// ------------------------------------------------------------
// Multer: File Upload Settings (Save files to 'uploads' folder)
// ------------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Keep unique name with original extension (e.g. uuid.pdf or uuid.png)
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: UPLOAD_LIMIT_MB * 1024 * 1024 } // Max from .env (e.g. 25 MB)
});

// ------------------------------------------------------------
// Helper Functions to Read and Write JSON file
// ------------------------------------------------------------
function getAchievements() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.log('Error reading file:', error);
    return [];
  }
}

function saveAchievements(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.log('Error saving file:', error);
  }
}

function getProfile() {
  try {
    if (!fs.existsSync(PROFILE_FILE)) {
      return {
        fullName: "Mahfuz Khan",
        title: "Computer Science & Engineering Student",
        institution: "University of Technology & Science",
        bio: "Passionate about full-stack engineering, cloud architecture, and AI-driven systems. Continuously pursuing academic excellence and industry certifications.",
        location: "India",
        email: "mahfuz.khan@example.com",
        linkedin: "https://linkedin.com/in/mahfuzkhan",
        github: "https://github.com/mahfuzkhan"
      };
    }
    const raw = fs.readFileSync(PROFILE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveProfile(profile) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// Predefined Categories
const CATEGORIES = [
  'Degree & Diploma',
  'Professional Certification',
  'Academic Result & Marksheet',
  'Award & Honor',
  'Course & Training',
  'Research & Publication',
  'Extracurricular & Leadership'
];

// ============================================================
// API ROUTES
// ============================================================

// 1. Get all available categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: CATEGORIES });
});

// 2. Get dashboard statistics (Total certificates, verified count, etc.)
app.get('/api/stats', (req, res) => {
  const list = getAchievements();

  const totalAchievements = list.length;
  const verifiedCount = list.filter(item => item.isVerified).length;
  const featuredCount = list.filter(item => item.isFeatured).length;

  // Count by each category
  const categoryCounts = {};
  CATEGORIES.forEach(cat => { categoryCounts[cat] = 0; });
  list.forEach(item => {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category]++;
    }
  });

  res.json({
    success: true,
    data: {
      totalAchievements,
      verifiedCount,
      featuredCount,
      categoryCounts
    }
  });
});

// 3. Get all achievements (with optional search and category filter)
app.get('/api/achievements', (req, res) => {
  let list = getAchievements();
  const { category, search, sortBy } = req.query;

  // Filter by category if selected
  if (category && category !== 'All') {
    list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.institution && item.institution.toLowerCase().includes(q)) ||
      (item.grade && item.grade.toLowerCase().includes(q)) ||
      (item.credentialId && item.credentialId.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sort list
  if (sortBy === 'date-asc') {
    list.sort((a, b) => new Date(a.issueDate || 0) - new Date(b.issueDate || 0));
  } else if (sortBy === 'title-asc') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'featured') {
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } else {
    // Default: newest first
    list.sort((a, b) => new Date(b.issueDate || 0) - new Date(a.issueDate || 0));
  }

  // Ensure all file URLs include the full host so they work across domains (Amplify + EC2)
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const formattedList = list.map(item => {
    if (item.file && item.file.url && !item.file.url.startsWith('http')) {
      return {
        ...item,
        file: {
          ...item.file,
          url: `${baseUrl}${item.file.url}`
        }
      };
    }
    return item;
  });

  res.json({ success: true, count: formattedList.length, data: formattedList });
});

// 4. Get a single achievement by ID
app.get('/api/achievements/:id', (req, res) => {
  const list = getAchievements();
  const found = list.find(item => item.id === req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Achievement not found' });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  if (found.file && found.file.url && !found.file.url.startsWith('http')) {
    found.file.url = `${baseUrl}${found.file.url}`;
  }

  res.json({ success: true, data: found });
});

// 5. Create / Upload a new achievement with file
app.post('/api/achievements', upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      category,
      institution,
      issueDate,
      expiryDate,
      grade,
      credentialId,
      credentialUrl,
      description,
      tags,
      isFeatured,
      isVerified
    } = req.body;

    if (!title || !institution) {
      return res.status(400).json({ success: false, message: 'Title and Institution are required!' });
    }

    // Convert comma-separated tags into an array
    let tagsArray = [];
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }

    // File details if uploaded
    let fileInfo = null;
    if (req.file) {
      let fileUrl = `/uploads/${req.file.filename}`;

      // If S3 bucket is configured, upload directly to AWS S3!
      if (S3_BUCKET) {
        try {
          fileUrl = await uploadToS3(req.file);
          console.log('☁️ Certificate uploaded to S3:', fileUrl);
        } catch (s3Err) {
          console.error('⚠️ S3 upload error, falling back to local file:', s3Err.message);
        }
      }

      fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      };
    }

    const newItem = {
      id: uuidv4(),
      title: title.trim(),
      category: category || 'Degree & Diploma',
      institution: institution.trim(),
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || null,
      grade: grade ? grade.trim() : '',
      credentialId: credentialId ? credentialId.trim() : '',
      credentialUrl: credentialUrl ? credentialUrl.trim() : '',
      description: description ? description.trim() : '',
      tags: tagsArray,
      file: fileInfo,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isVerified: isVerified === 'true' || isVerified === true,
      createdAt: new Date().toISOString()
    };

    const list = getAchievements();
    list.unshift(newItem); // Add new item to the top
    saveAchievements(list);

    res.status(201).json({ success: true, message: 'Achievement added successfully!', data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Update / Edit an existing achievement
app.put('/api/achievements/:id', upload.single('file'), async (req, res) => {
  try {
    const list = getAchievements();
    const index = list.findIndex(item => item.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    const existing = list[index];
    const {
      title,
      category,
      institution,
      issueDate,
      expiryDate,
      grade,
      credentialId,
      credentialUrl,
      description,
      tags,
      isFeatured,
      isVerified,
      removeFile
    } = req.body;

    // Handle tags
    let tagsArray = existing.tags;
    if (tags !== undefined) {
      tagsArray = typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : tags;
    }

    // Handle file replacement or deletion
    let fileInfo = existing.file;
    if (req.file) {
      let fileUrl = `/uploads/${req.file.filename}`;

      // If S3 bucket is configured, upload new file to S3
      if (S3_BUCKET) {
        try {
          fileUrl = await uploadToS3(req.file);
          console.log('☁️ Updated certificate uploaded to S3:', fileUrl);
        } catch (s3Err) {
          console.error('⚠️ S3 upload error:', s3Err.message);
        }
      }

      fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      };
    } else if (removeFile === 'true' || removeFile === true) {
      fileInfo = null;
    }

    list[index] = {
      ...existing,
      title: title ? title.trim() : existing.title,
      category: category || existing.category,
      institution: institution ? institution.trim() : existing.institution,
      issueDate: issueDate || existing.issueDate,
      expiryDate: expiryDate !== undefined ? expiryDate : existing.expiryDate,
      grade: grade !== undefined ? grade.trim() : existing.grade,
      credentialId: credentialId !== undefined ? credentialId.trim() : existing.credentialId,
      credentialUrl: credentialUrl !== undefined ? credentialUrl.trim() : existing.credentialUrl,
      description: description !== undefined ? description.trim() : existing.description,
      tags: tagsArray,
      file: fileInfo,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : existing.isFeatured,
      isVerified: isVerified !== undefined ? (isVerified === 'true' || isVerified === true) : existing.isVerified,
      updatedAt: new Date().toISOString()
    };

    saveAchievements(list);
    res.json({ success: true, message: 'Achievement updated successfully!', data: list[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Delete an achievement
app.delete('/api/achievements/:id', (req, res) => {
  try {
    const list = getAchievements();
    const itemToDelete = list.find(item => item.id === req.params.id);

    if (!itemToDelete) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    // Delete uploaded physical file if not a sample
    if (itemToDelete.file && itemToDelete.file.filename && !itemToDelete.file.filename.startsWith('sample-')) {
      const filePath = path.join(UPLOADS_DIR, itemToDelete.file.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    const filtered = list.filter(item => item.id !== req.params.id);
    saveAchievements(filtered);

    res.json({ success: true, message: 'Achievement deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. Get student profile details
app.get('/api/profile', (req, res) => {
  const profile = getProfile();
  res.json({ success: true, data: profile });
});

// 9. Update student profile details
app.put('/api/profile', (req, res) => {
  try {
    const existing = getProfile();
    const updated = {
      ...existing,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveProfile(updated);
    res.json({ success: true, message: 'Profile updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend if built
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads') && req.method === 'GET') {
      return res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    }
    next();
  });
}

// Start Server on Port 5001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🎓 Backend Server running on http://localhost:${PORT}`);
  console.log(`   ➜ API Stats:   http://localhost:${PORT}/api/stats`);
  console.log(`   ➜ API Records: http://localhost:${PORT}/api/achievements`);
  console.log(`======================================================\n`);
});
