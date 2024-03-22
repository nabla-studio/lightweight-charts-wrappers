import EventEmitter from 'eventemitter3';
import {
  type IChartApi,
  createChart,
  type DeepPartial,
  type TimeChartOptions,
  type MouseEventParams,
  type Time,
  type SeriesDataItemTypeMap,
  type SeriesOptionsMap,
} from 'lightweight-charts';
import {
  useRef,
  useSyncExternalStore,
  memo,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

function resizeSubscribe(callback: (this: Window, ev: UIEvent) => unknown) {
  window.addEventListener('resize', callback);

  return () => {
    window.removeEventListener('resize', callback);
  };
}

export interface Series {
  type: keyof SeriesOptionsMap;
  options: DeepPartial<SeriesOptionsMap[keyof SeriesOptionsMap]>;
  data: SeriesDataItemTypeMap<Time>[keyof SeriesOptionsMap][];
}

export interface ChartControllerParams<T = TimeChartOptions, K = Time> {
  options: DeepPartial<T>;
  series?: Series[];
  container: HTMLElement;
  onCrosshairMove?: (param: MouseEventParams<K>) => void;
}

export type ChartControllerEvents<T = TimeChartOptions, K = Time> = {
  crosshairMove: (param: MouseEventParams<K>) => void;
  init: (params: ChartControllerParams<T>) => void;
  remove: (params: ChartControllerParams<T>) => void;
};

export abstract class ChartController<T = TimeChartOptions, K = Time> {
  protected api: IChartApi;
  protected onCrosshairMove:  ((param: MouseEventParams<Time>) => void) | undefined;

  events = new EventEmitter<ChartControllerEvents<T, K>>();

  constructor(private params: ChartControllerParams<T>) {
    const { options, container, onCrosshairMove } = params;

    this.onCrosshairMove = onCrosshairMove;

    this.api = createChart(container, {
      width: container?.clientWidth,
      ...options,
    });

    this.api.timeScale().fitContent();

    this.api.subscribeCrosshairMove((param) => {
      this.onCrosshairMove?.(param as never);
      this.events.emit('crosshairMove', param as never);
    });

    this.events.emit('init', this.params);
  }

  applyOptions(params: Partial<ChartControllerParams<T>>) {
    if (params.options) {
      this.api.applyOptions(params.options);
    }

    if (params.onCrosshairMove) {
      this.onCrosshairMove = params.onCrosshairMove;
    }
  }

  resize() {
    this.api.applyOptions({
      ...this.params.options,
      width: this.params.container.clientWidth,
    });

    this.api.timeScale().fitContent();
  }

  remove() {
    this.api.remove();
    this.events.emit('remove', this.params);
  }
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
