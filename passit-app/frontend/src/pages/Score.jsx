import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Score.css';

const SUBJECT_LABELS = {
  english: 'English Language',
  maths:   'Mathematics',
};

function getMessage(score, name) {
  if (score >= 30) return `Excellent work, ${name}! Keep it up!`;
  if (score >= 20) return `Good effort, ${name}! Keep practicing!`;
  return `Keep going, ${name}! Practice makes perfect!`;
}

function TickIcon() {
  return (
    <svg className="breakdown-icon" width="20" height="20"
      viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      <path d="M8 12.5l2.5 2.5 5-5.5"
        stroke="#fff" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="breakdown-icon" width="20" height="20"
      viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#EF4444" />
      <path d="M9 9l6 6M15 9l-6 6"
        stroke="#fff" strokeWidth="2.2"
        strokeLinecap="round" />
    </svg>
  );
}

export default function Score() {
  const {
    studentName,
    score: scoreData,
    selectedSubject,
    selectedYear,
    setSelectedSubject,
    setSelectedYear,
    setAnswers,
    setScore,
    setYearModalOpen,
  } = useApp();
  const navigate = useNavigate();

  const scoreNum     = scoreData?.score    ?? 0;
  const total        = scoreData?.total    ?? 40;
  const breakdown    = scoreData?.breakdown ?? [];
  const subjectLabel = SUBJECT_LABELS[selectedSubject] ?? selectedSubject;

  function handleTryAnother() {
    setSelectedSubject('');
    setSelectedYear('');
    setAnswers({});
    setScore(null);
    navigate('/subjects');
  }

  function handleTryAgain() {
    setSelectedYear('');
    setAnswers({});
    setScore(null);
    setYearModalOpen(true);
  }

  if (!scoreData) {
    return (
      <div className="score-fallback">
        <p>No results to display.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="score-page">
      <div className="score-container">

        {/* Hero */}
        <div className="score-hero">
          <p className="score-message">
            {getMessage(scoreNum, studentName)}
          </p>

          <div className="score-circle">
            <span className="score-number">{scoreNum}/{total}</span>
          </div>

          <p className="score-meta">
            {subjectLabel}&nbsp;&middot;&nbsp;{selectedYear}
          </p>

          <button className="btn-review" onClick={() => navigate('/review')}>
            Review Answers
          </button>
        </div>

        {/* Breakdown */}
        <h2 className="breakdown-heading">Question Breakdown</h2>

        <div className="breakdown-list">
          {breakdown.map((item) => (
            <div
              key={item.id}
              className={`breakdown-item ${item.correct ? 'correct' : 'wrong'}`}
            >
              <span className="breakdown-qnum">Q{item.id}</span>

              {item.correct ? <TickIcon /> : <CrossIcon />}

              <span className={`breakdown-selected ${item.correct ? 'is-correct' : 'is-wrong'}`}>
                {item.selectedAnswer ?? '—'}
              </span>

              {!item.correct && (
                <>
                  <span className="breakdown-arrow">→</span>
                  <span className="breakdown-correct-answer">
                    {item.correctAnswer}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="score-actions">
          <button className="btn-primary" onClick={handleTryAnother}>
            Try Another Subject
          </button>
          <button className="btn-accent" onClick={handleTryAgain}>
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
}
