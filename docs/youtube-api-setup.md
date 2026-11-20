# Free uploads with your own YouTube API (replaces Zapier after 5 Dec 2026)

Sign in everywhere as **untoldstories844@gmail.com** (the account that owns the Untold Stories channel).

## Part A: Google Cloud project (about 15 minutes)
1. Open https://console.cloud.google.com → top bar project picker → **New Project** → name `Untold Stories Uploader` → Create.
2. Menu → **APIs & Services → Library** → search **YouTube Data API v3** → **Enable**.
3. **APIs & Services → OAuth consent screen** (Google Auth Platform):
   - User type **External**, app name `Untold Stories Uploader`, support email and developer email = untoldstories844@gmail.com.
   - Scopes: add `https://www.googleapis.com/auth/youtube` (it covers upload and changing privacy).
   - **Audience / Publishing status → Publish app → In production.** (Important: in "Testing" the login expires every 7 days.)
4. **Credentials → Create credentials → OAuth client ID** → type **Web application** →
   Authorized redirect URI: `https://developers.google.com/oauthplayground` → Create. Copy the **Client ID** and **Client secret**.

## Part B: One-time login → refresh token (about 3 minutes)
1. Open https://developers.google.com/oauthplayground
2. Gear icon (top right) → tick **Use your own OAuth credentials** → paste Client ID and Client secret.
3. Left box "Input your own scopes": `https://www.googleapis.com/auth/youtube` → **Authorize APIs**.
4. Choose untoldstories844@gmail.com, pick the **Untold Stories** channel, and click Allow. If Google warns "app isn't verified", click
   **Advanced → Go to Untold Stories Uploader (unsafe)**. It's your own app.
5. **Exchange authorization code for tokens** → copy the **Refresh token**.

## Part C: Let the cloud reach Google and Telegram
claude.ai → **Settings → Capabilities** → allowed domains → add:
`oauth2.googleapis.com`, `www.googleapis.com`, `api.telegram.org`

## Part D: Free YouTube audit (lets uploads go public)
Until Google audits a new API project, every upload through it is locked **private**. The audit is free.
Form: https://support.google.com/youtube/contact/yt_api_form → "YouTube API Services - Audit and Quota Extension Form".
Suggested answers:
- Organization/individual: individual creator, channel "Untold Stories" (@untoldstories-z8b).
- API client: internal tool, used only by the channel owner to upload the channel's own original animated Shorts
  (Hindi Indian-mythology stories) and set their privacy status. No other users and no data stored about anyone else.
- API services used: videos.insert, videos.update (status), channels.list (mine), playlistItems.list (own uploads).
- Expected quota: about 5,000 units/day (3 uploads + status updates).
- Privacy policy / terms: needed only if they ask: a simple public page saying the tool is private, used by the
  owner only, and stores no user data. (Ask Claude to publish one.)
Approval usually takes 1-4 weeks. Until then the Zapier connection keeps uploading.

## After approval
Tell Claude "API approved". The runs switch to `tools/yt_direct.py` (upload + publish + Telegram), Zapier is no longer needed,
and the GitHub repo can even be made private (no public file link is needed any more).
