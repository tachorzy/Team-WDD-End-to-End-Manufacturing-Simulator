"use client";

// import font later
import React, { useEffect,useState } from "react";
import { getAllFactories } from "@/app/api/factories/factoryAPI";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
    position: { lat: number; lon: number };
}
interface Factory{
    factoryId: string;
    name:string;
    location:{
        longitude: number;
        latitude: number;
    };
    description:string;
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
    const [factories, setFactories] = useState<Factory[]>([]);

    useEffect(() => {
        const fetchFactories = async () => {
            try {
                const response = await getAllFactories();
                const data = JSON.parse(response.body);
                setFactories(data);
                console.log(factories);
            } catch (error) {
                console.error('Error fetching factories:', error);
            }
        };

        fetchFactories();
    }, []);

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
                {factories.map((factory, index) => (
                    <Marker
                        key={index}
                        position={[factory.location.latitude, factory.location.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div>
                                <h3>{factory.name}</h3>
                                <p>{factory.description}</p>
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
                                <h3 className="font-bold">{`New Facility ${positions.length+1}`}</h3>
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
