# Jay Parmar

My portfolio: work, results and projects, drawn as a metro map where each line is a set of skills.

https://jay-parmar.github.io/JayParmar/

## Run it

Needs Node 22.12 or newer.

```
npm install
npm run dev
```

Then open http://localhost:4321/JayParmar/.

## Check it

```
npm test            # content, map geometry and text rules
npm run test:site   # builds the site, then checks every page and link
npm run check       # types
```

## Change the content

Everything on the page comes from `src/data`: `profile.ts`, `experience.ts`, `projects.ts`, `results.ts` and `lines.ts`. The map's lines and stations are in `map.ts`, and `npm test` checks that every station sits on its lines.

A push to `main` runs the tests and publishes the site to GitHub Pages.
