require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Bug = require('./models/Bug');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bugvault';

async function seed() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Read sample bugs
    const sampleBugsPath = path.join(__dirname, 'sample-bugs.json');
    if (!fs.existsSync(sampleBugsPath)) {
      console.error('❌ sample-bugs.json not found');
      process.exit(1);
    }

    const sampleData = JSON.parse(fs.readFileSync(sampleBugsPath, 'utf-8'));
    console.log(`📦 Found ${sampleData.length} sample bugs`);

    // Clear existing bugs (optional - comment out to preserve existing data)
    const existingCount = await Bug.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing bugs in database`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('Clear existing bugs? (yes/no): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() === 'yes') {
        await Bug.deleteMany({});
        console.log('🗑️  Cleared existing bugs');
      }
    }

    // Transform sample data to match schema (remove id field, let MongoDB generate _id)
    const bugsToInsert = sampleData.map(bug => {
      const { id, ...bugData } = bug;
      return bugData;
    });

    // Insert sample bugs
    console.log('💾 Inserting sample bugs...');
    const result = await Bug.insertMany(bugsToInsert);
    console.log(`✅ Successfully inserted ${result.length} bugs`);

    // Display summary
    const projects = await Bug.distinct('project');
    const tags = await Bug.distinct('tags');
    console.log(`
╔═══════════════════════════════════════════╗
║         Seed Complete!                    ║
╠═══════════════════════════════════════════╣
║  Total Bugs:      ${result.length}                      ║
║  Projects:        ${projects.length}                       ║
║  Unique Tags:     ${tags.length}                      ║
╚═══════════════════════════════════════════╝
    `);

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
