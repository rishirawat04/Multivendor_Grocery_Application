import React, { useState, useEffect } from 'react';
import hero from "../../assets/hero.png";
import CloseIcon from '@mui/icons-material/Close';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`relative bg-gray-50 py-2 px-6 flex items-center justify-center overflow-hidden `}>
      <div className="flex items-center leading-tight tracking-wide whitespace-nowrap">
        <span className="mr-2 font-semibold">SHOP AND</span>
        <span className="mr-2 font-bold text-black">SAVE BIG</span>
        <span className="mr-3 font-semibold">ON LATEST PRODUCTS</span>
        <div className="flex bg-white p-2 items-center mr-2">
          <span className="font-semibold text-[9px] mr-1">STARTING FROM</span>
          <span className="bg-white text-black font-bold">$55</span>
        </div>
        <span className="my-2 text-green-600 font-bold">UP TO 30% OFF</span>
        <img className='w-10 h-10' src={hero} alt="promoImg" />
      </div>
      <button
        className="absolute top-2 right-2 text-gray-400 font-bold"
        onClick={handleClose}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default PromoBanner;