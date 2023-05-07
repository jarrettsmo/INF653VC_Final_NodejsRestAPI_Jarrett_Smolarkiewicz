// const allowedOrigins = require('./allowedOrigins');

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// }

// module.exports = corsOptions;

const allowedOrigins = require('./allowedOrigins');
/*
const allowedOrigins = ['https://modern-unleashed-mulberry.glitch.me',
                        'https://inf-653-vc-final-project-jarrett-smolarkiewicz.glitch.me',
                        'https://replit.com/@JarrettSmo/INF653VCFinalNodejsRestAPIJarrettSmolarkiewicz',
                        'git+https://github.com/jarrettsmo/INF653VC_Final_NodejsRestAPI_Jarrett_Smolarkiewicz.git',
                        'https://dazzling-snickerdoodle-777101.netlify.app',
                        'http://127.0.0.1:5500',
                        'http://localhost:3500',
                        'http://localhost:3000'];
                        
const options = {
  origin: function(origin, callback) {

//const corsOptions = {
    //origin: (origin, callback) => {
*/

const corsOptions = {
    origin: function(origin, callback) {
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


const corsMiddleware = function(req, res, next) {
  console.log(req);
  next();
};


//console.log('allowedOrigins:', allowedOrigins);

//module.exports = corsOptions;
module.exports = { allowedOrigins, corsOptions, corsMiddleware };
//module.exports = { allowedOrigins, options, corsMiddleware };