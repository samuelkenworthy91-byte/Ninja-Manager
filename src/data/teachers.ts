export type TeacherSpecialty = 'taijutsu' | 'ninjutsu' | 'genjutsu' | 'medical' | 'weapons' | 'stealth' | 'tactics';

export type Teacher = {
  id: string;
  name: string;
  specialty: TeacherSpecialty;
  rank: 'chunin' | 'jonin' | 'elite jonin';
  personality: string;
  hiringCostRyo: number;
};

export const teachers: Teacher[] = [
  { id: 'master-daigo', name: 'Master Daigo', specialty: 'taijutsu', rank: 'jonin', personality: 'Demanding but fair drill instructor.', hiringCostRyo: 900 },
  { id: 'sister-koharu', name: 'Sister Koharu', specialty: 'medical', rank: 'jonin', personality: 'Gentle healer with strict standards.', hiringCostRyo: 1100 },
  { id: 'blade-ryota', name: 'Blade Ryota', specialty: 'weapons', rank: 'elite jonin', personality: 'Gruff veteran obsessed with discipline.', hiringCostRyo: 1400 },
  { id: 'mist-aya', name: 'Mist Aya', specialty: 'stealth', rank: 'jonin', personality: 'Quiet mentor who rewards patience.', hiringCostRyo: 1200 },
  { id: 'scribe-ren', name: 'Scribe Ren', specialty: 'tactics', rank: 'chunin', personality: 'Bookish analyst and planner.', hiringCostRyo: 700 },
  { id: 'ember-haru', name: 'Ember Haru', specialty: 'ninjutsu', rank: 'jonin', personality: 'Charismatic elemental specialist.', hiringCostRyo: 1050 },
  { id: 'veil-natsumi', name: 'Veil Natsumi', specialty: 'genjutsu', rank: 'elite jonin', personality: 'Elusive illusionist with sharp wit.', hiringCostRyo: 1450 },
  { id: 'captain-goro', name: 'Captain Goro', specialty: 'taijutsu', rank: 'chunin', personality: 'Loud motivator and endurance coach.', hiringCostRyo: 680 },
  { id: 'doctor-shin', name: 'Doctor Shin', specialty: 'medical', rank: 'elite jonin', personality: 'Clinical prodigy with little patience.', hiringCostRyo: 1500 },
  { id: 'whisper-rei', name: 'Whisper Rei', specialty: 'stealth', rank: 'chunin', personality: 'Soft-spoken scout and tracker.', hiringCostRyo: 750 },
];
