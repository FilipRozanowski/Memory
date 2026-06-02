/** Active visual theme for the game. */
export type Theme = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

/** The two competing players, identified by color. */
export type Player = 'blue' | 'orange';

/** Supported board sizes (total number of cards). */
export type BoardSize = 16 | 24 | 36;

/** Named application screens used for routing. */
export type Screen = 'start' | 'settings' | 'game' | 'gameover' | 'winner';

/** Player-configurable options chosen on the settings screen. */
export interface GameSettings {
  theme: Theme;
  startingPlayer: Player;
  boardSize: BoardSize;
}

/** Immutable data describing a single card on the board. */
export interface CardData {
  id: number;
  pairId: number;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/** Full snapshot of the game at any point in time. */
export interface GameState {
  settings: GameSettings;
  cards: CardData[];
  currentPlayer: Player;
  scores: Record<Player, number>;
  flippedCards: number[];
  isLocked: boolean;
}

/** Static configuration for a single visual theme. */
export interface ThemeConfig {
  name: string;
  label: string;
  cardImages: string[];
  previewImage: string;
}
