# Repro for a hydrate flicker issue with react-imported-component

To run:

```bash
git clone git@github.com:thomasjm/ric-hydrate-flicker.git
npm install
npm run build
PORT=1222 npm run start
```

Open Chrome to [localhost:1222](http://localhost:1222) and open devtools.

Initially, it prints `waiting`.
After 5 seconds, it prints `loading` and calls `rehydrateMarks()`.
After another 5 seconds, it prints `loaded...`.
After another 5 seconds, it prints `hyrating` and you see a **flicker**.
