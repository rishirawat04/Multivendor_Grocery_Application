import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Divider,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from '../AllProducts/ProuductCard';
import api from '../../API/api';
import ProductSkeleton from '../AllProducts/ProductSkeleton';
import Breadcrumb from '../common/Breadcrumb';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch category details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching category details for ID:", categoryId);
        const response = await api.get('/category');
        console.log("Categories API response:", response.data);
        
        const categoryData = response.data.find(cat => cat._id === categoryId);
        console.log("Found category data:", categoryData);
        
        if (categoryData) {
          setCategory(categoryData);
          // Remove subcategories with _id equal to null or undefined
          const validSubcategories = categoryData.subcategories.filter(
            subcat => subcat._id && subcat._id !== 'null' && subcat._id !== 'undefined'
          );
          console.log("Valid subcategories:", validSubcategories);
          setSubcategories(validSubcategories);
        } else {
          console.error("Category not found for ID:", categoryId);
          setError('Category not found');
        }
      } catch (err) {
        console.error('Failed to fetch category details:', err);
        setError('Failed to fetch category details');
      }
    };

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products for category ID:", categoryId);
        const response = await api.get(`/products/category/${categoryId}`);
        console.log("Products API response:", response.data);
        
        setProducts(response.data);
        setFilteredProducts(response.data);
        
        // Find min and max price for the slider
        if (response.data.length > 0) {
          const prices = response.data.map(product => product.discountedPrice);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          console.log("Price range:", minPrice, maxPrice);
          setPriceRange([minPrice, maxPrice]);
        } else {
          console.log("No products found for this category");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...products];
    
    // Filter by price range
    filtered = filtered.filter(
      product => 
        product.discountedPrice >= priceRange[0] && 
        product.discountedPrice <= priceRange[1]
    );
    
    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.subcategory || !product.subcategory._id) {
          return false;
        }
        return selectedSubcategories.includes(product.subcategory._id);
      });
    }
    
    setFilteredProducts(filtered);
    
    // Close mobile filter drawer after applying filters on mobile
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSubcategories([]);
    // Reset price range to min and max values from products
    if (products.length > 0) {
      const prices = products.map(product => product.discountedPrice);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
    setFilteredProducts(products);
    
    // Close mobile filter drawer after resetting filters on mobile
    if (isMobile) {
      setMobileFilterOpen(false);
    }
  };

  // Apply filters whenever selected subcategories or price range changes
  useEffect(() => {
    applyFilters();
  }, [selectedSubcategories, priceRange]);

  // Render filter content (used for both desktop sidebar and mobile drawer)
  const renderFilterContent = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Subcategories Filter */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Subcategories
      </Typography>
      <Box sx={{ ml: 1, mb: 3 }}>
        {subcategories.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No subcategories available
          </Typography>
        ) : (
          subcategories.map((subcategory) => (
            <FormControlLabel
              key={subcategory._id}
              control={
                <Checkbox
                  checked={selectedSubcategories.includes(subcategory._id)}
                  onChange={() => handleSubcategoryChange(subcategory._id)}
                  color="primary"
                  sx={{
                    color: '#38a169',
                    '&.Mui-checked': {
                      color: '#38a169',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {subcategory.name} ({subcategory.productCount || 0})
                </Typography>
              }
            />
          ))
        )}
      </Box>

      {/* Price Range Filter */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Price Range
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={products.length > 0 ? Math.floor(Math.min(...products.map(p => p.discountedPrice))) : 0}
          max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.discountedPrice))) : 1000}
          sx={{
            color: '#38a169', // Green color
            '& .MuiSlider-thumb': {
              backgroundColor: '#38a169',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#c6f6d5',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* Reset Filters Button */}
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={resetFilters}
        sx={{
          mt: 2,
          borderColor: '#38a169',
          color: '#38a169',
          '&:hover': {
            borderColor: '#2f855a',
            backgroundColor: 'rgba(56, 161, 105, 0.04)',
          },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { name: 'Categories', link: '/category' },
          { name: category?.name || 'Category' }
        ]} 
      />
      
      {/* Category Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
          {category?.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {filteredProducts.length} products found
          </Typography>
          
          {/* Mobile Filter Button */}
          {isMobile && (
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFilterOpen(true)}
              sx={{
                my: 1,
                borderColor: '#38a169',
                color: '#38a169',
                '&:hover': {
                  borderColor: '#2f855a',
                  backgroundColor: 'rgba(56, 161, 105, 0.04)',
                },
              }}
            >
              Filters
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Desktop Sidebar with Filters */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              {renderFilterContent()}
            </Box>
          </Grid>
        )}

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="right"
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '80%',
              maxWidth: '300px',
            },
          }}
        >
          {renderFilterContent()}
        </Drawer>

        {/* Products Grid */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          <Grid container spacing={2}>
            {loading ? (
              // Show skeletons when loading
              Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <ProductSkeleton />
                </Grid>
              ))
            ) : filteredProducts.length === 0 ? (
              // Show message when no products found
              <Box sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No products found with the selected filters.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={resetFilters}
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#38a169',
                    '&:hover': {
                      backgroundColor: '#2f855a',
                    }
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            ) : (
              // Show products
              filteredProducts.map((product) => (
                <Grid item xs={6} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryPage; 