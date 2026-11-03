const mongoose = require('mongoose');

// SB-15 — Database connection.
// The connection string lives in .env as MONGO_URI and is never committed.
async function connectDB() {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		throw new Error('MONGO_URI is missing. Copy .env.example to .env and fill it in.');
	}

	await mongoose.connect(uri);
	console.log(`MongoDB connected: ${mongoose.connection.host} / ${mongoose.connection.name}`);
	return mongoose.connection;
}

module.exports = connectDB;
