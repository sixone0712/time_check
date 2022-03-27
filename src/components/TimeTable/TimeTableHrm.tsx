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
import dayjs from 'dayjs';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Column, useTable } from 'react-table';
import { postHrmData } from '@src/libs/axios/requests';
import { V_SPACE } from '../Common/Space';
import { HrmInputData } from './type';

export type TimeTableHrmProps = {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function TimeTableHrm({
  date,
  setDate,
}: TimeTableHrmProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [data, setData] = useState<HrmInputData[]>([]);
  const queryClient = useQueryClient();
  const reqDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MM') : ''),
    [date]
  );

  const { mutate } = useMutation(
    (reqData: HrmInputData[]) => postHrmData(reqData),
    {
      mutationKey: ['postHrmData'],
      onSettled: (data, error) => {
        queryClient.refetchQueries(['getTimeTable', reqDate]);
        setOpen(false);
      },
    }
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.replace(/\t/g, ' '));
  };

  const onChangeData = () => {
    if (text) {
      const textArr = text.split(/\r|\n/);
      const newData: HrmInputData[] = textArr.map((item) => {
        const dateWeek = item.match(
          /\d{4}\/\d{2}\/\d{02}[\s][월|화|수|목|금]|토|일]{1}/g
        ) ?? [''];

        const date: string[] = dateWeek[0].match(/\d{4}\/\d{2}\/\d{02}/g) ?? [
          '',
        ];
        const week: string[] = dateWeek[0].match(
          /[월|화|수|목|금]|토|일]{1}/g
        ) ?? [''];
        const start_end = item.match(/\d{02}:\d{02}/g) ?? ['', ''];
        const dayOff = item.match(/연차/);

        const start = start_end[0].split(':');
        const end = start_end[1].split(':');

        const startTime = dayjs()
          .hour(+start[0])
          .minute(+start[1])
          .second(0);
        const endTime = dayjs()
          .hour(+end[0])
          .minute(+end[1])
          .second(0);

        const startAfternoon = dayjs().hour(12).minute(0).second(0);

        const diff = endTime
          .subtract(endTime > startAfternoon ? 1 : 0, 'hour')
          .subtract(+startTime.hour(), 'hour')
          .subtract(+startTime.minute(), 'minute');

        const spendOn =
          diff.hour() + Math.floor((diff.minute() / 60) * 10) / 10;

        return {
          date: date[0].replaceAll('/', '-'),
          week: week[0],
          start: dayOff ? '연차' : start_end[0],
          end: dayOff ? '연차' : start_end[1],
          spentOnHrm: dayOff ? 9 : isNaN(spendOn) ? 0 : spendOn,
        };
      });

      console.log(dayjs().daysInMonth());
      console.log(dayjs().day());
      setData(newData);
    }
  };

  const onSaveChange = () => {
    mutate(data);
  };

  useEffect(() => {
    if (text) {
      onChangeData();
    }
  }, [text]);

  return (
    <div css={style}>
      <Button variant="contained" size="small" onClick={() => setOpen(true)}>
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
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // eslint-disable-next-line react/jsx-key
                        <TableCell {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    // eslint-disable-next-line react/jsx-no-undef
                    <TableRow
                      {...row.getRowProps()}
                      key={row.getRowProps().key}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <TableCell
                            {...cell.getCellProps()}
                            key={cell.getCellProps().key}
                          >
                            {cell.render('Cell')}
                          </TableCell>
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

const columns: Column<HrmInputData>[] = [
  {
    Header: (
      <div
        css={css`
          width: 8.7rem;
        `}
      >
        날짜
      </div>
    ),
    accessor: 'date', // accessor is the "key" in the data
  },
  {
    Header: (
      <div
        css={css`
          width: 8.7rem;
        `}
      >
        요일
      </div>
    ),
    accessor: 'week',
  },
  {
    Header: (
      <div
        css={css`
          width: 8.7rem;
        `}
      >
        시작 시간
      </div>
    ),
    accessor: 'start',
  },
  {
    Header: (
      <div
        css={css`
          width: 8.7rem;
        `}
      >
        종료 시간
      </div>
    ),
    accessor: 'end',
  },
  {
    Header: (
      <div
        css={css`
          width: 8.7rem;
        `}
      >
        근무 시간
      </div>
    ),
    accessor: 'spentOnHrm',
  },
];

const style = css`
  display: flex;
  width: 71rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0.5rem;
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
