from __future__ import annotations

from dataclasses import dataclass, field
from random import Random
from typing import Dict, List, Tuple


STAT_NAMES = ["strength", "speed", "intelligence", "stamina", "chakra", "hand_seals"]
BASE_GROWTH = {
    "strength": 1,
    "speed": 1,
    "intelligence": 1,
    "stamina": 1,
    "chakra": 1,
    "hand_seals": 1,
}

SCHOOL_BONUS = {
    "taijutsu": {"strength": 1, "speed": 1, "stamina": 1},
    "ninjutsu": {"chakra": 1, "intelligence": 1},
    "genjutsu": {"intelligence": 1, "hand_seals": 1},
    "balanced": {},
}

ROLE_BONUS = {
    "attacker": {"strength": 1, "speed": 1},
    "defender": {"stamina": 2},
    "support": {"chakra": 1, "intelligence": 1},
    "scout": {"speed": 2},
    "specialist": {"hand_seals": 2},
}

TRAIT_BONUS = {
    "hard_worker": {"stamina": 1},
    "prodigy": {"intelligence": 1, "chakra": 1},
    "quick_learner": {"speed": 1, "hand_seals": 1},
    "iron_will": {"strength": 1},
}

MISSION_XP = {
    "D": 10,
    "C": 20,
    "B": 35,
    "A": 55,
    "S": 80,
}


@dataclass
class Ninja:
    name: str
    age: int
    school: str
    role: str
    potential: int  # 1-100
    traits: List[str] = field(default_factory=list)
    level: int = 1
    xp: int = 0
    stats: Dict[str, int] = field(default_factory=lambda: {k: 10 for k in STAT_NAMES})


@dataclass
class MissionResult:
    mission_rank: str
    squad: List[Ninja]
    training_xp: int = 0
    notes: List[str] = field(default_factory=list)
    level_up_reports: List[Dict[str, object]] = field(default_factory=list)


def awardXp(ninja: Ninja, amount: int, rng: Random | None = None) -> List[Dict[str, object]]:
    """Award XP and process one or more level-ups every 100 XP.

    Returns list of level-up reports.
    """
    if amount <= 0:
        return []

    ninja.xp += amount
    reports = []
    while ninja.xp >= 100:
        ninja.xp -= 100
        reports.append(levelUpNinja(ninja, rng=rng))
    return reports


def levelUpNinja(ninja: Ninja, rng: Random | None = None) -> Dict[str, object]:
    """Increase ninja level and apply growth rules. Returns a detailed report."""
    ninja.level += 1
    before = ninja.stats.copy()

    growth = calculateStatGrowth(ninja, rng=rng)
    for stat, delta in growth.items():
        ninja.stats[stat] = min(100, ninja.stats.get(stat, 0) + max(0, delta))

    improved = {
        stat: ninja.stats[stat] - before.get(stat, 0)
        for stat in STAT_NAMES
        if ninja.stats[stat] > before.get(stat, 0)
    }
    return {
        "name": ninja.name,
        "new_level": ninja.level,
        "improved_stats": improved,
    }


def calculateStatGrowth(ninja: Ninja, rng: Random | None = None) -> Dict[str, int]:
    """Calculate growth using school, role, potential, traits, age, and randomness."""
    if rng is None:
        rng = Random()

    growth = BASE_GROWTH.copy()

    for table, key in ((SCHOOL_BONUS, ninja.school), (ROLE_BONUS, ninja.role)):
        for stat, delta in table.get(key, {}).items():
            growth[stat] = growth.get(stat, 0) + delta

    for trait in ninja.traits:
        for stat, delta in TRAIT_BONUS.get(trait, {}).items():
            growth[stat] = growth.get(stat, 0) + delta

    # Potential scales all growth over time: low potential less likely bonus; high potential frequently bonus.
    potential_boost_chance = max(0.0, min(1.0, ninja.potential / 100))
    for stat in STAT_NAMES:
        if rng.random() < potential_boost_chance:
            growth[stat] += 1

    # Age growth penalty: older ninjas can plateau.
    age_penalty = 0
    if ninja.age >= 30:
        age_penalty = 2
    elif ninja.age >= 24:
        age_penalty = 1

    for stat in STAT_NAMES:
        growth[stat] = max(0, growth[stat] - age_penalty)

    # Random spike chance per stat for variance.
    for stat in STAT_NAMES:
        if rng.random() < 0.2:
            growth[stat] += 1

    # Keep capped relevance by skipping stats already maxed.
    for stat in STAT_NAMES:
        if ninja.stats.get(stat, 0) >= 100:
            growth[stat] = 0

    return growth


def applyMissionXpToSquad(result: MissionResult, rng: Random | None = None) -> MissionResult:
    """Apply mission + training XP and append clear level-up reports to mission results."""
    base = MISSION_XP.get(result.mission_rank.upper(), 0)
    reports: List[Dict[str, object]] = []

    for ninja in result.squad:
        gained = base + max(0, result.training_xp)
        ninja_reports = awardXp(ninja, gained, rng=rng)
        if ninja_reports:
            reports.extend(ninja_reports)

    result.level_up_reports = reports

    if reports:
        for report in reports:
            improved = ", ".join(f"{k}+{v}" for k, v in report["improved_stats"].items()) or "No stat gains"
            result.notes.append(
                f"{report['name']} reached Lv.{report['new_level']} ({improved})"
            )
    else:
        result.notes.append("No level ups this mission.")

    return result
