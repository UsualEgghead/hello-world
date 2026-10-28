# Tech+ Quest

A browser-based 2D top-down game built to reinforce the six CompTIA Tech+
(formerly ITF+) exam domains:

- IT Concepts & Terminology
- Infrastructure
- Applications & Software
- Software Development Concepts
- Database Fundamentals
- Security

## How to play

No build step or install required — it's plain HTML/CSS/JS and runs entirely
in the browser.

1. Serve the folder (opening `index.html` directly also works in most
   browsers, but a local server avoids any `file://` quirks):
   ```
   cd techplus-quest
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080` in your browser.
3. Click **Start Game**.

**Controls:** move with `WASD` or the arrow keys. Walk up to a glowing
terminal and press `E` or `Space` to answer a multiple-choice question for
that domain. A correct answer awards 100 points and a badge for that domain,
shown in the HUD along with a short explanation. Collect all six badges to
win.

## Project structure

```
techplus-quest/
  index.html        Page shell, HUD, start/win/quiz overlay markup
  style.css         Styling for the HUD and overlays
  js/map.js         Tile grid + room layout (also usable from Node for tests)
  js/questions.js   Question bank, organized by domain
  js/game.js        Game loop, input, collision, rendering, quiz logic
```

## Extending it

- Add more questions by appending to the arrays in `js/questions.js` — each
  entry is `{ q, choices: [4 strings], correct: index, explain }`.
- Add a new domain/room by adding an entry to `ROOMS` in `js/map.js` and a
  matching key in `js/questions.js`; `buildGrid()` automatically carves the
  room, places its terminal, and connects it to the central hub.
