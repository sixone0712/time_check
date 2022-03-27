import { TimeItem } from '@common/types/time';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { ResLogin } from '@src/types/axios';
import { getTimeTable, login } from '../axios/requests';

export const useLogin = (
  id: string,
  // options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, QueryKey>
  options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, any>
): UseQueryResult<ResLogin, AxiosError> =>
  useQuery(['login'], () => login(id), options);

export const useGetTimeTable = (
  date: string,
  // options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, QueryKey>
  options?: UseQueryOptions<TimeItem[], AxiosError, TimeItem[], any>
): UseQueryResult<TimeItem[], AxiosError> =>
  useQuery(['getTimeTable', date], () => getTimeTable(date), options);
