import { Link } from 'react-router-dom';
import '../Styles/ReadyToStartCard.scss';

export default function ReadyToStartCard() {
  return (
    <div className="ready-to-start">
      <div className="ready-to-start-card">
        <div className="ready-to-start-content">
          <h1>Ready to manage your School smarter?</h1>
          <p>Take the wheel of your driving school — set up in 2 minutes.</p>
          <Link to={'/signup'} className="ready-to-start-button  rounded-pill text-decoration-none">
            Begin now{' '}
            <span className="arrow-box">
              {/* FIRST ARROW */}
              <svg
                className="arrow first"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>

              {/* SECOND ARROW */}
              <svg
                className="arrow second"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H8M17 7V16" />
              </svg>
            </span>
          </Link>
        </div>
        <div className="ready-to-start-image"></div>
      </div>
    </div>
  );
}
