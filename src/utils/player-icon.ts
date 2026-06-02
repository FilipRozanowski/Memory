const ICON_FILTER_BLUE = 'filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(175deg)';
const ICON_FILTER_ORANGE = 'filter:invert(60%) sepia(80%) saturate(500%) hue-rotate(340deg)';
const ICON_DEFAULT_SIZE = 18;

/**
 * Returns an inline `<img>` HTML string for a colored player icon.
 *
 * @param color - The player color to render (`'blue'` or `'orange'`)
 * @param size - Optional pixel size for width and height (default `18`)
 * @returns An HTML string containing the styled `<img>` element
 */
export function playerIcon(color: 'blue' | 'orange', size = ICON_DEFAULT_SIZE): string {
  const filter = color === 'blue' ? ICON_FILTER_BLUE : ICON_FILTER_ORANGE;
  return `<img
    src="/images/icons/icon-player.png"
    style="width:${size}px;height:${size}px;object-fit:contain;${filter}"
    alt="${color} player" />`;
}
