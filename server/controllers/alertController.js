import SecurityAlert from '../models/SecurityAlert.js';

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await SecurityAlert.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const markAlertAsRead = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAlertsAsRead = async (req, res, next) => {
  try {
    await SecurityAlert.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All security alerts marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await SecurityAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

