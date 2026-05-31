import type { GameState } from '../types';
import { getWinner } from '../game/engine';
import { playerIcon } from '../utils/player-icon';

const CONTINUE_DELAY_MS = 2000;
const COLOR_BLUE = '#4ab4e8';
const COLOR_ORANGE = '#e8914a';

/** Builds the gaming-theme final score HTML (white box, colored numbers). */
function buildGamingScores(state: GameState): string {
  return `
    <div class="score-combined">
      <span class="score-combined__item">
        ${playerIcon('orange')} <span style="color:${COLOR_ORANGE};font-weight:700">${state.scores.orange}</span>
      </span>
      <span class="score-combined__divider"></span>
      <span class="score-combined__item">
        ${playerIcon('blue')} <span style="color:${COLOR_BLUE};font-weight:700">${state.scores.blue}</span>
      </span>
    </div>`;
}

/** Builds the code-vibes-theme final score HTML (teal box, colored text). */
function buildCodeVibesScores(state: GameState): string {
  return `
    <div class="score-badge score-badge--blue score-badge--no-bg">
      <span class="score-badge__arrow"></span>
      <span style="color:${COLOR_BLUE};font-weight:700">Blue ${state.scores.blue}</span>
    </div>
    <div class="score-badge score-badge--orange score-badge--no-bg">
      <span class="score-badge__arrow"></span>
      <span style="color:${COLOR_ORANGE};font-weight:700">Orange ${state.scores.orange}</span>
    </div>`;
}

/** Renders the game-over screen and auto-advances to the winner screen. */
export function renderGameOverScreen(state: GameState, onContinue: () => void): HTMLElement {
  getWinner(state);

  const isGaming = state.settings.theme === 'gaming';
  const scoresHtml = isGaming ? buildGamingScores(state) : buildCodeVibesScores(state);

  const el = document.createElement('div');
  el.className = 'screen-gameover';

  el.innerHTML = `
    <h1 class="screen-gameover__title">Game over</h1>
    <p class="screen-gameover__label">Final score</p>
    <div class="screen-gameover__scores">
      ${scoresHtml}
    </div>
  `;

  setTimeout(() => onContinue(), CONTINUE_DELAY_MS);
  return el;
}
