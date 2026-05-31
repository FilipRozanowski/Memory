import type { GameState, Player } from '../types';
import { getWinner } from '../game/engine';

export function renderWinnerScreen(state: GameState, onRestart: () => void): HTMLElement {
  const result = getWinner(state);
  const isDraw = result === 'draw';
  const winner = result as Player;

  const el = document.createElement('div');
  el.className = 'screen-winner';

  el.innerHTML = `
    <canvas class="screen-winner__confetti" id="confetti-canvas"></canvas>
    <p class="screen-winner__label">The winner is</p>
    <h1 class="screen-winner__name screen-winner__name--${isDraw ? 'blue' : winner}">
      ${isDraw ? 'DRAW!' : `${winner.toUpperCase()} PLAYER`}
    </h1>
    <img
      class="screen-winner__avatar"
      src="/images/players/${isDraw ? 'draw' : winner}-avatar.svg"
      alt="${isDraw ? 'draw' : winner} player avatar"
    />
    <button class="btn btn--secondary" id="btn-restart">Back to start</button>
  `;

  el.querySelector('#btn-restart')!.addEventListener('click', onRestart);

  if (!isDraw) startConfetti(el.querySelector<HTMLCanvasElement>('#confetti-canvas')!);

  return el;
}

function startConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const W = (canvas.width = canvas.offsetWidth || window.innerWidth);
  const H = (canvas.height = 120);
  const colors = ['#e84a4a', '#4ab4e8', '#e8d44a', '#4ae877', '#e8914a'];
  const pieces = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H - H,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 1.5 + Math.random() * 2,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
  }));

  let raf: number;
  const draw = () => {
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
    raf = requestAnimationFrame(draw);
  };
  draw();

  canvas.closest('.screen-winner')?.addEventListener(
    'click',
    () => cancelAnimationFrame(raf),
    { once: true }
  );
}
