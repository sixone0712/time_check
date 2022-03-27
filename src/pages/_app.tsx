import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { css, Global, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import MainNav from '@src/components/MainNav';
import { ReactQueryDevtools } from 'react-query/devtools';
import muiTheme from '@src/theme/mui-theme';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          Nextjs App with TypeScript, ESlint, Jest, Emotion, Tailwind and Twin
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider theme={muiTheme}>
            <SessionProvider session={pageProps.session}>
              <CssBaseline />
              <Global styles={globalStyles} />
              <MainNav appProps={<Component {...pageProps} />} />
            </SessionProvider>
          </ThemeProvider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

const globalStyles = css`
  @font-face {
    font-family: 's-core-dream-regular';
    src: url('/assets/font/scdream4.woff2') format('woff2'),
      url('/assets/fonts/scdream4.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'noto-sans-regular';
    src: url('/assets/font/noto-sans-regular.woff2') format('woff2'),
      url('/assets/fonts/noto-sans-regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    /* font-family: -apple-system, s-core-dream-regular, BlinkMacSystemFont,
      Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
      Helvetica Neue, sans-serif; */

    font-family: -apple-system, s-core-dream-regular, sans-serif !important;
  }

  * {
    box-sizing: border-box;
  }
`;

export default MyApp;
