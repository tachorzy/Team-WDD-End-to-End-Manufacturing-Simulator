import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import Image from "next/image";

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
        <Popup className="w-56">
            <div className="w-full">
                <h3 className="font-bold text-base text-slate-600">{title}</h3>
                <div className="flex flex-col gap-y-1">
                    <div className="flex flex-row gap-x-1 border-b-2 border-slate-300 py-0">
                        <Image
                            src="/icons/map/popup/location.svg"
                            width={17}
                            height={17}
                            className="select-none"
                            alt="error pin"
                        />
                        <p className="font-thin	text-slate-500 my-0 text-xs">{`${Number(position.lat).toFixed(2)}°, ${Number(position.lng).toFixed(2)}°`}</p>
                    </div>
                </div>

                {description && (
                    <p className="font-text-xs text-pretty">{description}</p>
                )}
                <div className="w-fit">
                    {link && (
                        <Link
                            href={link}
                            className="text-sm hover:text-MainBlue group"
                        >
                            View Factory
                            <span className="text-lg font-bold pt-0.5 pl-0.5 group-hover:pl-1.5 duration-500">
                                ›
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </Popup>
    </Marker>
);

export default MapPin;
