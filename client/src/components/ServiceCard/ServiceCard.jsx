import React from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ReplayIcon from '@mui/icons-material/Replay';

const Card = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-100 w-full sm:w-[234px] h-[100px] py-3 px-2 rounded-lg shadow-md flex flex-col md:flex-row items-center text-center transition-transform duration-300 hover:scale-105">
      <div className="text-green-500 mb-1 md:mr-1">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

const OfferCards = () => {
  const cardsData = [
    {
      icon: <LocalOfferIcon style={{ fontSize: 30 }} />,
      title: 'Best prices & offers',
      description: 'Orders $50 or more',
    },
    {
      icon: <LocalShippingIcon style={{ fontSize: 30 }} />,
      title: 'Free delivery',
      description: '24/7 amazing services',
    },
    {
      icon: <MonetizationOnIcon style={{ fontSize: 30 }} />,
      title: 'Great daily deal',
      description: 'When you sign up',
    },
    {
      icon: <CategoryIcon style={{ fontSize: 30 }} />,
      title: 'Wide assortment',
      description: 'Mega Discounts',
    },
    {
      icon: <ReplayIcon style={{ fontSize: 30 }} />,
      title: 'Easy returns',
      description: 'Within 30 days',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-8 justify-center">
      {cardsData.map((card, index) => (
        <Card 
          key={index} 
          icon={card.icon} 
          title={card.title} 
          description={card.description} 
        />
      ))}
    </div>
  );
};

export default OfferCards;
