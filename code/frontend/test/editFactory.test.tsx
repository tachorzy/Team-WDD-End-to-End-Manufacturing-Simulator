/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditFactoryForm from "@/components/factorydashboard/editFactory";


global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                factoryId: "1",
                message: "",
            }),
    }),
) as jest.Mock;

describe("Landing Page Component", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });
    
    test("renders and its compontents correctly ", () => {
        
    });
});
