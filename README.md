# Pipelines dashboard

> Get an overview of the state of the pipelines of a GitLab instance

## Quick start

### Create GitLab application

You will need to create a GitLab application.

For that, go to your GitLab instance, then on Settings > Applications.

Give a name, for example `Pipelines dashboard`.
The redirection URL should be set to `http://localhost:8080/oidc/callback` if you want to run it locally (for developement) or to `https://YOUR-PUBLIC-URL/oidc/callback` (for production).

Make sure that `Confidential` is unchecked.

You will need the following scopes:

- `api`
- `read_user`
- `read_api`
- `openid`
- `profile`
- `email`

You will get a client ID.

### Create the `.env` file

Copy the `.env.example` file into `.env`.

```sh
cp .env.example .env
```

And update the values with you information:

- `GITLAB`: the public URL of your GitLab instance (for example: https://gitlab.com)
- `OIDC_CLIENT_ID`: the client ID you got from the previous step
- `SELECTED_TAGS`: tags to be selected by default (for example: `monitoring`)
- `SENTRY_DSN`: the Sentry Data Source Name (if you want to use Sentry)

### Start the project

```sh
# install dependencies
npm install

# start locally
npm run start
```

And open http://localhost:8080/ .
