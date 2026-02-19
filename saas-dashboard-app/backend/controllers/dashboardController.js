const User = require('../models/User');
const Team = require('../models/Team');
const Talk = require('../models/Talk');
const Meeting = require('../models/Meeting');
const Shoutout = require('../models/Shoutout');

const getDashboard = async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.user.id).select('-password');

    // Get stats
    const teams = await Team.countDocuments({ userId: req.user.id });
    const talks = await Talk.countDocuments({ userId: req.user.id });
    const meetings = await Meeting.countDocuments({ userId: req.user.id });
    const users = await User.countDocuments();

    // Get team distribution
    const teamList = await Team.find({ userId: req.user.id });
    const teamDistribution = {
      labels: teamList.map(t => t.name),
      data: teamList.map(t => t.members),
      colors: teamList.map(t => t.color)
    };

    // Get upcoming talks
    const upcomingTalks = await Talk.find({ userId: req.user.id })
      .sort({ date: 1 })
      .limit(5);

    // Get upcoming meetings
    const upcomingMeetings = await Meeting.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get latest shoutouts
    const shoutouts = await Shoutout.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      stats: {
        teams,
        users,
        talks,
        meetings
      },
      teamDistribution,
      upcomingTalks,
      meetings: upcomingMeetings,
      shoutouts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboard };
