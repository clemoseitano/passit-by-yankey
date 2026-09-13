import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios';
import '../styles/Progress.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Progress() {
  const { studentName, setBreakdown } = useApp();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    api
      .get('/api/results', { params: { name: studentName } })
      .then((res) => setResults(res.data))
      .catch(() => setResults([]));
  }, [studentName]);

  function handleReview(result) {
    setBreakdown(result.breakdown);
    navigate('/review');
  }

  if (results === null) {
    return (
      <div className="progress-loading">
        <p>Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="progress-container">
        <h1 className="progress-heading">Your Progress, {studentName}!</h1>

        {results.length === 0 ? (
          <div className="progress-empty">
            <p className="progress-empty-text">
              You have not completed any exams yet. Start practising!
            </p>
            <button className="progress-btn-primary" onClick={() => navigate('/subjects')}>
              Start Practising
            </button>
          </div>
        ) : (
          <ul className="progress-list">
            {results.map((result) => (
              <li key={result.id} className="progress-card">
                <div className="progress-card-left">
                  <span className="progress-subject">{result.subject}</span>
                  {result.year && (
                    <span className="progress-year">{result.year}</span>
                  )}
                  <span className="progress-date">{formatDate(result.date)}</span>
                </div>
                <div className="progress-card-right">
                  <span className="progress-score">
                    {result.score}
                    <span className="progress-score-total"> / {result.total}</span>
                  </span>
                  <button
                    className="progress-btn-review"
                    onClick={() => handleReview(result)}
                  >
                    Review Answers
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
