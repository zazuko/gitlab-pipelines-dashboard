import { OidcSecure } from '@axa-fr/react-oidc';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (
    <OidcSecure>
      <div className="App">
        <Header />
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </OidcSecure>
  );
}

export default App;
