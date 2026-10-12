# AGENTS.md — Yamoransa Model Lab 8 website

## What this is
A plain static website: `index.html`, `style.css`, `script.js`, plus local images
(`logo.png`, `logo.jpg`, `IMG_*.JPG`). There is **no build step, no package
manager, and no backend**. The README mentions `package.json` / `npm run build`,
but neither exists — nothing needs compiling.

Everything interactive (mobile menu, smooth scroll, quiz, donation form) is
client-side JS. The donation form does **not** call any payment API; it validates
input and shows a simulated success notification. No external service credentials
are required to run the site.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
Serves the cloned source on host port **3000** via a stock `nginx:alpine`
container with the repo bind-mounted at `/usr/share/nginx/html`.

- Health check: `wget --spider http://localhost/` inside the container.
- No live-reload dev server: after editing source, just refresh the page (or
  force a preview refresh). nginx serves the mounted files directly, so no
  rebuild or restart is needed.

## Verifying it works
- `docker compose -f docker-compose.base44.yml ps` shows `web` healthy.
- `curl -s http://localhost:3000/ | grep -q "S.T.E.A.M Hub"` returns the page.
- In the browser: hero renders, nav links smooth-scroll, the learning-center quiz
  answers, and the donation form shows its success notification on submit.

## Quirks
- Font Awesome loads from a CDN and the favicon is a remote URL; the page itself
  renders fine without network access to those.
- Why not nginx: the repo root is mode `700` here, so an nginx worker (user
  `nginx`) gets **403** on every file. The Python image runs as root and reads the
  mount unchanged. Don't "fix" this by chmod-ing the repo.
- Several links are placeholders (`href="#"`: the four "Learn More" buttons,
  "Read More" news links, footer "Contact"/socials). Clicking one makes the
  smooth-scroll handler run `querySelector('#')`, which logs
  `Uncaught SyntaxError: '#' is not a valid selector` and does nothing. Pre-existing
  repo bug — leave the behavior alone unless asked to fix it.
- `index.html` still references Cloudflare scrape leftovers that don't exist
  locally (`/cdn-cgi/scripts/.../email-decode.min.js` → 404, email `href`s point at
  `/cdn-cgi/l/email-protection`). The visible email address text is fine.

## Verified (Oct 2026)
Booting and curling: `/` → 200 serving the cloned `index.html`; `/style.css`,
`/script.js`, `/logo.png` → 200; container reports healthy. In the browser: hero
and logo render, styles applied, nav anchor smooth-scroll moves to the target
section, quiz answers register (`Score: 1/5` after a correct answer), the donation
form submits and shows its success toast, the mobile menu toggles, no horizontal
overflow at 375px. Left as-is: the two quirks above.
