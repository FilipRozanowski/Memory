import type { GameState } from '../types';
import { getWinner } from '../game/engine';

export function renderGameOverScreen(state: GameState, onContinue: () => void): HTMLElement {
  getWinner(state);

  const el = document.createElement('div');
  el.className = 'screen-gameover';

  el.innerHTML = `
    <h1 class="screen-gameover__title">Game over</h1>
    <p class="screen-gameover__label">Final score</p>
    <div class="screen-gameover__scores">
      <div class="score-badge score-badge--blue">
        <span class="score-badge__dot"></span>
        Blue ${state.scores.blue}
      </div>
      <div class="score-badge score-badge--orange">
        <span class="score-badge__dot"></span>
        Orange ${state.scores.orange}
      </div>
    </div>
  `;

  setTimeout(() => onContinue(), 2000);

  return el;
}
