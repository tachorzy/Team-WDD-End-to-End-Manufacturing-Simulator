import Image from "next/image";

const Blueprint = (props: { imageFile: File }) => {
    const { imageFile } = props;

    const imageURL = URL.createObjectURL(imageFile);

    return (
        <div>
            <Image
                src={imageURL}
                width={775}
                height={775}
                quality={100}
                alt="upload result tray"
                className="select-none mb-2"
            />
        </div>
    );
};

export default Blueprint;
