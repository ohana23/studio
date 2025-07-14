# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## eBay Listings

The app fetches live eBay listings using the Browse API. You can target the
sandbox or production environment.

1. Copy the provided example file and edit the values:

   ```bash
   cp .env.example .env.local
   # open .env.local and replace the placeholders
   ```

2. Set `EBAY_ENV` to either `sandbox` or `production`.
   - When using the sandbox, provide `EBAY_SANDBOX_OAUTH_TOKEN`.
   - When using production, provide `EBAY_OAUTH_TOKEN`.

Alternatively, export the variables in your shell before starting the
development server.
