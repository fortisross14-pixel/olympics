import type { CountryCode } from '../engine/types';

/**
 * Name pools by language group. Each group has separate male and
 * female first names, plus shared surnames. Names are common,
 * realistic given names — used to generate fictional legend athletes.
 */

export type LanguageGroup =
  | 'english'
  | 'spanish'
  | 'chinese'
  | 'japanese'
  | 'korean'
  | 'russian'
  | 'germanic'
  | 'french'
  | 'african';

interface NameBank {
  maleFirst: string[];
  femaleFirst: string[];
  surnames: string[];
}

export const NAME_BANKS: Record<LanguageGroup, NameBank> = {
  english: {
    maleFirst: ['James', 'Mason', 'Cole', 'Tyler', 'Brandon', 'Ethan'],
    femaleFirst: ['Olivia', 'Brielle', 'Harper', 'Caroline', 'Sienna', 'Quinn'],
    surnames: [
      'Holloway', 'Carter', 'Whitfield', 'Pemberton', 'Ashworth', 'Mitchell',
      'Hartley', 'Brooks', 'Caldwell', 'Wexford', 'Maddox', 'Harlow',
      'Ellington', 'Sutton', 'Radcliffe',
    ],
  },
  spanish: {
    maleFirst: ['Mateo', 'Iván', 'Diego', 'Andrés', 'Rafael', 'Joaquín'],
    femaleFirst: ['Lucía', 'Valentina', 'Camila', 'Rafaela', 'Sofía', 'Daniela'],
    surnames: [
      'Bellido', 'Cardoso', 'Herrera', 'Vásquez', 'Domínguez', 'Castillo',
      'Ferreira', 'Navarro', 'Mendoza', 'Quintero', 'Salazar', 'Ibáñez',
      'Cabrera', 'Montero', 'Reyes',
    ],
  },
  chinese: {
    maleFirst: ['Wei', 'Haoran', 'Mingyu', 'Jun', 'Bo', 'Lei'],
    femaleFirst: ['Wenjie', 'Xinyi', 'Mei', 'Jing', 'Yan', 'Ling'],
    surnames: [
      'Liu', 'Zhang', 'Wang', 'Chen', 'Li', 'Zhao',
      'Huang', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma',
      'Guo', 'Lin', 'He',
    ],
  },
  japanese: {
    maleFirst: ['Haruki', 'Kenta', 'Sora', 'Riku', 'Daichi', 'Yuto'],
    femaleFirst: ['Aoi', 'Yui', 'Hina', 'Mei', 'Sakura', 'Rin'],
    surnames: [
      'Tanaka', 'Morimoto', 'Yamada', 'Nakamura', 'Kobayashi', 'Suzuki',
      'Watanabe', 'Takahashi', 'Ito', 'Fujimoto', 'Sato', 'Hayashi',
      'Inoue', 'Kimura', 'Shimizu',
    ],
  },
  korean: {
    maleFirst: ['Min-seok', 'Ji-ho', 'Joon-ho', 'Seung-min', 'Tae-yang', 'Hyun-woo'],
    femaleFirst: ['Ji-won', 'Seo-yeon', 'Min-ji', 'Ha-eun', 'Yu-na', 'Soo-ah'],
    surnames: [
      'Kim', 'Park', 'Lee', 'Choi', 'Jung', 'Kang',
      'Cho', 'Yoon', 'Jang', 'Lim', 'Han', 'Oh',
      'Seo', 'Shin', 'Kwon',
    ],
  },
  russian: {
    maleFirst: ['Dimitri', 'Anatoly', 'Mikhail', 'Sergei', 'Yuri', 'Nikolai'],
    femaleFirst: ['Yelena', 'Anastasia', 'Irina', 'Natalia', 'Svetlana', 'Olga'],
    surnames: [
      'Volkov', 'Sokolov', 'Voronova', 'Petrov', 'Kuznetsov', 'Popov',
      'Morozov', 'Novikov', 'Fedorov', 'Romanov', 'Pavlov', 'Orlov',
      'Bondarenko', 'Tkachenko', 'Kovalenko',
    ],
  },
  germanic: {
    maleFirst: ['Maximilian', 'Lukas', 'Jonas', 'Felix', 'Niklas', 'Tobias'],
    femaleFirst: ['Hannah', 'Lena', 'Mia', 'Greta', 'Johanna', 'Clara'],
    surnames: [
      'Köhler', 'Müller', 'Schmidt', 'Fischer', 'Weber', 'Wagner',
      'Becker', 'Hoffmann', 'Schäfer', 'Richter', 'Klein', 'Wolf',
      'Neumann', 'Brandt', 'Vogel',
    ],
  },
  french: {
    maleFirst: ['Lucas', 'Théo', 'Hugo', 'Antoine', 'Julien', 'Mathis'],
    femaleFirst: ['Camille', 'Manon', 'Léa', 'Chloé', 'Inès', 'Juliette'],
    surnames: [
      'Dubois', 'Lefèvre', 'Moreau', 'Laurent', 'Girard', 'Bonnet',
      'Rousseau', 'Fontaine', 'Chevalier', 'Lemaire', 'Marchand', 'Dupont',
      'Mercier', 'Blanchard', 'Garnier',
    ],
  },
  african: {
    maleFirst: ['Eliud', 'Kwame', 'Tendai', 'Sefu', 'Jabari', 'Amari'],
    femaleFirst: ['Faith', 'Amara', 'Zola', 'Nia', 'Imani', 'Aaliyah'],
    surnames: [
      'Kipkemboi', 'Jeptoo', 'Mwangi', 'Okafor', 'Adeyemi', 'Mensah',
      'Diallo', 'Otieno', 'Banda', 'Cheruiyot', 'Kamau', 'Abara',
      'Nkemelu', 'Osei', 'Tadesse',
    ],
  },
};

/** Map each tracked country to its naming language group. */
export const COUNTRY_LANGUAGE: Record<CountryCode, LanguageGroup> = {
  USA: 'english',
  CHN: 'chinese',
  RUS: 'russian',
  GBR: 'english',
  GER: 'germanic',
  JPN: 'japanese',
  FRA: 'french',
  AUS: 'english',
  ITA: 'french', // closest Romance pool available
  KOR: 'korean',
  NED: 'germanic',
  ESP: 'spanish',
  CAN: 'english',
  BRA: 'spanish', // Portuguese ≈ Spanish pool for our purposes
  KEN: 'african',
  JAM: 'english',
  HUN: 'germanic',
  POL: 'russian', // Slavic pool
  NOR: 'germanic',
  NZL: 'english',
};
