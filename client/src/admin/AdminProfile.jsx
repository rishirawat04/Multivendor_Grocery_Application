import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  MenuItem,
  Select,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../API/api';
import { AuthContext } from '../auth/AuthContext';
import uploadImageToCloudinary from '../cloudinary/cloudinary';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [shopImage, setShopImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(''); // Store image preview URL
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [status, setStatus] = useState('Activated');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    accountType: ''
  });

  // Fetch User Details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/users/profile/${user.id}`);
        setFormData({
          name: response.data.user.fullName,
          email: response.data.user.email,
          phone: response.data.user.phoneNumber,
          avatar: response.data.user.shopLogo, // Display admin's image
          accountType: response.data.user.accountType
        });
        console.log(response.data);
        
        setPreviewImage(response.data.user.shopLogo); // Set the initial avatar preview
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setShopImage(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage)); // Set image preview
    }
  };

  // Handle Edit Button Click
  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  // Handle Update
  const updateUser = async () => {
    try {
      let avatarUrl = formData.avatar;

      // If a new image is selected, upload to Cloudinary
      if (shopImage) {
        avatarUrl = await uploadImageToCloudinary(shopImage);
        if (!avatarUrl) {
          throw new Error('Image upload failed');
        }
      }

      const updatedData = {
        ...formData,
        shopLogo: avatarUrl, // Update formData with the new image URL
      };

      // Send update request to the server
      const response = await api.put(`/users/${user.id}/profile`, updatedData, {
        withCredentials: true
      });

      console.log(response.data,"put");
      

      // Show success message
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsEditing(false); // Disable editing after successful update
      setPreviewImage(avatarUrl); // Set the final image URL after save
    } catch (error) {
      // Show error message
      setSnackbarMessage('Failed to update profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error(error);
    }
  };

  // Handle Snackbar Close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Admin Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }} // Editable when isEditing is true
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account Type'
                  name='accountType'
                  value={formData.accountType}
                  InputProps={{ readOnly: true }} // Read-only field for account type
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Avatar
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar
                alt={formData.name}
                src={previewImage} // Display the preview image
                sx={{ width: 100, height: 100, mb: 2, borderRadius: '50%' }}
              />
              {isEditing && (
                <Button variant='contained' component='label'>
                  Choose Image
                  <input type='file' hidden onChange={handleImageChange} />
                </Button>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
              Publish
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1'>Status</Typography>
              <Select
                value={status}
                onChange={e => setStatus(e.target.value)}
                fullWidth
                disabled={!isEditing}
              >
                <MenuItem value='Activated'>Activated</MenuItem>
                
              </Select>
            </Box>
            <Button
              variant={isEditing ? 'contained' : 'outlined'}
              color='primary'
              fullWidth
              onClick={isEditing ? updateUser : handleEditToggle}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfile;
