import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Exam.css';
import '../styles/Review.css';

const SUBJECT_LABELS = {
  english: 'English Language',
  maths:   'Mathematics',
};

function renderText(text) {
  if (!text || !text.includes('_')) return text;
  return text.split(/(_[^_]+_)/g).map((part, i) =>
    part.startsWith('_') && part.endsWith('_') && part.length > 2
      ? <u key={i}>{part.slice(1, -1)}</u>
      : part
  );
}

function CheckIcon() {
  return (
    <svg className="option-indicator" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="option-indicator" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Review() {
  const { questions, score, selectedSubject, selectedYear } = useApp();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const breakdown = score?.breakdown ?? [];
  const total     = questions.length;

  const breakdownMap = useMemo(
    () => Object.fromEntries(breakdown.map(b => [String(b.id), b])),
    [breakdown]
  );

  const currentQuestion   = questions[currentIndex];
  const currentBreakdown  = currentQuestion ? breakdownMap[String(currentQuestion.id)] : null;
  const isFirst           = currentIndex === 0;
  const isLast            = currentIndex === total - 1;
  const progress          = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const preamble = useMemo(() => {
    if (!currentQuestion) return null;
    if ('preamble' in currentQuestion) return currentQuestion.preamble || null;
    for (let i = currentIndex; i >= 0; i--) {
      if (questions[i]?.passage) return currentIndex - i <= 7 ? questions[i].passage : null;
    }
    return null;
  }, [questions, currentIndex, currentQuestion]);

  const displayQuestion = useMemo(() => {
    if (!currentQuestion) return '';
    const text = currentQuestion.question;
    if (preamble && text.includes('\n\n')) return text.split('\n\n').pop();
    return text;
  }, [currentQuestion, preamble]);

  if (!score || !questions.length) {
    return (
      <div className="review-fallback">
        <p>No review data available.</p>
        <button onClick={() => navigate('/score')}>Back to Results</button>
      </div>
    );
  }

  return (
    <div className="review-page">

      {/* Fixed sub-header */}
      <div className="review-header">
        <span className="review-header-title">
          {SUBJECT_LABELS[selectedSubject] ?? selectedSubject}&nbsp;·&nbsp;{selectedYear}
        </span>
        <button className="review-back-btn" onClick={() => navigate('/score')}>
          ← Results
        </button>
      </div>

      <div className="review-container">

        {/* Progress */}
        <div className="exam-progress">
          <span className="progress-label">
            Question {currentIndex + 1} of {total}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="review-scroll">

          {currentQuestion.section && (
            <p className="question-section">{currentQuestion.section}</p>
          )}
          {currentQuestion.instruction && (
            <p className="question-instruction">{currentQuestion.instruction}</p>
          )}

          {preamble && (
            <div className="question-preamble">
              {preamble.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          <p className="question-text">{renderText(displayQuestion)}</p>

          {/* Options — display only, not interactive */}
          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([letter, text]) => {
              const isCorrect  = letter === currentBreakdown?.correctAnswer;
              const isSelected = letter === currentBreakdown?.selectedAnswer;
              const isWrong    = isSelected && !isCorrect;

              return (
                <div
                  key={letter}
                  className={`option-btn option-btn--review${isCorrect ? ' review-correct' : ''}${isWrong ? ' review-wrong' : ''}`}
                >
                  <span className="option-letter">{letter}</span>
                  <span className="option-text">{renderText(text)}</span>
                  {isCorrect && <CheckIcon />}
                  {isWrong && <CrossIcon />}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {currentBreakdown?.explanation && (
            <div className="review-explanation">
              <p className="review-explanation-label">Why?</p>
              <p className="review-explanation-text">{currentBreakdown.explanation}</p>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="exam-nav">
          <button
            className="nav-btn nav-btn--prev"
            onClick={() => setCurrentIndex(i => i - 1)}
            disabled={isFirst}
          >
            Previous
          </button>
          <button
            className="nav-btn nav-btn--next"
            onClick={() => setCurrentIndex(i => i + 1)}
            disabled={isLast}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
