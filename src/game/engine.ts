import type { BoardSize, CardData, GameSettings, GameState, Player, Theme } from '../types';
import { THEMES } from './themes';

/**
 * Creates and shuffles all card pairs for a given theme and board size.
 *
 * @param theme - The active visual theme used to pick card images
 * @param boardSize - Total number of cards; half this value becomes the pair count
 * @returns A shuffled array of `CardData` objects ready for a new game
 */
export function createCards(theme: Theme, boardSize: BoardSize): CardData[] {
  const pairCount = boardSize / 2;
  const images = THEMES[theme].cardImages.slice(0, pairCount);

  const cards: CardData[] = images.flatMap((src, i) => [
    { id: i * 2,     pairId: i, imageSrc: src, isFlipped: false, isMatched: false },
    { id: i * 2 + 1, pairId: i, imageSrc: src, isFlipped: false, isMatched: false },
  ]);

  return shuffle(cards);
}

/**
 * Creates the initial game state from the player's chosen settings.
 *
 * @param settings - Theme, starting player, and board size selected by the user
 * @returns A fresh `GameState` with shuffled cards and zeroed scores
 */
export function createInitialState(settings: GameSettings): GameState {
  return {
    settings,
    cards: createCards(settings.theme, settings.boardSize),
    currentPlayer: settings.startingPlayer,
    scores: { blue: 0, orange: 0 },
    flippedCards: [],
    isLocked: false,
  };
}

/**
 * Marks two cards as matched and awards a point to the current player.
 *
 * @param state - The current game state before the match is applied
 * @param firstId - Card ID of the first flipped card
 * @param secondId - Card ID of the second flipped card
 * @returns A new `GameState` with the matched cards and updated score
 */
function applyMatch(state: GameState, firstId: number, secondId: number): GameState {
  const matchedCards = state.cards.map((c) =>
    c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
  );
  const newScore = state.scores[state.currentPlayer] + 1;
  return {
    ...state,
    cards: matchedCards,
    scores: { ...state.scores, [state.currentPlayer]: newScore },
    flippedCards: [],
    isLocked: false,
  };
}

/**
 * Locks the board after a failed match attempt.
 *
 * @param state - The current game state
 * @param updatedCards - Card array with both mismatched cards flipped face-up
 * @param flippedCards - IDs of the two mismatched cards
 * @returns A new `GameState` with `isLocked` set to `true`
 */
function applyMismatch(state: GameState, updatedCards: CardData[], flippedCards: number[]): GameState {
  return { ...state, cards: updatedCards, flippedCards, isLocked: true };
}

/**
 * Flips a card and resolves a match or mismatch when two cards are revealed.
 *
 * @param state - The current game state
 * @param cardId - The ID of the card the player clicked
 * @returns An updated `GameState` reflecting the flip and any match/mismatch result
 */
export function flipCard(state: GameState, cardId: number): GameState {
  if (state.isLocked) return state;

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return state;
  if (state.flippedCards.length >= 2) return state;

  const updatedCards = state.cards.map((c) =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );
  const flippedCards = [...state.flippedCards, cardId];

  if (flippedCards.length < 2) {
    return { ...state, cards: updatedCards, flippedCards };
  }

  const [firstId, secondId] = flippedCards;
  const first = updatedCards.find((c) => c.id === firstId)!;
  const second = updatedCards.find((c) => c.id === secondId)!;

  return first.pairId === second.pairId
    ? applyMatch(state, firstId, secondId)
    : applyMismatch(state, updatedCards, flippedCards);
}

/**
 * Unflips both mismatched cards and passes the turn to the other player.
 *
 * @param state - The locked game state with two mismatched cards face-up
 * @returns A new `GameState` with the cards flipped back and the next player active
 */
export function unflipCards(state: GameState): GameState {
  const [firstId, secondId] = state.flippedCards;
  const unflipped = state.cards.map((c) =>
    c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
  );
  const next: Player = state.currentPlayer === 'blue' ? 'orange' : 'blue';
  return { ...state, cards: unflipped, flippedCards: [], isLocked: false, currentPlayer: next };
}

/**
 * Returns `true` when every card on the board has been matched.
 *
 * @param state - The current game state to evaluate
 * @returns `true` if all cards are matched, otherwise `false`
 */
export function isGameOver(state: GameState): boolean {
  return state.cards.every((c) => c.isMatched);
}

/**
 * Determines the winning player, or `'draw'` if scores are tied.
 *
 * @param state - The game state at the end of the game
 * @returns The winning `Player` (`'blue'` or `'orange'`), or `'draw'`
 */
export function getWinner(state: GameState): Player | 'draw' {
  const { blue, orange } = state.scores;
  if (blue > orange) return 'blue';
  if (orange > blue) return 'orange';
  return 'draw';
}

/**
 * Returns a new array with elements shuffled using the Fisher-Yates algorithm.
 *
 * @param arr - The array to shuffle
 * @returns A new shuffled array of the same type
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
