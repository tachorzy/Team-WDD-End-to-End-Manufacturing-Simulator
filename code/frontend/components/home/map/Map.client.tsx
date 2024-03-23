"use client";

// TODO: import font later
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Factory } from "@/app/types/types";
import MapPin from "./MapPin";
import "leaflet/dist/leaflet.css";

interface MapProps {
    positions: Factory[];
}

const customIcon = new L.Icon({
    iconUrl: "icons/map/factory-map-marker.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const customIconDualFacilities = new L.Icon({
    iconUrl: "icons/map/factory-map-marker-two.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const customIconMultipleFacilities = new L.Icon({
    iconUrl: "icons/map/factory-map-marker-multiple.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const ChangeView = ({
    center,
    zoom,
}: {
    center: L.LatLngExpression;
    zoom: number | undefined;
}) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                animate: true,
                duration: 2.0,
            });
        }
    }, [center, zoom, map]);
    return null;
};

export function groupFactoriesByLocation(ungroupedFactories: Factory[]) {
    const groupedFactories: { [key: string]: Factory[] } = {};
    ungroupedFactories.forEach((factory) => {
        const key = `${Number(factory.location.latitude).toFixed(2)},${Number(factory.location.longitude).toFixed(2)}`;
        if (!groupedFactories[key]) {
            groupedFactories[key] = [];
        }
        groupedFactories[key].push(factory);
    });

    return groupedFactories;
}

const MapComponent: React.FC<MapProps> = ({ positions }) => {
    const initialZoom = 4;
    const zoomInLevel = 15;
    const [factories, setFactories] = useState<Factory[]>([]);
    useEffect(() => {
        const fetchFactories = async () => {
            const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;
            try {
                const response = await fetch(`${BASE_URL}/factories`);
                const data = (await response.json()) as Factory[];
                console.log(data);
                setFactories(data);
            } catch (error) {
                console.error("Error fetching factories:", error);
            }
        };

        fetchFactories();
    }, []);

    function generateLatLng() {
        const coordinate = positions[positions.length - 1];

        return new L.LatLng(
            coordinate.location.latitude,
            coordinate.location.longitude,
        );
    }

    const totalFactories = factories.concat(positions);
    const groupedFactories = groupFactoriesByLocation([...totalFactories]);

    return (
        <div className="z-10">
            <MapContainer
                center={[37.0902, -95.7129]}
                zoom={initialZoom}
                style={{ height: "25rem", width: "100%" }}
                className="z-10"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {positions.length > 0 && (
                    <ChangeView center={generateLatLng()} zoom={zoomInLevel} />
                )}
                {Object.entries(groupedFactories).map(
                    ([key, factoriesAtLocation], index) => {
                        const [lat, lng] = key.split(",").map(Number);
                        const numOfSharedFacilities =
                            factoriesAtLocation.length;
                        console.log(
                            `numOfSharedFacilities: ${numOfSharedFacilities}`,
                        );
                        return (
                            <MapPin
                                _key={index}
                                position={{ lat, lng }}
                                factoriesAtLocation={factoriesAtLocation}
                                icon={(() => {
                                    if (numOfSharedFacilities === 1) {
                                        return customIcon;
                                    }
                                    if (numOfSharedFacilities === 2) {
                                        return customIconDualFacilities;
                                    }
                                    return customIconMultipleFacilities;
                                })()}
                            />
                        );
                    },
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
