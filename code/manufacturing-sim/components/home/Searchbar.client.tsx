'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface SearchProps {
  onSearch: (position: { lat: number, lon: number }) => void;
}

const INITIAL_ADDRESS_STATE = '';
const INIITIAL_LATITUDE_STATE = '';
const INITIAL_LONGITUDE_STATE = '';


const Searchbar: React.FC<SearchProps> = ({ onSearch }) => {
  const [isAddressSearchBarActive, setIsAddressSearchBarActive] = useState(true);
  const [address, setAddress] = useState(INITIAL_ADDRESS_STATE);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSearch = async () => {
    const coordinates = isAddressSearchBarActive ? await getCoordinates(address) : await getCoodinates(latitude, longitude);
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

  const getCoodinates = async (latitude: string, longitude: string): Promise<{ lat: number, lon: number } | undefined> => {
    try { 
      const lat = Number(latitude);
      const lon = Number(longitude);
      console.log(`lat: ${lat}, lon: ${lon}`)
      if ((lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180))
        return { lat, lon };

      console.log("Invalid latitude or longitude")
      return undefined
      // we should show a tooltip if the latitude and/or longitude are not valid
    }
    catch (error) {
      return undefined;
    }
  }

  return (
    <div className="flex flex-row gap-x-2 w-[45%] p-2 bg-DarkBlue rounded-lg mb-8">
       {isAddressSearchBarActive ? 
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter factory address"
            className="rounded w-11/12 p-3 text-DarkBlue font-medium"
          />
          : 
          <div className="flex flex-row gap-x-2">
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude"
              className="rounded w-6/12 p-3 text-DarkBlue font-medium"
            />
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude"
              className="rounded w-6/12 p-3 text-DarkBlue font-medium"
            />
        </div>
      }

      <button onClick={() => setIsAddressSearchBarActive(!isAddressSearchBarActive)} className="flex flex-col group bg-MainBlue dark:text-white rounded p-2.5 w-20 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101%] items-center">
        <Image src="/icons/searchbar/cycle.svg" width={35} height={35} alt="switch searchbar" className="group-hover:rotate-180 transform duration-500"></Image>

      </button>


      {address === INITIAL_ADDRESS_STATE && (longitude === INIITIAL_LATITUDE_STATE && latitude === INITIAL_LONGITUDE_STATE)
          ? (
            <button onClick={handleSearch} className="bg-DarkGray dark:text-white rounded p-3 font-bold inactive">Search</button>
          )
          : (
            <button onClick={handleSearch} className="bg-gradient-to-r from-MainBlue to-Iris rounded p-3 font-bold transition-colors duration-700 ease-in ease-out hover:scale-[101.5%]">Search</button>
          )
      }
    </div>
  );
};

export default Searchbar;