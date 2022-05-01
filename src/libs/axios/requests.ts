import { TimeItem } from '@common/types/time';
import axios from 'axios';
import { HrmInputData } from '@src/components/TimeTable/type';
import { ReqSignUp, ResSignIn, ResSignUp } from '@src/types/axios';

export const getSignIn = async (id: string) => {
  const { data } = await axios.get<ResSignIn>(`/api/auth/login?id=${id}`);

  return data;
};

export const postSingUp = async (reqData: ReqSignUp) => {
  const { data } = await axios.post<ResSignUp>('/api/server/user', reqData);
  return data;
};

export const getTimeTable = async (date: string, accessToken?: string) => {
  const options = accessToken
    ? {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    : undefined;

  const { data } = await axios.get<TimeItem[]>(
    `/api/db/work/all?date=${date}`,
    options
  );
  return data;
};

export const getHrmData = async (date: string) => {
  const { data } = await axios.get<HrmInputData[]>(
    `/api/db/work/hrm?date=${date}`
  );
  return data;
};

export const postHrmData = async (reqData: HrmInputData[]) => {
  const { data } = await axios.post(`/api/db/work/hrm`, reqData);

  return data;
};
