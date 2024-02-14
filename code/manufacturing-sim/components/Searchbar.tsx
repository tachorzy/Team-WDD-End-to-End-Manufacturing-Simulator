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
      return undefined;
    }
  };

  return (
    <div className="flex flex-row gap-x-2 w-full max-w-md p-2 bg-DarkBlue rounded-lg mb-8">
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter factory address"
        className="rounded w-11/12 p-3 text-DarkBlue"
      />
      <button onClick={handleSearch} className="bg-LightBlue rounded p-3 font-bold hover:bg-MainBlue">Search</button>
    </div>
  );
};

export default Searchbar;