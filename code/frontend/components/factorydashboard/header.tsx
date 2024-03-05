import React from 'react';
import { Factory } from '@/app/types/types';
import { getFactory } from '@/app/api/factories/factoryAPI';
import { usePathname  } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
    const navigation = usePathname();
    const [factory, setFactory] = useState<Factory | null>(null);

    useEffect(() => {
        const fetchFactory = async () => {
            if (typeof window !== 'undefined') {
                const factoryId = navigation.split("/")[2];
            if (factoryId && typeof factoryId === "string") {
                try {
                    const factoryData = await getFactory(factoryId);
                    setFactory(factoryData);
                    console.log(factory);
                } catch (error) {
                    console.error("Error fetching factory:", error);
                }
            }
        }
        };

        fetchFactory();
    }, [navigation]);

    return (
        <div className="lg:flex lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    {factory ? factory.name : "Loading..."}
                </h2>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                 
                    {factory ? factory.description : "Loading..."}
                </div>
                
            </div>
            <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="hidden sm:block">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        
                        Edit
                    </button>
                </span>
            </div>
        </div>
    );
}

export default Header;
