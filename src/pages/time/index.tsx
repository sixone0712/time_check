import TimeTable from '@src/components/TimeTable';
import { getTimeTable } from '@src/libs/axios/requests';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { dehydrate, QueryClient } from 'react-query';

export type timeProps = {};

export default function time({}: timeProps): JSX.Element {
  return <TimeTable />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  const date = dayjs().format('YYYY-MM');

  const session = (await getToken({
    req: context.req as any,
    secret: process.env.NEXTAUTH_SECRET as string,
  })) as any;

  const accessToken = jwt.sign(
    { ...session },
    process.env.NEXTAUTH_SECRET as string
  );

  try {
    await queryClient.prefetchQuery(['getTimeTable', date], () =>
      getTimeTable(date, accessToken)
    );
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
