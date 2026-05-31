export function renderStartScreen(onPlay: () => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'screen-start';

  el.innerHTML = `
    <p class="screen-start__eyebrow">It's play time.</p>
    <h1 class="screen-start__title">Ready to play?</h1>
    <button class="btn btn--primary" id="btn-play">
      <span>🎮</span> Play →
    </button>
    <img
      class="screen-start__decoration"
      src="/images/icons/controller-decoration.svg"
      alt=""
      aria-hidden="true"
    />
  `;

  el.querySelector('#btn-play')!.addEventListener('click', onPlay);
  return el;
}
