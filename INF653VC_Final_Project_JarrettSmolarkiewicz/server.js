// Final Project Requirements:
//  1. Link to GitHub code repository.
//  2. Link to deployed project.
//  3. One page PDF document discussing what challenges you faced while building your project.
//  4. Automated Tests for REST API (Automated Testing page will run 70 detailed automated tests on REST API).

// Final Project GitHub Repository (Node.js REST API)
// https://github.com/jarrettsmo/INF653VC_Final_NodejsRestAPI_Jarrett_Smolarkiewicz

// Final Project Automated Tests
// https://dazzling-snickerdoodle-777101.netlify.app/

// ----------------------> FINAL PROJECT RESOURCES <----------------------
// Dave Gray YouTube Playlist for Vanilla JavaScript
// https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Oi6xNtL_fwCrwpuqylMsgT 

// Dave Gray YouTube Playlist for Node.js
// https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw 

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// CORS Options Controller
app.use(cors(corsOptions));

// Built-in Middleware for express.js
app.use(express.urlencoded({ extended: false }));

// Built-in Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

// app.all() is for Routing and accepts Regex.
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Function with error logging parameter - also displays message in browser.
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});