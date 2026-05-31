import './styles/main.scss';
import type { GameSettings, GameState } from './types';
import { createInitialState } from './game/engine';
import { renderStartScreen } from './screens/StartScreen';
import { renderSettingsScreen } from './screens/SettingsScreen';
import { renderGameScreen } from './screens/GameScreen';
import { renderGameOverScreen } from './screens/GameOverScreen';
import { renderWinnerScreen } from './screens/WinnerScreen';

const app = document.getElementById('app')!;

function show(el: HTMLElement) {
  app.innerHTML = '';
  app.appendChild(el);
}

function goToStart() {
  show(renderStartScreen(goToSettings));
}

function goToSettings() {
  show(renderSettingsScreen(goToGame));
}

function goToGame(settings: GameSettings) {
  const state = createInitialState(settings);
  show(renderGameScreen(state, goToGameOver, goToStart));
}

function goToGameOver(state: GameState) {
  show(renderGameOverScreen(state, () => goToWinner(state)));
}

function goToWinner(state: GameState) {
  show(renderWinnerScreen(state, goToStart));
}

goToStart();
