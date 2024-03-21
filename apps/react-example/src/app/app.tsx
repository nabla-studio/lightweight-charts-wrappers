import { Chart, ChartController } from '@nabla-studio/lightweight-charts-react';
import {
  ColorType,
  DeepPartial,
  IChartApi,
  LineStyle,
  TimeChartOptions,
} from 'lightweight-charts';
import { Route, Routes, Link } from 'react-router-dom';

class LinearChartController extends ChartController {
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
        controller={LinearChartController}
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
      ></Chart>
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
