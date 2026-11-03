// Checks the models against a real database, then removes everything it made.
// Run after seeding:   node test-models.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Line = require('./models/Line');
const Station = require('./models/Station');
const Report = require('./models/Report');

let passed = 0;
let failed = 0;

function check(name, ok, detail) {
	if (ok) {
		passed++;
		console.log(`  PASS  ${name}`);
	} else {
		failed++;
		console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`);
	}
}

async function rejects(promise) {
	try {
		await promise;
		return null;
	} catch (err) {
		return err;
	}
}

async function main() {
	await connectDB();
	await Promise.all([User.init(), Line.init(), Station.init(), Report.init()]);

	// Reference data from the seed script
	const lineCount = await Line.countDocuments();
	const stationCount = await Station.countDocuments();
	check('5 lines loaded', lineCount === 5, `found ${lineCount}`);
	check('117 stations loaded', stationCount === 117, `found ${stationCount}`);

	const line1 = await Line.findOne({ number: 1 });
	const line2 = await Line.findOne({ number: 2 });
	const line1Stations = await Station.forLine(line1._id);
	check('Line 1 dropdown starts at Vaughan Metropolitan Centre', line1Stations[0].name === 'Vaughan Metropolitan Centre');
	check('Line 1 dropdown ends at Finch', line1Stations.at(-1).name === 'Finch');

	const dupStation = await rejects(Station.create({ name: 'Union', line: line1._id, order: 99 }));
	check('Duplicate station on the same line is rejected', dupStation && dupStation.code === 11000);

	// Users
	const tag = Date.now();
	const userA = await User.create({ name: 'Test A', email: `a-${tag}@test.invalid`, password: 'x' });
	const userB = await User.create({ name: 'Test B', email: `b-${tag}@test.invalid`, password: 'x' });
	const dupEmail = await rejects(User.create({ name: 'Dup', email: `A-${tag}@TEST.invalid`, password: 'x' }));
	check('Duplicate email (any case) is rejected', dupEmail && dupEmail.code === 11000);
	const found = await User.findById(userA._id);
	check('Password is not returned by default', found.password === undefined);

	// Reports
	const union = await Station.findOne({ line: line1._id, name: 'Union' });
	const kipling = await Station.findOne({ line: line2._id, name: 'Kipling' });

	const report = await Report.create({ line: line1._id, station: union._id, description: 'Test report', createdBy: userA._id });
	check('New report starts Active with 1 vote', report.status === 'Active' && report.votes === 1);
	check('Creator is the first voter', report.voters.length === 1 && report.voters[0].equals(userA._id));
	check('Voters are hidden from JSON', !('voters' in report.toJSON()));

	const wrongLine = await rejects(Report.create({ line: line1._id, station: kipling._id, description: 'x', createdBy: userA._id }));
	check('Station on another line is rejected', wrongLine && wrongLine.errors && wrongLine.errors.station);

	const badStatus = await rejects(Report.create({ line: line1._id, station: union._id, description: 'x', status: 'Deleted', createdBy: userA._id }));
	check('"Deleted" status is rejected', badStatus && badStatus.errors && badStatus.errors.status);

	check('Creator cannot vote again', (await Report.addVote(report._id, userA._id)) === false);
	check('Another user can vote once', (await Report.addVote(report._id, userB._id)) === true);
	check('...but not twice', (await Report.addVote(report._id, userB._id)) === false);
	const afterVotes = await Report.findById(report._id);
	check('Vote count is 2', afterVotes.votes === 2, `found ${afterVotes.votes}`);

	afterVotes.status = 'Resolved';
	afterVotes.resolvedAt = new Date();
	await afterVotes.save();
	check('Resolved reports refuse votes', (await Report.addVote(report._id, new mongoose.Types.ObjectId())) === false);

	// Clean up everything this test created
	await Report.deleteMany({ createdBy: { $in: [userA._id, userB._id] } });
	await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });

	console.log(`\n${passed} passed, ${failed} failed`);
	process.exitCode = failed ? 1 : 0;
}

main()
	.catch(err => {
		console.error('Test run failed:', err.message);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
