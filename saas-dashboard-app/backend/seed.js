require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const User = require('./models/User');
const Team = require('./models/Team');
const Talk = require('./models/Talk');
const Meeting = require('./models/Meeting');
const Shoutout = require('./models/Shoutout');

const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...\n');

    // Connect to DB
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Talk.deleteMany({});
    await Meeting.deleteMany({});
    await Shoutout.deleteMany({});

    // Create user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
      avatar: 'https://i.pravatar.cc/150?img=5'
    });

    console.log('✅ User created');

    // Create teams
    const teams = await Team.insertMany([
      { name: 'Design', members: 12, color: '#6c63ff', userId: user._id },
      { name: 'Engineering', members: 28, color: '#ff6b6b', userId: user._id },
      { name: 'Marketing', members: 8, color: '#ffd93d', userId: user._id },
      { name: 'Sales', members: 15, color: '#6bcf7f', userId: user._id },
      { name: 'HR', members: 5, color: '#ff9ff3', userId: user._id }
    ]);

    console.log('✅ Teams created');

    // Create talks
    const talks = await Talk.insertMany([
      {
        title: 'React Performance Optimization',
        speaker: 'Sarah Chen',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        topic: 'Technology',
        userId: user._id
      },
      {
        title: 'Design System Best Practices',
        speaker: 'Mike Rodriguez',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        topic: 'Design',
        userId: user._id
      },
      {
        title: 'Team Building Workshop',
        speaker: 'Emma Wilson',
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        topic: 'Culture',
        userId: user._id
      }
    ]);

    console.log('✅ Talks created');

    // Create meetings
    const meetings = await Meeting.insertMany([
      {
        title: 'Q1 Planning Session',
        organizer: 'John Smith',
        time: 'Monday 10:00 AM',
        duration: 120,
        attendees: 24,
        userId: user._id
      },
      {
        title: 'Design Review - Dashboard',
        organizer: 'Lisa Park',
        time: 'Tuesday 2:00 PM',
        duration: 60,
        attendees: 8,
        userId: user._id
      },
      {
        title: 'Sprint Retrospective',
        organizer: 'David Lee',
        time: 'Wednesday 3:30 PM',
        duration: 45,
        attendees: 12,
        userId: user._id
      },
      {
        title: 'Client Presentation',
        organizer: 'Rachel White',
        time: 'Thursday 11:00 AM',
        duration: 90,
        attendees: 15,
        userId: user._id
      }
    ]);

    console.log('✅ Meetings created');

    // Create shoutouts
    const shoutouts = await Shoutout.insertMany([
      {
        message: 'Great work on the new dashboard design!',
        author: 'Sarah Chen',
        emoji: '🎉',
        userId: user._id
      },
      {
        message: 'Thanks for helping with the API integration',
        author: 'Mike Rodriguez',
        emoji: '🙏',
        userId: user._id
      },
      {
        message: 'Amazing presentation yesterday!',
        author: 'Emma Wilson',
        emoji: '👏',
        userId: user._id
      },
      {
        message: 'Love the new color scheme!',
        author: 'John Smith',
        emoji: '❤️',
        userId: user._id
      },
      {
        message: 'Partnership with new client is official!',
        author: 'Lisa Park',
        emoji: '🚀',
        userId: user._id
      }
    ]);

    console.log('✅ Shoutouts created');

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📌 Test Credentials:');
    console.log('   Email: alex@example.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
