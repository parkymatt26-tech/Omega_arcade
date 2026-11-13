# OMEGA ARCADE — GitHub Pages website

## Deploy in 5 steps

1. On GitHub, create a new **public** repository, e.g. `omega-arcade`.
2. Upload **all files and folders inside this ZIP** into the repository root (not an enclosing `OMEGA_ARCADE_SITE` folder). Keep each game's `index.html` inside its folder.
3. Commit changes to `main`.
4. Open repository **Settings → Pages → Build and deployment → Deploy from a branch**. Choose `main` and `/(root)`, then Save.
5. Visit `https://YOUR-GITHUB-USERNAME.github.io/omega-arcade/` once GitHub Pages publishes.

You do not need a previous homepage; this package contains the required `index.html`.

## Games included

- `games/ashfall/index.html` — ASHFALL: LAST LIGHT (sound overhaul)
- `games/floor99/index.html` — FLOOR 99
- `games/neon-foundry/index.html` — NEON FOUNDRY
- `yandex-385957` — third-party game, embedded using your Yandex-hosted URL. No game files are copied into this repository.

## Embedded 16:9 game iframe

The `play.html` page uses the requested iframe approach:

```html
<iframe id="game" class="gameClass" style="aspect-ratio:16/9"
  src="games/ashfall/index.html" scrolling="no" frameborder="0"></iframe>
```

The player dynamically changes `src` when you select another game. This is a same-origin iframe on GitHub Pages, so games can use browser storage normally. HTML files opened directly from your PC and hosted games may have separate saves. Use individual game import/export where supported.

### Adding Drift Boss V3

Your snippet mentioned `src="drift-boss-v3/index.html"`. The Drift Boss V3 game files were **not provided**, so this ZIP does **not** include a playable copy. To embed it: upload the whole `drift-boss-v3` folder into the repository root, then add an entry pointing to `drift-boss-v3/index.html` in `app.js` and `player.js`. You can also change the iframe `src` manually, but then the game selector will overwrite it on load.

## Files

- `index.html`, `styles.css`, `app.js` — homepage
- `play.html`, `player.css`, `player.js` — embedded 16:9 game player
- `games/` — standalone game pages
- `assets/` — cover images and favicon
- `.nojekyll` — prevent Jekyll processing

Works entirely with static HTML, CSS and JavaScript; no backend or build system needed. Games use the user's browser for local save data.

### External game: THEY ARE COMING

Click **Online Games** on the homepage and choose the THEY ARE COMING. The 16:9 player will set its `src` to the URL you supplied. Because this game is hosted by someone else, it needs an internet connection, and it may refuse to load in a third-party iframe due to site security settings or domain checks. The player offers **Open on Yandex** as a fallback. Embedding the external game does not give the repository any ownership or right to redistribute its assets. Confirm the publisher permits embedding on your website before public distribution.

Game settings and saved data for the externally hosted game are managed by that provider, not by OMEGA ARCADE.
