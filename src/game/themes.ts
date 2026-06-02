import type { Theme, ThemeConfig } from '../types';

const CARD_COUNT = 18;

/**
 * Generates an array of sequential card image paths for a theme folder.
 *
 * @param folder - The subfolder name under `/images/cards/`
 * @param count - The number of card images to generate
 * @returns An array of image path strings (`card-1.png` … `card-N.png`)
 */
function cardImages(folder: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/images/cards/${folder}/card-${i + 1}.png`);
}

/** All available themes mapped by their theme key. */
export const THEMES: Record<Theme, ThemeConfig> = {
  'code-vibes': {
    name: 'code-vibes',
    label: 'Code vibes theme',
    previewImage: '/images/cards/code-vibes/preview.png',
    cardImages: cardImages('code-vibes', CARD_COUNT),
  },
  gaming: {
    name: 'gaming',
    label: 'Gaming theme',
    previewImage: '/images/cards/gaming/preview.png',
    cardImages: cardImages('gaming', CARD_COUNT),
  },
  'da-projects': {
    name: 'da-projects',
    label: 'DA Projects theme',
    previewImage: '/images/cards/da-projects/preview.png',
    cardImages: cardImages('da-projects', CARD_COUNT),
  },
  foods: {
    name: 'foods',
    label: 'Foods theme',
    previewImage: '/images/cards/foods/preview.png',
    cardImages: cardImages('foods', CARD_COUNT),
  },
};
