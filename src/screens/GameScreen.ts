import type { GameState } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';

const ICON_BLUE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)`;
const ICON_ORANGE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)`;

function playerIcon(color: 'blue' | 'orange') {
  return `<img src="/images/icons/icon-player.png"
    style="width:18px;height:18px;object-fit:contain;${color === 'blue' ? ICON_BLUE : ICON_ORANGE}"
    alt="" />`;
}

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
        <div class="score-combined">
          <span class="score-combined__item score-combined__item--orange">
            ${playerIcon('orange')} ${state.scores.orange}
          </span>
          <span class="score-combined__divider"></span>
          <span class="score-combined__item score-combined__item--blue">
            ${playerIcon('blue')} ${state.scores.blue}
          </span>
        </div>

        <div class="game-header__current">
          Current player:
          <img src="/images/icons/icon-player.png"
            style="width:20px;height:20px;object-fit:contain;
            ${state.currentPlayer === 'blue' ? ICON_BLUE : ICON_ORANGE}"
            alt="" />
        </div>

        <button class="btn btn--exit" id="btn-exit">
          ⏻ Exit game
        </button>
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
                  <img src="/images/cards/${state.settings.theme}/card-back.png"
                    onerror="this.src='/images/icons/card-back.png'" alt="" />
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
