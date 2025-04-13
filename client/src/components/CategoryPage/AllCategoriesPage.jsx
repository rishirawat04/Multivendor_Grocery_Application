import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress,
  Container,
  Breadcrumbs,
  Divider
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import api from '../../API/api';
import Breadcrumb from '../common/Breadcrumb';

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/category');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#38a169' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1">
          Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: 'All Categories' }]} />
      
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          All Categories
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Browse our extensive collection of products organized by category to help you find exactly what you're looking for.
        </Typography>
      </Box>
      
      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Link to={`/category/${category._id}`} style={{ textDecoration: 'none' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                  borderRadius: 2
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={category.imageUrl || 'https://via.placeholder.com/300x180?text=Category+Image'}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                    {category.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <Divider sx={{ width: '40%', borderColor: '#38a169', borderWidth: 2 }} />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {category.subcategoryCount} Subcategories
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: '#38a169', fontWeight: 'medium' }}>
                    {category.productCount || 0} Products Available
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mt: 2, color: '#2f855a' }}>
                    Browse Category &rarr;
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllCategoriesPage; 