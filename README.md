# YouTube Shorts Blocker

A small, free Firefox extension that removes YouTube Shorts from your feed.
## What it does

- Hides Shorts shelves on the home page, search results and subscriptions
- Hides individual Shorts that appear inside normal video lists
- Removes the Shorts entry from the sidebar and the "Shorts" tab on channel pages
- Opens any `/shorts/…` link as a normal video page, so shared Shorts links still work
- Has an on/off switch in the toolbar popup, so you can see Shorts when you want to
- Works on `www.youtube.com` and `m.youtube.com`

## Privacy

The extension collects no data and makes no network requests. The only thing it
stores is your on/off choice, locally in your browser (`storage.local`). It only
runs on YouTube pages and asks for no other permissions.

## Install (for testing)

1. Download or clone this repository.
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select `manifest.json`.
4. Open YouTube. Click the toolbar icon to switch blocking on or off.

Temporary add-ons are removed when Firefox closes. Requires Firefox 128 or newer.

## How it works

- `content.css` hides Shorts elements using CSS selectors, all scoped under an
  `html.ysb-on` class so blocking can be switched off instantly.
- `content.js` toggles that class based on the saved setting, and redirects
  `/shorts/ID` URLs to `/watch?v=ID`. YouTube is a single-page app, so it also
  listens for YouTube's navigation events.
- `popup/` contains the toolbar popup with the on/off switch.


## Project structure

```
manifest.json      Extension manifest (Manifest V3)
content.css        Rules that hide Shorts
content.js         Toggle and redirect logic
popup/             Toolbar popup (HTML, CSS, JS)
icons/icon.svg     Extension icon
```

## Built with

Plain HTML, CSS and JavaScript, no dependencies or build step. Developed, reviewed and tested by Ratstew.