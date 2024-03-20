import { type IChartApi, createChart, type DeepPartial, type TimeChartOptions } from "lightweight-charts";
import { type PropsWithChildren, useRef, useSyncExternalStore, memo, Children, cloneElement, isValidElement, useEffect, useState } from "react";

export interface ChartProps {
  options: DeepPartial<TimeChartOptions>;
  onCreate?: () => void;
}

function resizeSubscribe(callback: (this: Window, ev: UIEvent) => unknown) {
  window.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
  };
}

export const Chart = memo((props: PropsWithChildren<ChartProps>) => {
  const { options, children, onCreate } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const chart = useRef<IChartApi>();

  useSyncExternalStore(
    resizeSubscribe,
    () => {
      chart.current?.applyOptions({ ...options, width: container?.clientWidth })
      chart.current?.timeScale().fitContent();
    },
    () => true
  );

  useEffect(() => {
    if (container && chart.current === undefined) {
      chart.current = createChart(container, {
        width: container?.clientWidth,
        ...options,
      });

      chart.current.timeScale().fitContent();

      const lineSeries = chart.current.addLineSeries();
      lineSeries.setData([
          { time: '2019-04-11', value: 80.01 },
          { time: '2019-04-12', value: 96.63 },
          { time: '2019-04-13', value: 76.64 },
          { time: '2019-04-14', value: 81.89 },
          { time: '2019-04-15', value: 74.43 },
          { time: '2019-04-16', value: 80.01 },
          { time: '2019-04-17', value: 96.63 },
          { time: '2019-04-18', value: 76.64 },
          { time: '2019-04-19', value: 81.89 },
          { time: '2019-04-20', value: 74.43 },
      ]);

      onCreate?.();
    }
  }, [container])

  useEffect(() => {
    chart.current?.applyOptions(options)
  }, [options])

  useEffect(() => {
    return () => {
      chart.current?.remove();
      chart.current = undefined;
    }
  }, [])

  return <div ref={setContainer}>
    {chart.current && Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child, { chart, ...child.props, })
      }

      return child
    })}
  </div>
})
