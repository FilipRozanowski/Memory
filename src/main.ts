import './styles/main.scss';
import type { GameSettings, GameState } from './types';
import { createInitialState } from './game/engine';
import { renderStartScreen } from './screens/StartScreen';
import { renderSettingsScreen } from './screens/SettingsScreen';
import { renderGameScreen } from './screens/GameScreen';
import { renderGameOverScreen } from './screens/GameOverScreen';
import { renderWinnerScreen } from './screens/WinnerScreen';

const APP = document.getElementById('app') as HTMLElement;

/** Mounts a screen element, replacing the current content. */
function show(el: HTMLElement): void {
  APP.innerHTML = '';
  APP.appendChild(el);
}

/** Applies the given theme to the app container. */
function setTheme(theme: string): void {
  APP.dataset.theme = theme;
}

function goToStart(): void {
  setTheme('default');
  show(renderStartScreen(goToSettings));
}

function goToSettings(): void {
  show(renderSettingsScreen(goToGame));
}

function goToGame(settings: GameSettings): void {
  setTheme(settings.theme);
  const state = createInitialState(settings);
  show(renderGameScreen(state, goToGameOver, goToStart));
}

function goToGameOver(state: GameState): void {
  show(renderGameOverScreen(state, () => goToWinner(state)));
}

function goToWinner(state: GameState): void {
  show(renderWinnerScreen(state, goToStart));
}

goToStart();
