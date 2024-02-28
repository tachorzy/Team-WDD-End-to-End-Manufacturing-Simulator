/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom";
import SearchModeButton from "../components/home/searchbar/SearchModeButton";


test('renders without crashing', () => {
    const { container } = render(
      <SearchModeButton
        isAddressSearchBarActive={false}
        setIsAddressSearchBarActive={() => {}}
        setInvalidInput={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('toggles state and invokes callbacks when "Address" button is clicked', () => {
    const setIsAddressSearchBarActive = jest.fn();
    const setInvalidInput = jest.fn();

    const { getByText } = render(
      <SearchModeButton
        isAddressSearchBarActive={false}
        setIsAddressSearchBarActive={setIsAddressSearchBarActive}
        setInvalidInput={setInvalidInput}
      />
    );

    fireEvent.click(getByText('Address'));

    expect(setIsAddressSearchBarActive).toHaveBeenCalledTimes(1);
    expect(setIsAddressSearchBarActive).toHaveBeenCalledWith(true);
    expect(setInvalidInput).toHaveBeenCalledTimes(1);
    expect(setInvalidInput).toHaveBeenCalledWith(false);
  });

  test('toggles state and invokes callbacks when "Coordinates" button is clicked', () => {
    const setIsAddressSearchBarActive = jest.fn();
    const setInvalidInput = jest.fn();

    const { getByText } = render(
      <SearchModeButton
        isAddressSearchBarActive={true}
        setIsAddressSearchBarActive={setIsAddressSearchBarActive}
        setInvalidInput={setInvalidInput}
      />
    );

    fireEvent.click(getByText('Coordinates'));

    expect(setIsAddressSearchBarActive).toHaveBeenCalledTimes(1);
    expect(setIsAddressSearchBarActive).toHaveBeenCalledWith(false);
    expect(setInvalidInput).toHaveBeenCalledTimes(1);
    expect(setInvalidInput).toHaveBeenCalledWith(false);
  });
