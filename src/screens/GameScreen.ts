import type { GameState } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';

export function renderGameScreen(
  initialState: GameState,
  onGameOver: (state: GameState) => void,
  onExit: () => void
): HTMLElement {
  let state = initialState;

  const el = document.createElement('div');
  el.className = 'screen-game';

  const render = () => {
    el.innerHTML = `
      <header class="game-header">
        <div class="game-header__scores">
          <div class="score-badge score-badge--blue">
            <span class="score-badge__dot"></span>
            Blue ${state.scores.blue}
          </div>
          <div class="score-badge score-badge--orange">
            <span class="score-badge__dot"></span>
            Orange ${state.scores.orange}
          </div>
        </div>
        <div class="game-header__current">
          Current player:
          <span class="score-badge__dot" style="
            width:14px;height:14px;border-radius:50%;display:inline-block;
            background:${state.currentPlayer === 'blue' ? '#4ab4e8' : '#e8914a'}
          "></span>
        </div>
        <button class="btn btn--ghost" id="btn-exit">⏻ Exit game</button>
      </header>
      <div class="game-board">
        <div class="game-board__grid game-board__grid--${state.settings.boardSize}">
          ${state.cards.map((card) => `
            <div
              class="card ${card.isFlipped || card.isMatched ? 'is-flipped' : ''} ${card.isMatched ? 'is-matched' : ''}"
              data-id="${card.id}"
            >
              <div class="card__inner">
                <div class="card__back">
                  <img src="/images/icons/card-back-icon.svg" alt="" />
                </div>
                <div class="card__front">
                  <img src="${card.imageSrc}" alt="card" />
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    el.querySelector('#btn-exit')!.addEventListener('click', onExit);

    el.querySelectorAll<HTMLElement>('.card:not(.is-matched)').forEach((cardEl) => {
      cardEl.addEventListener('click', () => {
        const id = Number(cardEl.dataset.id);
        state = flipCard(state, id);
        render();

        if (state.isLocked) {
          setTimeout(() => {
            state = unflipCards(state);
            if (isGameOver(state)) {
              onGameOver(state);
            } else {
              render();
            }
          }, 900);
        } else if (isGameOver(state)) {
          setTimeout(() => onGameOver(state), 400);
        }
      });
    });
  };

  render();
  return el;
}
