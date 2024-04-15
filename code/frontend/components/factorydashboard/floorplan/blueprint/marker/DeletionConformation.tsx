import React, { MouseEventHandler } from "react";

interface DeletionConfirmationProps {
    confirmDelete: MouseEventHandler<HTMLButtonElement>;
    cancelDelete: MouseEventHandler<HTMLButtonElement>;
}

const DeletionConfirmation: React.FC<DeletionConfirmationProps> = ({
    confirmDelete,
    cancelDelete,
}) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        data-testid="confirm-dialog"
    >
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-semibold mb-4 text-gray-900">
                Confirm Deletion
            </h1>
            <p className="text-gray-800 mb-4">
                Are you sure you want to delete this?
            </p>
            <div className="flex justify-end">
                <button
                    onClick={cancelDelete}
                    className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 focus:outline-none mr-2"
                    type="button"
                    data-testid="no-button"
                >
                    No
                </button>
                <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 focus:outline-none"
                    type="button"
                    data-testid="yes-button"
                >
                    Yes
                </button>
            </div>
        </div>
    </div>
);

export default DeletionConfirmation;
