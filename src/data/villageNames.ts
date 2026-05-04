export const villageNames = [
  'Sunfall Village',
  'Mossgate Village',
  'Stoneveil Hamlet',
  'Silver Reed Village',
  'Ashen Brook Village',
  'Cloudrest Village',
  'Crane Hollow Village',
  'Red Pine Village',
  'Moonwell Village',
  'Bamboo Crest Village',
] as const;

export type VillageName = (typeof villageNames)[number];
