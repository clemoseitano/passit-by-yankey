const express   = require('express');
const router    = express.Router();
const path      = require('path');
const fs        = require('fs');

const RESULTS_FILE = path.join(__dirname, '../data/results.json');
const questions    = require('../data/maths.json');

function readResults() {
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveResult(result) {
  const results = readResults();
  results.push(result);
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

router.get('/questions', (req, res) => {
  const sanitised = questions.map(({ answer, ...rest }) => rest);
  res.json(sanitised);
});

router.post('/submit', (req, res) => {
  const { answers, year, name } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  let score = 0;
  const breakdown = questions.map((q) => {
    const selected = answers[String(q.id)] || null;
    const correct  = selected === q.answer;
    if (correct) score++;
    return {
      id: q.id,
      correct,
      correctAnswer: q.answer,
      selectedAnswer: selected,
      explanation: q.explanation,
    };
  });

  if (name) {
    saveResult({
      id:       Date.now().toString(),
      name,
      subject:  'Mathematics',
      year:     year || '',
      score,
      total:    questions.length,
      date:     new Date().toISOString(),
      breakdown,
    });
  }

  res.json({ score, total: questions.length, breakdown });
});

module.exports = router;
