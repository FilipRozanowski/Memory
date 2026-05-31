import type { GameState } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';

const ICON_BLUE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)`;
const ICON_ORANGE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)`;

function renderHeaderCodeVibes(state: GameState): string {
  const curBg = state.currentPlayer === 'blue' ? '#4ab4e8' : '#e8914a';
  return `
    <div class="game-header game-header--code-vibes">
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
        <span class="player-square" style="background:${curBg}"></span>
      </div>
      <button class="btn btn--exit" id="btn-exit">⏻ Exit game</button>
    </div>
  `;
}

function renderHeaderGaming(state: GameState): string {
  const iconStyle = (c: 'blue' | 'orange') =>
    `width:20px;height:20px;object-fit:contain;${c === 'blue' ? ICON_BLUE : ICON_ORANGE}`;
  return `
    <div class="game-header game-header--gaming">
      <div class="score-combined">
        <span class="score-combined__item score-combined__item--orange">
          <img src="/images/icons/icon-player.png" style="${iconStyle('orange')}" alt="" />
          ${state.scores.orange}
        </span>
        <span class="score-combined__divider"></span>
        <span class="score-combined__item score-combined__item--blue">
          <img src="/images/icons/icon-player.png" style="${iconStyle('blue')}" alt="" />
          ${state.scores.blue}
        </span>
      </div>
      <div class="game-header__current">
        Current player:
        <img src="/images/icons/icon-player.png"
          style="${state.currentPlayer === 'blue' ? iconStyle('blue') : iconStyle('orange')}"
          alt="" />
      </div>
      <button class="btn btn--exit btn--exit-gaming" id="btn-exit">⏻ Exit game</button>
    </div>
  `;
}

export function renderGameScreen(
  initialState: GameState,
  onGameOver: (state: GameState) => void,
  onExit: () => void
): HTMLElement {
  let state = initialState;
  const isGaming = state.settings.theme === 'gaming';

  const el = document.createElement('div');
  el.className = 'screen-game';

  const render = () => {
    const header = isGaming ? renderHeaderGaming(state) : renderHeaderCodeVibes(state);

    el.innerHTML = `
      ${header}
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
