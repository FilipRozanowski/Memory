import type { BoardSize, GameSettings, Player, Theme } from '../types';
import { THEMES } from '../game/themes';

const THEMES_LIST: Theme[] = ['code-vibes', 'gaming'];
const BOARD_SIZES: BoardSize[] = [16, 24, 36];

/** Capitalizes the first letter of a string. */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Builds the HTML for a single radio option. */
function buildRadioOption(name: string, value: string, label: string, isSelected: boolean): string {
  return `
    <label class="radio-option ${isSelected ? 'is-selected' : ''}">
      <input type="radio" name="${name}" value="${value}" ${isSelected ? 'checked' : ''} />
      ${label}
    </label>`;
}

/** Builds the theme selection group HTML. */
function buildThemeOptions(settings: GameSettings): string {
  const options = THEMES_LIST.map((t) =>
    buildRadioOption('theme', t, THEMES[t].label, t === settings.theme)
  ).join('');
  return `
    <div class="settings-group">
      <div class="settings-group__label">
        <img src="/images/icons/icon-theme.png" class="settings-group__icon settings-group__icon--theme" alt="Theme icon" />
        <span>Game themes</span>
      </div>
      <div class="settings-group__options" id="theme-options">${options}</div>
    </div>`;
}

/** Builds the starting player selection group HTML. */
function buildPlayerOptions(settings: GameSettings): string {
  const players: Player[] = ['blue', 'orange'];
  const options = players.map((p) =>
    buildRadioOption('player', p, capitalize(p), p === settings.startingPlayer)
  ).join('');
  return `
    <div class="settings-group">
      <div class="settings-group__label">
        <img src="/images/icons/icon-player.png" class="settings-group__icon settings-group__icon--player" alt="Player icon" />
        <span>Choose player</span>
      </div>
      <div class="settings-group__options" id="player-options">${options}</div>
    </div>`;
}

/** Builds the board size selection group HTML. */
function buildSizeOptions(settings: GameSettings): string {
  const options = BOARD_SIZES.map((s) =>
    buildRadioOption('size', String(s), `${s} cards`, s === settings.boardSize)
  ).join('');
  return `
    <div class="settings-group">
      <div class="settings-group__label">
        <img src="/images/icons/icon-board.png" class="settings-group__icon settings-group__icon--board" alt="Board icon" />
        <span>Board size</span>
      </div>
      <div class="settings-group__options" id="size-options">${options}</div>
    </div>`;
}

/** Builds the summary bar showing the current selections. */
function buildSummaryBar(settings: GameSettings): string {
  return `
    <div class="screen-settings__actions">
      <span id="summary-theme">${THEMES[settings.theme].label}</span>
      <span class="divider">/</span>
      <span id="summary-player">${capitalize(settings.startingPlayer)}</span>
      <span class="divider">/</span>
      <span id="summary-size">${settings.boardSize} cards</span>
      <button class="btn btn--primary" id="btn-start">▶ Start</button>
    </div>`;
}

/** Builds the full settings screen HTML. */
function buildSettingsHtml(settings: GameSettings): string {
  return `
    <div class="screen-settings__left">
      <div class="screen-settings__title-wrap">
        <h1 class="screen-settings__title">Settings</h1>
        <div class="screen-settings__title-line"></div>
      </div>
      ${buildThemeOptions(settings)}
      ${buildPlayerOptions(settings)}
      ${buildSizeOptions(settings)}
    </div>
    <div class="screen-settings__right">
      <div class="screen-settings__preview">
        <img src="${THEMES[settings.theme].previewImage}" alt="Theme preview" />
      </div>
      ${buildSummaryBar(settings)}
    </div>`;
}

/** Registers all radio input change listeners and wires up summary + preview updates. */
function registerListeners(el: HTMLElement, getSettings: () => GameSettings, updateSettings: (s: GameSettings) => void): void {
  const summaryTheme  = el.querySelector<HTMLElement>('#summary-theme')!;
  const summaryPlayer = el.querySelector<HTMLElement>('#summary-player')!;
  const summarySize   = el.querySelector<HTMLElement>('#summary-size')!;
  const previewImg    = el.querySelector<HTMLImageElement>('.screen-settings__preview img')!;

  el.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
    input.addEventListener('change', () => {
      updateSettings({ ...getSettings(), theme: input.value as Theme });
      el.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summaryTheme.textContent = THEMES[getSettings().theme].label;
      previewImg.src = THEMES[getSettings().theme].previewImage;
    });
  });

  el.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((input) => {
    input.addEventListener('change', () => {
      updateSettings({ ...getSettings(), startingPlayer: input.value as Player });
      input.closest('.settings-group')?.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summaryPlayer.textContent = capitalize(getSettings().startingPlayer);
    });
  });

  el.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((input) => {
    input.addEventListener('change', () => {
      updateSettings({ ...getSettings(), boardSize: Number(input.value) as BoardSize });
      input.closest('.settings-group')?.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summarySize.textContent = `${getSettings().boardSize} cards`;
    });
  });
}

/** Renders the settings screen with theme, player, and board size selection. */
export function renderSettingsScreen(onStart: (settings: GameSettings) => void): HTMLElement {
  let settings: GameSettings = { theme: 'code-vibes', startingPlayer: 'blue', boardSize: 16 };

  const el = document.createElement('div');
  el.className = 'screen-settings';
  el.innerHTML = buildSettingsHtml(settings);

  registerListeners(
    el,
    () => settings,
    (updated) => { settings = updated; }
  );

  el.querySelector('#btn-start')!.addEventListener('click', () => onStart(settings));
  return el;
}
