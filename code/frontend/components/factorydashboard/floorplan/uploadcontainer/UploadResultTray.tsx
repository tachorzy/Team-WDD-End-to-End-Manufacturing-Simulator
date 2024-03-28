const UploadResultTray = (props: {
    acceptedFileItems: React.JSX.Element[];
    fileRejectionItems: React.JSX.Element[];
}) => {
    const { acceptedFileItems, fileRejectionItems } = props;

    return (
        <div>
            {acceptedFileItems.length !== 0 && (
                <span className="text-center">
                    <h4 className="text-slate-700 font-medium text-sm">
                        Accepted files:
                    </h4>
                    <ul className="text-slate-700 text-sm">
                        {acceptedFileItems}
                    </ul>
                </span>
            )}
            {fileRejectionItems.length !== 0 && (
                <span className="text-center">
                    <h4 className="text-red-500 font-medium text-sm">
                        Rejected files:
                    </h4>
                    <ul className="text-red-500 text-sm">
                        {fileRejectionItems}
                    </ul>
                </span>
            )}
        </div>
    );
};

export default UploadResultTray;
