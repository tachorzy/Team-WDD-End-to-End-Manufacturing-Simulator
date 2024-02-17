import React from 'react'
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';

const LandingPageTitle: React.FC = () => {
    
    return (
        <div className="flex flex-col items-center justify-center mx-auto">
            <h1 className="font-extrabold bg-gradient-to-br from-DarkGray via-[#4A545C] to-DarkGray bg-clip-text text-transparent text-4xl text-center md:text-5xl lg:text-6xl xl:text-7xl w-2/3 mb-1.5">End-to-End<br/>Manufacturing Simulator</h1>
            <div className="absolute flex flex-row items-center float-left justify-center gap-x-2 w-1/2 mt-72 ">
                <Image src="/icons/home/chevron-horizontal.svg" width={15} height={15} alt="chevron" className="relative h-full mb-3 select-none align-top"></Image>
                <TypeAnimation
                    className={"relative text-DarkBlue/80 text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2"}
                    sequence={["We connect your devices to make them smarter.", 1000]}
                    cursor={true}
                />   
            </div>
        </div>
    );
  };
  
export default LandingPageTitle;
  