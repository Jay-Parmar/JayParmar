# Jay Parmar

My portfolio: experience, measured results and projects in one place.

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
npm test            # content, colour contrast, styles and text rules
npm run test:site   # builds the site, then checks every page and link
npm run check       # types
```

## Change the content

The portfolio copy lives in `src/data`. The hero shows the layers of my work in `src/components/StackPortrait.astro`. The architecture case study uses `src/data/platform.ts` and `src/components/SystemDiagram.astro`.

A push to `main` runs the tests and publishes the site to GitHub Pages.
