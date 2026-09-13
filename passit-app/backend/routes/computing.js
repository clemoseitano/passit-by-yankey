const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const DATA_DIR     = path.join(__dirname, '../data');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

const YEAR_FILES = {
  '2024': 'computing_2024.json',
};

function getQuestions(year) {
  const file = YEAR_FILES[year] || 'computing_2024.json';
  const raw  = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
  return JSON.parse(raw);
}

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
  const questions = getQuestions(req.query.year);
  const sanitised = questions.map(({ answer, explanation, ...rest }) => rest);
  res.json(sanitised);
});

router.post('/submit', (req, res) => {
  const { answers, year, name } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  const questions = getQuestions(year);

  let score = 0;
  const breakdown = questions.map((q) => {
    const selected = answers[String(q.id)] || null;
    const correct  = selected === q.answer;
    if (correct) score++;
    return {
      id:             q.id,
      correct,
      correctAnswer:  q.answer,
      selectedAnswer: selected,
      explanation:    q.explanation,
    };
  });

  if (name) {
    saveResult({
      id:       Date.now().toString(),
      name,
      subject:  'Computing',
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
