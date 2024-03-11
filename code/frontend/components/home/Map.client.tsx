"use client";

// TODO: import font later
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getAllFactories } from "@/app/api/factories/factoryAPI";
import { Factory } from "@/app/types/types";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

interface Coordinate {
    lat: number;
    lon: number;
}

interface MapProps {
    positions: Coordinate[];
}

const customIcon = new L.Icon({
    iconUrl: "/map/factory-map-marker.svg",
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

    useEffect(() => {
        const fetchFactories = async () => {
            try {
                const response = await getAllFactories();
                setFactories(response);
            } catch (error) {
                console.error("Error fetching factories:", error);
            }
        };

        fetchFactories();
    }, []);

    function generateLatLng() {
        const coordinate = positions[positions.length - 1];

        return new L.LatLng(coordinate.lat, coordinate.lon);
    }

    return (
        <div>
            <MapContainer
                center={[37.0902, -95.7129]}
                zoom={initialZoom}
                style={{ height: "25rem", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {positions.length > 0 && (
                    <ChangeView center={generateLatLng()} zoom={zoomInLevel} />
                )}
                {Array.isArray(factories) &&
                    factories.map((factory, index) => (
                        <Marker
                            key={index}
                            position={[
                                factory.location.latitude,
                                factory.location.longitude,
                            ]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div>
                                    <h3 className="font-bold">
                                        {factory.name}
                                    </h3>
                                    <p>{`Located: ${factory.location.latitude}, ${factory.location.longitude}`}</p>
                                    <p>{factory.description}</p>
                                    <Link
                                        href={`/factorydashboard/${factory.factoryId}`}
                                    >
                                        View Factory
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                {positions.map((position, index) => (
                    <Marker
                        key={index}
                        position={[position.lat, position.lon]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{`New Facility ${positions.length + 1}`}</h3>
                                <p>{`Located: ${position.lat}, ${position.lon}`}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
