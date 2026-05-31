import type { Theme, ThemeConfig } from '../types';

/** Generates an array of card image paths for the given folder. */
function cardImages(folder: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/images/cards/${folder}/card-${i + 1}.png`);
}

const CARD_COUNT = 18;

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
