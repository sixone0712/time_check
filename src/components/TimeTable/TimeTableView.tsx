import { TimeItem } from '@common/types/time';
import { css } from '@emotion/react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { useGetTimeTable } from '@src/libs/query/hooks';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { HeaderTitle, TableCellMemo, TableSkeletonCell } from '../Common/Table';

export type TimeTableViewProps = {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function TimeTableView({
  date,
  setDate,
}: TimeTableViewProps): JSX.Element {
  const reqDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MM') : ''),
    [date]
  );

  const { data, isFetching: isFetchingData } = useGetTimeTable(reqDate, {
    enabled: !!reqDate,
  });

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data ?? [],
  });

  const daysInMonth = useMemo(() => {
    const cur = dayjs(date);
    return cur.daysInMonth() ?? 0;
  }, [date]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          // sx={{ minWidth: 650 }}
          aria-label="simple table"
          size="small"
          {...getTableProps()}
          css={tableStyle}
        >
          <TableHead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <TableCell {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isFetchingData && (
              <TableSkeletonCell
                row={daysInMonth}
                column={8}
                heightRem={1.25}
              />
            )}
            {!isFetchingData &&
              rows.map((row, i) => {
                prepareRow(row);
                const { spentOnHrm, spentOnRedmine, spentOnTimeSheet } =
                  row.values as TimeItem;
                const diffRedmine = spentOnHrm - spentOnRedmine;
                const diffTimeSheet = spentOnHrm - spentOnTimeSheet;

                const warning =
                  diffRedmine >= 1 ||
                  diffRedmine <= -1 ||
                  diffTimeSheet >= 1 ||
                  diffTimeSheet <= -1;

                const { key, ...rest } = row.getRowProps();

                return (
                  <TableRow
                    key={key}
                    {...rest}
                    css={rowStyle(row.values as TimeItem, warning)}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCellMemo<TimeItem>
                          key={cell.getCellProps().key}
                          cell={cell}
                        />
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const columns: Column<TimeItem>[] = [
  {
    Header: () => <HeaderTitle widthRem={10}>날짜</HeaderTitle>,
    accessor: 'date', // accessor is the "key" in the data
  },
  {
    Header: () => <HeaderTitle widthRem={5}>요일</HeaderTitle>,
    accessor: 'week',
  },
  {
    Header: () => <HeaderTitle widthRem={8}>시작시간</HeaderTitle>,
    accessor: 'start',
  },
  {
    Header: () => <HeaderTitle widthRem={8}>종료시간</HeaderTitle>,
    accessor: 'end',
  },
  {
    Header: () => <HeaderTitle widthRem={8}>HRM</HeaderTitle>,
    accessor: 'spentOnHrm',
  },
  {
    Header: () => <HeaderTitle widthRem={8}>레드마인</HeaderTitle>,
    accessor: 'spentOnRedmine',
  },
  {
    Header: () => <HeaderTitle widthRem={8}>타임시트</HeaderTitle>,
    accessor: 'spentOnTimeSheet',
  },
  {
    Header: () => <HeaderTitle widthRem={12.875}>비고</HeaderTitle>,
    accessor: 'etc',
  },
];

const tableStyle = css`
  thead {
    background-color: black;

    .MuiTableCell-head {
      color: white;
      text-align: center;
    }
  }

  tbody {
    .MuiTableCell-body {
      text-align: center;
    }
  }
`;

const rowStyle = (values: TimeItem, warning: boolean) => css`
  ${['토', '일'].includes(values.week) &&
  css`
    background-color: ${grey[400]};
  `}

  ${warning &&
  css`
    background-color: ${red[100]};
  `}
`;
