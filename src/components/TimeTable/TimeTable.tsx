import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { V_SPACE } from '../Common/Space';
import TimeTableHrm from './TimeTableHrm';
import TimeTableSelect from './TimeTableSelect';
import TimeTableView from './TimeTableView';

export type TimeTableProps = {};

export default function TimeTable({}: TimeTableProps): JSX.Element {
  const [curDate, setCurDate] = useState<Date | null>(null);

  useEffect(() => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    setCurDate(date);
  }, []);

  return (
    <div css={style}>
      <TimeTableSelect date={curDate} setDate={setCurDate} />
      <V_SPACE />
      <TimeTableHrm date={curDate} setDate={setCurDate} />
      <TimeTableView date={curDate} setDate={setCurDate} />
    </div>
  );
}

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;

  .header-section {
    width: 71rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;
