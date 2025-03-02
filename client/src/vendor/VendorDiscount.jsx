import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Select,
  InputLabel,
  FormControl,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../API/api'; // Adjust the path as necessary

const VendorDiscount = () => {
  const [couponCode, setCouponCode] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  const [neverExpired, setNeverExpired] = useState(false);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, 'month'));
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(100);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(200);
  const [usageLimit, setUsageLimit] = useState(100);
  const [applyProduct, setApplyProduct] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [products, setProducts] = useState([]);

  // Fetch vendor's products 
  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const response = await api.get('/vendor/products', {
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (error) {
        setSnackbarMessage(error.response?.data?.message || 'Error fetching products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    fetchVendorProducts();
  }, []);

  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCouponCode(randomCode);
  };

  const handleSave = async () => {
    const discountData = {
      couponCode,
      description: couponDescription,
      startDate: startDate.toISOString(),
      endDate: neverExpired ? null : endDate.toISOString(),
      discountPercentage,
      maxDiscountAmount,
      minPurchaseAmount,
      usageLimit,
      applyProduct,
    };

    try {
      const response = await api.post('/coupon/discount', discountData, {
        withCredentials: true,
      });

      console.log(response.data);
      
     
      setSnackbarMessage(response?.data?.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      resetForm();
    } catch (error) {
      setSnackbarMessage('Failed to create discount: ' + (error.response?.data?.error || 'Unknown error'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setCouponCode('');
    setCouponDescription('');
    setNeverExpired(false);
    setStartDate(dayjs());
    setEndDate(dayjs().add(1, 'month'));
    setDiscountPercentage(10);
    setMaxDiscountAmount(100);
    setMinPurchaseAmount(200);
    setUsageLimit(100);
    setApplyProduct('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, mt: 2, backgroundColor: '#fff' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant='h6'>Create Discount</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label='Coupon Code'
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <IconButton
              onClick={generateRandomCode}
              sx={{
                mb: 2,
                backgroundColor: "transparent",
                '&:hover': {
                  backgroundColor: "rgba(46, 204, 113, 0.1)",
                },
                color: "#2ecc71",
              }}
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Box>

          <TextField
            label='Coupon Description'
            value={couponDescription}
            onChange={e => setCouponDescription(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label='Discount Percentage'
            type='number'
            value={discountPercentage}
            onChange={e => setDiscountPercentage(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label='Max Discount Amount'
            type='number'
            value={maxDiscountAmount}
            onChange={e => setMaxDiscountAmount(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label='Min Purchase Amount'
            type='number'
            value={minPurchaseAmount}
            onChange={e => setMinPurchaseAmount(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label='Usage Limit'
            type='number'
            value={usageLimit}
            onChange={e => setUsageLimit(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

        </Grid>

        <Grid container spacing={3} item xs={12} md={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label='Start Date'
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={params => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label='End Date'
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={params => <TextField {...params} fullWidth />}
                  disabled={neverExpired}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={neverExpired}
                  onChange={() => setNeverExpired(!neverExpired)}
                />
              }
              label='Never Expired'
            />
          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
  <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel id='product-label'>Select Product</InputLabel>
    <Select
      labelId='product-label'
      value={applyProduct} // This will show the selected product
      onChange={e => setApplyProduct(e.target.value)} // Update the applyProduct state
      label='Select Product' // Ensure the label is provided
    >
      {products.map(product => (
        <MenuItem key={product._id} value={product._id}>
          {product.name} {/* Display the product name in the dropdown */}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>


        <Grid item xs={12} md={8}>
          <Button variant='contained' onClick={handleSave}>
            Save Discount
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorDiscount;
