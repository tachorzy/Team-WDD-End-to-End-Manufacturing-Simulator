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

interface CreateFactory{
    name: string;
  location: {
    longitude: number;
    latitude: number;
  };
  description: string;
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
          console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      
      console.error(`Failed to fetch factory with ID ${factoryId}:`, error);
      throw new Error(`Failed to fetch factory with ID ${factoryId}`);
    }
  };

  const createFactory = async (newFactory: CreateFactory): Promise<Factory> => {
    try {
      const response = await api.post<Factory>('/factories', newFactory);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to add new factory:', error);
      throw new Error('Failed to add new factory');
    }
  };

  export { getFactory, createFactory };