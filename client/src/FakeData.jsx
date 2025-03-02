import cart1 from "./assets/cart1.jpg";
import cart2 from "./assets/cart2.jpg";
import cart3 from "./assets/cart3.jpg";
import cart4 from "./assets/cart4.jpg";
import cart5 from "./assets/cart5.png";
import cart6 from "./assets/cart6.png";
import cart7 from "./assets/cart7.png";
import cart8 from "./assets/cart8.png";
import cart9 from "./assets/cart9.jpg";
import hero1 from "./assets/hero1.png";
import hero2 from "./assets/hero2.png";
import hero3 from "./assets/hero3.png";
import hero from "./assets/hero.png";
import offer1 from "./assets/offer1.png";
import offer2 from "./assets/offer2.png";
import offer3 from "./assets/offer3.png";
import offer4 from "./assets/offer4.png";


export const categories = [
  { id: 1, name: 'Milks and Dairies', items: 3, image: cart1 },
  { id: 2, name: 'Clothing & Apparel', items: 8, image: cart2 },
  { id: 3, name: 'Pet Toy', items: 11, image: cart3 },
  { id: 4, name: 'Baking material', items: 6, image: cart4 },
  { id: 5, name: 'Fresh Fruit', items: 8, image: cart5 },
  { id: 6, name: 'Wines & Drinks', items: 8, image: cart6 },
  { id: 7, name: 'Fresh Seafood', items: 9, image: cart7 },
  { id: 8, name: 'Fast food', items: 5, image: cart8 },
  { id: 9, name: 'Vegetables', items: 7, image: cart9 },
  { id: 10, name: 'Bread and Bakery', items: 6, image: cart1 },
];


 // Fake data for the card
 export const offers = [
  { title: "Get 30% off on Fruit", discount: 30, image: hero1, bgColor: "bg-green-100" },
  { title: "Get 25% off on Juice", discount: 25, image: hero2, bgColor: "bg-orange-100" },
  { title: "Get 20% off on Vegetables", discount: 20, image: hero3, bgColor: "bg-blue-100" },
];

  // Sample product data - replace with your actual data
  export const products = {
    'New Products': [
      { name: 'Garlic China', price: 28.25, oldPrice: 35.25, discount: 20, rating: 4, reviews: 12, image: hero },
      { name: 'Organic Carrots', price: 15.00, oldPrice: 18.00, discount: 17, rating: 5, reviews: 8, image: hero2 },
      { name: 'Fresh Broccoli', price: 12.50, oldPrice: 15.00, discount: 17, rating: 3, reviews: 5, image: hero1 },

      { name: 'Garlic China', price: 28.25, oldPrice: 35.25, discount: 20, rating: 4, reviews: 12, image: hero },
      { name: 'Organic Carrots', price: 15.00, oldPrice: 18.00, discount: 17, rating: 5, reviews: 8, image: hero2 },
      { name: 'Fresh Broccoli', price: 12.50, oldPrice: 15.00, discount: 17, rating: 3, reviews: 5, image: hero1 },
      { name: 'Garlic China', price: 28.25, oldPrice: 35.25, discount: 20, rating: 4, reviews: 12, image: hero },
      { name: 'Organic Carrots', price: 15.00, oldPrice: 18.00, discount: 17, rating: 5, reviews: 8, image: hero2 },
      { name: 'Fresh Broccoli', price: 12.50, oldPrice: 15.00, discount: 17, rating: 3, reviews: 5, image: hero1 },
      
    ],
    'Top Selling': [
      { name: 'Almonds', price: 20.75, oldPrice: 25.00, discount: 17, rating: 4, reviews: 22, image: cart1 },
      { name: 'Organic Bananas', price: 10.00, oldPrice: 12.50, discount: 20, rating: 4.5, reviews: 15, image: cart2 },
      { name: 'Avocado', price: 7.50, oldPrice: 9.00, discount: 16, rating: 5, reviews: 20, image: cart3 },
      { name: 'Almonds', price: 20.75, oldPrice: 25.00, discount: 17, rating: 4, reviews: 22, image: cart1 },
      { name: 'Organic Bananas', price: 10.00, oldPrice: 12.50, discount: 20, rating: 4.5, reviews: 15, image: cart2 },
      { name: 'Avocado', price: 7.50, oldPrice: 9.00, discount: 16, rating: 5, reviews: 20, image: cart3 },
      { name: 'Almonds', price: 20.75, oldPrice: 25.00, discount: 17, rating: 4, reviews: 22, image: cart1 },
      { name: 'Organic Bananas', price: 10.00, oldPrice: 12.50, discount: 20, rating: 4.5, reviews: 15, image: cart2 },
      { name: 'Avocado', price: 7.50, oldPrice: 9.00, discount: 16, rating: 5, reviews: 20, image: cart3 },
    ],
    'Trending Products': [
      { name: 'Chia Seeds', price: 8.99, oldPrice: 11.99, discount: 25, rating: 4.8, reviews: 18, image: cart1},
      { name: 'Quinoa', price: 15.50, oldPrice: 19.00, discount: 18, rating: 4.7, reviews: 10, image: hero },
      { name: 'Kale', price: 9.50, oldPrice: 11.00, discount: 14, rating: 4.3, reviews: 7, image: hero2 },
      { name: 'Chia Seeds', price: 8.99, oldPrice: 11.99, discount: 25, rating: 4.8, reviews: 18, image: cart1},
      { name: 'Quinoa', price: 15.50, oldPrice: 19.00, discount: 18, rating: 4.7, reviews: 10, image: hero },
      { name: 'Kale', price: 9.50, oldPrice: 11.00, discount: 14, rating: 4.3, reviews: 7, image: hero2 },
      { name: 'Chia Seeds', price: 8.99, oldPrice: 11.99, discount: 25, rating: 4.8, reviews: 18, image: cart1},
      { name: 'Quinoa', price: 15.50, oldPrice: 19.00, discount: 18, rating: 4.7, reviews: 10, image: hero },
      { name: 'Kale', price: 9.50, oldPrice: 11.00, discount: 14, rating: 4.3, reviews: 7, image: hero2 },
    ],
    'Top Rated': [
      { name: 'Blueberries', price: 18.00, oldPrice: 22.00, discount: 18, rating: 4.9, reviews: 30, image: hero },
      { name: 'Greek Yogurt', price: 6.50, oldPrice: 8.00, discount: 19, rating: 4.6, reviews: 25, image: hero1 },
      { name: 'Wild Salmon', price: 25.00, oldPrice: 30.00, discount: 17, rating: 5, reviews: 40, image: cart1 },
      { name: 'Blueberries', price: 18.00, oldPrice: 22.00, discount: 18, rating: 4.9, reviews: 30, image: hero },
      { name: 'Greek Yogurt', price: 6.50, oldPrice: 8.00, discount: 19, rating: 4.6, reviews: 25, image: hero1 },
      { name: 'Wild Salmon', price: 25.00, oldPrice: 30.00, discount: 17, rating: 5, reviews: 40, image: cart1 },
      { name: 'Blueberries', price: 18.00, oldPrice: 22.00, discount: 18, rating: 4.9, reviews: 30, image: hero },
      { name: 'Greek Yogurt', price: 6.50, oldPrice: 8.00, discount: 19, rating: 4.6, reviews: 25, image: hero1 },
      { name: 'Wild Salmon', price: 25.00, oldPrice: 30.00, discount: 17, rating: 5, reviews: 40, image: cart1 },
    ],
  };

  export const OfferProducts = [
    {
      name: "Foster Farms Takeout Crispy Classic Buffalo Wings",
      image: offer1,
      price: 508.61,
      oldPrice: 599.99,
      rating: 4.5,
      reviews: 120,
      seller: "Global Store",
      timeLeft: { days: 2, hours: 7, minutes: 55, seconds: 17 }
    },
    {
      name: "Organic Grass-Fed Ground Beef",
      image: offer2,
      price: 350.75,
      oldPrice: 429.99,
      rating: 4.7,
      reviews: 85,
      seller: "Nature's Best",
      timeLeft: { days: 1, hours: 5, minutes: 30, seconds: 45 }
    },
    {
      name: "Fresh Atlantic Salmon Fillets",
      image: offer3,
      price: 649.99,
      oldPrice: 749.99,
      rating: 4.8,
      reviews: 150,
      seller: "Ocean Harvest",
      timeLeft: { days: 3, hours: 12, minutes: 15, seconds: 30 }
    },
    {
      name: "Foster Farms Takeout Crispy Classic Buffalo Wings",
      image: offer4,
      price: 508.61,
      oldPrice: 599.99,
      rating: 4.5,
      reviews: 120,
      seller: "Global Store",
      timeLeft: { days: 2, hours: 7, minutes: 55, seconds: 17 }
    },
  ];
  
  