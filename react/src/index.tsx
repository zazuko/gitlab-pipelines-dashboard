import React from 'react';
import ReactDOM from 'react-dom/client';
import env from '@ludovicm67/react-dotenv';
import { OidcProvider } from '@axa-fr/react-oidc';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// fetch values from config
const publicUrl = env.PUBLIC_URL;
const gitlabUrl = env.GITLAB;
const clientId = env.OIDC_CLIENT_ID;

const OIDCConfiguration = {
  client_id: clientId || '',
  redirect_uri: `${publicUrl}/oidc/callback`,
  scope: 'openid profile email read_api read_user api',
  authority: gitlabUrl || 'https://gitlab.com',
  authority_configuration: {
    authorization_endpoint: `${gitlabUrl}/oauth/authorize`,
    token_endpoint: `${gitlabUrl}/oauth/token`,
    userinfo_endpoint: `${gitlabUrl}/oauth/userinfo`,
    revocation_endpoint: `${gitlabUrl}/oauth/revoke`
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OidcProvider configuration={OIDCConfiguration}>
      <App />
    </OidcProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
