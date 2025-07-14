# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## eBay Listings

The app can fetch live eBay listings for each product using the eBay sandbox.
To enable this feature you need to provide your sandbox application ID.

1. Copy the provided example file and edit the value:

   ```bash
   cp .env.example .env.local
   # open .env.local and replace the placeholder
   ```

2. Alternatively, export the variable in your shell before starting the
   development server.

With `EBAY_SANDBOX_APP_ID` defined in `.env.local` (or your environment)
`process.env.EBAY_SANDBOX_APP_ID` will resolve correctly.
