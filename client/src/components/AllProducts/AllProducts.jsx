import React, { useState, useEffect } from 'react';
import api from '../../API/api';
import ProductCard from './ProuductCard';
import ProductSkeleton from './ProductSkeleton';
import CategorySkeleton from './CategorySkeleton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

const AllProducts = () => {
  const scrollRef = React.useRef(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await api.get('/category');
        setCategories(response.data); // Set categories from API response

        // Set the first category as the default selected category if categories exist
        if (response.data.length > 0) {
          const firstCategoryId = response.data[0]._id;
          setCategoryId(firstCategoryId); // Set default category ID
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/category/${id}`);
      const fetchedProducts = response.data.map(product => ({
        ...product,
        discount: product.discountedPrice ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch products when categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    }
  }, [categoryId]);

  return (
    <div className="container mx-auto p-4 px-2 mt-10">
      <h1 className="text-black font-bold text-3xl md:text-4xl mb-6">Organic & Fresh Products</h1>
      
      {/* Category selector with improved UI */}
      <div className="relative flex items-center my-6">
        <button 
          onClick={scrollLeft} 
          className="absolute left-0 z-10 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md"
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
        
        <div
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto py-4 px-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryLoading ? (
            // Category skeleton loaders
            Array(6).fill(0).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setCategoryId(cat._id)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                  categoryId === cat._id 
                    ? 'bg-green-500 text-white font-medium shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
        
        <button 
          onClick={scrollRight} 
          className="absolute right-0 z-10 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Products grid with skeleton loading */}
      <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Render skeleton loaders while loading
          Array(8).fill(0).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products available for this category.</p>
            <button 
              onClick={() => categories.length > 0 && setCategoryId(categories[0]._id)}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Browse other categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
