import { weekToString } from '@common/types/constants';
import { postHrmData } from '@src/libs/axios/requests';
import { useGetHrmData } from '@src/libs/query/hooks';
import dayjs from 'dayjs';
import produce from 'immer';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { EditMultipleHrmInputData, HrmInputData } from '../type';

interface useTimeTableHrmEditProp {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function useTimeTableHrmEdit({
  date,
  setDate,
}: useTimeTableHrmEditProp) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const reqDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MM') : ''),
    [date]
  );

  const [data, setData] = useState<HrmInputData[]>([]);

  const { isFetching: isFetchingData } = useGetHrmData(reqDate, {
    enabled: !!reqDate && open,
    onSuccess: (data) => {
      const cur = dayjs(date);
      const newData: HrmInputData[] = new Array(cur.daysInMonth())
        .fill(null)
        .map((item, idx) => {
          const curDay = cur.add(idx, 'd');
          return {
            date: curDay.format('YYYY-MM-DD'),
            week: weekToString[curDay.day()],
            start: '',
            end: '',
            spentOnHrm: 0,
            etc: '',
          };
        });

      data.forEach((item) => {
        const index = +item.date.split('-')[2] - 1;
        newData[index].start = item.start;
        newData[index].end = item.end;
        newData[index].spentOnHrm = item.spentOnHrm;
        newData[index].etc = item.etc;
      });

      setData(newData);
    },
    onError: (err) => {
      setData([]);
    },
  });

  const editData = useCallback(
    (rowIndex: any, columnId: any, value: any) => {
      if (data[rowIndex]) {
        setData((prev) => {
          return produce(prev, (draft) => {
            draft[rowIndex as number] = {
              ...draft[rowIndex as number],
              [columnId]: value,
            };
          });
        });
      }
    },
    [data]
  );

  const editMultipleData = useCallback(
    (rowIndex: number, editData: EditMultipleHrmInputData) => {
      if (data[rowIndex]) {
        setData((prev) => {
          return produce(prev, (draft) => {
            draft[rowIndex as number] = {
              ...draft[rowIndex as number],
              ...editData,
            };
          });
        });
      }
    },
    [data]
  );

  const { mutate } = useMutation(
    (reqData: HrmInputData[]) => postHrmData(reqData),
    {
      mutationKey: ['postHrmData'],
      onSettled: (data, error) => {
        queryClient.invalidateQueries(['getTimeTable', reqDate]);
        setOpen(false);
      },
    }
  );

  const onSaveChange = useCallback(() => {
    mutate(data);
  }, [mutate, data]);

  useEffect(() => {
    if (!open) {
      setData([]);
    }
  }, [open]);

  return {
    open,
    setOpen,
    data,
    onSaveChange,
    editData,
    editMultipleData,
    isFetchingData,
  };
}
