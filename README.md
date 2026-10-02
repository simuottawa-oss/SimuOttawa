# SimuOttawa website

The SimuOttawa club website, including a public technical-document library and restricted senior-member uploads.

## Development

```bash
npm install
npm run dev
```

Run `npm run build` and `npm run lint` before publishing.

## Senior-member document access

Document viewing is public. Uploading requires Google sign-in with an email address explicitly listed in `SENIOR_MEMBER_EMAILS`. Addresses can be Gmail accounts or other verified Google accounts; no `@uottawa.ca` address is required. Authorization is checked by the upload API, not only by the page UI.

Create a Google OAuth client with application type **Web application** and add this authorized redirect URI:

```text
https://simuottawa.bendela035.chatgpt.site/api/auth/callback
```

Configure the OAuth consent screen for external users. The app only requests the basic `openid`, `email`, and `profile` identity scopes. While testing, add the Google accounts that need access as test users; before general use, publish the consent screen and complete any Google branding verification it requires. The exact email allowlist below—not simply the ability to sign into Google—is what grants document-upload access.

Add the following variables to the hosting environment settings for production:

```text
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
AUTH_SECRET=<random value of at least 32 characters>
SENIOR_MEMBER_EMAILS=senior1@gmail.com,senior2@gmail.com
```

`SENIOR_MEMBER_EMAILS` accepts comma-, semicolon-, or newline-separated addresses and ignores letter case. Enter the exact Google account email each approved senior will use, and update this setting whenever the senior team changes; no source-code edit is necessary.

For local development, copy `.dev.vars.example` to `.dev.vars`, fill in the Google credentials and a random `AUTH_SECRET`, and add your local callback URL (usually `http://localhost:5173/api/auth/callback`) to the Google OAuth client. `.dev.vars` is ignored by Git. Never commit real credentials. Production values must be added in the hosting provider's runtime environment settings; a local file does not configure the deployed site.
