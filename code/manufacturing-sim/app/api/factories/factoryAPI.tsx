import axios from 'axios';

interface Factory{
    factoryId: string;
    name:string;
    location:{
        longitude: number;
        latitude: number;
    };
    description:string;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AWS_ENDPOINT, 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  

  const getFactory = async (factoryId: string): Promise<Factory> => {
    try {
        const response = await api.get<Factory>('/factories', {
            params: { factoryId }
          }); 
      return response.data;
    } catch (error) {
      
      console.error(`Failed to fetch factory with ID ${factoryId}:`, error);
      throw new Error(`Failed to fetch factory with ID ${factoryId}`);
    }
  };

  const getAllFactories = async (): Promise<Factory> => {
    try {
        const response = await api.get<Factory>('/factories'); 
          console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      
      console.error(`Failed to fetch all factories: `, error);
      throw new Error(`Failed to fetch all factories.`);
    }
  };

  const createFactory = async (newFactory: Factory): Promise<Factory> => {
    try {
      const response = await api.post<Factory>('/factories', newFactory);
      return response.data;
    } catch (error) {
      console.error('Failed to add new factory:', error);
      throw new Error('Failed to add new factory');
    }
  };


  const getAllFactories = async (): Promise<Factory[]> => {
    try {
        const response = await api.get<Factory[]>('/factories'); 
        console.log("API Response:", response.data);
        return response.data; 
    } catch (error) {
        console.error(`Failed to fetch all factories: `, error);
        throw new Error(`Failed to fetch all factories.`);
    }
};

  export { getFactory, createFactory,getAllFactories};

