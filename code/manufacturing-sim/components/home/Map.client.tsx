"use client";

// import font later
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    position: { lat: number; lon: number };
}

const customIcon = new L.Icon({
    iconUrl: "/map/factory-map-marker.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const ChangeView = ({ center, zoom }) => {
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

    return (
        <div>
            <MapContainer
                center={[37.0902, -95.7129]}
                zoom={initialZoom}
                style={{ height: "25rem", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {positions.length > 0 && (
                    <ChangeView
                        center={positions[positions.length - 1]}
                        zoom={zoomInLevel}
                    />
                )}
                {positions.map((position, index) => (
                    <Marker
                        key={index}
                        position={[position.lat, position.lon]}
                        icon={customIcon}
                    >
                        <Popup>
                            Factory Data or we can redirect user to another page
                            when they click on it
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
