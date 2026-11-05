// SB-18 — Load TTC lines and stations, plus test users and sample reports.
//
// Run from the project folder:   node seed/seed.js
// Needs MONGO_URI in .env and the packages mongoose, dotenv and bcryptjs.
//
// Safe to run more than once:
// - Lines and stations are upserted (added or updated, never duplicated).
// - Test users all use @skyblue.test emails. Only those users, and reports
//   they created, are removed and re-created. Real users and reports are
//   never touched.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Line = require('../models/Line');
const Station = require('../models/Station');
const User = require('../models/User');
const Report = require('../models/Report');
const TTC = require('./ttc-stations');

// Test password for every seeded account (8+ characters, per the design doc).
const TEST_PASSWORD = 'SkyBlue2026!';

const TEST_USERS = [
	{ key: 'maya', name: 'Maya Chen', email: 'maya@skyblue.test', role: 'user' },
	{ key: 'omar', name: 'Omar Haddad', email: 'omar@skyblue.test', role: 'user' },
	{ key: 'priya', name: 'Priya Natarajan', email: 'priya@skyblue.test', role: 'user' },
	{ key: 'mod', name: 'Sam Moderator', email: 'moderator@skyblue.test', role: 'moderator' }
];

// by: who created it. confirmedBy: other riders who voted "Still happening".
// minutesAgo: how long ago it was reported, so the feed has a realistic spread.
const SAMPLE_REPORTS = [
	{ line: 1, station: 'Bloor-Yonge', by: 'maya', confirmedBy: ['omar', 'priya'], minutesAgo: 6, status: 'Active',
		description: 'Signal problem, southbound trains holding at the platform.' },
	{ line: 2, station: 'Main Street', by: 'omar', confirmedBy: ['maya'], minutesAgo: 12, status: 'Active',
		description: 'Train stopped between Main Street and Victoria Park for about 10 minutes.' },
	{ line: 1, station: 'St. Clair West', by: 'priya', confirmedBy: [], minutesAgo: 18, status: 'Active',
		description: 'Northbound trains running slowly, crowded platform.' },
	{ line: 2, station: 'Ossington', by: 'maya', confirmedBy: ['priya'], minutesAgo: 25, status: 'Active',
		description: 'Eastbound train out of service, everyone asked to get off.' },
	{ line: 5, station: 'Eglinton', by: 'omar', confirmedBy: [], minutesAgo: 34, status: 'Active',
		description: 'Eastbound Line 5 trains delayed, about 15 minutes between trains.' },
	{ line: 4, station: 'Bayview', by: 'priya', confirmedBy: ['omar'], minutesAgo: 41, status: 'Active',
		description: 'Escalator out of service, elevator only. Trains running normally.' },
	{ line: 6, station: 'Jane and Finch', by: 'maya', confirmedBy: [], minutesAgo: 55, status: 'Active',
		description: 'Westbound trains held because of a vehicle on the tracks.' },
	{ line: 1, station: 'Union', by: 'omar', confirmedBy: ['maya', 'priya'], minutesAgo: 90, status: 'Resolved',
		description: 'No service between Union and St. Andrew, shuttle buses running.' },
	{ line: 2, station: 'Kennedy', by: 'priya', confirmedBy: ['maya'], minutesAgo: 120, status: 'Resolved',
		description: 'Medical emergency on a westbound train, trains bypassing the station.' },
	{ line: 5, station: 'Kennedy', by: 'maya', confirmedBy: [], minutesAgo: 150, status: 'Resolved',
		description: 'Doors not opening on one car, train taken out of service.' }
];

async function seedLinesAndStations() {
	const lineIds = {};
	let stationCount = 0;

	for (const line of TTC) {
		const doc = await Line.findOneAndUpdate(
			{ number: line.number },
			{ name: line.name, number: line.number, route: line.route },
			{ upsert: true, returnDocument: 'after', runValidators: true }
		);
		lineIds[line.number] = doc._id;

		for (let i = 0; i < line.stations.length; i++) {
			await Station.updateOne(
				{ line: doc._id, name: line.stations[i] },
				{ name: line.stations[i], line: doc._id, order: i + 1 },
				{ upsert: true, runValidators: true }
			);
			stationCount++;
		}
	}

	console.log(`Lines: ${TTC.length}, stations: ${stationCount}`);
	return lineIds;
}

async function seedUsers() {
	const testEmails = TEST_USERS.map(u => u.email);
	const oldUsers = await User.find({ email: { $in: testEmails } }).select('_id');
	const removed = await Report.deleteMany({ createdBy: { $in: oldUsers.map(u => u._id) } });
	await User.deleteMany({ email: { $in: testEmails } });

	const hash = await bcrypt.hash(TEST_PASSWORD, 10);
	const userIds = {};
	for (const u of TEST_USERS) {
		const doc = await User.create({ name: u.name, email: u.email, password: hash, role: u.role });
		userIds[u.key] = doc._id;
	}

	console.log(`Test users: ${TEST_USERS.length} (old sample reports removed: ${removed.deletedCount})`);
	return userIds;
}

async function seedReports(lineIds, userIds) {
	for (const r of SAMPLE_REPORTS) {
		const lineId = lineIds[r.line];
		const station = await Station.findOne({ line: lineId, name: r.station });
		if (!station) {
			throw new Error(`Station "${r.station}" not found on Line ${r.line}`);
		}

		const voters = [userIds[r.by], ...r.confirmedBy.map(k => userIds[k])];
		const reportedAt = new Date(Date.now() - r.minutesAgo * 60 * 1000);

		const report = new Report({
			line: lineId,
			station: station._id,
			description: r.description,
			status: r.status,
			createdBy: userIds[r.by],
			voters,
			votes: voters.length,
			resolvedAt: r.status === 'Resolved' ? new Date(reportedAt.getTime() + 30 * 60 * 1000) : undefined,
			createdAt: reportedAt,
			updatedAt: r.status === 'Resolved' ? new Date(reportedAt.getTime() + 30 * 60 * 1000) : reportedAt
		});
		await report.save({ timestamps: false });
	}

	console.log(`Sample reports: ${SAMPLE_REPORTS.length}`);
}

async function main() {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is missing. Add it to your .env file.');
	}
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected to MongoDB');

	await Line.init();
	await Station.init(); // builds the unique { line, name } index before inserting

	const lineIds = await seedLinesAndStations();
	const userIds = await seedUsers();
	await seedReports(lineIds, userIds);

	console.log(`Done. Test accounts use the password: ${TEST_PASSWORD}`);
}

main()
	.catch(err => {
		console.error('Seeding failed:', err.message);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
