'use client';
import React, { useState } from 'react';
import axios from 'axios';

interface SearchProps {
  onSearch: (position: { lat: number, lon: number }) => void;
}

const Searchbar: React.FC<SearchProps> = ({ onSearch }) => {
  const [address, setAddress] = useState('');

  const handleSearch = async () => {
    const coordinates = await getCoordinates(address);
    if (coordinates) {
      onSearch(coordinates);
    }
  };

  const getCoordinates = async (address: string): Promise<{ lat: number, lon: number } | undefined> => {
    try {
      const response = await axios.get('https://geocode.maps.co/search', {
        params: {
          q: address,
          api_key:process.env.NEXT_PUBLIC_GEOCODE_API_KEY
          
        }
      });

      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      console.error('Can\'t find this location oopsie!!!', error);
      console.log(process.env.NEXT_PUBLIC_GEOCODE_API_KEY);
      return undefined;
    }
  };

  return (
    <div className="mb-3 md:w-96">
    <div className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter factory address"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
    </div>
  );
};

export default Searchbar;
