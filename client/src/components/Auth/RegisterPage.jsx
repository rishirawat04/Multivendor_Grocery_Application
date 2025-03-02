import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Link,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../API/api';

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [userType, setUserType] = useState('User');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    shopLogo: ''
  });
  const [error, setError] = useState(null); // For error handling
  const [success, setSuccess] = useState(null); // For success message
  const [loading, setLoading] = useState(false); // For loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        accountType: userType === 'Vendor' ? 'Vendor' : 'User',
      };

      if (userType === 'Vendor') {
        payload.shopName = formData.shopName;
        payload.shopLogo = formData.shopLogo;
      }

      const response = await api.post('/users/register', payload, {
        withCredentials: true,
      });
      setLoading(false); // Stop loading

      if (response.status === 201) {
        setSuccess('Registration successful!');
        setOpenSnackbar(true);
        setError(null);

        // Navigate to login page after 3 seconds
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 3000);
      } else {
        setError('Registration failed. Please try again.');
        setSuccess(null);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setLoading(false); // Stop loading
      if (error.response && error.response.status === 409) {
        setError('User already exists with this email.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      setSuccess(null);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 2, p: 4, backgroundColor: '#f7f8fa' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={userType}
            exclusive
            onChange={handleUserTypeChange}
            aria-label="User type"
          >
            <ToggleButton value="User">I am a customer</ToggleButton>
            <ToggleButton value="Vendor">I am a seller</ToggleButton>
          </ToggleButtonGroup>

          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Create an {userType} account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            {userType === 'Vendor' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="shopName"
                  label="Shop Name"
                  id="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="shopLogo"
                  label="Shop Logo URL"
                  id="shopLogo"
                  value={formData.shopLogo}
                  onChange={handleInputChange}
                />
              </>
            )}

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="I'm not a robot"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#8bc34a',
                '&:hover': { bgcolor: '#7cb342' },
              }}
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Register'
              )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href="#" variant="body2">
                Forgot your password?
              </Link>
              <Link href="/login" variant="body2">
                Back to login
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for showing success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {success ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            {success}
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;
