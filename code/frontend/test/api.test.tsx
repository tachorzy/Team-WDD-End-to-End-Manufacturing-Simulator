/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as api from "../app/api/factories/factoryAPI";
import { Factory } from "@/app/types/types";

//Mocks
const mockFetch = jest.fn();
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules(); 
  
  process.env = { ...originalEnv }; 
});

afterEach(() => {
  process.env = originalEnv; 
});

beforeEach(() => {
  // @ts-ignore
  global.fetch = mockFetch;
});


afterEach(() => {
  jest.clearAllMocks();
});

describe("Factory API", () => {
    const mockFactory = {
        factoryId: "1",
        name: "Factory 1",
        location: {
            city: "City 1",
            country: "Country 1",
        },
        description: "none",
    };
        

  test("getFactory function", async () => {
   
    console.log("NEXT_PUBLIC_AWS_ENDPOINT before assignment:", process.env.NEXT_PUBLIC_AWS_ENDPOINT);
    process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://example.com/api";
    console.log("NEXT_PUBLIC_AWS_ENDPOINT after assignment:", process.env.NEXT_PUBLIC_AWS_ENDPOINT);


    const mockResponse = mockFactory;

    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

    const result = await api.getFactory("1");

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/factories?id=1`,
      expect.objectContaining({
        method: "GET",
      })
    );
  });
  
  test("createFactory function", async () => {
    process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://example.com/api";
  
    const mockResponse = mockFactory;
  
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as any);
  
    const result = await api.createFactory(mockFactory as any); // Using 'as any' to suppress TypeScript error
  
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/factories`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(mockFactory),
      })
    );
  });

  test("getAllFactories function", async () => {
    process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://example.com/api";

    const mockResponse = [mockFactory];

    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await api.getAllFactories();

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/factories`,
      expect.objectContaining({
        method: "GET",
      })
    );
  });

  test("updateFactory function", async () => {
    process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://example.com/api";
  
    const updatedFactory = {
      ...mockFactory,
      name: "Updated Factory",
    };
    const mockResponse = updatedFactory;
  
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as any);
  
    const result = await api.updateFactory(updatedFactory as any); // Using 'as any' to suppress TypeScript error
  
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/factories`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(updatedFactory),
      })
    );
  });
  
});
