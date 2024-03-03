interface Factory {
    factoryId: string;
    name: string;
    location: {
      longitude: number;
      latitude: number;
    };
    description: string;
  }
  
  const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;
  
  const requestOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const getFactory = async (factoryId: string): Promise<Factory> => {
    try {
      const response = await fetch(`${BASE_URL}/factories?factoryId=${factoryId}`, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch factory with ID ${factoryId}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch factory with ID ${factoryId}:`, error);
      throw new Error(`Failed to fetch factory with ID ${factoryId}`);
    }
  };
  
  const createFactory = async (newFactory: Factory): Promise<Factory> => {
    try {
      const response = await fetch(`${BASE_URL}/factories`, {
        ...requestOptions,
        method: 'POST',
        body: JSON.stringify(newFactory),
      });
      if (!response.ok) {
        throw new Error(`Failed to add new factory: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to add new factory:', error);
      throw new Error('Failed to add new factory');
    }
  };
  
  const getAllFactories = async (): Promise<Factory[]> => {
    try {
      const response = await fetch(`${BASE_URL}/factories`, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch all factories: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch all factories: `, error);
      throw new Error(`Failed to fetch all factories.`);
    }
  };
  
  export { getFactory, createFactory, getAllFactories };
  