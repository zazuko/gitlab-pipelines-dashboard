import ZazukoLogo from './logo.svg'

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="container-left">
          <a
            href="https://zazuko.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={ZazukoLogo} alt="Zazuko" className="header-logo" />
          </a>
          <a href="/" className="header-link">
            Pipelines Dashboard
          </a>
        </div>
        <div className="container-right">
          Logged in as <strong>John Doe</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
