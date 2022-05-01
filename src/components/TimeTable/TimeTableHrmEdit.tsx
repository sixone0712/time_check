import { css } from '@emotion/react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { HeaderTitle, TableCellMemo, TableSkeletonCell } from '../Common/Table';
import { useTimeTableHrmEdit } from './hooks/useTimetableHrmEdit';
import { HrmInputData } from './type';

export type TimeTableHrmEditProps = {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function TimeTableHrmEdit({
  date,
  setDate,
}: TimeTableHrmEditProps): JSX.Element {
  const {
    open,
    setOpen,
    data,
    onSaveChange,
    editData,
    editMultipleData,
    isFetchingData,
  } = useTimeTableHrmEdit({
    date,
    setDate,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      defaultColumn: {
        Cell: EditableCell,
      },
      data,
      //@ts-ignore
      editData,
      editMultipleData,
    });

  const daysInMonth = useMemo(() => {
    const cur = dayjs(date);
    return cur.daysInMonth() ?? 0;
  }, [date]);

  return (
    <div css={style}>
      <Button
        variant="contained"
        size="small"
        onClick={() => setOpen(true)}
        css={css`
          margin-left: 0.5rem;
        `}
      >
        Edit Hrm
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>HRM 근무 시간 수정</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <Table {...getTableProps()} css={tableStyle} size="small">
              <TableHead>
                {headerGroups.map((headerGroup) => {
                  const { key: groupKey, ...groupRest } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <TableRow key={groupKey} {...groupRest}>
                      {headerGroup.headers.map((column) => {
                        const { key: headerKey, ...headerRest } =
                          column.getHeaderProps();
                        return (
                          <TableCell key={headerKey} {...headerRest}>
                            {column.render('Header')}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableHead>

              <TableBody {...getTableBodyProps()}>
                {isFetchingData && (
                  <TableSkeletonCell
                    row={daysInMonth}
                    column={6}
                    heightRem={2.31}
                  />
                )}
                {!isFetchingData &&
                  rows.map((row, i) => {
                    prepareRow(row);
                    const { key, ...rest } = row.getRowProps();
                    return (
                      <TableRow
                        key={key}
                        {...rest}
                        css={rowStyle(row.values as HrmInputData)}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <TableCellMemo<HrmInputData>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSaveChange}>저장</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const style = css``;

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

const rowStyle = (values: HrmInputData) => css`
  ${['토', '일'].includes(values.week) &&
  css`
    background-color: ${grey[400]};
  `}
`;

const columns: Column<HrmInputData>[] = [
  {
    Header: <HeaderTitle widthRem={8}>날짜</HeaderTitle>,
    accessor: 'date', // accessor is the "key" in the data
  },
  {
    Header: <HeaderTitle widthRem={4}>요일</HeaderTitle>,
    accessor: 'week',
  },
  {
    Header: <HeaderTitle widthRem={7}>시작시간</HeaderTitle>,
    accessor: 'start',
  },
  {
    Header: <HeaderTitle widthRem={7}>종료시간</HeaderTitle>,
    accessor: 'end',
  },
  {
    Header: <HeaderTitle widthRem={7}>근무시간</HeaderTitle>,
    accessor: 'spentOnHrm',
  },
  {
    Header: <HeaderTitle widthRem={8.5}>비고</HeaderTitle>,
    accessor: 'etc',
  },
];

const EditableCell = React.memo(
  ({
    value: initialValue,
    row: { index },
    column: { id },
    editData, // This is a custom function that we supplied to our table instance
    editMultipleData,
  }: any) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e: any) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      editData(index, id, value);
    };

    const onChangeEtc = (e: any) => {
      const { value } = e.target;
      setValue(value);
      editMultipleData(index, getEtcData(value));
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === 'etc') {
      return (
        <Select
          value={value}
          onChange={onChangeEtc}
          size="small"
          css={css`
            width: 7rem;
          `}
        >
          <MenuItem value="">
            <em>없음</em>
          </MenuItem>
          <MenuItem value="연차">연차</MenuItem>
          <MenuItem value="재택근무">재택근무</MenuItem>
          <MenuItem value="교육">교육</MenuItem>
        </Select>
      );
    }

    return (
      <TextField
        size="small"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={id === 'date' || id === 'week'}
        css={css`
          input {
            font-size: 0.875rem;
            text-align: center;
          }
        `}
      />
    );
  }
);

const getEtcData = (value: string) =>
  ({
    ['연차']: {
      start: '-',
      end: '-',
      spentOnHrm: 9,
      etc: '연차',
    },
    ['재택근무']: {
      start: '-',
      end: '-',
      spentOnHrm: 9,
      etc: '재택근무',
    },
    ['교육']: {
      start: '-',
      end: '-',
      spentOnHrm: 9,
      etc: '교육',
    },
  }[value] ?? {
    start: '',
    end: '',
    spentOnHrm: 0,
    etc: '',
  });
