import { ComponentProps, ComponentType, memo } from 'react';

//https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
export const typedMemo: <T extends ComponentType<any>>(
  c: T,
  areEqual?: (
    prev: React.ComponentProps<T>,
    next: React.ComponentProps<T>
  ) => boolean
) => T = memo;

type PropsComparator<C extends ComponentType> = (
  prevProps: Readonly<ComponentProps<C>>,
  nextProps: Readonly<ComponentProps<C>>
) => boolean;

export function typedMemo2<C extends ComponentType<any>>(
  Component: C,
  propsComparator?: PropsComparator<C>
) {
  return memo(Component, propsComparator) as any as C;
}
