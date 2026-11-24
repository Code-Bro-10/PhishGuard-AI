import mongoose from 'mongoose';
import Scan from '../models/Scan.js';
import SecurityAlert from '../models/SecurityAlert.js';

/**
 * @desc    Get dashboard high-level statistics from real DB data
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalScans,
      totalUrlsScanned,
      safeUrls,
      suspiciousUrls,
      highRiskUrls,
      totalEmailsAnalyzed,
      scoreAgg,
      unreadAlertsCount,
    ] = await Promise.all([
      Scan.countDocuments({ userId }),
      Scan.countDocuments({ userId, scanType: 'url' }),
      Scan.countDocuments({ userId, scanType: 'url', riskLevel: 'low' }),
      Scan.countDocuments({ userId, scanType: 'url', riskLevel: 'medium' }),
      Scan.countDocuments({ userId, scanType: 'url', riskLevel: { $in: ['high', 'critical'] } }),
      Scan.countDocuments({ userId, scanType: 'email' }),
      Scan.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, avgScore: { $avg: '$riskScore' } } },
      ]),
      SecurityAlert.countDocuments({ userId, isRead: false }),
    ]);

    const averageRiskScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalScans,
        totalUrlsScanned,
        safeUrls,
        suspiciousUrls,
        highRiskUrls,
        totalEmailsAnalyzed,
        averageRiskScore,
        unreadAlertsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get weekly scanning activity and recent scans
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
export const getDashboardActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch recent 5 scans
    const recentScans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Fetch recent 5 alerts
    const recentAlerts = await SecurityAlert.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Calculate daily activity for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyAgg = await Scan.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
          urls: {
            $sum: { $cond: [{ $eq: ['$scanType', 'url'] }, 1, 0] },
          },
          emails: {
            $sum: { $cond: [{ $eq: ['$scanType', 'email'] }, 1, 0] },
          },
          highRisk: {
            $sum: {
              $cond: [{ $in: ['$riskLevel', ['high', 'critical']] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build complete 7-day array even if some days have 0 scans
    const dayMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      dayMap.set(dateKey, {
        date: dateKey,
        day: dayLabel,
        total: 0,
        urls: 0,
        emails: 0,
        highRisk: 0,
      });
    }

    dailyAgg.forEach(item => {
      if (dayMap.has(item._id)) {
        const existing = dayMap.get(item._id);
        existing.total = item.total;
        existing.urls = item.urls;
        existing.emails = item.emails;
        existing.highRisk = item.highRisk;
      }
    });

    const weeklyTrend = Array.from(dayMap.values());

    res.status(200).json({
      success: true,
      data: {
        recentScans,
        recentAlerts,
        weeklyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get threat level distribution and category breakdown
 * @route   GET /api/dashboard/threat-distribution
 * @access  Private
 */
export const getThreatDistribution = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Distribution by risk level
    const levelAgg = await Scan.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    ]);

    const levels = { low: 0, medium: 0, high: 0, critical: 0 };
    levelAgg.forEach(item => {
      if (item._id && levels.hasOwnProperty(item._id)) {
        levels[item._id] = item.count;
      }
    });

    const levelData = [
      { name: 'Low Risk', value: levels.low, color: '#22C55E' },
      { name: 'Medium Risk', value: levels.medium, color: '#F59E0B' },
      { name: 'High Risk', value: levels.high, color: '#EF4444' },
      { name: 'Critical Risk', value: levels.critical, color: '#DC2626' },
    ];

    // Distribution by scan type
    const typeAgg = await Scan.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$scanType', count: { $sum: 1 } } },
    ]);

    const typeData = [
      { name: 'URLs', value: 0, fill: '#00D4FF' },
      { name: 'Emails', value: 0, fill: '#7C3AED' },
    ];
    typeAgg.forEach(item => {
      if (item._id === 'url') typeData[0].value = item.count;
      if (item._id === 'email') typeData[1].value = item.count;
    });

    // Breakdown of top threat categories from detectedIndicators
    const indicatorAgg = await Scan.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$detectedIndicators' },
      {
        $group: {
          _id: '$detectedIndicators.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const topCategories = indicatorAgg.map(cat => ({
      category: cat._id,
      count: cat.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        byRiskLevel: levelData,
        byScanType: typeData,
        topCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

