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


## Add Game (new)

Open the website and click **＋ ADD GAME**. Enter a title and either:

- An HTTPS game URL, or paste a complete `<iframe src="https://...">` embed.
- A relative HTML path such as `games/my-game/index.html`, but **upload that folder to GitHub first**.

The game appears immediately under **My Games**, plays in the 16:9 iframe player, and is saved using `localStorage` in the current browser. A site's iframe policy may prevent an external game's display; use the "Open original game" link. Avoid embedding third-party games unless you have permission.

**To publish added games for every visitor:** In Add Game click **EXPORT FOR GITHUB** to download `community-games.json`. Upload or replace the file at the **repository root** on GitHub, then commit. Everyone will then see those game entries. This only publishes links/metadata, not HTML game files; standalone local HTML games still require uploading their files. The export retains existing published entries loaded from the repository. Do not post GitHub tokens or passwords into the website form.

You can also export/import your game list between browsers using the JSON export and IMPORT GAMES button. **The Add Game form itself cannot write to GitHub**: GitHub Pages is static and cannot securely accept unauthenticated public edits.
