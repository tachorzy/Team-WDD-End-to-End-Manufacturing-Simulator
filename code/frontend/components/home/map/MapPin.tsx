import { Marker, Popup } from "react-leaflet";
import Link from "next/link";

interface PinProps {
    key: number;
    position: { lat: number; lng: number };
    title: string;
    description?: string;
    link?: string;
    icon: L.Icon;
}

const MapPin: React.FC<PinProps> = ({
    key,
    position,
    title,
    description,
    link,
    icon,
}) => (
    <Marker key={key} position={position} icon={icon}>
        <Popup>
            <div>
                <h3 className="font-bold">{title}</h3>
                <p>{`Located: ${position.lat}, ${position.lng}`}</p>
                {description && <p>{description}</p>}
                {link && <Link href={link}>View Factory</Link>}
            </div>
        </Popup>
    </Marker>
);

export default MapPin;
