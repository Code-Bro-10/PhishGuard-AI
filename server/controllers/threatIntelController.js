import { threatIntelService } from '../services/threatIntelService.js';
import { normalizeUrl } from '../services/urlDetector.js';

export const getThreatIntelStatus = (req, res) => {
  const status = threatIntelService.getStatus();
  res.status(200).json({
    success: true,
    data: status,
  });
};

export const lookupThreatIntel = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A target URL is required for threat intelligence lookup.',
      });
    }

    const normalized = normalizeUrl(url);
    const result = await threatIntelService.checkUrl(normalized);

    res.status(200).json({
      success: true,
      data: {
        queriedUrl: normalized,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

