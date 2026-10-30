# ianhudson.dev

Personal site of Ian Hudson Vieira. One static page built with [Astro](https://astro.build) and Tailwind CSS v4, meant to be hosted on Vercel (Hobby plan).

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build
```

## Where things live

- `src/data/site.ts`: all copy, links and projects. The page, `/resume.json`, `/resume.txt` and `/llms.txt` are all generated from this file, so edit it in one place.
- `src/pages/index.astro`: the page. `src/layouts/Base.astro`: head, SEO and Open Graph tags.
- `public/`: favicon, `og.png`, `robots.txt`. The sitemap is generated at build time.
- `scripts/og.html` + `npm run og`: regenerate `public/og.png` (needs Playwright with Chromium).
- `vercel.json`: serves the plain-text résumé at `/` when the user agent is curl, Wget or HTTPie. Everyone else gets the page. Try it after deploying with `curl https://ianhudson.dev`.

## CV PDF

There is no CV yet, so nothing links to one. When you have it, save it as `public/cv.pdf`, then add a link in `src/pages/index.astro` and `src/data/site.ts`.

## Deploy (not done yet)

1. Buy the domain, then in Vercel import this repo. The Astro preset is detected automatically.
2. Add `ianhudson.dev` under Project → Settings → Domains and use the exact DNS records Vercel shows.
3. Every push to `main` deploys.

## Adding a blog later

Add `src/content.config.ts` with a Markdown collection, then a `/blog` index and `[slug]` page that reuse `Base.astro`. Add `@astrojs/rss` for a feed. Nothing is set up for it yet.

## Adding the npm link

Once `taco-br-mcp` is published, add the link in `src/data/site.ts` (see the comment under `projects`).
