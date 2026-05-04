export const ninjaFirstNames = [
  'Akio',
  'Ren',
  'Sora',
  'Hana',
  'Daichi',
  'Mei',
  'Kaito',
  'Nari',
  'Toma',
  'Yui',
] as const;

export const ninjaLastNames = [
  'Kurogane',
  'Hayashi',
  'Mizuno',
  'Takeda',
  'Ishikawa',
  'Fujimori',
  'Hoshino',
  'Arakida',
  'Moriyama',
  'Shirakawa',
] as const;

export type NinjaFirstName = (typeof ninjaFirstNames)[number];
export type NinjaLastName = (typeof ninjaLastNames)[number];
