interface ProjectStep {
  id: string;
  name: string;
  text: string;
  preview?: string;
}

export const projectSections = {
  what: 'Workflow',
  how: "How it's built",
  stack: 'Built with',
};

export const contentsLabel = 'On this page';

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  stack: string[];
  facts: string[];
  where?: string;
  code?: string;
  featured?: boolean;
  page?: { steps: ProjectStep[]; how: string[] };
}

export const projects: Project[] = [
  {
    slug: 'hirejutsu',
    name: 'hirejutsu',
    tagline: 'Ranks job openings against your resume and explains the 10 closest matches each morning.',
    year: '2026',
    stack: ['Python', 'SQLite', 'pytest', 'Playwright'],
    facts: ['629 company career pages', '15 applicant tracking systems', '2,000+ tests'],
    code: 'https://github.com/Jay-Parmar/hirejutsu',
    featured: true,
    page: {
      steps: [
        {
          id: 'collect',
          name: 'Collect openings',
          preview: 'Company sites and job boards',
          text: 'Reads 629 company career pages across 15 applicant tracking systems, including Greenhouse, Lever, Ashby and Workday. It also checks 9 remote job boards and Hacker News, and skips reposted, evergreen and closed listings.',
        },
        {
          id: 'rank',
          name: 'Rank matches',
          preview: 'Six signals for each opening',
          text: 'Checks eligibility, including work permits, and scores each opening against your resume. Each morning you get the 10 best matches and a reason for each pick.',
        },
        {
          id: 'review',
          name: 'Review and apply',
          preview: 'Forms you check before submitting',
          text: 'Fills Workday, Greenhouse, Lever and Ashby forms in a browser you control. You review and submit. It tracks applications, follow-ups and referrals, and prepares interview notes when you get an interview.',
        },
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
    stack: ['Kotlin', 'Ktor', 'Coroutines', 'Jetpack Compose', 'JUnit', 'Espresso'],
    facts: ['146 tests', 'No cloud, no internet', 'Guests need only a browser'],
    code: 'https://github.com/Jay-Parmar/HoldMyFiles',
    page: {
      steps: [
        {
          id: 'share',
          name: 'Choose folders',
          text: "The owner picks folders with Android's folder picker, starts sharing and gives guests a local address and a PIN.",
        },
        {
          id: 'browse',
          name: 'Browse and download',
          text: 'Guests enter the PIN in a browser. They can download files from the selected folders with read-only access.',
        },
        {
          id: 'stop',
          name: 'Stop sharing',
          text: 'Stopping the server closes the listener and ends every guest session at once.',
        },
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
    stack: ['Kotlin', 'Android', 'JUnit', 'GitHub Actions'],
    facts: ['Both apps on one board', '36 tests', 'CI on every push'],
    code: 'https://github.com/Jay-Parmar/FoodHub',
    page: {
      steps: [
        {
          id: 'capture',
          name: 'Read notifications',
          text: 'The Zomato and Swiggy order APIs are restricted to partners. The app reads the notifications their partner apps already post on the cafe phone and can export the captured fields for inspection.',
        },
        {
          id: 'board',
          name: 'Combine orders',
          text: "Shows orders from both apps on one board, with a card for each order's status and amount and a count of today's orders.",
        },
        {
          id: 'alert',
          name: 'Alert the counter',
          text: 'Each new order triggers one audible alarm. It rings until someone stops it or two minutes pass.',
        },
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
    stack: ['FastAPI', 'SQLAlchemy', 'LiveKit', 'Redis'],
    facts: [
      'Moved blocking lookups off the event loop',
      'Batched queries that drained the DB pool',
      "Bounded WebSocket sends so one dead socket can't wedge the API",
    ],
    where: 'built at ESSI',
  },
  {
    slug: 'poker-planner',
    name: 'Poker Planner',
    tagline: 'Real-time rooms where a team votes on Jira ticket estimates together and sees the spread as votes land.',
    year: '2021',
    stack: ['Django REST', 'AngularJS', 'PostgreSQL'],
    facts: [],
  },
];
