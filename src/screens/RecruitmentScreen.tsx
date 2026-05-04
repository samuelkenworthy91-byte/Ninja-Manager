import React, { useMemo, useState } from 'react';
import { RecruitmentList } from '../components/RecruitmentList';
import { recruitNinja } from '../game/recruitmentLogic';
import { VillageState } from '../game/types';

type RecruitmentScreenProps = {
  initialVillageState: VillageState;
  onVillageStateChange?: (state: VillageState) => void;
};

export function RecruitmentScreen({ initialVillageState, onVillageStateChange }: RecruitmentScreenProps) {
  const [villageState, setVillageState] = useState(initialVillageState);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const sortedPool = useMemo(
    () => [...villageState.recruitmentPool].sort((a, b) => a.recruitmentCost - b.recruitmentCost),
    [villageState.recruitmentPool]
  );

  const handleRecruit = (ninjaId: string) => {
    const result = recruitNinja(villageState, ninjaId);

    if (!result.ok) {
      setWarningMessage(
        result.reason === 'insufficient-funds'
          ? 'You cannot afford this recruit.'
          : result.reason === 'already-recruited'
            ? 'This ninja is already in your roster.'
            : 'Recruit could not be found in this weekly pool.'
      );
      return;
    }

    setWarningMessage(null);
    setVillageState(result.state);
    onVillageStateChange?.(result.state);
  };

  return (
    <section>
      <h1>Recruitment</h1>
      <p>Village funds: {villageState.money}</p>
      {warningMessage ? <p role="alert">{warningMessage}</p> : null}
      <RecruitmentList money={villageState.money} pool={sortedPool} onRecruit={handleRecruit} />
    </section>
  );
}
