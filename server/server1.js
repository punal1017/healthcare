// const express = require('express');
// const errorHandler = require('./Middleware/Errorhandler');
// // const connectDb = require('./Config/dbconnection');
// const cors = require('cors'); // CORS for security at server side
// const multer = require('multer');
// const File = require('./Models/file');
// const dotenv = require('dotenv');
// const path = require('path'); // Module for working with file and directory paths
// const hbs = require('hbs');
// const fs = require('fs'); // Node.js module for interacting with the file system
// const mongoose = require('mongoose');

// dotenv.config(); // Load environment variables from .env file

// // Connect to MongoDB
// const connectDb = async () => {
//   try {
//     const uri = process.env.MONGO_URI;
//     if (!uri) {
//       throw new Error("Mongo URI is not defined in the .env file.");
//     }
//     await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Database connected successfully!');
//   } catch (error) {
//     console.error('Database connection failed', error);
//   }
// };
// connectDb();

// module.exports = connectDb;

// // Initialize the Express app
// const app = express();
// const port = process.env.PORT || 7000;

// // Set view engine and views path
// hbs.registerPartials(path.join(__dirname, 'views', 'partials'), err => {
//   if (err) console.error('Error registering hbs partials:', err);
// });
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Ensure 'uploads' directory exists or create it
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
//   console.log("Created 'uploads' directory.");
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({ storage: storage });

// // Route to render the home page with uploaded files data
// app.get('/home', async (req, res) => {
//   try {
//     const files = await File.find(); // Fetch all uploaded files from MongoDB
//     res.render('home', {
//       username: 'Hiya',
//       users: [
//         { name: 'John Doe', age: 30 },
//         { name: 'Jane Smith', age: 25 }
//       ],
//       files: files // Pass files to the template
//     });
//   } catch (error) {
//     console.error('Error rendering home page:', error);
//     res.status(500).send('Error loading home page.');
//   }
// });

// // Route to handle file upload and save metadata to MongoDB
// app.post('/profile', upload.single('avatar'), async (req, res) => {
//   console.log('Upload endpoint hit');
//   if (!req.file) {
//     console.error('No file uploaded');
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     const fileData = new File({
//       originalName: req.file.originalname,
//       filename: req.file.filename,
//       path: req.file.path,
//       size: req.file.size,
//       contentType: req.file.mimetype
//     });
//     await fileData.save();
//     console.log('File metadata saved:', fileData);
//     return res.redirect('/home');
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).send('Error uploading file.');
//   }
// });

// // Route to serve uploaded files directly
// app.get('/uploads/:filename', (req, res) => {
//   const filePath = path.join(uploadDir, req.params.filename);
//   fs.stat(filePath, (err, stat) => {
//     if (err || !stat.isFile()) {
//       console.error('File not found:', err);
//       return res.status(404).send('File not found.');
//     }
//     res.sendFile(filePath);
//   });
// });

// // Import and use additional routes
// app.use("/api/users",  require('./Routes/userRoutes'))
// app.use('/api/register', require('./Routes/userRoutes'));
// app.use('/api/details', require('./Routes/doctorDetails'));

// // Error handling middleware
// app.use(errorHandler);

// // Start the server and listen for connections
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// // Catch any unhandled exceptions for better debugging
// process.on('uncaughtException', err => {
//   console.error('Uncaught Exception:', err);
// });
const express = require('express');
const errorHandler = require('./Middleware/Errorhandler');
const cors = require('cors');
const multer = require('multer');
const File = require('./Models/file');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config();

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Mongo URI is not defined in the .env file.");
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed', error);
  }
};

connectDb();

const app = express();
const port = process.env.PORT || 7000;

// Set up Handlebars and view paths
hbs.registerPartials(path.join(__dirname, 'views', 'partials'), err => {
  if (err) console.error('Error registering hbs partials:', err);
});
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created 'uploads' directory.");
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/home', async (req, res) => {
  try {
    const files = await File.find();
    res.render('home', {
      username: 'Hiya',
      users: [
        { name: 'John Doe', age: 30 },
        { name: 'Jane Smith', age: 25 }
      ],
      files: files
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Error loading home page.');
  }
});

app.post('/profile', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  try {
    const fileData = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      contentType: req.file.mimetype
    });
    await fileData.save();
    return res.redirect('/home');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      console.error('File not found:', err);
      return res.status(404).send('File not found.');
    }
    res.sendFile(filePath);
  });
});

// Import routes
app.use("/api/users", require('./Routes/userRoutes'));
app.use("/api/register", require('./Routes/userRoutes'));
app.use('/api/details', require('./Routes/doctorDetails'));

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
