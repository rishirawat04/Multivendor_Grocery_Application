import {OfferProducts} from "../../FakeData"
import ProductCard from './ProductCard';



const DealsOfTheDay = () => {
 

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Deals Of The Day</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OfferProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default DealsOfTheDay;