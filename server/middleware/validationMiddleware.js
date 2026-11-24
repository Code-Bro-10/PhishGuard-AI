import validator from 'validator';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }

  if (name.trim().length > 50) {
    return res.status(400).json({ success: false, message: 'Name cannot exceed 50 characters.' });
  }

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  next();
};

export const validateUrlScan = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'A URL string is required to perform analysis.' });
  }

  if (url.length > 2048) {
    return res.status(400).json({ success: false, message: 'URL exceeds maximum allowable length of 2048 characters.' });
  }

  next();
};

export const validateEmailScan = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Please provide email content to analyze (minimum 5 characters).' });
  }

  if (content.length > 50000) {
    return res.status(400).json({ success: false, message: 'Email content exceeds maximum allowable length of 50,000 characters.' });
  }

  next();
};

