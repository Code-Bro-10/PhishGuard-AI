import Scan from '../models/Scan.js';
import SecurityAlert from '../models/SecurityAlert.js';
import { analyzeUrl } from '../services/urlDetector.js';
import { analyzeEmail } from '../services/emailDetector.js';
import { threatIntelService } from '../services/threatIntelService.js';

/**
 * @desc    Analyze a URL and save scan record
 * @route   POST /api/scan/url
 * @access  Private
 */
export const scanUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    const userId = req.user._id;

    // Run safe heuristic detection engine
    const analysis = analyzeUrl(url);

    // Optional Threat Intelligence query (non-blocking for safe external verification)
    const threatIntel = await threatIntelService.checkUrl(analysis.normalizedUrl);
    analysis.analysisDetails.threatIntel = threatIntel;

    // If external threat intel found high-confidence match, integrate into score/indicators
    if (threatIntel.executed && threatIntel.isThreat) {
      analysis.riskScore = Math.min(100, analysis.riskScore + 30);
      analysis.riskLevel = 'critical';
      analysis.detectedIndicators.unshift({
        id: 'external-threat-intel-positive',
        category: 'Threat Intelligence',
        severity: 'critical',
        title: 'Active Threat Confirmed by External Reputation Service',
        description: `External threat intel flagged this domain: ${threatIntel.threatTypes.join(', ')}`,
        explanation: threatIntel.details,
        scoreImpact: 30,
      });
    }

    // Persist scan record to database
    const scanRecord = await Scan.create({
      userId,
      scanType: 'url',
      originalInput: analysis.originalUrl,
      normalizedInput: analysis.normalizedUrl,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      detectedIndicators: analysis.detectedIndicators,
      recommendations: analysis.recommendations,
      analysisDetails: analysis.analysisDetails,
    });

    // Create a SecurityAlert if risk is high or critical
    if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
      await SecurityAlert.create({
        userId,
        scanId: scanRecord._id,
        title: `${analysis.riskLevel.toUpperCase()} RISK URL Detected`,
        description: `URL scan of "${analysis.normalizedUrl.substring(0, 60)}" triggered ${analysis.detectedIndicators.length} threat indicators with risk score ${analysis.riskScore}/100.`,
        severity: analysis.riskLevel,
      });
    }

    res.status(201).json({
      success: true,
      data: scanRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze email text content and save scan record
 * @route   POST /api/scan/email
 * @access  Private
 */
export const scanEmail = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    // Run heuristic email analyzer
    const analysis = analyzeEmail(content);

    // Persist scan record to database
    const scanRecord = await Scan.create({
      userId,
      scanType: 'email',
      originalInput: content,
      normalizedInput: analysis.emailSnippet,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      detectedIndicators: analysis.detectedIndicators,
      recommendations: analysis.recommendations,
      analysisDetails: {
        ...analysis.analysisDetails,
        disclaimer: analysis.disclaimer,
      },
    });

    // Create a SecurityAlert if risk is high or critical
    if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
      await SecurityAlert.create({
        userId,
        scanId: scanRecord._id,
        title: `${analysis.riskLevel.toUpperCase()} RISK Phishing Email Detected`,
        description: `Email analysis triggered ${analysis.detectedIndicators.length} threat indicators with risk score ${analysis.riskScore}/100.`,
        severity: analysis.riskLevel,
      });
    }

    res.status(201).json({
      success: true,
      data: scanRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's scan history with search, filters, pagination
 * @route   GET /api/scan/history
 * @access  Private
 */
export const getScanHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      search = '',
      type,
      riskLevel,
      sortBy = 'newest',
    } = req.query;

    const query = { userId };

    if (type && type !== 'all') {
      query.scanType = type;
    }

    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { originalInput: searchRegex },
        { normalizedInput: searchRegex },
      ];
    }

    const sortOption = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [scans, totalCount] = await Promise.all([
      Scan.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Scan.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: scans,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single scan details
 * @route   GET /api/scan/:id
 * @access  Private
 */
export const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({
      _id: req.params.id,
      userId: req.user._id, // User data isolation
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found or access unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      data: scan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete single scan record
 * @route   DELETE /api/scan/:id
 * @access  Private
 */
export const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id, // User data isolation
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found or access unauthorized.',
      });
    }

    // Also delete any associated alerts
    await SecurityAlert.deleteMany({ scanId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

