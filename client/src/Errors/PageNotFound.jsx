import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // if using react-router for navigation

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Navigate to home or any other page
  };

  return (
    <Container component="main" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center">
        <Typography variant="h1" component="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
