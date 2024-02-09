import Image from "next/image";
import Map from "../components/Map";

export default function Home() {
  return (
    <main className="bg-[#FAFAFA] h-screen">
      <div>
        <Map></Map>
      </div>
    </main>
  );
}
