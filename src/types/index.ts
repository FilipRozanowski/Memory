export type Theme = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';
export type Player = 'blue' | 'orange';
export type BoardSize = 16 | 24 | 36;
export type Screen = 'start' | 'settings' | 'game' | 'gameover' | 'winner';

export interface GameSettings {
  theme: Theme;
  startingPlayer: Player;
  boardSize: BoardSize;
}

export interface CardData {
  id: number;
  pairId: number;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  settings: GameSettings;
  cards: CardData[];
  currentPlayer: Player;
  scores: Record<Player, number>;
  flippedCards: number[];
  isLocked: boolean;
}

export interface ThemeConfig {
  name: string;
  label: string;
  cardImages: string[];
  previewImage: string;
}
