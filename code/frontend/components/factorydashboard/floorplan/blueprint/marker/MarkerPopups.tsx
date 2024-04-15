import React, { MouseEventHandler, SyntheticEvent } from "react";
import { Asset } from "@/app/api/_utils/types";
import Popup from "reactjs-popup";
import Image from "next/image";
import EditAssetForm from "@/components/factorydashboard/floormanager/EditAssetForm";
import DeletionConfirmation from "./DeletionConformation";

interface AssetPopupsProps {
    handleDelete: (event?: SyntheticEvent<Element, Event>) => void;
    showConfirmDialog: boolean;
    confirmDelete: MouseEventHandler<HTMLButtonElement>;
    cancelDelete: MouseEventHandler<HTMLButtonElement>;
    handleEdit: (event?: SyntheticEvent<Element, Event>) => void;
    showEditForm: boolean;
    closeEditForm: (event?: React.MouseEvent<HTMLElement> | undefined) => void;
    asset: Asset;
}

const AssetPopups: React.FC<AssetPopupsProps> = ({
    handleDelete,
    showConfirmDialog,
    confirmDelete,
    cancelDelete,
    handleEdit,
    showEditForm,
    closeEditForm,
    asset,
}) => (
    <div>
        <Popup
            trigger={
                <button
                    className="text-gray-800 rounded-full"
                    type="button"
                    data-testid="delete-button"
                >
                    <Image
                        src="/icons/garbage.svg"
                        width={30}
                        height={30}
                        alt="delete icon"
                        className="select-none"
                    />
                </button>
            }
            position="right center"
            onOpen={handleDelete}
        >
            {showConfirmDialog && (
                <div>
                    <DeletionConfirmation
                        confirmDelete={confirmDelete}
                        cancelDelete={cancelDelete}
                    />
                </div>
            )}
        </Popup>
        <Popup
            trigger={
                <button
                    className="text-gray-800"
                    type="button"
                    data-testid="edit-button"
                >
                    <Image
                        src="/icons/edit.svg"
                        width={30}
                        height={30}
                        alt="edit icon"
                        className="select-none"
                    />
                </button>
            }
            position="left center"
            onOpen={handleEdit}
        >
            {showEditForm && (
                <div>
                    <EditAssetForm
                        asset={asset}
                        closeEditForm={closeEditForm}
                    />
                </div>
            )}
        </Popup>
    </div>
);

export default AssetPopups;
