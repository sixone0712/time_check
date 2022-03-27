import { TimeItem } from '@common/types/time';
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
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { useGetTimeTable } from '@src/libs/query/hooks';
import { css } from '@emotion/react';

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

  const { data } = useGetTimeTable(reqDate, {
    enabled: !!reqDate,
  });

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data ?? [],
  });

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
            {rows.map((row, i) => {
              prepareRow(row);

              const { spentOnHrm, spentOnRedmine, spentOnTimeSheet } =
                row.values as TimeItem;
              const diffRedmine = spentOnHrm - spentOnRedmine;
              const diffTimeSheet = spentOnHrm - spentOnTimeSheet;

              const warning =
                diffRedmine > 1 ||
                diffRedmine < -1 ||
                diffTimeSheet > 1 ||
                diffTimeSheet < -1;

              return (
                // eslint-disable-next-line react/jsx-key
                <TableRow
                  {...row.getRowProps()}
                  css={rowStyle(row.values as TimeItem, warning)}
                >
                  {row.cells.map((cell) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
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
    Header: () => (
      <div
        css={css`
          width: 9rem;
        `}
      >
        Date
      </div>
    ),
    accessor: 'date', // accessor is the "key" in the data
  },
  {
    Header: () => (
      <div
        css={css`
          width: 6rem;
        `}
      >
        Week
      </div>
    ),
    accessor: 'week',
  },
  {
    Header: () => (
      <div
        css={css`
          width: 9rem;
        `}
      >
        Start
      </div>
    ),
    accessor: 'start',
  },
  {
    Header: () => (
      <div
        css={css`
          width: 9rem;
        `}
      >
        End
      </div>
    ),
    accessor: 'end',
  },
  {
    Header: () => (
      <div
        css={css`
          width: 9rem;
        `}
      >
        HRM
      </div>
    ),
    accessor: 'spentOnHrm',
  },
  {
    Header: () => (
      <div
        css={css`
          width: 8rem;
        `}
      >
        Redmine
      </div>
    ),
    accessor: 'spentOnRedmine',
  },
  {
    Header: () => (
      <div
        css={css`
          width: 8rem;
        `}
      >
        TimeSheet
      </div>
    ),
    accessor: 'spentOnTimeSheet',
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
