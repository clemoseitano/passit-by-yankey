import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios';
import '../styles/Exam.css';

const SUBJECT_LABELS = {
  english:   'English Language',
  maths:     'Mathematics',
  computing: 'Computing',
  bdt:       'Basic Design & Technology',
};

const SUBJECT_API = {
  english:   { get: (year) => `/api/english/questions?year=${year}`, post: '/api/english/submit' },
  maths:     { get: ()     => '/api/maths/questions',                post: '/api/maths/submit'   },
  computing: { get: (year) => `/api/computing/questions?year=${year}`, post: '/api/computing/submit' },
  bdt:       { get: (year) => `/api/bdt/questions?year=${year}`,       post: '/api/bdt/submit'       },
};

function renderText(text) {
  if (!text || !text.includes('_')) return text;
  return text.split(/(_[^_]+_)/g).map((part, i) =>
    part.startsWith('_') && part.endsWith('_') && part.length > 2
      ? <u key={i}>{part.slice(1, -1)}</u>
      : part
  );
}

export default function Exam() {
  const { selectedSubject, selectedYear, studentName, setScore, setQuestions: setContextQuestions } = useApp();
  const navigate = useNavigate();

  const [questions, setQuestions]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({});
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => {
    const { get } = SUBJECT_API[selectedSubject] ?? SUBJECT_API.english;
    const endpoint = get(selectedYear);
    api.get(endpoint)
      .then(res => { setContextQuestions(res.data); setQuestions(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load questions. Please check the server.'); setLoading(false); });
  }, []);

  const total           = questions.length;
  const currentQuestion = questions[currentIndex];
  const isFirst         = currentIndex === 0;
  const isLast          = currentIndex === total - 1;
  const progress        = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const selectedOption  = answers[String(currentQuestion?.id)] || null;

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

  function handleOptionSelect(letter) {
    setAnswers(prev => ({ ...prev, [String(currentQuestion.id)]: letter }));
  }

  function handlePrev() {
    if (!isFirst) setCurrentIndex(i => i - 1);
  }

  function handleNext() {
    if (isLast) { handleSubmit(); return; }
    setCurrentIndex(i => i + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const { post: endpoint } = SUBJECT_API[selectedSubject] ?? SUBJECT_API.english;
    try {
      const res = await api.post(endpoint, { year: selectedYear, answers, name: studentName });
      setScore(res.data);
      navigate('/score');
    } catch {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="exam-loading">
        <p>Loading questions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-loading">
        <p className="exam-error">{error}</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="exam-page">

      {/* Fixed sub-header: subject + year */}
      <div className="exam-header">
        <span className="exam-header-subject">
          {SUBJECT_LABELS[selectedSubject] ?? selectedSubject}
        </span>
        <span className="exam-header-year">{selectedYear}</span>
      </div>

      <div className="exam-container">

        {/* Progress */}
        <div className="exam-progress">
          <span className="progress-label">
            Question {currentIndex + 1} of {total}
          </span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Scrollable question body */}
        <div className="exam-scroll">

          {currentQuestion.section && (
            <p className="question-section">{currentQuestion.section}</p>
          )}
          {currentQuestion.instruction && (
            <p className="question-instruction">{currentQuestion.instruction}</p>
          )}

          {preamble && (
            <div className="preamble-box">
              <p className="preamble-box-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                    stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
                Passage — scroll to read
              </p>
              <div className="question-preamble">
                {preamble.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.image && (
            <div className="question-image-box">
              <img
                src={`http://localhost:5001/images/${currentQuestion.image}`}
                alt="Question diagram"
                className="question-image"
              />
              <p className="question-image-caption">Figure — refer to diagram above</p>
            </div>
          )}

          <p className="question-text">{renderText(displayQuestion)}</p>

          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([letter, text]) => (
              <button
                key={letter}
                className={`option-btn${selectedOption === letter ? ' selected' : ''}`}
                onClick={() => handleOptionSelect(letter)}
              >
                <span className="option-letter">{letter}</span>
                <span className="option-text">{renderText(text)}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Navigation — always pinned at bottom */}
        <div className="exam-nav">
          <button
            className="nav-btn nav-btn--prev"
            onClick={handlePrev}
            disabled={isFirst}
          >
            Previous
          </button>
          <button
            className="nav-btn nav-btn--next"
            onClick={handleNext}
            disabled={!selectedOption || submitting}
          >
            {isLast ? (submitting ? 'Submitting…' : 'Submit') : 'Next'}
          </button>
        </div>

      </div>
    </div>
  );
}
