import type { CardData, GameState, Player } from '../types';
import { flipCard, isGameOver, unflipCards } from '../game/engine';
import { playerIcon } from '../utils/player-icon';

const MATCH_DELAY_MS = 600;
const UNMATCH_DELAY_MS = 900;
const GAMEOVER_DELAY_MS = 400;

const COLOR_BLUE = '#4ab4e8';
const COLOR_ORANGE = '#e8914a';

/**
 * Builds the white score box HTML used in the gaming header.
 *
 * @param state - The current game state containing both player scores
 * @returns An HTML string for the combined score widget
 */
function buildScoreCombinedHtml(state: GameState): string {
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

/**
 * Builds the bottom row (current player indicator + exit button) for the gaming header.
 *
 * @param cur - The player whose turn it currently is
 * @returns An HTML string for the gaming header's bottom row
 */
function buildGamingBottomHtml(cur: Player): string {
  return `
    <div class="game-header__bottom">
      <div class="game-header__current">
        Current player: ${playerIcon(cur, 20)}
      </div>
      <button class="btn btn--exit btn--exit-gaming" id="btn-exit">⏻ Exit game</button>
    </div>`;
}

/**
 * Builds the full gaming-theme header HTML.
 *
 * @param state - The current game state
 * @returns An HTML string for the gaming header
 */
function buildGamingHeader(state: GameState): string {
  return `
    <div class="game-header game-header--gaming">
      ${buildScoreCombinedHtml(state)}
      ${buildGamingBottomHtml(state.currentPlayer)}
    </div>`;
}

/**
 * Builds the score badge pair HTML for the code-vibes header.
 *
 * @param state - The current game state containing both player scores
 * @returns An HTML string with two colored score badges
 */
function buildScoreBadgesHtml(state: GameState): string {
  return `
    <div class="game-header__scores">
      <div class="score-badge score-badge--blue">
        <span class="score-badge__arrow"></span>
        Blue ${state.scores.blue}
      </div>
      <div class="score-badge score-badge--orange">
        <span class="score-badge__arrow"></span>
        Orange ${state.scores.orange}
      </div>
    </div>`;
}

/**
 * Builds the bottom row (current player indicator + exit button) for the code-vibes header.
 *
 * @param curBg - The CSS background color string for the active player's arrow indicator
 * @returns An HTML string for the code-vibes header's bottom row
 */
function buildCodeVibesBottomHtml(curBg: string): string {
  return `
    <div class="game-header__bottom">
      <div class="game-header__current">
        Current player:
        <span class="player-arrow" style="background:${curBg}"></span>
      </div>
      <button class="btn btn--exit" id="btn-exit">⏻ Exit game</button>
    </div>`;
}

/**
 * Builds the full code-vibes-theme header HTML.
 *
 * @param state - The current game state
 * @returns An HTML string for the code-vibes header
 */
function buildCodeVibesHeader(state: GameState): string {
  const curBg = state.currentPlayer === 'blue' ? COLOR_BLUE : COLOR_ORANGE;
  return `
    <div class="game-header game-header--code-vibes">
      ${buildScoreBadgesHtml(state)}
      ${buildCodeVibesBottomHtml(curBg)}
    </div>`;
}

/**
 * Dispatches to the correct header builder based on the active theme.
 *
 * @param state - The current game state
 * @param isGaming - `true` when the gaming theme is active
 * @returns An HTML string for the appropriate game header
 */
function buildHeader(state: GameState, isGaming: boolean): string {
  return isGaming ? buildGamingHeader(state) : buildCodeVibesHeader(state);
}

/**
 * Builds the HTML for a single card list item.
 *
 * @param card - The card data to render
 * @param theme - The active theme name used to resolve the card-back image path
 * @returns An HTML string for the card element
 */
function buildCardHtml(card: CardData, theme: string): string {
  return `
    <li class="card" data-id="${card.id}">
      <div class="card__inner">
        <div class="card__back">
          <img src="/images/cards/${theme}/card-back.png"
            onerror="this.src='/images/icons/card-back.png'" alt="card back" />
        </div>
        <div class="card__front">
          <img src="${card.imageSrc}" alt="card" />
        </div>
      </div>
    </li>`;
}

/**
 * Builds the full game board HTML with a sized grid list.
 *
 * @param state - The current game state containing all card data and settings
 * @returns An HTML string for the game board grid
 */
function buildBoardHtml(state: GameState): string {
  const cards = state.cards.map((c) => buildCardHtml(c, state.settings.theme)).join('');
  return `
    <ul class="game-board__grid game-board__grid--${state.settings.boardSize}">
      ${cards}
    </ul>`;
}

/**
 * Builds the exit confirmation modal HTML.
 *
 * @param isGaming - `true` when the gaming theme is active (affects button labels)
 * @returns An HTML string for the exit modal dialog
 */
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

/**
 * Creates and mounts the exit confirmation modal dialog to the app root.
 *
 * @param isGaming - `true` when the gaming theme is active
 * @param onExit - Callback invoked when the player confirms they want to exit
 */
function showExitModal(isGaming: boolean, onExit: () => void): void {
  const overlay = document.createElement('dialog');
  overlay.setAttribute('open', '');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = buildExitModalHtml(isGaming);
  overlay.querySelector('#modal-back')!.addEventListener('click', () => overlay.remove());
  overlay.querySelector('#modal-exit')!.addEventListener('click', () => { overlay.remove(); onExit(); });
  (document.getElementById('app') as HTMLElement).appendChild(overlay);
}

/**
 * Creates and returns the main screen element, header element, and board section.
 *
 * @param state - The initial game state used to build the board HTML
 * @returns An object with the root element, header element, and board section
 */
function createScreenElements(state: GameState): { el: HTMLElement; headerWrap: HTMLElement; boardWrap: HTMLElement } {
  const el = document.createElement('main');
  el.className = 'screen-game';
  const headerWrap = document.createElement('header');
  const boardWrap = document.createElement('section');
  boardWrap.className = 'game-board';
  boardWrap.innerHTML = buildBoardHtml(state);
  el.appendChild(headerWrap);
  el.appendChild(boardWrap);
  return { el, headerWrap, boardWrap };
}

/**
 * Returns a callback that re-renders the header and re-wires the exit button.
 *
 * @param headerWrap - The header element to update
 * @param getState - Returns the current game state snapshot
 * @param isGaming - `true` when the gaming theme is active
 * @param onExit - Callback passed to the exit modal on confirmation
 * @returns A zero-argument function that refreshes the header
 */
function makeUpdateHeader(headerWrap: HTMLElement, getState: () => GameState, isGaming: boolean, onExit: () => void): () => void {
  return () => {
    headerWrap.innerHTML = buildHeader(getState(), isGaming);
    headerWrap.querySelector('#btn-exit')!.addEventListener('click', () => showExitModal(isGaming, onExit));
  };
}

/**
 * Unflips mismatched cards in the DOM and updates the header after the delay.
 *
 * @param getState - Returns the current game state snapshot
 * @param setState - Replaces the current game state
 * @param cardEl - Returns the DOM element for a given card ID
 * @param updateHeader - Re-renders the header to reflect the updated state
 */
function applyMismatchDom(getState: () => GameState, setState: (s: GameState) => void, cardEl: (id: number) => HTMLElement, updateHeader: () => void): void {
  const [firstId, secondId] = getState().flippedCards;
  setState(unflipCards(getState()));
  [firstId, secondId].forEach((id) => cardEl(id).classList.remove('is-flipped'));
  updateHeader();
}

/**
 * Returns a callback that handles a mismatch: updates the header, then unflips after a delay.
 *
 * @param getState - Returns the current game state snapshot
 * @param setState - Replaces the current game state
 * @param cardEl - Returns the DOM element for a given card ID
 * @param updateHeader - Re-renders the header to reflect the updated state
 * @returns A zero-argument function to call on mismatch
 */
function makeHandleMismatch(getState: () => GameState, setState: (s: GameState) => void, cardEl: (id: number) => HTMLElement, updateHeader: () => void): () => void {
  return () => {
    updateHeader();
    setTimeout(() => applyMismatchDom(getState, setState, cardEl, updateHeader), UNMATCH_DELAY_MS);
  };
}

/**
 * Returns a callback that handles a match: marks cards matched, updates header, checks game over.
 *
 * @param getState - Returns the current game state snapshot
 * @param cardEl - Returns the DOM element for a given card ID
 * @param updateHeader - Re-renders the header to reflect the updated state
 * @param onGameOver - Callback invoked with the final state when all cards are matched
 * @returns A function accepting the previously flipped IDs and the newly matched card ID
 */
function makeHandleMatch(getState: () => GameState, cardEl: (id: number) => HTMLElement, updateHeader: () => void, onGameOver: (s: GameState) => void): (prevFlipped: number[], id: number) => void {
  return (prevFlipped, id) => {
    setTimeout(() => {
      [prevFlipped[0], id].forEach((mid) => cardEl(mid).classList.add('is-matched'));
      updateHeader();
      if (isGameOver(getState())) setTimeout(() => onGameOver(getState()), GAMEOVER_DELAY_MS);
    }, MATCH_DELAY_MS);
  };
}

/**
 * Processes a valid card flip: flips the card, advances state, and dispatches match/mismatch/turn.
 *
 * @param target - The clicked card element
 * @param getState - Returns the current game state snapshot
 * @param setState - Replaces the current game state
 * @param handleMatch - Called when two flipped cards are a matching pair
 * @param handleMismatch - Called when two flipped cards do not match
 * @param updateHeader - Re-renders the header to reflect the updated state
 */
function resolveFlip(target: HTMLElement, getState: () => GameState, setState: (s: GameState) => void, handleMatch: (prev: number[], id: number) => void, handleMismatch: () => void, updateHeader: () => void): void {
  const id = Number(target.dataset.id);
  const prevFlipped = [...getState().flippedCards];
  setState(flipCard(getState(), id));
  target.classList.add('is-flipped');
  if (!getState().isLocked && getState().flippedCards.length === 0) handleMatch(prevFlipped, id);
  else if (getState().isLocked) handleMismatch();
  else updateHeader();
}

/**
 * Attaches the card click handler to the board, guarding against locked state and already-flipped cards.
 *
 * @param boardWrap - The board element that receives click events
 * @param getState - Returns the current game state snapshot
 * @param setState - Replaces the current game state
 * @param handleMatch - Called when two flipped cards are a matching pair
 * @param handleMismatch - Called when two flipped cards do not match
 * @param updateHeader - Re-renders the header to reflect the updated state
 */
function attachCardClickHandler(boardWrap: HTMLElement, getState: () => GameState, setState: (s: GameState) => void, handleMatch: (prev: number[], id: number) => void, handleMismatch: () => void, updateHeader: () => void): void {
  boardWrap.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!target || target.classList.contains('is-flipped') || target.classList.contains('is-matched')) return;
    if (!getState().isLocked) resolveFlip(target, getState, setState, handleMatch, handleMismatch, updateHeader);
  });
}

/**
 * Renders the full game screen and wires up all interactions.
 *
 * @param initialState - The freshly created game state to start from
 * @param onGameOver - Callback invoked with the final state when all cards are matched
 * @param onExit - Callback invoked when the player confirms exiting via the modal
 * @returns The fully mounted game screen `HTMLElement`
 */
export function renderGameScreen(initialState: GameState, onGameOver: (state: GameState) => void, onExit: () => void): HTMLElement {
  let state = initialState;
  const isGaming = state.settings.theme === 'gaming';
  const { el, headerWrap, boardWrap } = createScreenElements(state);
  const getState = (): GameState => state;
  const setState = (s: GameState): void => { state = s; };
  const cardEl = (id: number): HTMLElement => boardWrap.querySelector<HTMLElement>(`.card[data-id="${id}"]`)!;
  const updateHeader = makeUpdateHeader(headerWrap, getState, isGaming, onExit);
  const handleMatch = makeHandleMatch(getState, cardEl, updateHeader, onGameOver);
  const handleMismatch = makeHandleMismatch(getState, setState, cardEl, updateHeader);
  attachCardClickHandler(boardWrap, getState, setState, handleMatch, handleMismatch, updateHeader);
  updateHeader();
  return el;
}
