const ICON_FILTER_BLUE = 'filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)';
const ICON_FILTER_ORANGE = 'filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)';
const ICON_DEFAULT_SIZE = 18;

/** Returns an HTML img string for a colored player icon. */
export function playerIcon(color: 'blue' | 'orange', size = ICON_DEFAULT_SIZE): string {
  const filter = color === 'blue' ? ICON_FILTER_BLUE : ICON_FILTER_ORANGE;
  return `<img
    src="/images/icons/icon-player.png"
    style="width:${size}px;height:${size}px;object-fit:contain;${filter}"
    alt="${color} player" />`;
}
