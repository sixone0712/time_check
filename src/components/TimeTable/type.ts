import { TimeItem } from '@common/types/time';
import { Column } from 'react-table';

export const columns: Column<TimeItem>[] = [
  {
    Header: 'Date',
    accessor: 'date', // accessor is the "key" in the data
  },
  {
    Header: 'Week',
    accessor: 'week',
  },
  {
    Header: 'Start',
    accessor: 'start',
  },
  {
    Header: 'End',
    accessor: 'end',
  },
  {
    Header: 'HRM',
    accessor: 'spentOnHrm',
  },
  {
    Header: 'Redmine',
    accessor: 'spentOnRedmine',
  },
  {
    Header: 'TimeSheet',
    accessor: 'spentOnTimeSheet',
  },
];

export interface HrmInputData {
  date: string;
  week: string;
  start: string;
  end: string;
  spentOnHrm: number;
  etc: string;
}

export interface TableExtend {
  editData: (rowIndex: any, columnId: any, value: any) => void;
}

export type EditMultipleHrmInputData = {
  [key in keyof HrmInputData]: any;
};
