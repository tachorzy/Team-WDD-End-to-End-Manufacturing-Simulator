import React from "react";
import { render, cleanup } from "@testing-library/react";
import { Property } from "@/app/api/_utils/types";
import PropertyChart, {
    PropertyData,
} from "../components/assetdashboard/charts/PropertyChart";
import "@testing-library/jest-dom";

jest.mock("d3", () => ({
    select: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    exit: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    scaleTime: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    domain: jest.fn().mockReturnThis(),
    extent: jest.fn().mockReturnThis(),
    axisBottom: jest.fn().mockReturnThis(),
    axisLeft: jest.fn().mockReturnThis(),
    line: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    scaleLinear: jest.fn().mockReturnThis(),
    tickFormat: jest.fn().mockReturnThis(),
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
    datum: jest.fn().mockReturnThis(),
    merge: jest.fn().mockReturnThis(),
    // Add any other D3 methods you use
}));

afterEach(cleanup);

const mockProperty: Property = {
    propertyId: "1",
    modelId: "1",
    factoryId: "1",
    measurementId: "1",
    generatorType: "random",
    name: "property",
    unit: "unit",
    // min: 1,
    // max: 100,
    // value: 50,
    // timestamp: Date.now(),
    // factoryId: "1",
};

describe("PropertyChart", () => {
    const data: PropertyData[] = [
        { date: Date.now(), value: 10 },
        { date: Date.now(), value: 20 },
    ];

    test("should render component", () => {
        const { getByTestId } = render(
            <PropertyChart property={mockProperty} />,
        );
        expect(getByTestId("property chart")).toBeInTheDocument();
    });
});
