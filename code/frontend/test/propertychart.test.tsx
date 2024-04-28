import React from 'react';
import { render, cleanup } from '@testing-library/react';
import PropertyChart, { DataPoint } from '../components/assetdashboard/charts/PropertyChart';
import * as d3 from 'd3';

jest.mock('d3-color', () => ({}));

describe('PropertyChart', () => {
    const data: DataPoint[] = [
      { timeStamp: Date.now(), value: 10 },
      { timeStamp: Date.now(), value: 20 },
    ];
  
    test('should render without crashing', () => {
      const { container } = render(<PropertyChart data={data} />);
      expect(container).toBeInTheDocument();
    });
  
    test('should create an SVG element', () => {
      render(<PropertyChart data={data} />);
      expect(d3.select).toHaveBeenCalled();
    });
});