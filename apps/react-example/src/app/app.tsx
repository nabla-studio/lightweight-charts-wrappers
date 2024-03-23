import { Chart } from '@nabla-studio/lightweight-charts-react';
import {
  AreaChartController,
  ChartControllerParams,
} from '@nabla-studio/lightweight-charts-core';
import {
  AreaData,
  AreaSeriesOptions,
  ColorType,
  DeepPartial,
  LineStyle,
  MouseEventParams,
  TickMarkType,
  Time,
  TimeChartOptions,
  isBusinessDay,
} from 'lightweight-charts';
import { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const seriesOpt: DeepPartial<AreaSeriesOptions> = {
  lineColor: '#8C8AF9',
  topColor: 'rgba(60, 53, 109, 1)',
  bottomColor: 'rgba(32, 27, 67, 1)',
  priceLineVisible: false,
  priceScaleId: 'left',
  crosshairMarkerBorderWidth: 0,
  crosshairMarkerRadius: 8,
};

const seriesOpt2: DeepPartial<AreaSeriesOptions> = {
  lineColor: 'red',
  topColor: 'rgba(202, 46, 189, 0.2)',
  bottomColor: 'rgba(202, 46, 189, 0)',
  priceLineVisible: false,
  priceScaleId: 'right',
  crosshairMarkerBorderWidth: 0,
  crosshairMarkerRadius: 8,
};

class LinearChartController extends AreaChartController {
  tooltip: HTMLDivElement;

  constructor(params: ChartControllerParams<TimeChartOptions, Time>) {
    super(params);

    this.tooltip = document.createElement('div');
    this.tooltip.style.borderRadius = '20px';
    this.tooltip.style.background = 'black';
    this.tooltip.style.color = 'white';
    this.tooltip.style.padding = '20px';
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.display = 'none';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.zIndex = '9999';

    params.container.appendChild(this.tooltip);

    this.events.on('remove', () => {
      this.tooltip.remove();
    });

    this.events.on('crosshairMove', this.crosshairMove.bind(this));
  }

  crosshairMove(param: MouseEventParams<Time>) {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > this.params.container.clientWidth ||
      param.point.y < 0 ||
      param.point.y > this.params.container.clientHeight
    ) {
      this.tooltip.style.display = 'none';
    } else {
      this.tooltip.style.display = 'block';

      const dataSeries = Array.from(param.seriesData, ([key, value]) => ({
        key,
        value,
      }));

      const [_, secondSeriesData] = dataSeries;

      const content = dataSeries
        .map((series, index) => {
          const seriesData = series.value as AreaData;

          return `
          <div>
            <h6>
              <span>${secondSeriesData ? '$' : ''}</span>
              <span>${seriesData.value}</span>
            </h6>
          </div>
        `;
        })
        .join('');

      const toolTipWidth = secondSeriesData ? 180 : 90;
      const toolTipHeight = 64;
      const toolTipMargin = 15;

      this.tooltip.innerHTML = `<div>
        ${content}
      </div>
      `;

      const y = param.point.y;
      let left = param.point.x + toolTipMargin;
      if (left > this.params.container.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth;
      }

      let top = y + toolTipMargin;

      if (top > this.params.container.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin;
      }

      this.tooltip.style.left = left + 'px';
      this.tooltip.style.top = top + 'px';
    }
  }
}

const options: DeepPartial<TimeChartOptions> = {
  layout: {
    background: {
      type: ColorType.Solid,
      color: '#201B43',
    },
    textColor: '#B3B1FD',
    fontSize: 14,
  },
  grid: { horzLines: { visible: false }, vertLines: { visible: false } },
  rightPriceScale: { visible: false },
  leftPriceScale: { visible: false },
  crosshair: {
    horzLine: { visible: false },
    vertLine: {
      labelBackgroundColor: '#201B43',
      style: LineStyle.LargeDashed,
      width: 2,
      color: `#B0AADC33`,
    },
  },
  handleScroll: false,
  handleScale: false,
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    lockVisibleTimeRangeOnResize: true,
    allowBoldLabels: false,
    borderVisible: false,
    tickMarkFormatter: (
      timePoint: Time,
      tickMarkType: TickMarkType,
      locale: string
    ) => {
      const formatOptions: Intl.DateTimeFormatOptions = {};

      switch (tickMarkType) {
        case TickMarkType.Year:
          formatOptions.year = 'numeric';
          break;

        case TickMarkType.Month:
          formatOptions.month = 'short';
          break;

        case TickMarkType.DayOfMonth:
          formatOptions.day = 'numeric';
          formatOptions.month = 'short';
          break;

        case TickMarkType.Time:
          formatOptions.hour12 = false;
          formatOptions.hour = '2-digit';
          formatOptions.minute = '2-digit';
          break;

        case TickMarkType.TimeWithSeconds:
          formatOptions.hour12 = false;
          formatOptions.hour = '2-digit';
          formatOptions.minute = '2-digit';
          formatOptions.second = '2-digit';
          break;
      }

      let date = new Date();

      if (typeof timePoint === 'string') {
        date = new Date(timePoint);
      } else if (!isBusinessDay(timePoint)) {
        date = new Date((timePoint as number) * 1000);
      } else {
        date = new Date(
          Date.UTC(timePoint.year, timePoint.month - 1, timePoint.day)
        );
      }

      // from given date we should use only as UTC date or timestamp
      // but to format as locale date we can convert UTC date to local date
      const localDateFromUtc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      );

      return localDateFromUtc.toLocaleString(locale, formatOptions);
    },
  },
  height: 336,
};

export function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>TOGGLE</button>
      <Chart
        Controller={LinearChartController}
        options={options}
        series={[
          {
            type: 'Area',
            options: seriesOpt,
            data: toggle
              ? [
                  { time: '2019-04-11', value: Math.random() },
                  { time: '2019-04-12', value: Math.random() },
                  { time: '2019-04-13', value: Math.random() },
                  { time: '2019-04-14', value: Math.random() },
                  { time: '2019-04-15', value: Math.random() },
                  { time: '2019-04-16', value: Math.random() },
                  { time: '2019-04-17', value: Math.random() },
                  { time: '2019-04-18', value: Math.random() },
                  { time: '2019-04-19', value: Math.random() },
                  { time: '2019-04-20', value: Math.random() },
                  { time: '2019-04-21', value: Math.random() },
                  { time: '2019-04-22', value: Math.random() },
                  { time: '2019-04-23', value: Math.random() },
                  { time: '2019-04-24', value: Math.random() },
                  { time: '2019-04-25', value: Math.random() },
                  { time: '2019-04-26', value: Math.random() },
                  { time: '2019-04-27', value: Math.random() },
                  { time: '2019-04-28', value: Math.random() },
                  { time: '2019-04-29', value: Math.random() },
                  { time: '2019-04-30', value: Math.random() },
                ]
              : [
                  { time: '2019-04-11', value: Math.random() },
                  { time: '2019-04-12', value: Math.random() },
                  { time: '2019-04-13', value: Math.random() },
                  { time: '2019-04-14', value: Math.random() },
                  { time: '2019-04-15', value: Math.random() },
                  { time: '2019-04-16', value: Math.random() },
                  { time: '2019-04-17', value: Math.random() },
                  { time: '2019-04-18', value: Math.random() },
                  { time: '2019-04-19', value: Math.random() },
                ],
          },
          {
            type: 'Area',
            options: seriesOpt2,
            data: toggle
              ? [
                  { time: '2019-04-11', value: Math.random() },
                  { time: '2019-04-12', value: Math.random() },
                  { time: '2019-04-13', value: Math.random() },
                  { time: '2019-04-14', value: Math.random() },
                  { time: '2019-04-15', value: Math.random() },
                  { time: '2019-04-16', value: Math.random() },
                  { time: '2019-04-17', value: Math.random() },
                  { time: '2019-04-18', value: Math.random() },
                  { time: '2019-04-19', value: Math.random() },
                  { time: '2019-04-20', value: Math.random() },
                  { time: '2019-04-21', value: Math.random() },
                  { time: '2019-04-22', value: Math.random() },
                  { time: '2019-04-23', value: Math.random() },
                  { time: '2019-04-24', value: Math.random() },
                  { time: '2019-04-25', value: Math.random() },
                  { time: '2019-04-26', value: Math.random() },
                  { time: '2019-04-27', value: Math.random() },
                  { time: '2019-04-28', value: Math.random() },
                  { time: '2019-04-29', value: Math.random() },
                  { time: '2019-04-30', value: Math.random() },
                ]
              : [
                  { time: '2019-04-11', value: Math.random() },
                  { time: '2019-04-12', value: Math.random() },
                  { time: '2019-04-13', value: Math.random() },
                  { time: '2019-04-14', value: Math.random() },
                  { time: '2019-04-15', value: Math.random() },
                  { time: '2019-04-16', value: Math.random() },
                  { time: '2019-04-17', value: Math.random() },
                  { time: '2019-04-18', value: Math.random() },
                  { time: '2019-04-19', value: Math.random() },
                ],
          },
        ]}
      >
        {(param) => {
          const dataSeries = Array.from(
            param?.seriesData ?? [],
            ([key, value]) => ({
              key,
              value,
            })
          );

          if (dataSeries.length === 0) {
            return <div>X: {param?.point?.x}</div>;
          }

          const [data] = dataSeries;

          return <div>{data.value.time.toString()}</div>;
        }}
      </Chart>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
