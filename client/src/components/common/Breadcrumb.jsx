import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const Breadcrumb = ({ items }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 1, 
        px: 2, 
        mb: 2, 
        bgcolor: '#f9fafb',
        borderRadius: 1,
        flexWrap: 'wrap'
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#38a169', textDecoration: 'none' }}>
        <HomeIcon fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>Home</Typography>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <NavigateNextIcon sx={{ mx: 1, color: 'text.secondary', fontSize: 16 }} />
          
          {index === items.length - 1 ? (
            // Last item - current page
            <Typography variant="body2" color="text.secondary">
              {item.name}
            </Typography>
          ) : (
            // Clickable breadcrumb item
            <Link to={item.link} style={{ color: '#38a169', textDecoration: 'none' }}>
              <Typography variant="body2">
                {item.name}
              </Typography>
            </Link>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Breadcrumb; 