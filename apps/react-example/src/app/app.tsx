import {
  Chart,
  ChartController,
  ChartControllerParams,
} from '@nabla-studio/lightweight-charts-react';
import {
  AreaData,
  AreaSeriesOptions,
  AreaStyleOptions,
  ColorType,
  DeepPartial,
  ISeriesApi,
  LineStyle,
  SeriesOptionsCommon,
  TickMarkType,
  Time,
  TimeChartOptions,
  WhitespaceData,
  isBusinessDay,
} from 'lightweight-charts';
import { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const seriesOpt: DeepPartial<AreaSeriesOptions> = {
  lineColor: "#8C8AF9",
  topColor: "rgba(60, 53, 109, 1)",
  bottomColor: "rgba(32, 27, 67, 1)",
  priceLineVisible: false,
  priceScaleId: "left",
  crosshairMarkerBorderWidth: 0,
  crosshairMarkerRadius: 8,
}

class LinearChartController extends ChartController {
  lineSeries: ISeriesApi<"Area", Time, AreaData<Time> | WhitespaceData<Time>, AreaSeriesOptions, DeepPartial<AreaStyleOptions & SeriesOptionsCommon>>

  constructor(params: ChartControllerParams<TimeChartOptions, Time>) {
    super(params);

    this.lineSeries = this.api.addAreaSeries(seriesOpt);

    if (params.series && params.series.length > 0) {
      this.lineSeries.setData(params.series[0].data);
    }
  }

  applyOptions(params: Partial<ChartControllerParams<TimeChartOptions, Time>>): void {
    super.applyOptions(params);

    if (params.series && params.series.length > 0) {
      this.lineSeries.setData(params.series[0].data);
    }

    /* this.lineSeries.setData(params?.series?.[0].data ?? []); */

   /*  console.log("APPLY: ", params?.series?.[0].data ?? [])

    this.lineSeries.setData(params?.series?.[0].data ?? []) */
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
          formatOptions.year = "numeric";
          break;

        case TickMarkType.Month:
          formatOptions.month = "short";
          break;

        case TickMarkType.DayOfMonth:
          formatOptions.day = "numeric";
          formatOptions.month = "short";
          break;

        case TickMarkType.Time:
          formatOptions.hour12 = false;
          formatOptions.hour = "2-digit";
          formatOptions.minute = "2-digit";
          break;

        case TickMarkType.TimeWithSeconds:
          formatOptions.hour12 = false;
          formatOptions.hour = "2-digit";
          formatOptions.minute = "2-digit";
          formatOptions.second = "2-digit";
          break;
      }

      let date = new Date();

      if (typeof timePoint === 'string') {
        date = new Date(timePoint)
      } else if (!isBusinessDay(timePoint)) {
        date = new Date((timePoint as number) * 1000)
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
}

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
            type: "Area",
            options: seriesOpt,
            data: toggle ? [
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
              { time: '2019-04-21', value: 80.01 },
              { time: '2019-04-22', value: 96.63 },
              { time: '2019-04-23', value: 76.64 },
              { time: '2019-04-24', value: 81.89 },
              { time: '2019-04-25', value: 74.43 },
              { time: '2019-04-26', value: 80.01 },
              { time: '2019-04-27', value: 96.63 },
              { time: '2019-04-28', value: 76.64 },
              { time: '2019-04-29', value: 81.89 },
              { time: '2019-04-30', value: 74.43 },
            ] : 
            [
              { time: '2019-04-11', value: 80.01 },
              { time: '2019-04-12', value: 96.63 },
              { time: '2019-04-13', value: 76.64 },
              { time: '2019-04-14', value: 81.89 },
              { time: '2019-04-15', value: 74.43 },
              { time: '2019-04-16', value: 80.01 },
              { time: '2019-04-17', value: 96.63 },
              { time: '2019-04-18', value: 76.64 },
              { time: '2019-04-19', value: 81.89 },
            ]
          }
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
