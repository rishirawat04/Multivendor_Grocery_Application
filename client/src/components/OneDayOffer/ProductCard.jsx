import { useEffect, useState } from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TimeUnit = ({ value, unit }) => (
    <div className="flex flex-col items-center bg-white p-2 rounded">
      <span className="text-sm font-bold">{value.toString().padStart(2, '0')}</span>
      <span className="text-xs">{unit}</span>
    </div>
  );
const ProductCard = ({ product }) => {
    const [timeLeft, setTimeLeft] = useState(product.timeLeft);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
          } else if (prevTime.hours > 0) {
            return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
          } else if (prevTime.days > 0) {
            return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
          } else {
            clearInterval(timer);
            return prevTime;
          }
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover z-0" />
        <div className="absolute top-20 left-0 right-0 flex justify-center p-2">
          <div className="flex space-x-2 px-2 py-1">
            <TimeUnit value={timeLeft.days} unit="Days" />
            <TimeUnit value={timeLeft.hours} unit="Hours" />
            <TimeUnit value={timeLeft.minutes} unit="Mins" />
            <TimeUnit value={timeLeft.seconds} unit="Secs" />
          </div>
        </div>
        <div className=" bg-white mt-2  h-40 z-10">
        <div className="px-5 flex flex-col ">
          <h3 className="text-lg font-semibold mb-2  truncate w-full">{product.name}</h3>
          <div className="flex  mb-2">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-600 ml-1">({product.reviews})</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Sold by {product.seller}</p>
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              <span className="text-gray-500 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
            </div>
            <button className="text-green-500 bg-green-100 px-3 py-1 rounded hover:bg-green-500 hover:text-white ease-in-out duration-300 ">
            <ShoppingCartIcon /> Add
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  };

  export default ProductCard