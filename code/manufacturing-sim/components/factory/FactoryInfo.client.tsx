import React, { useState, useEffect } from "react";
import { getAllFactories } from "@/app/api/factories/factoryAPI";

interface Factory {
  factoryId: string;
  name: string;
  location: {
    longitude: number;
    latitude: number;
  };
  description: string;
}

const FactoryInfo = () => {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const data = await getAllFactories();
        setFactories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching factories:", error);
      }
    };

    fetchFactories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>All Factories</h2>
      <ul>
        {factories.map((factory) => (
          <li key={factory.factoryId}>
            <strong>ID:</strong> {factory.factoryId} <br />
            <strong>Name:</strong> {factory.name} <br />
            <strong>Location:</strong> ({factory.location.latitude},
            {factory.location.longitude}) <br />
            <strong>Description:</strong> {factory.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FactoryInfo;
