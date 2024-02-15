import React from 'react'
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';

const LandingPageTitle: React.FC = () => {
    
    return (
        <div>
            <h1 className="font-extrabold text-DarkGray text-4xl md:text-5xl lg:text-6xl xl:text-7xl w-1/2 mb-1.5">End-to-End<br/>Manufacturing Simulator</h1>
            <div className="absolute flex flex-row gap-x-2 w-1/3">
                <Image src="/icons/home/chevron-horizontal.svg" width={15} height={15} alt="chevron" className="relative h-full pt-1.5 select-none"></Image>
                <TypeAnimation
                    className={"relative text-DarkBlue/80 text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4"}
                    sequence={["We connect your devices to make them smarter.", 1000]}
                    cursor={true}
                />   
            </div>
        </div>
    );
  };
  
export default LandingPageTitle;
  