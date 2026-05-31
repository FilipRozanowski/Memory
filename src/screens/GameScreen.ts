import type { GameState } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';

const ICON_BLUE   = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)`;
const ICON_ORANGE = `filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)`;

function playerIcon(color: 'blue' | 'orange', size = 18) {
  return `<img src="/images/icons/icon-player.png"
    style="width:${size}px;height:${size}px;object-fit:contain;${color === 'blue' ? ICON_BLUE : ICON_ORANGE}"
    alt="" />`;
}

function buildHeader(state: GameState, isGaming: boolean): string {
  if (isGaming) {
    const cur = state.currentPlayer;
    return `
      <div class="game-header game-header--gaming">
        <div class="score-combined">
          <span class="score-combined__item">
            ${playerIcon('orange')} ${state.scores.orange}
          </span>
          <span class="score-combined__divider"></span>
          <span class="score-combined__item">
            ${playerIcon('blue')} ${state.scores.blue}
          </span>
        </div>
        <div class="game-header__current">
          Current player: ${playerIcon(cur, 20)}
        </div>
        <button class="btn btn--exit btn--exit-gaming" id="btn-exit">⏻ Exit game</button>
      </div>`;
  }
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
        <span class="player-arrow" style="background:${curBg}"></span>
      </div>
      <button class="btn btn--exit" id="btn-exit">⏻ Exit game</button>
    </div>`;
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

  // Header wrapper — updated in place without touching the board
  const headerWrap = document.createElement('div');

  // Board rendered once — only class changes on individual cards
  const boardWrap = document.createElement('div');
  boardWrap.className = 'game-board';
  boardWrap.innerHTML = `
    <div class="game-board__grid game-board__grid--${state.settings.boardSize}">
      ${state.cards.map((card) => `
        <div class="card" data-id="${card.id}">
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
    </div>`;

  el.appendChild(headerWrap);
  el.appendChild(boardWrap);

  const updateHeader = () => {
    headerWrap.innerHTML = buildHeader(state, isGaming);
    headerWrap.querySelector('#btn-exit')!.addEventListener('click', onExit);
  };

  const cardEl = (id: number) =>
    boardWrap.querySelector<HTMLElement>(`.card[data-id="${id}"]`)!;

  boardWrap.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!target) return;
    if (target.classList.contains('is-flipped') || target.classList.contains('is-matched')) return;
    if (state.isLocked) return;

    const id = Number(target.dataset.id);
    const prevFlipped = [...state.flippedCards];
    state = flipCard(state, id);

    // Flip this card visually
    target.classList.add('is-flipped');

    if (!state.isLocked && state.flippedCards.length === 0) {
      // Match found — mark both as matched after flip animation
      const matchedIds = [prevFlipped[0], id];
      setTimeout(() => {
        matchedIds.forEach(mid => cardEl(mid).classList.add('is-matched'));
        updateHeader();
        if (isGameOver(state)) setTimeout(() => onGameOver(state), 400);
      }, 600);
    } else if (state.isLocked) {
      // No match — flip both back after pause
      updateHeader();
      setTimeout(() => {
        const [firstId, secondId] = state.flippedCards;
        state = unflipCards(state);
        cardEl(firstId).classList.remove('is-flipped');
        cardEl(secondId).classList.remove('is-flipped');
        updateHeader();
      }, 900);
    } else {
      updateHeader();
    }
  });

  updateHeader();
  return el;
}
