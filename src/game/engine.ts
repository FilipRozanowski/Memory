import type { BoardSize, CardData, GameSettings, GameState, Player, Theme } from '../types';
import { THEMES } from './themes';

export function createCards(theme: Theme, boardSize: BoardSize): CardData[] {
  const pairCount = boardSize / 2;
  const images = THEMES[theme].cardImages.slice(0, pairCount);

  const cards: CardData[] = images.flatMap((src, i) => [
    { id: i * 2, pairId: i, imageSrc: src, isFlipped: false, isMatched: false },
    { id: i * 2 + 1, pairId: i, imageSrc: src, isFlipped: false, isMatched: false },
  ]);

  return shuffle(cards);
}

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

export function flipCard(state: GameState, cardId: number): GameState {
  if (state.isLocked) return state;

  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return state;
  if (state.flippedCards.length >= 2) return state;

  const updatedCards = state.cards.map((c) =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );

  const flippedCards = [...state.flippedCards, cardId];

  if (flippedCards.length === 2) {
    const [firstId, secondId] = flippedCards;
    const first = updatedCards.find((c) => c.id === firstId)!;
    const second = updatedCards.find((c) => c.id === secondId)!;

    if (first.pairId === second.pairId) {
      const matchedCards = updatedCards.map((c) =>
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

    return { ...state, cards: updatedCards, flippedCards, isLocked: true };
  }

  return { ...state, cards: updatedCards, flippedCards };
}

export function unflipCards(state: GameState): GameState {
  const [firstId, secondId] = state.flippedCards;
  const unflipped = state.cards.map((c) =>
    c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
  );
  const next: Player = state.currentPlayer === 'blue' ? 'orange' : 'blue';
  return { ...state, cards: unflipped, flippedCards: [], isLocked: false, currentPlayer: next };
}

export function isGameOver(state: GameState): boolean {
  return state.cards.every((c) => c.isMatched);
}

export function getWinner(state: GameState): Player | 'draw' {
  const { blue, orange } = state.scores;
  if (blue > orange) return 'blue';
  if (orange > blue) return 'orange';
  return 'draw';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
