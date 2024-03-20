"use client";

// TODO: import font later
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { getAllFactories } from "@/app/api/factories/factoryAPI";
import { Factory } from "@/app/types/types";
import MapPin from "./map/MapPin";
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

const MapComponent: React.FC<MapProps> = ({ positions }) => {
    const initialZoom = 4;
    const zoomInLevel = 15;
    const [factories, setFactories] = useState<Factory[]>([]);
    const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;
    useEffect(() => {
        const fetchFactories = async () => {
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

    function groupFactoriesByLocation(factories: Factory[]) {
        const groupedFactories: { [key: string]: Factory[] } = {};
        const totalFactories = factories.concat(positions)
        totalFactories.forEach((factory) => {
            const key = `${factory.location.latitude.toFixed(2)},${factory.location.longitude.toFixed(2)}`;
            if (!groupedFactories[key]) {
                groupedFactories[key] = [];
            }
            groupedFactories[key].push(factory);
        });
    
        return groupedFactories;
    }

    const groupedFactories = groupFactoriesByLocation([...factories, ...positions]);
    
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
                {Object.entries(groupedFactories).map(([key, factoriesAtLocation], index) => {
                    const [lat, lng] = key.split(',').map(Number);
                    const numOfSharedFacilities = factoriesAtLocation.length;

                    return (
                        <MapPin
                            key={index}
                            position={{ lat, lng }}
                            title={factoriesAtLocation[0].name} // adjust this as needed
                            description={factoriesAtLocation[0].description} // adjust this as needed
                            link={`/factorydashboard/${factoriesAtLocation[0].factoryId}`} // adjust this as needed
                            icon={numOfSharedFacilities > 2 ? customIconMultipleFacilities : numOfSharedFacilities > 1 ? customIconDualFacilities : customIcon}
                        />
                    );
                })}
                {/* {positions.map((sessionFactory, index) => (
                    <MapPin
                        key={index}
                        position={{
                            lat: sessionFactory.location.latitude,
                            lng: sessionFactory.location.longitude,
                        }}
                        title={sessionFactory.name}
                        description={sessionFactory.description}
                        link={`/factorydashboard/${sessionFactory.factoryId}`}
                        icon={(() => {
                            if (
                                countFactoriesAtLocation(
                                    sessionFactory.location.latitude,
                                    sessionFactory.location.longitude,
                                ) > 2
                            )
                                return customIconMultipleFacilities;
                            if (
                                countFactoriesAtLocation(
                                    sessionFactory.location.latitude,
                                    sessionFactory.location.longitude,
                                ) > 1
                            )
                                return customIconDualFacilities;
                            return customIcon;
                        })()}
                    /> */}
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
