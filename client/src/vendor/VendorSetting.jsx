import React, { useContext, useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Button,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../API/api';
import { AuthContext } from '../auth/AuthContext';
import uploadImageToCloudinary from '../cloudinary/cloudinary';

const VendorSetting = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    shopName: '',
    shopLogo: '',
    city: '',
    state: '',
    homeNumber: '',
    pinCode: '',
    landmark: ''
  });
  const [shopImage, setShopImage] = useState(null);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

  const getUserDetails = async () => {
    try {
      const response = await api.get(`users/profile/${user.id}`, {
        withCredentials: true
      });
      setUserDetails(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setShopImage(e.target.files[0]);
    }
  };

  const updateUser = async () => {
    try {
      let shopLogoUrl = userDetails.shopLogo;

      // If a new shop image is selected, upload to Cloudinary
      if (shopImage) {
        shopLogoUrl = await uploadImageToCloudinary(shopImage);
      }

      const updatedData = {
        ...userDetails,
        shopLogo: shopLogoUrl,
      };

      const response = await api.put(`/users/${user.id}/profile`, updatedData, {
        withCredentials: true
      });

      setMessage({ open: true, text: response.data.message, severity: 'success' });
      setUserDetails(response.data.user);
    } catch (error) {
      setMessage({ open: true, text: 'Failed to update profile.', severity: 'error' });
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, mt: 2, backgroundColor: '#fff' }}>
     
      <Grid item xs={12} sm={4} display='flex' flexDirection='column' alignItems='center' sx={{ mt: 4 }}>
        <img src={userDetails.shopLogo || '/path/to/logo.png'} alt='Logo' style={{ width: 100, height: 100, borderRadius: '50%', marginTop:2  }}  />
        <Button variant='contained' component='label' sx={{mt:1 }}>
          Choose Image
          <input type='file' hidden onChange={handleImageChange} />
        </Button>
        <Typography variant='body2' align='center'>
          This logo will be used in Store logo
        </Typography>
      </Grid>

      <Typography variant='h6' gutterBottom>
        Store Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='fullName'
            name='fullName'
            label='Full Name'
            fullWidth
            variant='outlined'
            value={userDetails.fullName}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='shopName'
            name='shopName'
            label='Shop Name'
            fullWidth
            variant='outlined'
            value={userDetails.shopName}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id='email'
            name='email'
            label='Email'
            fullWidth
            variant='outlined'
            value={userDetails.email}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id='phoneNumber'
            name='phoneNumber'
            label='Phone Number'
            fullWidth
            variant='outlined'
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='description'
            name='description'
            label='Description'
            fullWidth
            multiline
            rows={3}
            variant='outlined'
            defaultValue='Store description goes here.'
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' gutterBottom>
          Country Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='City'
              name='city'
              value={userDetails.city}
              onChange={handleInputChange}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='State'
              name='state'
              value={userDetails.state}
              onChange={handleInputChange}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Home Number'
              name='homeNumber'
              value={userDetails.homeNumber}
              onChange={handleInputChange}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Pin Code'
              name='pinCode'
              value={userDetails.pinCode}
              onChange={handleInputChange}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Landmark'
              name='landmark'
              value={userDetails.landmark}
              onChange={handleInputChange}
              variant='outlined'
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
        <Button
          variant='contained'
          sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
          onClick={updateUser}
        >
          Save
        </Button>
      </Box>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorSetting;
