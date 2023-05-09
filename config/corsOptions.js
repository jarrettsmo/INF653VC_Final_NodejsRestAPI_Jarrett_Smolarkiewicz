const allowedOrigins = require('./allowedOrigins');

// Setup corsOptions to handle cors based on all URL's listed in the allowedOrigins.js file.
const corsOptions = {
    origin: function(origin, callback) {
        // Allow Postman and Thunder Client VS Code extension to work by adding "!origin"
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            // callback(new Error('Not allowed by CORS'));
            const error = new Error(`Origin ${origin} not allowed by CORS`);
            error.status = 403;
            callback(error);
        }
    },
    optionsSuccessStatus: 200
}

// Setup corsMiddleware
const corsMiddleware = function(req, res, next) {
  console.log(req);
  next();
};

// Export modules
module.exports = { allowedOrigins, corsOptions, corsMiddleware };