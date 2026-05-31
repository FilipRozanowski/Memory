import type { BoardSize, GameSettings, Player, Theme } from '../types';
import { THEMES } from '../game/themes';

const THEMES_LIST: Theme[] = ['code-vibes', 'gaming'];
const BOARD_SIZES: BoardSize[] = [16, 24, 36];

export function renderSettingsScreen(onStart: (settings: GameSettings) => void): HTMLElement {
  let settings: GameSettings = {
    theme: 'code-vibes',
    startingPlayer: 'blue',
    boardSize: 16,
  };

  const el = document.createElement('div');
  el.className = 'screen-settings';

  const updatePreview = () => {
    const img = el.querySelector<HTMLImageElement>('.screen-settings__preview img');
    if (img) img.src = THEMES[settings.theme].previewImage;
  };

  el.innerHTML = `
    <div class="screen-settings__left">
      <div class="screen-settings__title-wrap">
        <h1 class="screen-settings__title">Settings</h1>
        <div class="screen-settings__title-line"></div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">
          <img src="/images/icons/icon-theme.png" class="settings-group__icon settings-group__icon--theme" alt="" />
          <span>Game themes</span>
        </div>
        <div class="settings-group__options" id="theme-options">
          ${THEMES_LIST.map((t) => `
            <label class="radio-option ${t === settings.theme ? 'is-selected' : ''}">
              <input type="radio" name="theme" value="${t}" ${t === settings.theme ? 'checked' : ''} />
              ${THEMES[t].label}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">
          <img src="/images/icons/icon-player.png" class="settings-group__icon settings-group__icon--player" alt="" />
          <span>Choose player</span>
        </div>
        <div class="settings-group__options" id="player-options">
          ${(['blue', 'orange'] as Player[]).map((p) => `
            <label class="radio-option ${p === settings.startingPlayer ? 'is-selected' : ''}">
              <input type="radio" name="player" value="${p}" ${p === settings.startingPlayer ? 'checked' : ''} />
              ${p.charAt(0).toUpperCase() + p.slice(1)}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">
          <img src="/images/icons/icon-board.png" class="settings-group__icon settings-group__icon--board" alt="" />
          <span>Board size</span>
        </div>
        <div class="settings-group__options" id="size-options">
          ${BOARD_SIZES.map((s) => `
            <label class="radio-option ${s === settings.boardSize ? 'is-selected' : ''}">
              <input type="radio" name="size" value="${s}" ${s === settings.boardSize ? 'checked' : ''} />
              ${s} cards
            </label>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="screen-settings__right">
      <div class="screen-settings__preview">
        <img src="${THEMES[settings.theme].previewImage}" alt="Theme preview" />
      </div>
      <div class="screen-settings__actions">
        <span id="summary-theme">${THEMES[settings.theme].label}</span>
        <span class="divider">/</span>
        <span id="summary-player">${settings.startingPlayer.charAt(0).toUpperCase() + settings.startingPlayer.slice(1)}</span>
        <span class="divider">/</span>
        <span id="summary-size">${settings.boardSize} cards</span>
        <button class="btn btn--primary" id="btn-start">▶ Start</button>
      </div>
    </div>
  `;

  const summaryTheme  = el.querySelector<HTMLElement>('#summary-theme')!;
  const summaryPlayer = el.querySelector<HTMLElement>('#summary-player')!;
  const summarySize   = el.querySelector<HTMLElement>('#summary-size')!;

  el.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
    input.addEventListener('change', () => {
      settings = { ...settings, theme: input.value as Theme };
      el.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summaryTheme.textContent = THEMES[settings.theme].label;
      updatePreview();
    });
  });

  el.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((input) => {
    input.addEventListener('change', () => {
      settings = { ...settings, startingPlayer: input.value as Player };
      input.closest('.settings-group')?.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summaryPlayer.textContent = settings.startingPlayer.charAt(0).toUpperCase() + settings.startingPlayer.slice(1);
    });
  });

  el.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((input) => {
    input.addEventListener('change', () => {
      settings = { ...settings, boardSize: Number(input.value) as BoardSize };
      input.closest('.settings-group')?.querySelectorAll('.radio-option').forEach((l) => l.classList.remove('is-selected'));
      input.closest('.radio-option')?.classList.add('is-selected');
      summarySize.textContent = `${settings.boardSize} cards`;
    });
  });

  el.querySelector('#btn-start')!.addEventListener('click', () => onStart(settings));

  return el;
}
