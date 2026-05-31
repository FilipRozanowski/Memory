import type { CardData, GameState } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';
import { playerIcon } from '../utils/player-icon';

const MATCH_DELAY_MS = 600;
const UNMATCH_DELAY_MS = 900;
const GAMEOVER_DELAY_MS = 400;

const COLOR_BLUE = '#4ab4e8';
const COLOR_ORANGE = '#e8914a';

/** Builds the gaming-theme header HTML. */
function buildGamingHeader(state: GameState): string {
  const cur = state.currentPlayer;
  return `
    <div class="game-header game-header--gaming">
      <div class="score-combined">
        <span class="score-combined__item">
          ${playerIcon('orange')} <span style="color:${COLOR_ORANGE};font-weight:700">${state.scores.orange}</span>
        </span>
        <span class="score-combined__divider"></span>
        <span class="score-combined__item">
          ${playerIcon('blue')} <span style="color:${COLOR_BLUE};font-weight:700">${state.scores.blue}</span>
        </span>
      </div>
      <div class="game-header__bottom">
        <div class="game-header__current">
          Current player: ${playerIcon(cur, 20)}
        </div>
        <button class="btn btn--exit btn--exit-gaming" id="btn-exit">⏻ Exit game</button>
      </div>
    </div>`;
}

/** Builds the code-vibes-theme header HTML. */
function buildCodeVibesHeader(state: GameState): string {
  const curBg = state.currentPlayer === 'blue' ? COLOR_BLUE : COLOR_ORANGE;
  return `
    <div class="game-header game-header--code-vibes">
      <div class="game-header__scores">
        <div class="score-badge score-badge--blue">
          <span class="score-badge__arrow"></span>
          Blue ${state.scores.blue}
        </div>
        <div class="score-badge score-badge--orange">
          <span class="score-badge__arrow"></span>
          Orange ${state.scores.orange}
        </div>
      </div>
      <div class="game-header__bottom">
        <div class="game-header__current">
          Current player:
          <span class="player-arrow" style="background:${curBg}"></span>
        </div>
        <button class="btn btn--exit" id="btn-exit">⏻ Exit game</button>
      </div>
    </div>`;
}

/** Dispatches to the correct header builder based on theme. */
function buildHeader(state: GameState, isGaming: boolean): string {
  return isGaming ? buildGamingHeader(state) : buildCodeVibesHeader(state);
}

/** Builds the HTML for a single card. */
function buildCardHtml(card: CardData, theme: string): string {
  return `
    <div class="card" data-id="${card.id}">
      <div class="card__inner">
        <div class="card__back">
          <img src="/images/cards/${theme}/card-back.png"
            onerror="this.src='/images/icons/card-back.png'" alt="card back" />
        </div>
        <div class="card__front">
          <img src="${card.imageSrc}" alt="card" />
        </div>
      </div>
    </div>`;
}

/** Builds the full board HTML. */
function buildBoardHtml(state: GameState): string {
  const cards = state.cards.map((c) => buildCardHtml(c, state.settings.theme)).join('');
  return `
    <div class="game-board__grid game-board__grid--${state.settings.boardSize}">
      ${cards}
    </div>`;
}

/** Returns the exit confirmation modal HTML. */
function buildExitModalHtml(isGaming: boolean): string {
  return `
    <div class="modal">
      <p class="modal__text">Are you sure you want to quit the game?</p>
      <div class="modal__actions">
        <button class="modal-btn--confirm modal-btn--confirm-back" id="modal-back">
          ${isGaming ? 'No, back to game' : 'Back to game'}
        </button>
        <button class="modal-btn--confirm modal-btn--confirm-exit" id="modal-exit">
          ${isGaming ? 'Yes, quit game' : 'Exit game'}
        </button>
      </div>
    </div>`;
}

/** Creates and attaches the exit confirmation modal overlay. */
function showExitModal(isGaming: boolean, onExit: () => void): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = buildExitModalHtml(isGaming);
  overlay.querySelector('#modal-back')!.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-exit')!.addEventListener('click', () => {
    overlay.remove();
    onExit();
  });
  (document.getElementById('app') as HTMLElement).appendChild(overlay);
}

/** Renders the full game screen and wires up all interactions. */
export function renderGameScreen(
  initialState: GameState,
  onGameOver: (state: GameState) => void,
  onExit: () => void
): HTMLElement {
  let state = initialState;
  const isGaming = state.settings.theme === 'gaming';

  const el = document.createElement('div');
  el.className = 'screen-game';

  const headerWrap = document.createElement('div');

  const boardWrap = document.createElement('div');
  boardWrap.className = 'game-board';
  boardWrap.innerHTML = buildBoardHtml(state);

  el.appendChild(headerWrap);
  el.appendChild(boardWrap);

  const cardEl = (id: number): HTMLElement =>
    boardWrap.querySelector<HTMLElement>(`.card[data-id="${id}"]`)!;

  const updateHeader = (): void => {
    headerWrap.innerHTML = buildHeader(state, isGaming);
    headerWrap.querySelector('#btn-exit')!.addEventListener('click', () => showExitModal(isGaming, onExit));
  };

  const handleMatch = (prevFlipped: number[], id: number): void => {
    const matchedIds = [prevFlipped[0], id];
    setTimeout(() => {
      matchedIds.forEach((mid) => cardEl(mid).classList.add('is-matched'));
      updateHeader();
      if (isGameOver(state)) setTimeout(() => onGameOver(state), GAMEOVER_DELAY_MS);
    }, MATCH_DELAY_MS);
  };

  const handleMismatch = (): void => {
    updateHeader();
    setTimeout(() => {
      const [firstId, secondId] = state.flippedCards;
      state = unflipCards(state);
      cardEl(firstId).classList.remove('is-flipped');
      cardEl(secondId).classList.remove('is-flipped');
      updateHeader();
    }, UNMATCH_DELAY_MS);
  };

  boardWrap.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!target || target.classList.contains('is-flipped') || target.classList.contains('is-matched')) return;
    if (state.isLocked) return;

    const id = Number(target.dataset.id);
    const prevFlipped = [...state.flippedCards];
    state = flipCard(state, id);
    target.classList.add('is-flipped');

    if (!state.isLocked && state.flippedCards.length === 0) {
      handleMatch(prevFlipped, id);
    } else if (state.isLocked) {
      handleMismatch();
    } else {
      updateHeader();
    }
  });

  updateHeader();
  return el;
}
