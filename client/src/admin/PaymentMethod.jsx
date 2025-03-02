import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, FormControl, MenuItem, Select, Box, IconButton, TextField, InputLabel } from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';

const PaymentMethods = () => {
  const [defaultMethod, setDefaultMethod] = React.useState('COD'); // COD - Cash on Delivery
  const [editMethod, setEditMethod] = useState(null);

  const handleChange = (event) => {
    setDefaultMethod(event.target.value);
  };

  const handleEditClick = (method) => {
    setEditMethod(editMethod === method ? null : method); // Toggle edit method
  };

  const handleCloseForm = () => {
    setEditMethod(null);
  };

  const renderEditForm = (method) => {
    switch (method) {
      case 'Stripe':
        return (
          <CardContent>
            <Typography variant="h6">Stripe Configuration</Typography>
            <Typography variant="body2">Configuration instructions for Stripe:</Typography>
            <Typography variant="body2">1. Register with Stripe</Typography>
            <Typography variant="body2">2. Enter Public, Secret keys in the right-hand box</Typography>
            <TextField fullWidth label="Stripe Public Key" margin="normal" />
            <TextField fullWidth label="Stripe Private Key" margin="normal" />
            <TextField fullWidth label="Webhook Secret" margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Type</InputLabel>
              <Select defaultValue="Stripe Checkout">
                <MenuItem value="Stripe Checkout">Stripe Checkout</MenuItem>
                <MenuItem value="Stripe Payment Links">Stripe Payment Links</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseForm}>Deactivate</Button>
              <Button variant="contained" color="primary">Update</Button>
            </Box>
          </CardContent>
        );
      case 'Paypal':
        return (
          <CardContent>
            <Typography variant="h6">Paypal Configuration</Typography>
            <TextField fullWidth label="Paypal Client ID" margin="normal" />
            <TextField fullWidth label="Paypal Secret" margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseForm}>Deactivate</Button>
              <Button variant="contained" color="primary">Update</Button>
            </Box>
          </CardContent>
        );
      case 'Razorpay':
        return (
          <CardContent>
            <Typography variant="h6">Razorpay Configuration</Typography>
            <TextField fullWidth label="Razorpay Key ID" margin="normal" />
            <TextField fullWidth label="Razorpay Key Secret" margin="normal" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" color="error" onClick={handleCloseForm}>Deactivate</Button>
              <Button variant="contained" color="primary">Update</Button>
            </Box>
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: { xs: 1, sm: 2 }, mt: 2,}}>
      {/* Default Payment Method */}
     <Box sx={{  backgroundColor: '#fff', p:2 }}>
     <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Default Payment Method
        </Typography>
        <Select value={defaultMethod} onChange={handleChange} displayEmpty>
          <MenuItem value="COD">Cash on Delivery (COD)</MenuItem>
          <MenuItem value="Stripe">Stripe</MenuItem>
          <MenuItem value="Paypal">PayPal</MenuItem>
          <MenuItem value="Razorpay">Razorpay</MenuItem>
        </Select>
      </FormControl>

      {/* Save Button */}
      <Button variant="contained" color="primary"  sx={{ marginBottom: '20px' }}>
        Save Settings
      </Button>
     </Box>

      {/* Payment Methods */}
      <Grid container spacing={2} marginTop={2}>
        {/* Stripe */}
        <Grid item xs={12} md={editMethod === 'Stripe' ? 12 : 6} lg={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent>
              <IconButton>
                <PaymentIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mt: 1 }}>Stripe</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Customer can buy products and pay directly using Visa, Credit card via Stripe.
              </Typography>
              <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => handleEditClick('Stripe')}>
                {editMethod === 'Stripe' ? 'Close' : 'Edit'}
              </Button>
            </CardContent>
            {editMethod === 'Stripe' && (
              <Box sx={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                {renderEditForm('Stripe')}
              </Box>
            )}
          </Card>
        </Grid>

        {/* PayPal */}
        <Grid item xs={12} md={editMethod === 'Paypal' ? 12 : 6} lg={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent>
              <IconButton>
                <PaymentIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mt: 1 }}>PayPal</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Customer can buy products and pay directly via PayPal.
              </Typography>
              <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => handleEditClick('Paypal')}>
                {editMethod === 'Paypal' ? 'Close' : 'Edit'}
              </Button>
            </CardContent>
            {editMethod === 'Paypal' && (
              <Box sx={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                {renderEditForm('Paypal')}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Razorpay */}
        <Grid item xs={12} md={editMethod === 'Razorpay' ? 12 : 6} lg={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent>
              <IconButton>
                <PaymentIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mt: 1 }}>Razorpay</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Use Payment with Razorpay.
              </Typography>
              <Button variant="outlined" sx={{ marginTop: '10px' }} onClick={() => handleEditClick('Razorpay')}>
                {editMethod === 'Razorpay' ? 'Close' : 'Edit'}
              </Button>
            </CardContent>
            {editMethod === 'Razorpay' && (
              <Box sx={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                {renderEditForm('Razorpay')}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentMethods;
