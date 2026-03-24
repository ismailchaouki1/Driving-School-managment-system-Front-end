import '../Styles/App.scss';
import '../Styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <div className="logo">
            <span className="logo-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="23"
                fill="none"
                overflow="visible"
              >
                <g>
                  <path
                    d="M 21.821 0.929 C 22.354 0.38 23.092 0.068 23.865 0.065 L 33.762 0.065 C 40.198 0.065 43.42 8.011 38.869 12.659 L 28.958 22.783 C 28.503 23.247 27.725 22.918 27.725 22.26 L 27.725 13.345 L 28.87 12.174 C 29.78 11.245 29.136 9.656 27.848 9.656 L 13.276 9.656 L 21.821 0.929 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                  <path
                    d="M 19.179 22.071 C 18.646 22.62 17.908 22.932 17.135 22.935 L 7.238 22.935 C 0.802 22.935 -2.42 14.988 2.131 10.341 L 12.042 0.217 C 12.497 -0.247 13.276 0.082 13.276 0.739 L 13.276 9.655 L 12.13 10.825 C 11.22 11.755 11.864 13.344 13.152 13.344 L 27.724 13.344 L 19.178 22.071 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                </g>
              </svg>{' '}
            </span>
            <span className="logo-text">Clario</span>
          </div>

          <p className="description">
            Your all-in-one driving school management system. Manage students, schedule lessons,
            track progress, and organize your operations – effortlessly.
          </p>

          <p className="credit">
            <span style={{ color: '#8cff2e' }}>❤︎ ⁠</span> Developed by <span>Chaouki Ismail</span>{' '}
            ©2026
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <div className="footer-column">
            <h4>Quick Menu</h4>
            <ul>
              <li>How it works</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>Blog</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Information</h4>
            <ul>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
