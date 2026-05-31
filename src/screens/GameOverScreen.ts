import type { GameState } from '../types';
import { getWinner } from '../game/engine';

const ICON_BLUE   = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)`;
const ICON_ORANGE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)`;

function playerIcon(color: 'blue' | 'orange', size = 18) {
  return `<img src="/images/icons/icon-player.png"
    style="width:${size}px;height:${size}px;object-fit:contain;${color === 'blue' ? ICON_BLUE : ICON_ORANGE}"
    alt="" />`;
}

export function renderGameOverScreen(state: GameState, onContinue: () => void): HTMLElement {
  getWinner(state);

  const isGaming = state.settings.theme === 'gaming';

  const el = document.createElement('div');
  el.className = 'screen-gameover';

  const scoresHtml = isGaming
    ? `<div class="score-combined">
        <span class="score-combined__item">
          ${playerIcon('orange')} <span style="color:#e8914a;font-weight:700">${state.scores.orange}</span>
        </span>
        <span class="score-combined__divider"></span>
        <span class="score-combined__item">
          ${playerIcon('blue')} <span style="color:#4ab4e8;font-weight:700">${state.scores.blue}</span>
        </span>
      </div>`
    : `<div class="score-badge score-badge--blue score-badge--no-bg">
        <span class="score-badge__arrow"></span>
        <span style="color:#4ab4e8;font-weight:700">Blue ${state.scores.blue}</span>
      </div>
      <div class="score-badge score-badge--orange score-badge--no-bg">
        <span class="score-badge__arrow"></span>
        <span style="color:#e8914a;font-weight:700">Orange ${state.scores.orange}</span>
      </div>`;

  el.innerHTML = `
    <h1 class="screen-gameover__title">Game over</h1>
    <p class="screen-gameover__label">Final score</p>
    <div class="screen-gameover__scores">
      ${scoresHtml}
    </div>
  `;

  setTimeout(() => onContinue(), 2000);

  return el;
}
