import React, { useEffect, useState } from "react";
import { Factory } from "@/app/types/types";
import { usePathname } from "next/navigation";
import EditFactoryForm from "./editFactory";

const BASE_URL = process.env.NEXT_PUBLIC_AWS_ENDPOINT;

const Header: React.FC = () => {
    const navigation = usePathname();
    const [factory, setFactory] = useState<Factory | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchFactory = async () => {
            const factoryId = navigation.split("/")[2];
            if (factoryId) {
                try {
                    const response = await fetch(
                        `${BASE_URL}/factories?id=${factoryId}`,
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Failed to fetch factory with ID ${factoryId}: ${response.statusText}`,
                        );
                    }
                    const factoryData = (await response.json()) as Factory;
                    setFactory(factoryData);
                } catch (error) {
                    console.error("Error fetching factory:", error);
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
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setShowEditForm(true)}
                >
                    Edit
                </button>

                {showEditForm && (
                    <EditFactoryForm
                        factory={factory}
                        onClose={() => setShowEditForm(false)}
                        onSave={() => setShowEditForm(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Header;
