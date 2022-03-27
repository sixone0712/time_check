import { TimeItem } from '@common/types/time';
import axios from 'axios';
import { HrmInputData } from '@src/components/TimeTable/type';
import { ResLogin } from '@src/types/axios';

export const login = async (id: string) => {
  const { data } = await axios.get<ResLogin>(`/api/auth/login?id=${id}`);

  return data;
};

export const getTimeTable = async (date: string) => {
  const { data } = await axios.get<TimeItem[]>(
    `/api/db/worktime/all?date=${date}`
  );

  return data;
};

export const postHrmData = async (reqData: HrmInputData[]) => {
  const { data } = await axios.post(`/api/db/worktime/hrm`, reqData);

  return data;
};
