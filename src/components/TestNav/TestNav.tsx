import { css } from '@emotion/react';
import React from 'react';

export type TestNavProps = {
  appProps?: any;
};

export default function TestNav({ appProps }: TestNavProps): JSX.Element {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <div>TestNav</div>
      <div>{appProps}</div>
    </div>
  );
}
