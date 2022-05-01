import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Skeleton, TableCell, TableRow } from '@mui/material';
import { typedMemo } from '@src/libs/react/utils';
import React from 'react';
import { Cell } from 'react-table';

export const HeaderTitle = styled.div<{ widthRem: number }>`
  width: ${(props) => `${props.widthRem}rem`};
`;

interface TableCellMemoProps<T extends {}> {
  cell: Cell<T>;
}

export const TableCellMemo = typedMemo(
  <T,>({ cell }: TableCellMemoProps<T>) => {
    return (
      <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
    );
  },
  // function TableCellMemoFunc<T>({ cell }: TableCellMemoProps<T>) {
  //   return (
  //     <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
  //   );
  // },
  (prev, next) => {
    return (
      prev.cell.value === next.cell.value &&
      prev.cell.getCellProps().key === next.cell.getCellProps().key
    );
  }
);

export const TableSkeletonCell = React.memo(
  ({
    row,
    column,
    heightRem,
  }: {
    row: number;
    column: number;
    heightRem?: number;
  }) => {
    const rowArray = new Array(row).fill(null);
    const columnArray = new Array(column).fill(null);

    return (
      <>
        {rowArray.map((item, index) => (
          <TableRow key={index}>
            {columnArray.map((item, idx) => (
              <TableCell key={idx}>
                <Skeleton
                  css={css`
                    height: ${heightRem}rem;
                  `}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  }
);
