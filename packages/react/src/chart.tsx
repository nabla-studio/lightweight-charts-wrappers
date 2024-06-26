import {
  type DeepPartial,
  type TimeChartOptions,
  type MouseEventParams,
  type Time,
} from 'lightweight-charts';
import {
  useRef,
  useSyncExternalStore,
  memo,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  ChartController,
  ChartControllerParams,
  Series,
} from '@nabla-studio/lightweight-charts-core';

function resizeSubscribe(callback: (this: Window, ev: UIEvent) => unknown) {
  window.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
  };
}

export interface ChartProps<T = TimeChartOptions, K = Time> {
  options: DeepPartial<T>;
  series?: Series[];
  children?: ReactNode | ((params?: MouseEventParams<K>) => ReactNode);
  Controller: new (params: ChartControllerParams<T, K>) => ChartController<
    T,
    K
  >;
}

export const Chart = memo(
  <T extends TimeChartOptions, K extends Time>(props: ChartProps<T, K>) => {
    const { options, children, series, Controller } = props;
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [hoverParam, setHoverParam] = useState<MouseEventParams<K>>();
    const chart = useRef<ChartController<T, K>>();

    useSyncExternalStore(
      resizeSubscribe,
      () => {
        chart.current?.resize();
      },
      () => true
    );

    useEffect(() => {
      if (container && chart.current === undefined) {
        chart.current = new Controller({
          options,
          series,
          container,
          onCrosshairMove: setHoverParam,
        });
      }
    }, [container]);

    useEffect(() => {
      chart.current?.applyOptions({ options, series });
    }, [options, series]);

    useEffect(() => {
      return () => {
        chart.current?.remove();
        chart.current = undefined;
      };
    }, []);

    return (
      <div ref={setContainer}>
        {typeof children === 'function' ? children(hoverParam) : children}
      </div>
    );
  }
);
