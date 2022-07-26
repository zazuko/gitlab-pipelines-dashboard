import React from 'react';
import ReactDOM from 'react-dom/client';
import { OidcProvider } from '@axa-fr/react-oidc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clientId, gitlabUrl, publicUrl } from './lib/env';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OidcProvider configuration={OIDCConfiguration}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </OidcProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
