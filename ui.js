const state = {
  money: 1000,
  teacher: { globalTrainingBonus: 5, trainingSpecialties: { chakraControl: 10, tacticalStudy: 7 } },
  villageUpgrades: { globalTrainingBonus: 3, trainingBonuses: { teamworkExercises: 8, enduranceConditioning: 5 } },
  ninjas: [
    { id: 1, name: 'Aoi', injured: false, stamina: 90, stats: { strength: 5, chakra: 6, stealth: 4 } },
    { id: 2, name: 'Daichi', injured: false, stamina: 75, stats: { strength: 7, teamwork: 5, vitality: 6 } },
    { id: 3, name: 'Rin', injured: true, stamina: 60, stats: { medical: 8, focus: 7 } },
  ],
};

const assignments = new Map();
const listEl = document.getElementById('ninjaList');
const previewEl = document.getElementById('preview');
const reportEl = document.getElementById('report');

function renderAssignmentUI() {
  listEl.innerHTML = '';
  state.ninjas.forEach((ninja) => {
    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.textContent = `${ninja.name} (Sta: ${ninja.stamina})`;

    const select = document.createElement('select');
    select.disabled = ninja.injured;
    select.innerHTML = `<option value="">-- Select Training --</option>${Object.entries(TRAINING_PROGRAMMES)
      .map(([key, value]) => `<option value="${key}">${value.name}</option>`)
      .join('')}`;

    if (ninja.injured) {
      const msg = document.createElement('span');
      msg.className = 'injured';
      msg.textContent = ' (Injured - cannot train)';
      wrapper.appendChild(msg);
    }

    select.addEventListener('change', () => {
      if (select.value) assignments.set(ninja.id, select.value);
      else assignments.delete(ninja.id);
      renderPreview();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(document.createElement('br'));
    wrapper.appendChild(select);
    listEl.appendChild(wrapper);
  });
}

function renderPreview() {
  const lines = [];
  assignments.forEach((trainingType, ninjaId) => {
    const ninja = state.ninjas.find((n) => n.id === ninjaId);
    if (!ninja || ninja.injured) return;
    const preview = calculateTrainingGain(ninja, trainingType, {
      teacher: state.teacher,
      upgrades: state.villageUpgrades,
    });
    lines.push(`${ninja.name} -> ${preview.programmeName}`);
    lines.push(`  Gains: ${JSON.stringify(preview.projectedGains)}`);
    lines.push(`  Cost: ${preview.staminaCost} stamina, ${preview.moneyCost} ryo`);
    lines.push(`  Injury Risk: ${(preview.injuryRisk * 100).toFixed(1)}%`);
  });

  previewEl.textContent = lines.length ? lines.join('\n') : 'Select training assignments to see projection.';
}

document.getElementById('confirmBtn').addEventListener('click', () => {
  const input = Array.from(assignments.entries()).map(([ninjaId, trainingType]) => ({ ninjaId, trainingType }));
  const result = applyTraining(state, input);
  reportEl.textContent = JSON.stringify(result.report, null, 2);
  renderAssignmentUI();
  renderPreview();
});

renderAssignmentUI();
renderPreview();
