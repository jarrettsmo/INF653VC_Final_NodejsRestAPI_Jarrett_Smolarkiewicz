const express = require('express');
const router = express.Router();
const path = require('path');

// Setup route for root URL using regex options
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Export module
module.exports = router;