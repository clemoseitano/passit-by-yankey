import { useApp } from '../context/AppContext';
import '../styles/Subjects.css';

/* ── Subject icons ──────────────────────────────── */
function BookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8"  cy="11" r="1" fill="currentColor"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <circle cx="16" cy="11" r="1" fill="currentColor"/>
      <circle cx="8"  cy="15" r="1" fill="currentColor"/>
      <circle cx="12" cy="15" r="1" fill="currentColor"/>
      <circle cx="16" cy="15" r="1" fill="currentColor"/>
      <circle cx="8"  cy="19" r="1" fill="currentColor"/>
      <circle cx="12" cy="19" r="1" fill="currentColor"/>
      <circle cx="16" cy="19" r="1" fill="currentColor"/>
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M9 3h6M10 3v6L5.5 15.5A4 4 0 0 0 9 22h6a4 4 0 0 0 3.5-6.5L14 9V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 17h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function PencilRulerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Subject data ───────────────────────────────── */
const SUBJECTS = [
  {
    id: 'english',
    name: 'English Language',
    active: true,
    questions: 40,
    Icon: BookIcon,
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
  },
  {
    id: 'maths',
    name: 'Mathematics',
    active: true,
    questions: 40,
    Icon: CalcIcon,
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
  },
  {
    id: 'science',
    name: 'Science',
    active: false,
    Icon: FlaskIcon,
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
  },
  {
    id: 'social',
    name: 'Social Studies',
    active: false,
    Icon: GlobeIcon,
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    id: 'computing',
    name: 'Computing',
    active: true,
    questions: 40,
    Icon: MonitorIcon,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
  },
  {
    id: 'bdt',
    name: 'Basic Design & Technology',
    active: true,
    questions: 40,
    Icon: PencilRulerIcon,
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
  },
];

/* ── Component ──────────────────────────────────── */
export default function Subjects() {
  const {
    studentName,
    setSelectedSubject, setSelectedYear,
    setAnswers, setScore,
    setYearModalOpen,
  } = useApp();

  function handleSelect(subject) {
    setSelectedSubject(subject.id);
    setSelectedYear('');
    setAnswers({});
    setScore(null);
    setYearModalOpen(true);
  }

  return (
    <div className="subjects-page">
      <div className="subjects-container">

        <div className="subjects-header">
          <h1 className="subjects-heading">
            Hello, {studentName || 'there'}!<br />
            <span className="subjects-heading-pick">Choose a subject to begin</span>
          </h1>
          <p className="subjects-sub">
            Select a subject below to practice past BECE questions
          </p>
        </div>

        <div className="subjects-grid">
          {SUBJECTS.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${subject.active ? 'active' : 'locked'}`}
              onClick={() => subject.active && handleSelect(subject)}
              role={subject.active ? 'button' : undefined}
              tabIndex={subject.active ? 0 : undefined}
              aria-disabled={!subject.active}
              onKeyDown={(e) =>
                subject.active && e.key === 'Enter' && handleSelect(subject)
              }
            >
              {!subject.active && (
                <span className="subject-lock-badge">
                  <LockIcon />
                </span>
              )}

              <div
                className="subject-icon-wrap"
                style={{
                  background: subject.active ? subject.iconBg : '#F3F4F6',
                  color: subject.active ? subject.iconColor : '#9CA3AF',
                }}
              >
                <subject.Icon />
              </div>

              <span className="subject-name">{subject.name}</span>

              <span className={`subject-meta ${subject.active ? 'subject-meta--active' : ''}`}>
                {subject.active ? `${subject.questions} questions available` : 'Coming soon'}
              </span>
            </div>
          ))}
        </div>

        <div className="encouragement-banner">
          <span className="encouragement-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
                fill="currentColor" />
            </svg>
          </span>
          <p className="encouragement-text">
            "Consistent practice is the secret to BECE success. You've got this!"
          </p>
        </div>

      </div>
    </div>
  );
}
