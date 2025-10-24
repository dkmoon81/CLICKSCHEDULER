const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const DATA_DIR = path.join(__dirname, '..', 'data');
const JOB_FILE = path.join(DATA_DIR, 'job.json');

fse.ensureDirSync(DATA_DIR);

function readJob() {
  try {
    const raw = fs.readFileSync(JOB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function writeJob(job) {
  const tmp = JOB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(job, null, 2), 'utf8');
  fs.renameSync(tmp, JOB_FILE);
}

module.exports = { readJob, writeJob, JOB_FILE };
