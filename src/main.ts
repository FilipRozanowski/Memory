import './styles/main.scss';
import type { GameSettings, GameState } from './types';
import { createInitialState } from './game/engine';
import { renderStartScreen } from './screens/StartScreen';
import { renderSettingsScreen } from './screens/SettingsScreen';
import { renderGameScreen } from './screens/GameScreen';
import { renderGameOverScreen } from './screens/GameOverScreen';
import { renderWinnerScreen } from './screens/WinnerScreen';

const APP = document.getElementById('app') as HTMLElement;

/**
 * Mounts a screen element, replacing the current content of `#app`.
 *
 * @param el - The screen element to display
 */
function show(el: HTMLElement): void {
  APP.innerHTML = '';
  APP.appendChild(el);
}

/**
 * Applies the given theme key as a `data-theme` attribute on `#app`.
 *
 * @param theme - The theme name to activate (e.g. `'gaming'`)
 */
function setTheme(theme: string): void {
  APP.dataset.theme = theme;
}

/** Navigates to the start screen and resets the theme to default. */
function goToStart(): void {
  setTheme('default');
  show(renderStartScreen(goToSettings));
}

/** Navigates to the settings screen. */
function goToSettings(): void {
  show(renderSettingsScreen(goToGame));
}

/**
 * Applies the chosen settings, creates initial state, and navigates to the game screen.
 *
 * @param settings - The settings selected by the player on the settings screen
 */
function goToGame(settings: GameSettings): void {
  setTheme(settings.theme);
  const state = createInitialState(settings);
  show(renderGameScreen(state, goToGameOver, goToSettings));
}

/**
 * Navigates to the game-over screen after the last card is matched.
 *
 * @param state - The final game state passed from the game screen
 */
function goToGameOver(state: GameState): void {
  show(renderGameOverScreen(state, () => goToWinner(state)));
}

/**
 * Navigates to the winner screen to announce the result.
 *
 * @param state - The final game state used to determine the winner
 */
function goToWinner(state: GameState): void {
  show(renderWinnerScreen(state, goToStart));
}

goToStart();
