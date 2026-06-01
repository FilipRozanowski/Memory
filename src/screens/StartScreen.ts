/** Builds the start screen HTML. */
function buildStartHtml(): string {
  return `
    <div class="screen-start__content">
      <p class="screen-start__eyebrow">It's play time.</p>
      <h1 class="screen-start__title">Ready to play?</h1>
      <button class="btn btn--primary" id="btn-play">
        <img src="/images/icons/icon-play.png" alt="" class="btn__icon" />
        Play <span class="btn__arrow">→</span>
      </button>
    </div>
    <img
      class="screen-start__decoration"
      src="/images/icons/decoration-controller.png"
      alt=""
      aria-hidden="true"
    />`;
}

/** Renders the start screen with a play button. */
export function renderStartScreen(onPlay: () => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'screen-start';
  el.innerHTML = buildStartHtml();
  el.querySelector('#btn-play')!.addEventListener('click', onPlay);
  return el;
}
