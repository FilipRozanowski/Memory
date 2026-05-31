# Memory Game

A two-player browser-based memory card game built with TypeScript, Vite and SCSS. Players take turns flipping cards to find matching pairs — the player with the most matches wins.

---

## Features

- **Two themes** — Code Vibes and Gaming, each with unique visuals and typography
- **Two players** — Blue and Orange, each tracked with live scores
- **Three board sizes** — 16, 24 or 36 cards
- **Animated card flips** — 3D CSS flip with match and mismatch feedback
- **Winner screen** — confetti animation for the winning player, draw support
- **Exit modal** — confirmation dialog before leaving an active game
- **Fully responsive** — optimised for desktop, tablet and mobile

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application logic |
| [Vite](https://vitejs.dev/) | Dev server and build tool |
| [SCSS](https://sass-lang.com/) | Modular, themeable styles |

No runtime frameworks — pure TypeScript with DOM APIs.

---

## Project Structure

```
src/
├── game/
│   ├── engine.ts        # Core game logic (flip, match, score, shuffle)
│   └── themes.ts        # Theme configuration and card image paths
├── screens/
│   ├── StartScreen.ts   # Landing screen
│   ├── SettingsScreen.ts # Theme, player and board size selection
│   ├── GameScreen.ts    # Active game board and header
│   ├── GameOverScreen.ts # Final score display
│   └── WinnerScreen.ts  # Winner / draw result with confetti
├── types/
│   └── index.ts         # Shared TypeScript interfaces and types
├── utils/
│   └── player-icon.ts   # Shared player icon HTML helper
├── styles/
│   ├── main.scss        # Entry point — imports all partials
│   ├── variables.scss   # Design tokens, CSS custom properties, breakpoints
│   ├── components/      # card, button, modal
│   └── screens/         # Per-screen stylesheets
└── main.ts              # App entry — screen routing and theme switching
```

---

## Getting Started

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Themes

Themes are switched via a `data-theme` attribute on the `#app` element. CSS custom properties cascade from there, so every child element picks up the correct colours and fonts automatically.

| | Code Vibes | Gaming |
|---|---|---|
| **Font** | RedRose | Orbitron |
| **Background** | `#3a3a3a` | `#2a4a5e` |
| **Accent** | `#d4e84a` | `#e8006e` |

Both fonts are loaded locally from `public/fonts/`.

---

## Game Rules

1. Choose a theme, starting player and board size in Settings
2. Players alternate turns — flip two cards per turn
3. A match scores one point and keeps the same player's turn
4. A mismatch flips the cards back and passes the turn
5. Game ends when all pairs are matched
6. The player with the most points wins — equal scores result in a draw

---

## Image Assets

Place card images under `public/images/cards/<theme>/`:

```
card-1.png … card-18.png   # Card faces (18 images = max 36-card board)
card-back.png               # Card back (gaming theme)
preview.png                 # Theme preview shown on the settings screen
```

Player and UI icons live in `public/images/icons/`.
