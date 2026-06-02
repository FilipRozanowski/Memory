import type { GameState, Player } from '../types';
import { getWinner } from '../game/engine';

const CONFETTI_COUNT = 60;
const CONFETTI_COLORS = ['#e84a4a', '#4ab4e8', '#e8d44a', '#4ae877', '#e8914a'];
const CONFETTI_HEIGHT = 120;

/** Describes a single confetti particle. */
interface ConfettiPiece {
  x: number; y: number;
  w: number; h: number;
  color: string;
  speed: number;
  angle: number;
  spin: number;
}

/** Returns the avatar image path based on result and active theme. */
function getAvatarSrc(result: Player | 'draw', isGaming: boolean): string {
  if (result === 'draw') return `/images/icons/player-draw${isGaming ? '-gaming' : ''}.png`;
  return isGaming ? '/images/icons/trophy.png' : `/images/icons/player-${result}.png`;
}

/** Returns the formatted winner name for display. */
function getWinnerLabel(winner: Player, isGaming: boolean): string {
  return isGaming
    ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Player`
    : `${winner.toUpperCase()} PLAYER`;
}

/** Returns the restart button label for the active theme. */
function getRestartLabel(isGaming: boolean): string {
  return isGaming ? 'Home' : 'Back to start';
}

/** Builds the draw result screen HTML. */
function buildDrawHtml(isGaming: boolean): string {
  return `
    <p class="screen-winner__label">It's a</p>
    <h1 class="screen-winner__name screen-winner__name--draw">DRAW</h1>
    <img class="screen-winner__avatar" src="${getAvatarSrc('draw', isGaming)}" alt="draw" />
    <button class="btn btn--secondary" id="btn-restart">${getRestartLabel(isGaming)}</button>`;
}

/** Builds the winner result screen HTML. */
function buildWinnerHtml(winner: Player, isGaming: boolean): string {
  return `
    <canvas class="screen-winner__confetti" id="confetti-canvas"></canvas>
    <p class="screen-winner__label">The winner is</p>
    <h1 class="screen-winner__name screen-winner__name--${winner}">
      ${getWinnerLabel(winner, isGaming)}
    </h1>
    <img class="screen-winner__avatar" src="${getAvatarSrc(winner, isGaming)}" alt="${winner} player" />
    <button class="btn btn--secondary" id="btn-restart">${getRestartLabel(isGaming)}</button>`;
}

/** Renders the winner screen with optional confetti animation. */
export function renderWinnerScreen(state: GameState, onRestart: () => void): HTMLElement {
  const result = getWinner(state);
  const isGaming = state.settings.theme === 'gaming';
  const isDraw = result === 'draw';

  const el = document.createElement('div');
  el.className = 'screen-winner';
  el.innerHTML = isDraw ? buildDrawHtml(isGaming) : buildWinnerHtml(result as Player, isGaming);

  if (!isDraw) {
    startConfetti(el.querySelector<HTMLCanvasElement>('#confetti-canvas')!);
  }

  el.querySelector('#btn-restart')!.addEventListener('click', onRestart);
  return el;
}

/** Creates an array of randomly positioned confetti particles. */
function createConfettiPieces(count: number, W: number, H: number): ConfettiPiece[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H - H,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speed: 1.5 + Math.random() * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
  }));
}

/** Draws one animation frame and advances each particle's position. */
function drawConfettiFrame(ctx: CanvasRenderingContext2D, pieces: ConfettiPiece[], W: number, H: number): void {
  ctx.clearRect(0, 0, W, H);
  pieces.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
    p.y += p.speed;
    p.angle += p.spin;
    if (p.y > H) p.y = -p.h;
  });
}

/** Starts the confetti animation on the given canvas and stops on click. */
function startConfetti(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')!;
  const W = (canvas.width = canvas.offsetWidth || window.innerWidth);
  const H = (canvas.height = CONFETTI_HEIGHT);
  const pieces = createConfettiPieces(CONFETTI_COUNT, W, H);
  let raf: number;

  const loop = (): void => {
    drawConfettiFrame(ctx, pieces, W, H);
    raf = requestAnimationFrame(loop);
  };

  loop();

  canvas.closest('.screen-winner')?.addEventListener(
    'click',
    () => cancelAnimationFrame(raf),
    { once: true }
  );
}
