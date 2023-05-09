const mongoose = require('mongoose');

// Setup database connection for MongoDB
const connectDB = async () => {
    try {
        // Use environment variable instead of hard-coded values
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

// Export database module
module.exports = connectDB;