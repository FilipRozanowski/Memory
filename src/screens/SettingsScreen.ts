import type { BoardSize, GameSettings, Player, Theme } from '../types';
import { THEMES } from '../game/themes';

const THEMES_LIST: Theme[] = ['code-vibes', 'gaming'];
const BOARD_SIZES: BoardSize[] = [16, 24, 36];

const PLACEHOLDER_PLAYER = 'Player';
const PLACEHOLDER_SIZE = 'Board size';

/** Holds references to summary DOM elements and the preview image. */
interface SettingsDomRefs {
  summaryTheme: HTMLElement;
  summaryPlayer: HTMLElement;
  summarySize: HTMLElement;
  previewImg: HTMLImageElement;
}

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

/** Builds the theme selection group HTML with the current theme pre-selected. */
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

/** Builds the starting player selection group HTML with no pre-selection. */
function buildPlayerOptions(): string {
  const players: Player[] = ['blue', 'orange'];
  const options = players.map((p) =>
    buildRadioOption('player', p, capitalize(p), false)
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

/** Builds the board size selection group HTML with no pre-selection. */
function buildSizeOptions(): string {
  const options = BOARD_SIZES.map((s) =>
    buildRadioOption('size', String(s), `${s} cards`, false)
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

/** Builds the summary bar with placeholders for fields not yet selected. */
function buildSummaryBar(settings: GameSettings): string {
  return `
    <div class="screen-settings__actions">
      <span id="summary-theme">${THEMES[settings.theme].label}</span>
      <span class="divider">/</span>
      <span id="summary-player" class="summary-placeholder">${PLACEHOLDER_PLAYER}</span>
      <span class="divider">/</span>
      <span id="summary-size" class="summary-placeholder">${PLACEHOLDER_SIZE}</span>
      <button class="btn btn--primary" id="btn-start">▶ Start</button>
    </div>`;
}

/** Builds the full settings screen HTML. */
function buildSettingsHtml(settings: GameSettings): string {
  return `
    <div class="screen-settings__inner">
      <div class="screen-settings__left">
        <div class="screen-settings__title-wrap">
          <h1 class="screen-settings__title">Settings</h1>
          <div class="screen-settings__title-line"></div>
        </div>
        ${buildThemeOptions(settings)}
        ${buildPlayerOptions()}
        ${buildSizeOptions()}
      </div>
      <div class="screen-settings__right">
        <div class="screen-settings__preview">
          <img src="${THEMES[settings.theme].previewImage}" alt="Theme preview" />
        </div>
        ${buildSummaryBar(settings)}
      </div>
    </div>`;
}

/** Queries and returns all relevant DOM refs from the settings element. */
function getSettingsDomRefs(el: HTMLElement): SettingsDomRefs {
  return {
    summaryTheme:  el.querySelector<HTMLElement>('#summary-theme')!,
    summaryPlayer: el.querySelector<HTMLElement>('#summary-player')!,
    summarySize:   el.querySelector<HTMLElement>('#summary-size')!,
    previewImg:    el.querySelector<HTMLImageElement>('.screen-settings__preview img')!,
  };
}

/** Registers hover and change listeners for the theme radio inputs. */
function registerThemeListeners(el: HTMLElement, getSettings: () => GameSettings, update: (s: GameSettings, f: string) => void, refs: SettingsDomRefs): void {
  el.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
    const label = input.closest('.radio-option')!;
    label.addEventListener('mouseenter', () => { refs.previewImg.src = THEMES[input.value as Theme].previewImage; });
    label.addEventListener('mouseleave', () => { refs.previewImg.src = THEMES[getSettings().theme].previewImage; });
    input.addEventListener('change', () => {
      update({ ...getSettings(), theme: input.value as Theme }, 'theme');
      el.querySelectorAll('#theme-options .radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      refs.summaryTheme.textContent = THEMES[getSettings().theme].label;
      refs.previewImg.src = THEMES[getSettings().theme].previewImage;
    });
  });
}

/** Registers change listeners for the player radio inputs. */
function registerPlayerListeners(el: HTMLElement, getSettings: () => GameSettings, update: (s: GameSettings, f: string) => void, refs: SettingsDomRefs): void {
  el.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((input) => {
    input.addEventListener('change', () => {
      update({ ...getSettings(), startingPlayer: input.value as Player }, 'player');
      el.querySelectorAll('#player-options .radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      refs.summaryPlayer.textContent = capitalize(getSettings().startingPlayer);
      refs.summaryPlayer.classList.remove('summary-placeholder');
    });
  });
}

/** Registers change listeners for the board size radio inputs. */
function registerSizeListeners(el: HTMLElement, getSettings: () => GameSettings, update: (s: GameSettings, f: string) => void, refs: SettingsDomRefs): void {
  el.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((input) => {
    input.addEventListener('change', () => {
      update({ ...getSettings(), boardSize: Number(input.value) as BoardSize }, 'size');
      el.querySelectorAll('#size-options .radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      refs.summarySize.textContent = `${getSettings().boardSize} cards`;
      refs.summarySize.classList.remove('summary-placeholder');
    });
  });
}

/** Registers all radio listeners for theme, player and board size. */
function registerListeners(el: HTMLElement, getSettings: () => GameSettings, update: (s: GameSettings, field: string) => void): void {
  const refs = getSettingsDomRefs(el);
  registerThemeListeners(el, getSettings, update, refs);
  registerPlayerListeners(el, getSettings, update, refs);
  registerSizeListeners(el, getSettings, update, refs);
}

/** Renders the settings screen with theme, player and board size selection. */
export function renderSettingsScreen(onStart: (settings: GameSettings) => void): HTMLElement {
  let settings: GameSettings = { theme: 'code-vibes', startingPlayer: 'blue', boardSize: 16 };
  let playerSelected = false;
  let sizeSelected = false;

  const el = document.createElement('div');
  el.className = 'screen-settings';
  el.innerHTML = buildSettingsHtml(settings);

  const btnStart = el.querySelector<HTMLButtonElement>('#btn-start')!;
  btnStart.disabled = true;

  const updateStartButton = (): void => { btnStart.disabled = !(playerSelected && sizeSelected); };

  registerListeners(el, () => settings, (updated, field) => {
    settings = updated;
    if (field === 'player') playerSelected = true;
    if (field === 'size')   sizeSelected = true;
    updateStartButton();
  });

  btnStart.addEventListener('click', () => onStart(settings));
  return el;
}
