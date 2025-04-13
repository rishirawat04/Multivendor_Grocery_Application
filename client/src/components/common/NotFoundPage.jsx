import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: 100, 
            color: '#38a169',
            mb: 2
          }} 
        />
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Oops! Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: 2, mt: 2 }}>
          <Button 
            component={Link} 
            to="/"
            variant="contained" 
            startIcon={<HomeIcon />}
            sx={{ 
              bgcolor: '#38a169', 
              '&:hover': { bgcolor: '#2f855a' }
            }}
          >
            Back to Home
          </Button>
          
          <Button 
            component={Link} 
            to="/category"
            variant="outlined" 
            startIcon={<CategoryIcon />}
            sx={{ 
              borderColor: '#38a169', 
              color: '#38a169',
              '&:hover': { 
                borderColor: '#2f855a',
                bgcolor: 'rgba(56, 161, 105, 0.04)'
              }
            }}
          >
            Browse Categories
          </Button>
          
          <Button 
            component={Link} 
            to="/cart"
            variant="outlined" 
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              borderColor: '#38a169', 
              color: '#38a169',
              '&:hover': { 
                borderColor: '#2f855a',
                bgcolor: 'rgba(56, 161, 105, 0.04)'
              }
            }}
          >
            View Cart
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 