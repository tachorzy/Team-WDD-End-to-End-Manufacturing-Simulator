import type { NextApiRequest, NextApiResponse } from 'next';
import { Factory } from '@/app/types/types';
import { createFactory,updateFactory,getAllFactories,getFactory } from './factoryAPI';

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const requestOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default async function(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const factoryId = req.query.id as string;
        if (factoryId) {
          const factory = await getFactory(factoryId);
          res.status(200).json(factory);
        } else {
          const factories = await getAllFactories();
          res.status(200).json(factories);
        }
        break;
      }
      case 'POST': {
        const newFactory = req.body as Factory;
        const createdFactory = await createFactory(newFactory);
        res.status(201).json(createdFactory);
        break;
      }
      case 'PUT': {
        const factoryData = req.body as Factory;
        const updatedFactory = await updateFactory(factoryData);
        res.status(200).json(updatedFactory);
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
