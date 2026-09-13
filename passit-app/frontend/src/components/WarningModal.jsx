import '../styles/WarningModal.css';

export default function WarningModal({ onStay, onLeave }) {
  return (
    <div className="warning-overlay">
      <div className="warning-modal">
        <h2 className="warning-title">Leave exam?</h2>
        <p className="warning-body">
          Are you sure you want to leave? Your current progress will not be saved.
        </p>
        <div className="warning-actions">
          <button className="warning-btn warning-btn--stay" onClick={onStay}>
            Stay
          </button>
          <button className="warning-btn warning-btn--leave" onClick={onLeave}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
