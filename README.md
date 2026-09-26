# Portfolio

Next.js 15 · React 19 · Tailwind CSS 4 · TypeScript. Light and dark themes, real project screens, and in-page demos.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static build of / and /work/[slug]
npm run lint
```

## Deploying

The site needs a Node host for the contact form's server action (Vercel works with no configuration). Set these environment variables on the host:

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Sends contact-form messages (see below) |
| `NEXT_PUBLIC_SITE_URL` | Off Vercel | Your domain, e.g. `https://tauhid.dev`, for link previews, the sitemap and canonical URLs. Vercel's production URL is used automatically |
| `CONTACT_TO`, `CONTACT_FROM` | No | Override the recipient and sender |

Share previews (`opengraph-image`), the favicon, `robots.txt` and `sitemap.xml` are generated at build time.

Optional: put a CV PDF in `public/` under the name in `links.cv` (`data/profile.ts`) and the "Download CV" button appears.

## Contact form

The "New message" form in the contact section sends email through a server action (`app/actions/sendMessage.ts`) and [Resend](https://resend.com). Replies go straight to the visitor, because the email's Reply-To is their address.

1. Sign up at resend.com **with the address that should receive messages** (the shared `onboarding@resend.dev` sender can only deliver to your own Resend account email).
2. Create an API key, then copy `.env.example` to `.env.local` and set `RESEND_API_KEY`.
3. When deploying, add the same variable in your host's environment settings.

Without a key, the form tells visitors to email you directly instead.

## Structure

| Path | What lives there |
|---|---|
| `data/profile.ts` | Name, intro, stats, experience, skills, contact copy |
| `data/projects.ts` | All nine projects: screens, metrics, story, demos. The only place project copy lives |
| `data/fl.ts` | Metrics from the federated-learning repo |
| `public/shots/<slug>/` | Screenshots, captured from the running app or rebuilt from its source |
| `app/` | `page.tsx` (home), `work/[slug]/page.tsx` (case studies), `globals.css` (design tokens) |
| `components/home/` | Home sections: Hero, Stats, Marquee, Experience, Work, Skills, Contact |
| `components/case-study/` | Case-study sections: header, screen carousel (every page, per device), metrics, story, demos |
| `components/frames/` | Browser, tablet and phone frames around real screenshots |
| `components/fl-results/` | Charts for the federated-learning project |
| `components/demos/` | Interactive demos, registered by id in `index.tsx` |
| `components/contact/` | The contact card: message form (compose window, topic chips, sent state) and the profile panel with Biscoot |
| `components/ui/` | Button, Chip, Icon, SectionHeading, SegmentedTabs, Container |
| `components/layout/` | Header, footer, theme toggle and the no-flash theme script |

## Theming

Colours are CSS variables in `app/globals.css`, with a light set on `:root` and a dark set on `[data-theme="dark"]`. They're mapped to Tailwind names (`bg-paper`, `text-ink`, `bg-accent` and so on); components never use raw hex, except for device hardware and the apps shown inside the frames. Each project's backdrop colour comes from `tint` in its data and switches with the theme through the `tint` utility.

## Adding a project

1. Put screenshots in `public/shots/<slug>/`.
2. Add an entry to `projects` in `data/projects.ts`, with one `views` entry per page in the order a user meets them (the case-study carousel shows them all). Set `featured: true` for a large card; otherwise add a `card` preview.
3. For a demo, build it in `components/demos/`, add its id to `DemoId`, and register it in `components/demos/index.tsx`.
