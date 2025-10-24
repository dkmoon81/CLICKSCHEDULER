const config = require('../config.json');

function validateUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateSelector(selector) {
  // Basic CSS selector validation - must be non-empty and not contain script tags
  if (!selector || typeof selector !== 'string') return false;
  if (selector.length === 0 || selector.length > 1000) return false;
  if (selector.includes('<script') || selector.includes('javascript:')) return false;
  return true;
}

function validateJob(job) {
  const errors = [];
  
  // Required fields
  if (!job) errors.push('Job payload required');
  else {
    if (!job.url) errors.push('url is required');
    else if (!validateUrl(job.url)) errors.push('url must be a valid http/https URL');

    if (!job.clickSelector) errors.push('clickSelector is required');
    else if (!validateSelector(job.clickSelector)) errors.push('clickSelector must be a valid CSS selector');

    if (!job.frequencySeconds) errors.push('frequencySeconds is required');
    else if (typeof job.frequencySeconds !== 'number' || 
             job.frequencySeconds < config.minFrequencySeconds || 
             job.frequencySeconds > 86400) {
      errors.push(`frequencySeconds must be a number between ${config.minFrequencySeconds} and 86400`);
    }

    // Optional credentials validation
    if (job.credentials) {
      if (typeof job.credentials !== 'object') errors.push('credentials must be an object');
      else {
        if (!job.credentials.username) errors.push('credentials.username is required when credentials provided');
        if (!job.credentials.password) errors.push('credentials.password is required when credentials provided');
      }
    }

    // Optional loginSelectors validation
    if (job.loginSelectors) {
      if (typeof job.loginSelectors !== 'object') errors.push('loginSelectors must be an object');
      else {
        ['username', 'password', 'submit'].forEach(field => {
          if (job.loginSelectors[field] && !validateSelector(job.loginSelectors[field])) {
            errors.push(`loginSelectors.${field} must be a valid CSS selector`);
          }
        });
      }
    }

    // Size limit check (prevent huge payloads)
    if (JSON.stringify(job).length > 5120) errors.push('Job payload too large (max 5KB)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateJob,
  validateUrl,
  validateSelector
};