import React, { useEffect, useState } from 'react'
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
} from '@mui/material'


import api from '../API/api'
import { useParams } from 'react-router-dom'



const VendorProfiles = () => {
  const {userId} = useParams()
 




  // user states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    privateNotes: '',
    addresses: [],
    avatar: '',
    accountType: '',
  });
  const [status, setStatus] = useState('Activated');

  


  //get User details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/users/profile/${userId}`);
        setFormData({
          name: response.data.user.fullName,
          email: response.data.user.email,
          phone: response.data.user.phoneNumber,
          addresses: response.data.user.addresses,
          avatar: response.data.user.shopLogo,
          accountType: response.data.user.accountType,  // Add accountType
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);







 



 


  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid container spacing={3} sx={{mb:4}}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant='h6' gutterBottom>
            Vendor Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={formData.name}
                InputProps={{ readOnly: true }} // Remove onChange
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                value={formData.email}
                InputProps={{ readOnly: true }} // Remove onChange
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Phone'
                name='phone'
                value={formData.phone}
                InputProps={{ readOnly: true }} // Remove onChange
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

        <Paper sx={{ mb: 2, p:2 }}>
          <Typography variant='h6' gutterBottom >
            Addresses
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {formData.addresses.map((address, index) => (
              <Grid key={index} item xs={12}>
                <Typography variant='body1'>
                  {address.homeNumber}, {address.city}, {address.state}, {address.pinCode}, {address.landmark}
                </Typography>
              </Grid>
            ))}
          </Grid>
         </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant='h6' gutterBottom>
            Avatar
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              alt={formData.name}
              src={formData.avatar}
              sx={{ width: 100, height: 100, mb: 2, borderRadius: '50%' }}
            />
          
              <Typography>Store Image</Typography>
            
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant='h6' gutterBottom>
            Publish
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Status</Typography>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
              <MenuItem value='Activated'>Activated</MenuItem>
              <MenuItem value='Deactivated'>Deactivated</MenuItem>
            </Select>
          </Box>
          <Button variant='outlined' color='primary' fullWidth>
            Edit Profile
          </Button>
        </Paper>
      </Grid>
    </Grid>



    
    </Box>
  )
}

export default VendorProfiles
