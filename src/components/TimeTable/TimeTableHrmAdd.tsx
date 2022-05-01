import { css } from '@emotion/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React from 'react';
import { Column, useTable } from 'react-table';
import { V_SPACE } from '../Common/Space';
import { HeaderTitle, TableCellMemo } from '../Common/Table';
import { useTimeTableHrmAdd } from './hooks/useTimetableHrmAdd';
import { HrmInputData } from './type';

export type TimeTableHrmAddProps = {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function TimeTableHrmAdd({
  date,
  setDate,
}: TimeTableHrmAddProps): JSX.Element {
  const { open, setOpen, data, text, onChangeText, onSaveChange, editData } =
    useTimeTableHrmAdd({ date, setDate });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      defaultColumn: {
        Cell: EditableCell,
      },
      data,
      //@ts-ignore
      editData,
    });

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
        Add Hrm
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>HRM 근무 시간 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            HRM사이트의 일일근무조회에서 근무일 ~ 근태내역까지의 테이블을
            복사하여 붙여 넣어주세요.
          </DialogContentText>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <TextField
              multiline
              rows={5}
              css={css`
                width: 53.5rem;
                textarea {
                  font-size: 0.8rem;
                }
              `}
              size="small"
              value={text}
              onChange={onChangeText}
            />
            <V_SPACE />
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
                {rows.map((row, i) => {
                  prepareRow(row);
                  const { key, ...rest } = row.getRowProps();
                  return (
                    <TableRow key={key} {...rest}>
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
          <Button onClick={onSaveChange}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const style = css`
  /* display: flex;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.5rem; */
`;

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
  }: any) => {
    console.log('EditableCell');
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e: any) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      editData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    // return <input value={value} onChange={onChange} onBlur={onBlur} />;
    return (
      <TextField
        size="small"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
