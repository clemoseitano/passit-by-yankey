const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');

const RESULTS_FILE = path.join(__dirname, '../data/results.json');

function readResults() {
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

router.get('/', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.json([]);
  }

  const results = readResults();

  const filtered = results
    .filter(r => r.name.trim().toLowerCase() === name.trim().toLowerCase())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(filtered);
});

module.exports = router;
