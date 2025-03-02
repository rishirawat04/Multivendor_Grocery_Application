import React, { useState } from 'react';
import cart5 from "../../assets/cart5.png"
import cart6 from "../../assets/cart6.png"

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <div className="bg-green-50 py-12 mt-10 relative overflow-hidden">
      {/* Left side vegetables */}
      <img 
        src={cart5}
        alt="Tomatoes" 
        className="absolute left-0 bottom-0 w-1/4 max-w-xs"
      />
      
      {/* Right side vegetables */}
      <img 
        src={cart6} 
        alt="Lettuce and vegetables" 
        className="absolute right-0 bottom-0 w-1/4 max-w-xs"
      />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Subscribe our newsletter</h2>
        <p className="text-gray-600 mb-6 mx-2">
          Subscribe to the mailing list to receive updates on special offers, new arrivals and our promotions.
        </p>
        <div className="flex mx-auto bg-green-50 rounded-full w-[300px] md:w-[250px] border-green-400 hover:border-green-600  lg:w-[500px]">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-2 px-4 flex-grow w-full rounded-l-full border-2 focus:outline-green-500 "
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-r-full w-[100px] md:w-[80px] lg:w-[120px] hover:bg-green-600 transition duration-300"
          >
            Subscribe
          </button>
      </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;