/**
 * Single source of truth for project content.
 * Every claim traces to the linked repo or to cv.md. Screens are captured from the
 * running app or rebuilt from its source; never drawn lookalikes.
 */

export type Category = "Backend" | "Web" | "ML" | "Mobile" | "Desktop";
export type Device = "desktop" | "tablet" | "phone";

export type DemoId =
  | "khati-gateway"
  | "khati-order"
  | "khati-filter"
  | "fl-rounds"
  | "fl-phases"
  | "fl-split"
  | "fl-terminal"
  | "helpdesk-escalation"
  | "helpdesk-jwt"
  | "helpdesk-status"
  | "instructflow-clarify"
  | "instructflow-schema"
  | "instructflow-e2e"
  | "cryptau-sale"
  | "cryptau-contract"
  | "rfix-permission"
  | "rfix-menu"
  | "nike-sections"
  | "deliveryanbi-voice"
  | "deliveryanbi-recommend";

export interface Shot {
  src: string;
  alt: string;
}

/** One page of the app, as it appears on each device. The case study slides through all of them. */
export interface ScreenView {
  label: string;
  /** Section of the app the page belongs to, e.g. "Pharmacy". */
  group?: string;
  /** One line on what the page shows. */
  note?: string;
  url?: string;
  desktop?: Shot;
  tablet?: Shot;
  phone?: Shot;
  /** Status-bar colour matching the top of the phone screenshot. */
  phoneBar?: string;
  /** Which end of a tall phone screenshot to show. */
  phoneAlign?: "top" | "bottom";
}

export interface Metric {
  value: string;
  label: string;
  context?: string;
}

export interface Demo {
  id: DemoId;
  title: string;
  body: string;
}

/** How the small card on the home page previews a secondary project. */
export type CardPreview =
  | { layout: "browser"; shot: Shot }
  | { layout: "browser-phone"; shot: Shot; phone: Shot }
  | { layout: "phones"; shots: Shot[] }
  | { layout: "windows"; shots: [Shot, Shot] };

export interface Project {
  slug: string;
  index: string;
  title: string;
  year: string;
  categories: Category[];
  tags: string[];
  featured: boolean;
  status?: "In production" | "Live site";
  tagline: string;
  summary: string;
  role: string;
  stack: string[];
  code: { label: string; href: string }[];
  live?: string;
  tint: { light: string; dark: string };
  /** Browser chrome style that suits the app's own colours. */
  frame: "light" | "dark";
  /** Shape of the desktop screenshots. Desktop apps like MediBot are wider than a browser page. */
  desktopAspect?: "16/10" | "16/9";
  views: ScreenView[];
  /** The ML project has no UI; its results section shows this chart from the repo. */
  distribution?: Shot;
  card?: CardPreview;
  highlights: Metric[];
  metrics: Metric[];
  problem: string;
  decision: string;
  tradeoff: string;
  change?: string;
  demos: Demo[];
}

const shot = (slug: string, file: string, alt: string): Shot => ({ src: `/shots/${slug}/${file}`, alt });

/** One section of the Nike landing page, captured on every device at the scroll position where it starts. */
const nike = (file: string, title: string) => ({
  url: "nike-demo-webapp.vercel.app",
  desktop: shot("nike", `${file}-desktop.png`, `Nike landing page ${title} on desktop`),
  tablet: shot("nike", `${file}-tablet.png`, `Nike landing page ${title} on a tablet`),
  phone: shot("nike", `${file}-phone.png`, `Nike landing page ${title} on a phone`),
});

/** A MediBot window: the desktop app has one screen per form, titled like its window. */
const medibot = (file: string, title: string) => ({
  url: `MediBot · ${title}`,
  desktop: shot("medibot", `${file}-desktop.png`, `MediBot ${title.toLowerCase()} window`),
});

export const projects: Project[] = [
  {
    slug: "helpdesk",
    index: "01",
    title: "Helpdesk",
    year: "2026",
    categories: ["Backend", "Web"],
    tags: ["Full-stack", "Spring Boot"],
    featured: true,
    status: "In production",
    tagline:
      "Ticketing portal with role-based access, SLA-band escalation and an audit trail on every row. The production version runs at Prime Bank.",
    summary:
      "The ticketing portal I built as sole developer at Reddot Digital, now handling 500–2,000 tickets a day for 50–80 bank staff. A Spring Boot REST API with stateless JWT auth sits behind a Next.js admin UI for tickets, master data and escalation rules.",
    role: "Sole developer: domain model, API, security, frontend",
    stack: ["Java 17", "Spring Boot 3", "Spring Security", "JWT", "JPA", "PostgreSQL", "Cloudinary", "Next.js 15", "TypeScript"],
    code: [{ label: "Code", href: "https://github.com/tautau08/helpdesk" }],
    tint: { light: "#F6D9D6", dark: "#2A1E1C" },
    frame: "light",
    views: [
      {
        label: "Tickets",
        note: "ID, category, user and priority for every open ticket",
        url: "localhost:3000/tickets",
        desktop: shot("helpdesk", "tickets-desktop.png", "Helpdesk ticket list on desktop"),
        tablet: shot("helpdesk", "tickets-tablet.png", "Helpdesk ticket list on a tablet"),
        phone: shot("helpdesk", "tickets-phone.png", "Helpdesk ticket list on a phone"),
      },
      {
        label: "Ticket detail",
        note: "Status, SLA information and the ticket's timeline",
        url: "localhost:3000/tickets",
        desktop: shot("helpdesk", "detail-desktop.jpg", "Helpdesk ticket detail dialog"),
      },
      {
        label: "Create ticket",
        note: "Details, attachments and categorisation",
        url: "localhost:3000/tickets/create",
        desktop: shot("helpdesk", "create-desktop.png", "Helpdesk create-ticket form on desktop"),
        phone: shot("helpdesk", "create-phone.jpg", "Helpdesk create-ticket form on a phone"),
      },
      {
        label: "Subcategories",
        note: "Response and resolution SLA per subcategory",
        url: "localhost:3000/subcategories",
        desktop: shot("helpdesk", "subcategories-desktop.jpg", "Helpdesk subcategories with SLA times"),
      },
      {
        label: "Companies",
        note: "Master data with project counts",
        url: "localhost:3000/companies",
        desktop: shot("helpdesk", "companies-desktop.jpg", "Helpdesk companies list"),
      },
      {
        label: "Login",
        note: "Role-based sign-in",
        url: "localhost:3000/login",
        desktop: shot("helpdesk", "login-desktop.png", "Helpdesk login page on desktop"),
        phone: shot("helpdesk", "login-phone.png", "Helpdesk login page on a phone"),
        phoneBar: "#E63946",
        phoneAlign: "bottom",
      },
    ],
    highlights: [
      { value: "500–2k", label: "tickets a day in production" },
      { value: "4", label: "roles with separate workflows" },
    ],
    metrics: [
      { value: "500–2k", label: "tickets a day", context: "handled by 50–80 staff across four roles" },
      { value: "80+", label: "issues resolved", context: "as the sole developer through UAT and go-live" },
      { value: "12", label: "REST controllers", context: "tickets, users, auth, companies, projects, escalation and lookups" },
    ],
    problem:
      "Support teams need to know who touched a ticket and when, and who to alert as a ticket approaches or passes its resolution deadline. Those alert rules differ per ticket subcategory.",
    decision:
      "Every entity extends one BaseAuditable superclass (created/updated user and time, sort order, active flag), filled by JPA lifecycle hooks. Escalation rules are percentage bands of the SLA window: PRE bands before the deadline, POST bands after it, each tied to a subcategory and an email address.",
    tradeoff:
      "Bands are validated at write time: from < to, no overlap, total ≤ 100%. The overlap query uses inclusive bounds, so 0–50 and 50–80 conflict. Admins leave a one-point gap, which is stricter than needed but means a ticket at exactly 50% can never match two rules.",
    demos: [
      {
        id: "helpdesk-escalation",
        title: "Escalation band editor",
        body: "Add PRE or POST bands for a subcategory. Validation mirrors EscalationMatrixService line for line, including the inclusive overlap check.",
      },
      {
        id: "helpdesk-jwt",
        title: "Role-gated API",
        body: "Log in as different roles and hit the same endpoints. Lookup tables are ADMIN/SYSTEM only; tickets are open to USER as well.",
      },
      {
        id: "helpdesk-status",
        title: "Two status columns",
        body: "A ticket stores the status it was submitted with (never updatable) and its current status, so the original state survives every later edit.",
      },
    ],
  },
  {
    slug: "khati",
    index: "02",
    title: "Khati",
    year: "2025",
    categories: ["Backend"],
    tags: ["Microservices", "Spring Boot"],
    featured: true,
    tagline: "Farm-fresh store built as four Spring Boot services behind an API gateway, each with its own PostgreSQL database.",
    summary:
      "Auth, User, Inventory and Order services behind a gateway, a database per service, and 27 REST endpoints. The Next.js 15 frontend has 9 pages, including separate Admin and Manager dashboards.",
    role: "Solo: backend, frontend, service boundaries",
    stack: ["Java 17", "Spring Boot 3.5", "Spring Security", "PostgreSQL", "WebClient", "Next.js 15", "TypeScript", "shadcn/ui"],
    code: [
      { label: "Backend code", href: "https://github.com/tautau08/Khati-microservice-backend" },
      { label: "Frontend code", href: "https://github.com/tautau08/Khati-microservice-frontend" },
    ],
    tint: { light: "#DDE8D4", dark: "#1C2A20" },
    frame: "light",
    views: [
      {
        label: "Products",
        url: "localhost:3000/products",
        desktop: shot("khati", "products-desktop.png", "Khati products page on desktop"),
        tablet: shot("khati", "products-tablet.png", "Khati products page on a tablet"),
        phone: shot("khati", "products-phone.png", "Khati products page on a phone"),
      },
      {
        label: "Home",
        url: "localhost:3000",
        desktop: shot("khati", "home-desktop.png", "Khati home page"),
      },
      {
        label: "Admin dashboard",
        url: "localhost:3000/admin",
        desktop: shot("khati", "admin-desktop.png", "Khati admin dashboard"),
      },
      {
        label: "Manager dashboard",
        note: "Where orders are confirmed and stock is reduced",
        url: "localhost:3000/manager",
        desktop: shot("khati", "manager-desktop.png", "Khati manager dashboard"),
      },
      {
        label: "Login",
        url: "localhost:3000/login",
        desktop: shot("khati", "login-desktop.png", "Khati login page on desktop"),
        phone: shot("khati", "login-phone.png", "Khati login page on a phone"),
      },
    ],
    highlights: [
      { value: "27", label: "REST endpoints" },
      { value: "4 + 1", label: "services + gateway" },
    ],
    metrics: [
      { value: "4 + 1", label: "services + gateway", context: "gateway :8080 · auth :8081 · user :8082 · inventory :8083 · order :8084" },
      { value: "27", label: "REST endpoints", context: "one PostgreSQL database per service, no shared tables" },
      { value: "3", label: "roles", context: "Admin, Manager, Customer: JWT checked in every service" },
    ],
    problem:
      "Orders need live stock from inventory and identity from auth, but each domain should own its data so it can be deployed and scaled on its own schedule.",
    decision:
      "One database per service and plain REST between them. The gateway is the only public entry point and returns 403 for any path under /internal/, which services use to talk to each other.",
    tradeoff:
      "Stock is checked when an order is placed but only reduced when a manager confirms it. Pending orders never lock inventory, but two of them can both pass the check for the last units.",
    change:
      "Confirming an order calls inventory once per item. If the second item fails, the order rolls back but the first item's stock change is already saved in another database. I'd move to one batch reservation call or a saga with a compensating step, and replace the fire-and-forget user sync with an outbox so failed syncs are retried.",
    demos: [
      {
        id: "khati-order",
        title: "Order lifecycle",
        body: "Place two orders of 3 against 5 in stock. Both pass the stock check; confirm both and watch the second one fail.",
      },
      {
        id: "khati-gateway",
        title: "Gateway routing",
        body: "Three real request shapes through the gateway. The last one tries an internal route and is blocked at the edge.",
      },
      {
        id: "khati-filter",
        title: "The internal-endpoint filter",
        body: "Auth syncs new users to the user service over /internal/users. This filter keeps that route off the public internet.",
      },
    ],
  },
  {
    slug: "instructflow",
    index: "03",
    title: "InstructFlow",
    year: "2025",
    categories: ["Web"],
    tags: ["AI", "Next.js"],
    featured: true,
    status: "Live site",
    tagline: "An open-source platform to find, make and share AI prompts. Its Gemini generator asks clarifying questions before it writes.",
    summary:
      "Describe a task in a sentence and get a structured prompt back. If the description is vague, a first model call returns 2–4 multiple-choice clarifying questions before a second call streams the prompt. Prompts can be kept private or shared to a searchable feed.",
    role: "Solo: product, API routes, AI flow, tests",
    stack: ["Next.js 15", "React 19", "Vercel AI SDK", "Gemini", "Zod", "MongoDB", "NextAuth", "Playwright"],
    code: [{ label: "Code", href: "https://github.com/tautau08/InstructFlow" }],
    live: "https://instruct-flow.vercel.app",
    tint: { light: "#2A2A2E", dark: "#2A2A2E" },
    frame: "dark",
    views: [
      {
        label: "Home",
        note: "Discover and share prompts",
        url: "instruct-flow.vercel.app",
        desktop: shot("instructflow", "home-desktop.png", "InstructFlow home page on desktop"),
        tablet: shot("instructflow", "home-tablet.png", "InstructFlow home page on a tablet"),
        phone: shot("instructflow", "home-phone.png", "InstructFlow home page on a phone"),
        phoneBar: "#09090B",
      },
      {
        label: "Community feed",
        note: "Scenario and prompt cards, searchable by tag or user",
        url: "instruct-flow.vercel.app",
        desktop: shot("instructflow", "feed-desktop.jpg", "InstructFlow community feed on desktop"),
        phone: shot("instructflow", "feed-phone.jpg", "InstructFlow community feed on a phone"),
        phoneBar: "#09090B",
      },
      {
        label: "Clarify step",
        note: "Multiple-choice questions when the request is vague",
        url: "instruct-flow.vercel.app/create_prompt",
        desktop: shot("instructflow", "clarify-desktop.jpg", "InstructFlow clarifying-questions dialog"),
      },
      {
        label: "Generated prompt",
        note: "Streamed output, ready to save or post",
        url: "instruct-flow.vercel.app/create_prompt",
        desktop: shot("instructflow", "generated-desktop.jpg", "InstructFlow generated prompt on desktop"),
        phone: shot("instructflow", "generated-phone.jpg", "InstructFlow generated prompt on a phone"),
        phoneBar: "#09090B",
      },
      {
        label: "Profile",
        note: "Private and public prompts",
        url: "instruct-flow.vercel.app/profile",
        desktop: shot("instructflow", "profile-desktop.jpg", "InstructFlow profile page"),
      },
    ],
    highlights: [
      { value: "2-step", label: "typed clarify, then streamed output" },
      { value: "5", label: "Playwright E2E tests" },
    ],
    metrics: [
      { value: "2", label: "model calls", context: "a typed clarify step, then a streamed generation" },
      { value: "5", label: "E2E tests", context: "Playwright: 2 auth, 3 generation, with /api/clarify stubbed" },
    ],
    problem:
      "A one-line request like \"write a cover letter\" gives a model nothing to work with: no audience, tone or scope. Generating straight away produces a long prompt full of guesses.",
    decision:
      "Two routes. /api/clarify calls generateObject with a Zod schema and scores the scenario on target, audience, tone, scope and context. /api/chat then streams a seven-section prompt that includes the answers. The UI can always skip the questions.",
    tradeoff:
      "It costs an extra model round-trip before any output appears. A typed object keeps that response small and parseable, so the dialog renders from data instead of from parsed free text.",
    demos: [
      {
        id: "instructflow-clarify",
        title: "Clarify, then generate",
        body: "Pick a vague or a clear scenario and follow the branch. Runs in your browser with no model call, using the real response shape.",
      },
      {
        id: "instructflow-schema",
        title: "Typed model output",
        body: "The clarify step returns an object validated against a Zod schema, not text that has to be parsed afterwards.",
      },
      {
        id: "instructflow-e2e",
        title: "Deterministic E2E tests",
        body: "Playwright intercepts /api/clarify, so both branches are tested without depending on what the model returns.",
      },
    ],
  },
  {
    slug: "federated-story-points",
    index: "04",
    title: "Federated Story Points",
    year: "2026",
    categories: ["ML"],
    tags: ["Research", "Federated learning"],
    featured: true,
    tagline: "Estimates agile effort across 16 JIRA projects without pooling their data, using split federation with FedProx.",
    summary:
      "A research pipeline that predicts story points from issue text across 16 open-source JIRA projects. No project's issues leave its client. It moves through five phases, from a centralized baseline through FedAvg and FedProx to a split-federation design.",
    role: "Research: pipeline, models, experiments",
    stack: ["Python", "Flower", "TensorFlow/Keras", "scikit-learn", "TF-IDF", "LSTM", "FedProx"],
    code: [{ label: "Code", href: "https://github.com/tautau08/tautau_model-A-FL-story-point-estimation-model-" }],
    tint: { light: "#24130F", dark: "#2B2420" },
    frame: "light",
    views: [],
    distribution: shot("federated-story-points", "distribution-overview.png", "Histograms of story points for each of the 16 client projects"),
    highlights: [
      { value: "−42.8%", label: "local-eval MAE vs. centralized" },
      { value: "23.3k", label: "issues across 16 clients" },
    ],
    metrics: [
      { value: "−42.8%", label: "local-eval MAE vs. centralized", context: "Phase 4: 2.157 vs. the 3.774 baseline" },
      { value: "3.099", label: "macro MAE, all 16 clients", context: "adopted config: FedProx μ 0.1, fraction_fit 1.0, log1p target" },
      { value: "23.3k", label: "issues", context: "18,650 train / 4,663 test, stratified" },
    ],
    problem:
      "Story-point data is non-IID: every team estimates on its own scale. Vanilla FedAvg got worse each round (MAE 4.209 → 5.280 over three rounds), about 40% behind the centralized baseline.",
    decision:
      "Split federation. Only the deep feature extractors (LSTM + MLP, about 1.95M parameters) are aggregated with FedProx (μ 0.1). Each client keeps a private StackingRegressor on top of the shared 96-dim embeddings, and that model never leaves the client.",
    tradeoff:
      "I kept the full story-point range [1, 100] as regression instead of filtering to {1, 2, 3, 5, 8}, so MAE isn't directly comparable to classification papers. A log1p target cut weighted MAE by 15.9% but slightly raised RMSE, and I report both.",
    change:
      "Two clients, moodle and datamanagement, still dominate the weighted error. I'd try per-client calibration of the regression head before adding model capacity.",
    demos: [
      { id: "fl-rounds", title: "Ten rounds of FedProx", body: "Replay the adopted run round by round, with the real per-round MAE and RMSE from phase4_metrics.json." },
      { id: "fl-phases", title: "Five phases, one baseline", body: "Every architecture change measured against the same centralized ensemble. Split federation is the first to beat it." },
      { id: "fl-split", title: "What leaves the client", body: "Only LSTM and MLP weights go to the server. The stacking ensemble and every row of issue text stay local." },
      { id: "fl-terminal", title: "Simulation run", body: "A replay of the Flower simulation using the logged metrics, showing what one experiment prints as it trains." },
    ],
  },
  {
    slug: "cryptau",
    index: "05",
    title: "CrypTau",
    year: "2025",
    categories: ["Web"],
    tags: ["Solidity", "Next.js"],
    featured: false,
    tagline: "NFT marketplace on the MegaETH testnet: mint, list, buy and resell.",
    summary:
      "The Solidity contract holds listed NFTs in escrow and splits each sale between seller and marketplace in one transaction. Metadata and images are pinned to IPFS through Pinata, and MetaMask signs every transaction.",
    role: "Solo: contract, frontend, deployment",
    stack: ["Solidity", "OpenZeppelin ERC-721", "Hardhat", "Ethers.js", "Web3Modal", "Next.js", "IPFS/Pinata", "Tailwind CSS"],
    code: [{ label: "Code", href: "https://github.com/tautau08/tautau_nft_workplace" }],
    live: "https://cryptau.vercel.app",
    tint: { light: "#EAD9EE", dark: "#2A1F33" },
    frame: "dark",
    views: [
      {
        label: "Explore",
        url: "cryptau.vercel.app",
        desktop: shot("cryptau", "home-desktop.png", "CrypTau explore page on desktop"),
        phone: shot("cryptau", "home-phone.png", "CrypTau explore page on a phone"),
        phoneBar: "#24252D",
      },
      {
        label: "NFT details",
        url: "cryptau.vercel.app/nft-details",
        desktop: shot("cryptau", "details-desktop.png", "CrypTau NFT details page on desktop"),
        phone: shot("cryptau", "details-phone.png", "CrypTau NFT details page on a phone"),
        phoneBar: "#24252D",
      },
      {
        label: "Create NFT",
        url: "cryptau.vercel.app/create-nft",
        desktop: shot("cryptau", "create-desktop.png", "CrypTau create-NFT page"),
      },
    ],
    card: {
      layout: "browser-phone",
      shot: shot("cryptau", "home-desktop.png", "CrypTau explore page"),
      phone: shot("cryptau", "details-phone.png", "CrypTau NFT details on a phone"),
    },
    highlights: [],
    metrics: [],
    problem: "A buyer and a seller who don't trust each other need the NFT and the payment to change hands in one step.",
    decision:
      "Listing moves the token into the contract. createMarketSale requires msg.value == price, transfers the token to the buyer, and splits the payment between seller and marketplace in the same transaction.",
    tradeoff:
      "Payouts use push transfers inside the sale function. That's simple and works on a testnet, but a seller contract that rejects ETH would block its own sale.",
    change:
      "Listing never checks msg.value, so the listing fee is paid out of the contract's balance. I'd add require(msg.value == listingPrice), switch to pull payments and add ReentrancyGuard.",
    demos: [
      { id: "cryptau-sale", title: "Where the ETH goes", body: "Set a price and follow the split createMarketSale performs: the listing fee to the owner, the remainder to the seller." },
      { id: "cryptau-contract", title: "The sale function", body: "Walk through the checks-then-effects ordering, step by step." },
    ],
  },
  {
    slug: "rfix",
    index: "06",
    title: "Rfix",
    year: "2026",
    categories: ["Backend"],
    tags: ["Express", "PostgreSQL"],
    featured: false,
    tagline: "Access control where permissions and menus are rows in PostgreSQL.",
    summary:
      "The access-control foundation for a ticket portal. An Express + PostgreSQL API where every permission is a (method, endpoint) row, and a Next.js shell whose sidebar is built from the menus the current role can see.",
    role: "Solo: API, schema, frontend shell",
    stack: ["Node.js", "Express", "PostgreSQL", "JWT", "Next.js", "TypeScript"],
    code: [{ label: "Code", href: "https://github.com/tautau08/Rfix" }],
    tint: { light: "#F6D9D6", dark: "#2A1E1C" },
    frame: "light",
    views: [
      {
        label: "Dashboard",
        url: "localhost:3000/dashboard",
        desktop: shot("rfix", "dashboard-desktop.png", "Rfix dashboard on desktop"),
        tablet: shot("rfix", "dashboard-tablet.png", "Rfix dashboard on a tablet"),
        phone: shot("rfix", "dashboard-phone.png", "Rfix dashboard on a phone"),
      },
    ],
    card: { layout: "browser", shot: shot("rfix", "dashboard-desktop.png", "Rfix dashboard") },
    highlights: [],
    metrics: [],
    problem: "Adding a role or changing what it can do shouldn't require a redeploy.",
    decision:
      "Permissions are rows, not code. Middleware builds the key from the method and normalised path, and one SQL query matches it, turning stored :id segments into a [0-9]+ regex inside PostgreSQL.",
    tradeoff: "Every request costs one permission query. There's no cache yet, in exchange for changes taking effect immediately.",
    demos: [
      { id: "rfix-permission", title: "Permission check", body: "Choose a role, a method and a path. The demo matches stored patterns the way the SQL does and returns the middleware's 200 or 403." },
      { id: "rfix-menu", title: "Menus from rows", body: "Flat menu rows become a tree in two passes. Groups with no route and no visible children are dropped." },
    ],
  },
  {
    slug: "deliveryanbi",
    index: "07",
    title: "DeliveryAnbi",
    year: "2025",
    categories: ["Mobile"],
    tags: ["Kotlin", "Firebase"],
    featured: false,
    tagline: "Hall food-delivery Android app. I built the wallet, voice ordering and recommendations.",
    summary:
      "A four-person Kotlin and Firebase project where students place food orders and peers accept and deliver them, with live order sync and per-order chat. My part was the wallet, voice-driven ordering and the reorder recommendation.",
    role: "Team of 4: wallet, voice ordering, recommendations",
    stack: ["Kotlin", "Android SDK", "Firebase Auth", "Realtime Database", "SpeechRecognizer"],
    code: [{ label: "Code", href: "https://github.com/tautau08/DeliveryAnbi" }],
    tint: { light: "#F8E2CF", dark: "#2A2019" },
    frame: "light",
    views: [
      { label: "Dashboard", phone: shot("deliveryanbi", "dashboard-phone.png", "DeliveryAnbi dashboard") },
      { label: "Wallet", phone: shot("deliveryanbi", "wallet-phone.png", "DeliveryAnbi wallet") },
      { label: "Place order", phone: shot("deliveryanbi", "order-phone.png", "DeliveryAnbi place-order form") },
    ],
    card: {
      layout: "phones",
      shots: [
        shot("deliveryanbi", "dashboard-phone.png", "DeliveryAnbi dashboard"),
        shot("deliveryanbi", "wallet-phone.png", "DeliveryAnbi wallet"),
        shot("deliveryanbi", "order-phone.png", "DeliveryAnbi place-order form"),
      ],
    },
    highlights: [],
    metrics: [],
    problem: "Placing an order meant filling four fields on a small screen, often for the same dish as last time.",
    decision:
      "Voice commands map onto form fields with plain prefix rules (\"item …\", \"quantity …\", \"price …\"). The dashboard reads the order history from Realtime Database and suggests the most frequently ordered dish.",
    tradeoff:
      "Prefix rules are predictable and easy to debug, but you say one field per utterance. I chose that over free-form parsing that could fill the wrong field.",
    change:
      "When no dish repeats, maxByOrNull still returns the first item it counted, so the most-recent fallback almost never runs. I'd break ties by recency.",
    demos: [
      { id: "deliveryanbi-voice", title: "Voice to form", body: "Type what the recognizer heard. The same startsWith rules from PlaceOrderActivity fill the form or reject the command." },
      { id: "deliveryanbi-recommend", title: "Reorder suggestion", body: "Add orders to a history and see which dish OrderHistoryAnalyzer would suggest." },
    ],
  },
  {
    slug: "medibot",
    index: "08",
    title: "MediBot",
    year: "2023",
    categories: ["Desktop"],
    tags: ["C#", "SQL Server"],
    featured: false,
    tagline: "Team WinForms app joining a pharmacy, a blood bank and a symptom checker. I connected the three systems.",
    summary:
      "A three-person C# WinForms project: a pharmacy with medicine stock and validity checks, a blood bank with donor records, and a symptom checker for heart, brain and abdominal conditions. Each teammate built one module against SQL Server.",
    role: "Team of 3: integration and the launcher",
    stack: ["C#", ".NET Framework 4.7.2", "WinForms", "Guna UI", "SQL Server"],
    code: [{ label: "Code", href: "https://github.com/tautau08/Medibot" }],
    tint: { light: "#D9E8EA", dark: "#1A2426" },
    frame: "light",
    desktopAspect: "16/9",
    views: [
      { label: "Gateway", note: "Pick Blood Bank, Symptoms or Pharmacy", ...medibot("gateway", "Front page") },
      { label: "Login", group: "Pharmacy", ...medibot("login", "Login") },
      { label: "User panel", group: "Pharmacy", ...medibot("user-panel", "User panel") },
      { label: "Pharmacist panel", group: "Pharmacy", note: "A side menu that swaps six user controls", ...medibot("pharmacist", "Pharmacist panel") },
      { label: "Dashboard", group: "Pharmacy", note: "Valid vs. expired medicines", ...medibot("ph-dashboard", "Pharmacist dashboard") },
      { label: "Add medicine", group: "Pharmacy", ...medibot("add-medicine", "Add medicine") },
      { label: "View medicine", group: "Pharmacy", ...medibot("view-medicine", "View medicine") },
      { label: "Modify medicine", group: "Pharmacy", ...medibot("modify-medicine", "Modify medicine") },
      { label: "Validity check", group: "Pharmacy", ...medibot("validity", "Medicine validity check") },
      { label: "Sell medicine", group: "Pharmacy", ...medibot("sell", "Sell medicine") },
      { label: "Dashboard", group: "Blood bank", note: "A menu of donor, search, stock and delete forms", ...medibot("dashboard", "Blood bank dashboard") },
      { label: "Add donor", group: "Blood bank", ...medibot("add-donor", "Add new donor") },
    ],
    card: {
      layout: "windows",
      shots: [shot("medibot", "ph-dashboard-desktop.png", "MediBot pharmacist dashboard"), shot("medibot", "dashboard-desktop.png", "MediBot blood bank dashboard")],
    },
    highlights: [],
    metrics: [],
    problem: "Three teammates built three separate modules, each starting from its own form, so there was no single app to run.",
    decision:
      "I added a front page that launches the Blood Bank dashboard, the Symptoms checker or the Pharmacy login, merged the modules into one project, and made that page the app's entry point.",
    tradeoff:
      "A launcher of separate forms kept each module independent and let everyone keep working, at the cost of shared navigation: you return to the front page to switch modules.",
    demos: [],
  },
  {
    slug: "nike-landing",
    index: "09",
    title: "Nike Landing",
    year: "2024",
    categories: ["Web"],
    tags: ["React", "Tailwind"],
    featured: false,
    status: "Live site",
    tagline: "Responsive landing page from 8 data-driven sections with an interactive hero.",
    summary:
      "A Vite + React + Tailwind landing page for a sneaker storefront: a hero with a shoe switcher, popular products, services, a special offer, reviews and a newsletter, built to practise layout and responsive spacing.",
    role: "Solo: UI build",
    stack: ["React 18", "Vite 5", "Tailwind CSS 3"],
    code: [{ label: "Code", href: "https://github.com/tautau08/NikeDemo-Webapp" }],
    live: "https://nike-demo-webapp.vercel.app",
    tint: { light: "#E6E8FB", dark: "#23213A" },
    frame: "light",
    views: [
      { label: "Hero", note: "Shoe switcher that swaps the big image", ...nike("home", "hero") },
      { label: "Popular products", note: "Product cards from a data array", ...nike("products", "popular products") },
      { label: "Super quality", ...nike("quality", "super quality section") },
      { label: "Services", note: "Shipping, payment and support cards", ...nike("services", "services") },
      { label: "Special offer", ...nike("offer", "special offer") },
      { label: "Newsletter & footer", ...nike("newsletter", "newsletter and footer") },
    ],
    card: { layout: "browser", shot: shot("nike", "home-desktop.png", "Nike landing page hero") },
    highlights: [],
    metrics: [],
    problem: "Eight sections each needed their own spacing at every breakpoint, and repeating padding utilities per section drifted out of sync.",
    decision:
      "Spacing is a small set of named utilities defined once in index.css, plus a custom 1440px `wide` breakpoint. App.jsx is just the section order.",
    tradeoff: "Named spacing utilities are less flexible than inline values, which is the point: every section's spacing changes from one place.",
    demos: [{ id: "nike-sections", title: "Composition", body: "The whole page is eight sections in App.jsx, each wrapped in shared spacing utilities." }],
  },
];

export const categories: ("All" | Category)[] = ["All", "Backend", "Web", "ML", "Mobile", "Desktop"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The screenshot that stands for a page: its largest capture. */
export const thumbOf = (view: ScreenView): Shot | undefined => view.desktop ?? view.tablet ?? view.phone;

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
