import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/YearModal.css';

const SUBJECT_YEARS = {
  english:   [2024, 2022],
  maths:     [2024, 2023, 2022, 2021, 2020, 2019],
  computing: [2024],
  bdt:       [2019],
};

export default function YearModal() {
  const { yearModalOpen, setYearModalOpen, setSelectedYear, selectedSubject } = useApp();
  const navigate = useNavigate();

  if (!yearModalOpen) return null;

  const years = SUBJECT_YEARS[selectedSubject] ?? [2024, 2023, 2022, 2021, 2020, 2019];

  function handleSelect(year) {
    setSelectedYear(String(year));
    setYearModalOpen(false);
    navigate('/exam');
  }

  return (
    <div className="year-overlay" onClick={() => setYearModalOpen(false)}>
      <div className="year-modal" onClick={e => e.stopPropagation()}>
        <div className="year-modal-header">
          <h2 className="year-modal-title">Select a Year</h2>
          <button
            className="year-modal-close"
            onClick={() => setYearModalOpen(false)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <p className="year-modal-sub">Choose the BECE year you want to practise.</p>
        <div className="year-modal-grid">
          {years.map(year => (
            <button key={year} className="year-card" onClick={() => handleSelect(year)}>
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
