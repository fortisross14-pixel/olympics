import type { City, Sport } from '../engine/types';

/**
 * Demonstration sports — host-exclusive, don't count toward medal totals,
 * only exist for that cycle. Defined here so each city's data is
 * self-contained.
 *
 * All demo sports are marked with demonstration: true. Their events use
 * the 'rank' unit since these are exhibition sports without standardized
 * baselines in our engine.
 */

const PADEL: Sport = {
  id: 'demo_padel',
  name: 'Padel',
  demonstration: true,
  events: [
    { id: 'demo_padel_md', name: "Men's Padel Doubles", unit: 'rank', baseline: null },
    { id: 'demo_padel_wd', name: "Women's Padel Doubles", unit: 'rank', baseline: null },
  ],
};

const FUTSAL: Sport = {
  id: 'demo_futsal',
  name: 'Futsal',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_futsal_m', name: "Men's Futsal", unit: 'rank', baseline: null },
  ],
};

const BEACH_FOOTBALL: Sport = {
  id: 'demo_beach_football',
  name: 'Beach Football',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_bfb_m', name: "Men's Beach Football", unit: 'rank', baseline: null },
    { id: 'demo_bfb_w', name: "Women's Beach Football", unit: 'rank', baseline: null },
  ],
};

const KARATE: Sport = {
  id: 'demo_karate',
  name: 'Karate',
  demonstration: true,
  events: [
    { id: 'demo_kar_kata_m', name: "Men's Kata", unit: 'rank', baseline: null },
    { id: 'demo_kar_kata_w', name: "Women's Kata", unit: 'rank', baseline: null },
    { id: 'demo_kar_kumite_m', name: "Men's Kumite -75kg", unit: 'rank', baseline: null },
    { id: 'demo_kar_kumite_w', name: "Women's Kumite -61kg", unit: 'rank', baseline: null },
  ],
};

const CRICKET: Sport = {
  id: 'demo_cricket',
  name: 'Cricket T20',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_crk_m', name: "Men's Cricket T20", unit: 'rank', baseline: null },
    { id: 'demo_crk_w', name: "Women's Cricket T20", unit: 'rank', baseline: null },
  ],
};

const SQUASH: Sport = {
  id: 'demo_squash',
  name: 'Squash',
  demonstration: true,
  events: [
    { id: 'demo_sqs_m', name: "Men's Squash", unit: 'rank', baseline: null },
    { id: 'demo_sqs_w', name: "Women's Squash", unit: 'rank', baseline: null },
  ],
};

const TAEKWONDO: Sport = {
  id: 'demo_taekwondo',
  name: 'Taekwondo',
  demonstration: true,
  events: [
    { id: 'demo_tkd_m', name: "Men's Taekwondo -68kg", unit: 'rank', baseline: null },
    { id: 'demo_tkd_w', name: "Women's Taekwondo -57kg", unit: 'rank', baseline: null },
  ],
};

const PETANQUE: Sport = {
  id: 'demo_petanque',
  name: 'Pétanque',
  demonstration: true,
  events: [
    { id: 'demo_pet_m', name: "Men's Pétanque", unit: 'rank', baseline: null },
    { id: 'demo_pet_w', name: "Women's Pétanque", unit: 'rank', baseline: null },
  ],
};

const NETBALL: Sport = {
  id: 'demo_netball',
  name: 'Netball',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_net_w', name: "Women's Netball", unit: 'rank', baseline: null },
  ],
};

const POLO: Sport = {
  id: 'demo_polo',
  name: 'Polo',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_polo', name: 'Polo', unit: 'rank', baseline: null },
  ],
};

const CURLING_SUMMER: Sport = {
  // Summer floor curling — invented variation to fit summer Games
  id: 'demo_floor_curling',
  name: 'Floor Curling',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_fc_mix', name: 'Mixed Floor Curling', unit: 'rank', baseline: null },
  ],
};

const ICE_BANDY_SUMMER: Sport = {
  // Norwegian bandy on summer rink — also a stretch but fits the theme
  id: 'demo_bandy',
  name: 'Bandy',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_bandy_m', name: "Men's Bandy", unit: 'rank', baseline: null },
  ],
};

const SUMO: Sport = {
  id: 'demo_sumo',
  name: 'Sumo',
  demonstration: true,
  events: [
    { id: 'demo_sumo_lt', name: "Sumo Lightweight", unit: 'rank', baseline: null },
    { id: 'demo_sumo_hw', name: "Sumo Heavyweight", unit: 'rank', baseline: null },
  ],
};

const KABADDI: Sport = {
  id: 'demo_kabaddi',
  name: 'Kabaddi',
  demonstration: true,
  team: true,
  events: [
    { id: 'demo_kab_m', name: "Men's Kabaddi", unit: 'rank', baseline: null },
  ],
};

const FOOTBALL_TENNIS: Sport = {
  id: 'demo_foottennis',
  name: 'Foot Tennis',
  demonstration: true,
  events: [
    { id: 'demo_ft_m', name: "Men's Foot Tennis", unit: 'rank', baseline: null },
  ],
};

/**
 * Host city pool. Each city has a two-color theme and a demonstration
 * sport (or pair) that only appears when that city hosts.
 */
export const CITY_POOL: City[] = [
  // Untracked-country hosts (flavor only):
  {
    name: 'Istanbul', country: 'Turkey', bonus: 'Wrestling tradition',
    countryCode: null,
    themePrimary: '#C8102E', themeSecondary: '#1A2B4C',
    demonstrationSports: [],
  },
  {
    name: 'Cape Town', country: 'South Africa', bonus: 'Rugby heartland',
    countryCode: null,
    themePrimary: '#007749', themeSecondary: '#FFB81C',
    demonstrationSports: [NETBALL],
  },
  {
    name: 'Doha', country: 'Qatar', bonus: 'Desert ambition',
    countryCode: null,
    themePrimary: '#8D1B3D', themeSecondary: '#E9C46A',
    demonstrationSports: [SQUASH],
  },
  {
    name: 'Mumbai', country: 'India', bonus: 'Cricket nation',
    countryCode: null,
    themePrimary: '#FF671F', themeSecondary: '#046A38',
    demonstrationSports: [CRICKET, KABADDI],
  },
  {
    name: 'Buenos Aires', country: 'Argentina', bonus: 'Polo & passion',
    countryCode: null,
    themePrimary: '#75AADB', themeSecondary: '#F6B40E',
    demonstrationSports: [POLO, FOOTBALL_TENNIS],
  },
  {
    name: 'Stockholm', country: 'Sweden', bonus: 'Endurance country',
    countryCode: null,
    themePrimary: '#005B99', themeSecondary: '#FECC02',
    demonstrationSports: [ICE_BANDY_SUMMER, CURLING_SUMMER],
  },

  // Tracked-country hosts:
  {
    name: 'Madrid', country: 'Spain', bonus: 'Football legacy',
    countryCode: 'ESP',
    themePrimary: '#AA151B', themeSecondary: '#F1BF00',
    demonstrationSports: [PADEL, FUTSAL],
  },
  {
    name: 'Toronto', country: 'Canada', bonus: 'Hockey roots',
    countryCode: 'CAN',
    themePrimary: '#D52B1E', themeSecondary: '#2F3640',
    demonstrationSports: [CURLING_SUMMER],
  },
  {
    name: 'Seoul', country: 'South Korea', bonus: 'Archery dynasty',
    countryCode: 'KOR',
    themePrimary: '#003478', themeSecondary: '#C8102E',
    demonstrationSports: [TAEKWONDO],
  },
  {
    name: 'Rome', country: 'Italy', bonus: 'Classical heritage',
    countryCode: 'ITA',
    themePrimary: '#0C5DA5', themeSecondary: '#C8B560',
    demonstrationSports: [PETANQUE],
  },
  {
    name: 'Rio de Janeiro', country: 'Brazil', bonus: 'Carnival nation',
    countryCode: 'BRA',
    themePrimary: '#009C3B', themeSecondary: '#FFDF00',
    demonstrationSports: [BEACH_FOOTBALL, FOOTBALL_TENNIS],
  },
  {
    name: 'Tokyo', country: 'Japan', bonus: 'Precision & ritual',
    countryCode: 'JPN',
    themePrimary: '#BC002D', themeSecondary: '#1C1C1C',
    demonstrationSports: [KARATE, SUMO],
  },
  {
    name: 'Sydney', country: 'Australia', bonus: 'Ocean & ozone',
    countryCode: 'AUS',
    themePrimary: '#012169', themeSecondary: '#FFCD00',
    demonstrationSports: [NETBALL],
  },
  {
    name: 'Oslo', country: 'Norway', bonus: 'Endurance nation',
    countryCode: 'NOR',
    themePrimary: '#BA0C2F', themeSecondary: '#00205B',
    demonstrationSports: [ICE_BANDY_SUMMER],
  },
  {
    name: 'Budapest', country: 'Hungary', bonus: 'Aquatic tradition',
    countryCode: 'HUN',
    themePrimary: '#436F4D', themeSecondary: '#CD2A3E',
    demonstrationSports: [SQUASH],
  },
  {
    name: 'Amsterdam', country: 'Netherlands', bonus: 'Cycling capital',
    countryCode: 'NED',
    themePrimary: '#FF6B00', themeSecondary: '#21468B',
    demonstrationSports: [PETANQUE],
  },
  {
    name: 'Warsaw', country: 'Poland', bonus: 'Throwers & strongmen',
    countryCode: 'POL',
    themePrimary: '#DC143C', themeSecondary: '#F5F5F5',
    demonstrationSports: [],
  },
];
