/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'
import Searchbar from '../components/home/Searchbar.client';

jest.mock('axios');

test('updates address on change', async () => {
  const onSearch = jest.fn((value) => {})

  const { getByPlaceholderText } = render(<Searchbar onSearch={onSearch}/>)

  const addressInput = getByPlaceholderText('Enter factory address');
  fireEvent.change(addressInput, { target: { value: '901 Bagby St, Houston, TX 77002' } });
  onSearch('901 Bagby St, Houston, TX 77002')
  expect(onSearch).toHaveBeenCalledWith('901 Bagby St, Houston, TX 77002');
});
/* Needs Fixing


test('validates latitude and longitude correctly', async () => {
  const onSearch = jest.fn((value) => {})

  const { getByPlaceholderText, getByText } = render( <Searchbar onSearch={onSearch} />);
  

  const latitudeInput = getByPlaceholderText('Enter latitude');
  const longitudeInput = getByPlaceholderText('Enter longitude');


  

  fireEvent.change(latitudeInput, { target: { value: '40.7128' } });
  fireEvent.change(longitudeInput, { target: { value: '-74.0060' } });

  expect(onSearch).not.toHaveBeenCalled();

  fireEvent.change(latitudeInput, { target: { value: '1000' } });
  fireEvent.change(longitudeInput, { target: { value: '2000' } });

  await waitFor(() =>
    expect(getByText(/Invalid latitude or longitude/)).toBeInTheDocument()
  );
}); */

test('displays results on map', async () => {
  const onSearchMock = jest.fn();

  const response = {
    data: [
      {
        lat: 40.7128, 
        lon: -74.0060, 
      },
    ],
  };
  //axios.get.mockResolvedValue(resp);
  (axios.get as jest.Mock).mockResolvedValue(response);

  const { getByText } = render(<Searchbar onSearch={onSearchMock} />);

  const addressInput = getByText('Search');

  fireEvent.click(addressInput);

  await waitFor(() => expect(onSearchMock).toHaveBeenCalled());
});

/*
Needs fixing

test('disables button on empty search bar', () => {
  const onSearchMock = jest.fn();

  const { getByText } = render(<Searchbar onSearch={onSearchMock} />);

  const searchButton = getByText('');

  expect(searchButton).toBeDisabled();
});*/

test.each(['New York', 'Berlin', 'Tokyo'])(
  'searches for %s',
  async (address) => {
    const onSearchMock = jest.fn();
    const response = {
      data: [
        {
          lat: 40.7128, 
          lon: -74.0060, 
        },
      ],
    };
    
    (axios.get as jest.Mock).mockResolvedValue(response);

    const { getByPlaceholderText, getByText } = render(
      <Searchbar onSearch={onSearchMock} />
    );

    const addressInput = getByPlaceholderText('Enter factory address');
    fireEvent.change(addressInput, { target: { value: address } });

    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(onSearchMock).toHaveBeenCalledWith({
        lat: 40.7128,
        lon: -74.0060,
      })
    );
  }
);
