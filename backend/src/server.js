const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../config.json');
const storage = require('./storage');
const { signToken, authMiddleware } = require('./auth');
const scheduler = require('./scheduler');
const { validateJob } = require('./validation');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === config.admin.username && password === config.admin.password) {
    const token = signToken({ username });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Get job
app.get('/api/job', authMiddleware, (req, res) => {
  const job = storage.readJob();
  res.json(job);
});

// Create/update job
app.post('/api/job', authMiddleware, (req, res) => {
  const payload = req.body;
  const validation = validateJob(payload);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }
  const job = Object.assign({ id: 'job-1', enabled: true }, payload);
  storage.writeJob(job);
  scheduler.stopScheduler();
  scheduler.startScheduler();
  res.json(job);
});

// Delete job
app.delete('/api/job', authMiddleware, (req, res) => {
  storage.writeJob(null);
  scheduler.stopScheduler();
  res.json({ ok: true });
});

// Manual trigger
app.post('/api/job/trigger', authMiddleware, async (req, res) => {
  const job = storage.readJob();
  if (!job) return res.status(404).json({ error: 'No job' });
  // import _runOnce directly to avoid double scheduling
  const { _runOnce } = require('./scheduler');
  const result = await _runOnce(job);
  res.json(result);
});

// Status
app.get('/api/status', authMiddleware, (req, res) => {
  const job = storage.readJob();
  res.json({ job, running: false });
});

const port = config.port || process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`ClickScheduler backend listening on ${port}`);
  // start scheduler if job present
  scheduler.startScheduler();
});
