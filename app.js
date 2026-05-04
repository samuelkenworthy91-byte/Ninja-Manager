const ninjas = [
  { id: 1, name: "Rin", injured: false, stamina: 82, teamwork: 90, stats: { stealth: 88, combat: 65, intel: 91, speed: 80 } },
  { id: 2, name: "Daichi", injured: true, stamina: 60, teamwork: 74, stats: { stealth: 55, combat: 92, intel: 61, speed: 70 } },
  { id: 3, name: "Yoru", injured: false, stamina: 76, teamwork: 71, stats: { stealth: 93, combat: 58, intel: 78, speed: 89 } },
  { id: 4, name: "Kenta", injured: false, stamina: 91, teamwork: 68, stats: { stealth: 62, combat: 85, intel: 66, speed: 77 } },
  { id: 5, name: "Mei", injured: false, stamina: 70, teamwork: 95, stats: { stealth: 74, combat: 72, intel: 90, speed: 75 } },
  { id: 6, name: "Haru", injured: false, stamina: 88, teamwork: 80, stats: { stealth: 68, combat: 79, intel: 70, speed: 86 } },
];

const missions = [
  { id: "m1", title: "Silent Archive Infiltration", danger: 45, requiredStats: ["stealth", "intel"], resolved: false, assignedNinjaIds: [] },
  { id: "m2", title: "Bridge Defense", danger: 65, requiredStats: ["combat", "teamwork"], resolved: false, assignedNinjaIds: [] },
  { id: "m3", title: "Rapid Courier Intercept", danger: 55, requiredStats: ["speed", "stealth"], resolved: false, assignedNinjaIds: [] },
];

let selectedMissionId = null;
let selectedNinjaIds = new Set();

function getRelevantStatsForMission(mission) {
  return mission.requiredStats;
}

function isNinjaAvailable(ninja, allMissions, currentMissionId) {
  if (ninja.injured) return false;
  return !allMissions.some(
    (mission) =>
      mission.id !== currentMissionId &&
      !mission.resolved &&
      mission.assignedNinjaIds.includes(ninja.id)
  );
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function overallRating(ninja) {
  return average([...Object.values(ninja.stats), ninja.stamina, ninja.teamwork]);
}

function calculateSquadPowerForMission(squad, mission) {
  if (!squad.length) return 0;
  const relevantStats = getRelevantStatsForMission(mission);
  const relevantScores = squad.map((ninja) =>
    average(
      relevantStats.map((stat) => {
        if (stat === "teamwork") return ninja.teamwork;
        return ninja.stats[stat] ?? 0;
      })
    )
  );
  const statCoverage = average(relevantScores);
  const stamina = average(squad.map((n) => n.stamina));
  const teamwork = average(squad.map((n) => n.teamwork));
  return statCoverage * 0.55 + stamina * 0.2 + teamwork * 0.25;
}

function calculateEstimatedSuccessChance(squad, mission) {
  if (!squad.length) return 0;
  const squadPower = calculateSquadPowerForMission(squad, mission);
  const sizeBonus = Math.min(squad.length * 3, 10);
  const chance = squadPower - mission.danger + 45 + sizeBonus;
  return Math.max(5, Math.min(95, chance));
}

function calculateEstimatedInjuryRisk(squad, mission) {
  if (!squad.length) return 0;
  const squadPower = calculateSquadPowerForMission(squad, mission);
  const successChance = calculateEstimatedSuccessChance(squad, mission);
  const stamina = average(squad.map((n) => n.stamina));
  const risk = mission.danger * 0.8 - squadPower * 0.25 + (100 - successChance) * 0.45 + (80 - stamina) * 0.25;
  return Math.max(3, Math.min(90, risk));
}

function getSelectedMission() {
  return missions.find((mission) => mission.id === selectedMissionId);
}

function getSelectedSquad() {
  return ninjas.filter((ninja) => selectedNinjaIds.has(ninja.id));
}

function renderMissions() {
  const list = document.getElementById("mission-list");
  list.innerHTML = "";

  missions.forEach((mission) => {
    const card = document.createElement("div");
    card.className = `mission-card ${mission.id === selectedMissionId ? "active" : ""}`;

    const assigned = mission.assignedNinjaIds.length
      ? `Assigned: ${mission.assignedNinjaIds
          .map((id) => ninjas.find((n) => n.id === id)?.name)
          .join(", ")}`
      : "No squad assigned";

    card.innerHTML = `
      <div class="inline">
        <strong>${mission.title}</strong>
        <span class="tag">Danger ${mission.danger}</span>
      </div>
      <div class="muted">Focus: ${mission.requiredStats.join(" + ")}</div>
      <div class="muted">${assigned}</div>
      <button class="secondary" data-mission-id="${mission.id}">Select Mission</button>
    `;

    list.appendChild(card);
  });

  list.querySelectorAll("button[data-mission-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMissionId = button.dataset.missionId;
      selectedNinjaIds = new Set(getSelectedMission().assignedNinjaIds);
      renderAll();
    });
  });
}

function renderNinjas() {
  const mission = getSelectedMission();
  const panel = document.getElementById("assignment-panel");
  if (!mission) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;

  document.getElementById("assignment-title").textContent = `Assign Squad: ${mission.title}`;
  document.getElementById("mission-description").textContent = `Required strengths: ${getRelevantStatsForMission(mission).join(", "
  )}. Choose 1 to 4 available ninjas.`;

  const ninjaList = document.getElementById("ninja-list");
  ninjaList.innerHTML = "";

  ninjas.forEach((ninja) => {
    const available = isNinjaAvailable(ninja, missions, mission.id);
    const checked = selectedNinjaIds.has(ninja.id);

    const wrapper = document.createElement("label");
    wrapper.className = "ninja-card";
    wrapper.innerHTML = `
      <div class="inline">
        <strong>${ninja.name}</strong>
        <span class="tag ${available ? "good" : "bad"}">${available ? "Available" : ninja.injured ? "Injured" : "Busy"}</span>
      </div>
      <div class="muted">Overall: ${overallRating(ninja).toFixed(1)} | Stamina: ${ninja.stamina} | Teamwork: ${ninja.teamwork}</div>
      <div class="muted">Stats — Stealth ${ninja.stats.stealth}, Combat ${ninja.stats.combat}, Intel ${ninja.stats.intel}, Speed ${ninja.stats.speed}</div>
      <div>
        <input type="checkbox" ${checked ? "checked" : ""} ${available ? "" : "disabled"} data-ninja-id="${ninja.id}" />
        Select for squad
      </div>
    `;

    ninjaList.appendChild(wrapper);
  });

  ninjaList.querySelectorAll("input[data-ninja-id]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = Number(input.dataset.ninjaId);
      if (input.checked) {
        if (selectedNinjaIds.size >= 4) {
          input.checked = false;
          return;
        }
        selectedNinjaIds.add(id);
      } else {
        selectedNinjaIds.delete(id);
      }
      renderSummary();
    });
  });
}

function renderSummary() {
  const mission = getSelectedMission();
  const squad = getSelectedSquad();
  const summary = document.getElementById("summary");
  const confirmButton = document.getElementById("confirm-btn");

  if (!mission || squad.length === 0) {
    summary.className = "summary muted";
    summary.textContent = "Select between 1 and 4 available ninjas.";
    confirmButton.disabled = true;
    return;
  }

  const avgOverall = average(squad.map((ninja) => overallRating(ninja)));
  const relevantStats = getRelevantStatsForMission(mission);
  const coverage = average(
    squad.map((ninja) =>
      average(
        relevantStats.map((stat) => (stat === "teamwork" ? ninja.teamwork : ninja.stats[stat] ?? 0))
      )
    )
  );
  const avgStamina = average(squad.map((ninja) => ninja.stamina));
  const avgTeamwork = average(squad.map((ninja) => ninja.teamwork));
  const success = calculateEstimatedSuccessChance(squad, mission);
  const injuryRisk = calculateEstimatedInjuryRisk(squad, mission);

  summary.className = "summary";
  summary.innerHTML = `
    <ul>
      <li><strong>Squad Size:</strong> ${squad.length}/4</li>
      <li><strong>Average Overall Rating:</strong> ${avgOverall.toFixed(1)}</li>
      <li><strong>Relevant Stat Coverage (${relevantStats.join(" + ")}):</strong> ${coverage.toFixed(1)}</li>
      <li><strong>Average Stamina:</strong> ${avgStamina.toFixed(1)}</li>
      <li><strong>Average Teamwork:</strong> ${avgTeamwork.toFixed(1)}</li>
      <li><strong>Estimated Success Chance:</strong> ${success.toFixed(1)}%</li>
      <li><strong>Estimated Injury Risk:</strong> ${injuryRisk.toFixed(1)}%</li>
    </ul>
  `;

  confirmButton.disabled = squad.length < 1 || squad.length > 4;
}

function setupConfirmButton() {
  const confirmButton = document.getElementById("confirm-btn");
  const confirmMessage = document.getElementById("confirm-message");

  confirmButton.addEventListener("click", () => {
    const mission = getSelectedMission();
    if (!mission) return;

    mission.assignedNinjaIds = Array.from(selectedNinjaIds);
    confirmMessage.textContent = `Assigned ${mission.assignedNinjaIds.length} ninja(s) to ${mission.title}.`;

    renderMissions();
    renderNinjas();
    renderSummary();
  });
}

function renderAll() {
  renderMissions();
  renderNinjas();
  renderSummary();
}

setupConfirmButton();
renderAll();
