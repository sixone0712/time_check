import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/signin');
    }
    if (session.status === 'authenticated') {
      router.push('/time');
    }
  }, [session.status]);
  return <></>;
};

export default Home;
