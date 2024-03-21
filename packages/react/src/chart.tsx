import {
  type IChartApi,
  createChart,
  type DeepPartial,
  type TimeChartOptions,
} from 'lightweight-charts';
import {
  type PropsWithChildren,
  useRef,
  useSyncExternalStore,
  memo,
  useEffect,
  useState,
} from 'react';

function resizeSubscribe(callback: (this: Window, ev: UIEvent) => unknown) {
  window.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
  };
}

export abstract class ChartController<T = TimeChartOptions> {
  protected api: IChartApi;

  constructor(private options: DeepPartial<T>, private container: HTMLElement) {
    this.api = createChart(container, {
      width: container?.clientWidth,
      ...options,
    });

    this.api.timeScale().fitContent();

    const lineSeries = this.api.addLineSeries();

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

    this.onInit();
  }

  applyOptions(options: DeepPartial<T>) {
    this.api.applyOptions(options);
  }

  resize() {
    this.applyOptions({ ...this.options, width: this.container.clientWidth });
    this.api.timeScale().fitContent();
  }

  remove() {
    this.api.remove();
    this.onRemove();
  }

  abstract onInit(): void;
  abstract onRemove(): void;
}

export interface ChartProps<T> {
  options: DeepPartial<TimeChartOptions>;
  controller: new (
    options: DeepPartial<TimeChartOptions>,
    container: HTMLElement
  ) => ChartController<T>;
}

export const Chart = memo(
  <T extends TimeChartOptions>(props: PropsWithChildren<ChartProps<T>>) => {
    const { options, children, controller } = props;
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const chart = useRef<ChartController>();

    useSyncExternalStore(
      resizeSubscribe,
      () => {
        chart.current?.resize();
      },
      () => true
    );

    useEffect(() => {
      if (container && chart.current === undefined) {
        chart.current = new controller(options, container);

        /*  const lineSeries = chart.current.addLineSeries();
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
      ]); */
      }
    }, [container]);

    useEffect(() => {
      chart.current?.applyOptions(options);
    }, [options]);

    useEffect(() => {
      return () => {
        chart.current?.remove();
        chart.current = undefined;
      };
    }, []);

    return <div ref={setContainer}>{children}</div>;
  }
);
