import { OidcSecure } from '@axa-fr/react-oidc';
import Header from './components/Header';
import Projects from './components/Projects';

const App = () => {
  return (
    <OidcSecure>
      <div className="App">
        <Header />
        <Projects />
      </div>
    </OidcSecure>
  );
}

export default App;
