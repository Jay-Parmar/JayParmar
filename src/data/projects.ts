import type { LineId } from './lines';

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  lines: LineId[];
  stack: string[];
  facts: string[];
  where?: string;
  code?: string;
  featured?: boolean;
  page?: { what: string[]; how: string[] };
}

export const projects: Project[] = [
  {
    slug: 'hirejutsu',
    name: 'hirejutsu',
    tagline: 'Finds the best job openings for your resume every morning, so you can apply to them yourself.',
    year: '2026',
    lines: ['backend', 'data'],
    stack: ['Python', 'SQLite', 'pytest', 'Playwright'],
    facts: ['629 company career pages', '15 applicant tracking systems', '2,000+ tests'],
    code: 'https://github.com/Jay-Parmar/hirejutsu',
    featured: true,
    page: {
      what: [
        'Reads jobs from 629 company career pages on Greenhouse, Lever, Ashby, Workday and 11 more applicant tracking systems, plus 9 remote job boards and Hacker News.',
        'Scores each job against your resume and shows the 10 best each morning, with the reason for every pick.',
        "Skips reposted, evergreen and taken down postings, and jobs you can't get, like ones that need a work permit you don't have.",
        'Fills Workday, Greenhouse, Lever and Ashby application forms in a browser window you control. You check them and submit.',
        'Tracks applications, follow-ups and referrals, and writes an interview prep pack when an application turns into an interview.',
      ],
      how: [
        'Ranking is a weighted mix of six parts: skills (rarer ones count more), TF-IDF similarity to the resume, title, seniority, freshness and location.',
        'The app is a local web app served on 127.0.0.1 by the standard library, in a browser window with a profile of its own.',
        'Form filling drives that window with Playwright and never signs in, ticks a consent box or clicks Submit.',
        'Requests to each site are paced, and a site that asks it to slow down is left alone for as long as it asks.',
        'Everything stays on your computer. Nothing is sent anywhere unless you turn it on.',
      ],
    },
  },
  {
    slug: 'hold-my-files',
    name: 'Hold My Files',
    tagline: 'Turns an Android phone into a temporary, read-only file server for people on the same Wi-Fi or hotspot.',
    year: '2026',
    lines: ['frontend', 'backend'],
    stack: ['Kotlin', 'Ktor', 'Coroutines', 'Jetpack Compose', 'JUnit', 'Espresso'],
    facts: ['146 tests', 'No cloud, no internet', 'Guests need only a browser'],
    code: 'https://github.com/Jay-Parmar/HoldMyFiles',
    page: {
      what: [
        "The owner picks folders with Android's own folder picker, starts sharing and gives guests a local address and a PIN.",
        "Guests browse and download in any browser. They can't see anything the owner didn't pick, and they can't change anything.",
        'Stopping the server closes the listener and ends every session at once.',
      ],
      how: [
        "An embedded Ktor server runs in a foreground service, so sharing keeps going when the app's screen is closed.",
        'A PIN buys a short-lived random session cookie, and PIN attempts are rate limited by address.',
        'Guests only ever see random, short-lived handles bound to one server run, never file paths.',
        'Files stream through the Storage Access Framework, from the folders the owner picked and nothing else.',
        '146 unit and instrumentation tests, and a security test plan with automated attack cases.',
      ],
    },
  },
  {
    slug: 'foodhub-sniffer',
    name: 'FoodHub Sniffer',
    tagline: "Puts a cafe's Zomato and Swiggy orders on one board, with an alarm that keeps ringing until someone sees a new order.",
    year: '2026',
    lines: ['frontend', 'cloud'],
    stack: ['Kotlin', 'Android', 'JUnit', 'GitHub Actions'],
    facts: ['Both apps on one board', '36 tests', 'CI on every push'],
    code: 'https://github.com/Jay-Parmar/FoodHub',
    page: {
      what: [
        'Reads the order notifications the Zomato and Swiggy partner apps already post on the cafe phone, since their order APIs are open only to partners.',
        "Shows one card per order from both apps, with its status, amount and a count of today's orders.",
        'Rings a loud alarm for up to 2 minutes when a new order arrives, once per order, until someone stops it.',
        'Captures and exports everything inside those notifications, to learn which order fields exist before building a bigger product.',
      ],
      how: [
        'A notification listener service saves notifications from the apps you pick to a JSON Lines store.',
        'A pure Kotlin parser turns captures into orders, and the board and alarm rules are unit tested.',
        'GitHub Actions runs the tests and lint and builds a debug APK on every push.',
      ],
    },
  },
  {
    slug: 'ens-meeting-bridge',
    name: 'ENS Meeting Bridge',
    tagline: 'Video meetings that start from an alert.',
    year: '2026',
    lines: ['backend'],
    stack: ['FastAPI', 'SQLAlchemy', 'LiveKit', 'Redis'],
    facts: [
      'Moved blocking lookups off the event loop',
      'Batched queries that drained the DB pool',
      "Bounded WebSocket sends so one dead socket can't wedge the API",
    ],
    where: 'Built at ESSI',
  },
  {
    slug: 'poker-planner',
    name: 'Poker Planner',
    tagline: 'Real-time rooms where a team votes on Jira ticket estimates together and sees the spread as votes land.',
    year: '2021',
    lines: ['backend', 'frontend'],
    stack: ['Django REST', 'AngularJS', 'PostgreSQL'],
    facts: [],
  },
];
