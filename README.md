# Reddit-izer

Reddit-izer is a portfolio prototype for exploring account activity through an analytics dashboard. It demonstrates activity summaries, community participation, nested conversations, and evidence-linked observations using deterministic, synthetic records.

> **Synthetic data only:** Reddit-izer does not scrape Reddit, connect to Reddit APIs, or access Reddit accounts. Usernames and all displayed account records are generated locally for demonstration; they do not describe real Reddit activity.

## Features

- Username search with stable synthetic results for each entered username.
- Account overview metrics, an activity timeline, and post/comment distribution.
- Community participation, engagement comparisons, and topic distribution.
- Searchable, filterable, sortable activity explorer with pagination.
- Expandable synthetic post, comment, and reply threads.
- Descriptive insights with links to their supporting synthetic record IDs.
- Filter-aware JSON and CSV exports plus a print-friendly report.
- Persistent light and dark themes, responsive layouts, and loading, error, and empty states.

## Technology stack

- Next.js 15 App Router and React 19
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

## Screenshots

Screenshots are not included in this source snapshot. Run the app locally using the instructions below to capture the home page and profile dashboard for a project gallery.

## Installation

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create and serve an optimized production build with:

```bash
npm run build
npm run start
```

## Architecture

- `app/` contains the App Router pages, metadata, and global design tokens/styles.
- `components/` contains the dashboard, reusable theme controls, and theme provider.
- `lib/types.ts` defines the profile, activity, conversation, insight, and `RedditDataProvider` types.
- `lib/mock-provider.ts` implements `MockRedditProvider`, which creates deterministic, username-specific synthetic data using a stable hash and fixed demo time.
- `package-lock.json` locks the installed dependency tree for repeatable npm installs.

To integrate another data provider in the future, implement `RedditDataProvider` and replace the `redditDataProvider` dependency. Any Reddit data integration must use an authorized source and clearly state its coverage and limitations. This project currently has no live provider or backend.

## Synthetic data and privacy

All usernames, posts, comments, scores, community labels, and insights shown by the app are synthetic. The entered username is used as a seed for deterministic demo results and is not sent to a backend. The app has no account connection, authentication, server-side storage, or API credentials. JSON and CSV downloads identify their contents as synthetic demonstration data.

## Current limitations

- The curated mock dataset demonstrates dashboard behavior; it is not representative of Reddit as a whole.
- Profile and activity details are generated from local templates and a username seed, not verified against real accounts.
- There is no live data provider, backend service, account system, or persistent user data.
- Screenshots and automated test suites are not included in this source snapshot.
