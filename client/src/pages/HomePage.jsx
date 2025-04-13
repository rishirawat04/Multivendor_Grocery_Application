import React, { useState, useEffect } from 'react';

import HeroPage from "../components/HeroSection/HeroPage"
import TopCategories from "../components/TopCategories/TopCategories"
import OfferSection, { OfferSectionSkeleton } from "../components/OfferSection/OfferSection"
import { offers } from "../FakeData"
import AllProducts from "../components/AllProducts/AllProducts"
import DealsOfTheDay  from "../components/OneDayOffer/OneDayOffer"
import SubscribePage from "../components/SubscribePage/SubscribePage"
import OfferCards from "../components/ServiceCard/ServiceCard"


const HomePage = () => {
  const [offerData, setOfferData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulating data loading for offers
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        // Simulate API call with timeout
        setTimeout(() => {
          setOfferData(offers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div>
      <HeroPage />
      <TopCategories />
      <div className="p-8 mt-24">
      <h2 className="text-3xl font-bold  mb-8">One More Offer For You!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          // Display skeleton loaders while loading
          Array(3).fill(0).map((_, index) => (
            <OfferSectionSkeleton key={index} />
          ))
        ) : (
          offerData.map((offer, index) => (
            <OfferSection key={index} {...offer} />
          ))
        )}
      </div>
    </div>
    <AllProducts />
    <DealsOfTheDay />
    <SubscribePage />
    <OfferCards />
    </div>
  )
}

export default HomePage 