import {
  Chart,
  ChartController,
  ChartControllerParams,
} from '@nabla-studio/lightweight-charts-react';
import {
  ColorType,
  LineStyle,
  MouseEventParams,
  Time,
  TimeChartOptions,
} from 'lightweight-charts';
import { Route, Routes, Link } from 'react-router-dom';

class LinearChartController extends ChartController {
  constructor(params: ChartControllerParams<TimeChartOptions, Time>) {
    super(params);

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
  }

  onCrosshairMove(param: MouseEventParams<Time>): void {
    console.log('MOVE');
    console.log(param);
  }

  onInit(): void {
    console.log('INIT');
  }

  onRemove(): void {
    console.log('REMOVE');
  }
}

export function App() {
  return (
    <div>
      <Chart
        Controller={LinearChartController}
        options={{
          layout: {
            background: {
              type: ColorType.Solid,
              color: 'red',
            },
            textColor: 'white',
            fontSize: 14,
          },
          crosshair: {
            vertLine: {
              labelBackgroundColor: 'white',
              style: LineStyle.LargeDashed,
              width: 2,
              color: 'white',
            },
          },
          height: 336,
        }}
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
