import type { Theme, ThemeConfig } from '../types';

function cardImages(folder: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/images/cards/${folder}/card-${i + 1}.png`);
}

export const THEMES: Record<Theme, ThemeConfig> = {
  'code-vibes': {
    name: 'code-vibes',
    label: 'Code vibes theme',
    previewImage: '/images/cards/code-vibes/preview.png',
    cardImages: cardImages('code-vibes', 18),
  },
  gaming: {
    name: 'gaming',
    label: 'Gaming theme',
    previewImage: '/images/cards/gaming/preview.png',
    cardImages: cardImages('gaming', 18),
  },
  'da-projects': {
    name: 'da-projects',
    label: 'DA Projects theme',
    previewImage: '/images/cards/da-projects/preview.png',
    cardImages: cardImages('da-projects', 18),
  },
  foods: {
    name: 'foods',
    label: 'Foods theme',
    previewImage: '/images/cards/foods/preview.png',
    cardImages: cardImages('foods', 18),
  },
};
