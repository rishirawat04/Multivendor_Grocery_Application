import React, { useEffect, useState } from 'react';
import '../../app.css';
import hero from '../../assets/hero.png' // Include custom styles for animation
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, useScrollTrigger, Zoom } from '@mui/material';
// import cart5 from "./assets/cart5.png";
// import cart6 from "./assets/cart6.png";
// import cart7 from "./assets/cart7.png";
// import cart8 from "./assets/cart8.png";

const HeroPage = () => {

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);
  return (
    <div className="relative h-auto w-full mt-20 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
        <div className="text-center md:text-left ml-4 md:w-1/2 z-0">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Take Organic Food and Stay Healthy
          </h1>
          <p className="text-gray-600 mb-6">
            A trusted brand for organic food
          </p>
          <button className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition">
            Shop Now
          </button>
        </div>
        <div className="relative md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img
            src={hero} 
            alt="Organic Basket"
            className="w-full max-w-md md:max-w-lg animate-bounce-slow"
          />
        </div>
      </div>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full cursor-pointer">
        <span><ArrowBackIcon /></span>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full cursor-pointer">
        <span><ArrowForwardIcon /></span>
      </div>
      <div className="fixed z-10 bottom-4 left-4 bg-green-600 text-white p-2 rounded-full cursor-pointer">
  <span><WhatsAppIcon /></span>
</div>
<div className="fixed z-10 bottom-4 right-4">
<Zoom in={visible}>
      <Fab
        
        size="small"
        onClick={scrollToTop}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          backgroundColor: '#38a169',
          '&:hover': {
            backgroundColor: '#2f855a', 
          },
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
</div>
    </div>
  );
};

export default HeroPage;
