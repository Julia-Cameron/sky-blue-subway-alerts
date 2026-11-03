const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Line = require('./models/Line');
const Station = require('./models/Station');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Real TTC Lines & Stations Data
const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing lines and stations to avoid duplicates
        await Station.deleteMany({});
        await Line.deleteMany({});
        console.log('Cleared existing Line and Station collections.');

        // 1. Insert Lines
        const line1 = await Line.create({ name: 'Line 1 Yonge-University', number: 1 });
        const line2 = await Line.create({ name: 'Line 2 Bloor-Danforth', number: 2 });
        const line4 = await Line.create({ name: 'Line 4 Sheppard', number: 4 });
        console.log('TTC Lines created successfully.');

        // 2. Insert Stations with sequence order
        const stationsData = [
            // Line 1 (Sample stations north to south/loop)
            { name: 'Finch', line: line1._id, order: 1 },
            { name: 'North York Centre', line: line1._id, order: 2 },
            { name: 'Sheppard-Yonge', line: line1._id, order: 3 },
            { name: 'Bloor-Yonge', line: line1._id, order: 4 },
            { name: 'Union', line: line1._id, order: 5 },
            
            // Line 2 (Sample stations west to east)
            { name: 'Kipling', line: line2._id, order: 1 },
            { name: 'Jane', line: line2._id, order: 2 },
            { name: 'St. George', line: line2._id, order: 3 },
            { name: 'Bloor-Yonge', line: line2._id, order: 4 },
            { name: 'Kennedy', line: line2._id, order: 5 },

            // Line 4 (Sheppard)
            { name: 'Sheppard-Yonge', line: line4._id, order: 1 },
            { name: 'Bayview', line: line4._id, order: 2 },
            { name: 'Don Mills', line: line4._id, order: 3 }
        ];

        await Station.insertMany(stationsData);
        console.log('TTC Stations created successfully.');

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();