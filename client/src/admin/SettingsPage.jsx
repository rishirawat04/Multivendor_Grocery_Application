import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const sections = {
  Common: [
    { title: 'General', description: 'View and update your general settings and activate license', link: '/settings/general' },
    { title: 'Email', description: 'View and update your email settings and email templates', link: '/settings/email' },
    { title: 'Email rules', description: 'Configure email rules for validation', link: '/settings/email-rules' },
    { title: 'Languages', description: 'View and update your website languages', link: '/settings/languages' },
    { title: 'Cache', description: 'Configure caching for optimized speed', link: '/settings/cache' },
    { title: 'Optimize', description: 'Minify HTML output, inline CSS, remove comments...', link: '/settings/optimize' },
    { title: 'Media', description: 'View and update your media settings', link: '/settings/media' },
    { title: 'Admin appearance', description: 'View and update logo, favicon, layout', link: '/settings/admin-appearance' },
    { title: 'Database', description: 'Settings for database', link: '/settings/database' },
    { title: 'Permalink', description: 'View and update your permalink settings', link: '/settings/permalink' },
    { title: 'API Settings', description: 'View and update your API settings', link: '/settings/api' },
    { title: 'Website Tracking', description: 'Configure website tracking', link: '/settings/website-tracking' },
  ],
  Localization: [
    { title: 'Locales', description: 'View, download and import locales', link: '/settings/locales' },
    { title: 'Theme Translations', description: 'Manage the theme translations', link: '/settings/theme-translations' },
    { title: 'Other Translations', description: 'Manage the other translations', link: '/settings/other-translations' },
  ],
  Ecommerce: [
    { title: 'General', description: 'View and update your general settings', link: '/ecommerce/general' },
    { title: 'Products', description: 'View and update your product settings', link: '/ecommerce/products' },
    { title: 'Currencies', description: 'View and update currency settings', link: '/ecommerce/currencies' },
    { title: 'Product Reviews', description: 'View and update your product reviews settings', link: '/ecommerce/reviews' },
    { title: 'Shopping', description: 'View and update your shopping settings', link: '/ecommerce/shopping' },
    { title: 'Return', description: 'View and update return settings', link: '/ecommerce/returns' },
    { title: 'Invoices', description: 'View and update your invoices settings', link: '/ecommerce/invoices' },
    { title: 'Taxes', description: 'View and update your taxes settings', link: '/ecommerce/taxes' },
    { title: 'Shipping Label Template', description: 'Settings for Shipping Label Template', link: '/ecommerce/shipping-label' },
    { title: 'Store locators', description: 'View and update the lists of your chains', link: '/ecommerce/store-locators' },
    { title: 'Digital Products', description: 'View and update digital product settings', link: '/ecommerce/digital-products' },
    { title: 'Checkout', description: 'View and update checkout settings', link: '/ecommerce/checkout' },
    { title: 'Invoice Template', description: 'Settings for Invoice Template', link: '/ecommerce/invoice-template' },
    { title: 'Customers', description: 'View and update your customer settings', link: '/ecommerce/customers' },
  ],
};

const SettingsPage = () => {
    const renderSection = (sectionName, items) => (
        <Box sx={{ marginBottom: '40px' }}>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
            {sectionName}
          </Typography>
          <Grid container spacing={3}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  component={Link}
                  to={item.link}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '16px',
                    textDecoration: 'none',
                    color: 'inherit',
                    backgroundColor: '#f6f8fb',
                    borderRadius: '8px',
                   
                  }}
                >
                  <Box sx={{ marginRight: '16px', color: 'primary.main' }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      );

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 }, mt: 2, backgroundColor:"#fff"}}>
      {renderSection('Common', sections.Common)}
      {renderSection('Localization', sections.Localization)}
      {renderSection('Ecommerce', sections.Ecommerce)}
    </Box>
  );
};

export default SettingsPage;
