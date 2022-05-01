import { TimeItem } from '@common/types/time';
import { AxiosError } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';
import { ReqSignUp, ResSignIn, ResSignUp } from '@src/types/axios';
import {
  getHrmData,
  getTimeTable,
  getSignIn,
  postSingUp,
} from '../axios/requests';
import { HrmInputData } from '@src/components/TimeTable/type';

export const useGetSignIn = (
  id: string,
  // options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, QueryKey>
  options?: UseQueryOptions<ResSignIn, AxiosError, ResSignIn, any>
): UseQueryResult<ResSignIn, AxiosError> =>
  useQuery(['login'], () => getSignIn(id), options);

export const useGetTimeTable = (
  date: string,
  // options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, QueryKey>
  options?: UseQueryOptions<TimeItem[], AxiosError, TimeItem[], any>
): UseQueryResult<TimeItem[], AxiosError> =>
  useQuery(['getTimeTable', date], () => getTimeTable(date), options);

export const useGetHrmData = (
  date: string,
  // options?: UseQueryOptions<ResLogin, AxiosError, ResLogin, QueryKey>
  options?: UseQueryOptions<HrmInputData[], AxiosError, HrmInputData[], any>
): UseQueryResult<HrmInputData[], AxiosError> =>
  useQuery(['getHrmData', date], () => getHrmData(date), options);

export const usePostSingUp = (
  options?: UseMutationOptions<ResSignUp, AxiosError, any, any>
): UseMutationResult<ResSignUp, AxiosError, any, any> =>
  useMutation((reqData: ReqSignUp) => postSingUp(reqData), {
    mutationKey: ['usePostSignUp'],
    ...options,
  });
