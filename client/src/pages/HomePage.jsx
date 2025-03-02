import React from 'react'

import HeroPage from "../components/HeroSection/HeroPage"
import TopCategories from "../components/TopCategories/TopCategories"
import OfferSection from "../components/OfferSection/OfferSection"
import { offers } from "../FakeData"
import AllProducts from "../components/AllProducts/AllProducts"
import DealsOfTheDay  from "../components/OneDayOffer/OneDayOffer"
import SubscribePage from "../components/SubscribePage/SubscribePage"
import OfferCards from "../components/ServiceCard/ServiceCard"


const HomePage = () => {
  return (
    <div>
      <HeroPage />
      <TopCategories />
      <div className="p-8 mt-24">
      <h2 className="text-3xl font-bold  mb-8">One More Offer For You!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <OfferSection key={index} {...offer} />
        ))}
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