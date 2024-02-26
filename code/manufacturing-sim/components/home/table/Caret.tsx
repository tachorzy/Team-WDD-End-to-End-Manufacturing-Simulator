const Caret = ({ direction }: { direction: string }) => {
    console.log(`Caret direction: ${direction}`) 
    return (
        <svg
            className={`w-5 h-5 py-0.5 ml-1 fill-current text-[#858A8F] ${
                direction === "desc" ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
        >
            <path d="M10 3l-7 7h14l-7-7z" />
        </svg>
    );
}

export default Caret;