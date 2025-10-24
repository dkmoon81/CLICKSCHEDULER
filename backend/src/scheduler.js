const storage = require('./storage');
const worker = require('./worker');
const config = require('../config.json');

let interval = null;
let running = false;

async function _runOnce(job) {
  if (!job) return;
  if (running) return { skipped: true };
  running = true;
  const result = await worker.runClickJob(job);
  const now = new Date().toISOString();
  const updated = Object.assign({}, job, { lastRunAt: now, lastRunResult: result });
  storage.writeJob(updated);
  running = false;
  return result;
}

function startScheduler() {
  const job = storage.readJob();
  if (!job || !job.enabled) return;
  const freq = Math.max(job.frequencySeconds || config.minFrequencySeconds, config.minFrequencySeconds);
  if (interval) clearInterval(interval);
  interval = setInterval(async () => {
    const j = storage.readJob();
    await _runOnce(j);
  }, freq * 1000);
}

function stopScheduler() {
  if (interval) clearInterval(interval);
  interval = null;
}

module.exports = { startScheduler, stopScheduler, _runOnce };
