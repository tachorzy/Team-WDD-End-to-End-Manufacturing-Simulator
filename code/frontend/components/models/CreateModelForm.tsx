import React, { useState, useEffect } from "react";
import Image from "next/image";

// interface CreateModelFormProps {
//     onClose: () => void;
//     onSave: (formData: Partial<Factory>) => void;
// }

const CreateModelForm: React.FC = () => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative w-10/12 h-3/4 bg-white rounded-xl shadow-lg p-8 px-12">
                <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                        Create Your Asset Model
                </h1>
                <div className="flex flex-row mt-4 ">
                    <div className="flex flex-col gap-y-3">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Model ID
                        </h1>
                        <div className="flex flex-col gap-y-0.5">
                            <h2 className="text-sm font-medium text-[#494949]">
                                Define ID prefix
                            </h2>
                            <input
                                className="bg-gray-200 p-4 rounded-lg placeholder-gray-400 w-28"
                                placeholder="e.g. CNC"
                            />
\                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default CreateModelForm;
