import { useOidcIdToken, useOidcUser, OidcUserStatus } from '@axa-fr/react-oidc';
import ZazukoLogo from './logo.svg'

const Header = () => {
  const { idToken } = useOidcIdToken();
  const { oidcUser, oidcUserLoadingState } = useOidcUser();

  let content = <>You are not logged in</>

  if (idToken) {
    switch (oidcUserLoadingState) {
      case OidcUserStatus.Loading:
        content = <>Loading…</>
        break;
      case OidcUserStatus.Unauthenticated:
        content = <>You are not logged in</>
        break;
      case OidcUserStatus.Loaded:
        content = <>Logged in as <strong>{oidcUser?.name || 'User'}</strong></>
        break;
      default:
        content = <>Error 🙁</>
        break;
    }
  }

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
          {content}
        </div>
      </div>
    </header>
  );
};

export default Header;
