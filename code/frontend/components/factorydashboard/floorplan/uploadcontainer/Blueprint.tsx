import Image from "next/image";

const UploadResultTray = (props: {
    imageURL: string
}) => {
    const { imageURL } = props;

    return (
        <div>
            <Image
                src={imageURL}
                width={200}
                height={200}
                alt="upload result tray"
                className="select-none mb-2"
            />
        </div>
    );
};

export default UploadResultTray;
