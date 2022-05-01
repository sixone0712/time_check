import { postHrmData } from '@src/libs/axios/requests';
import dayjs from 'dayjs';
import produce from 'immer';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { HrmInputData } from '../type';

interface useTimeTableHrmAddProp {
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function useTimeTableHrmAdd({ date, setDate }: useTimeTableHrmAddProp) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [data, setData] = useState<HrmInputData[]>([]);
  const queryClient = useQueryClient();
  const reqDate = useMemo(
    () => (date ? dayjs(date).format('YYYY-MM') : ''),
    [date]
  );

  const editData = useCallback((rowIndex: any, columnId: any, value: any) => {
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
  }, []);

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

  const onChangeText = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value.replace(/\t/g, ' ') ?? '');
  }, []);

  const onSaveChange = useCallback(() => {
    mutate(data);
  }, [mutate, data]);

  useEffect(() => {
    if (text) {
      setData(getTableData(text));
    } else {
      setData([]);
    }
  }, [text]);

  useEffect(() => {
    if (!open) {
      setText('');
      setData([]);
    }
  }, [open]);

  return { open, setOpen, data, text, onChangeText, onSaveChange, editData };
}

const getTableData = (text: string): HrmInputData[] => {
  const textArr = text.split(/\r|\n/);
  const newData: HrmInputData[] = textArr.map((item) => {
    const dateWeek = item.match(
      /\d{4}\/\d{2}\/\d{02}[\s][월|화|수|목|금]|토|일]{1}/g
    ) ?? [''];

    const date: string[] = dateWeek[0].match(/\d{4}\/\d{2}\/\d{02}/g) ?? [''];
    const week: string[] = dateWeek[0].match(/[월|화|수|목|금]|토|일]{1}/g) ?? [
      '',
    ];
    const start_end = item.match(/\d{02}:\d{02}/g) ?? ['', ''];
    const start = start_end[0].split(':');
    const end = start_end[1].split(':');

    if (!start) {
      return {
        date: '',
        week: '',
        start: '',
        end: '',
        spentOnHrm: 0,
        etc: '',
      };
    }

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

    const spendOn = diff.hour() + Math.floor((diff.minute() / 60) * 10) / 10;

    const etc = getEtcText(item);

    return {
      date: date[0].replaceAll('/', '-'),
      week: week[0],
      start: etc ? '-' : start_end[0],
      end: etc ? '-' : start_end[1],
      spentOnHrm: etc ? 9 : isNaN(spendOn) ? 0 : spendOn,
      etc,
    };
  });

  return newData.filter((item) => Boolean(item.date));
};

const getEtcText = (item: string) => {
  if (item.match(/연차/)) {
    return '연차';
  } else if (item.match(/재택/)) {
    return '재택근무';
  } else if (item.match(/교육/)) {
    return '교육';
  }
  return '';
};
