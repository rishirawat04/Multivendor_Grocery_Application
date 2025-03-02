import React, { useState, useContext } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Link,
  Paper,
  Snackbar,
  Alert
} from '@mui/material'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../auth/AuthContext'
import api from '../../API/api' // Assume this is your API handler

const GreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#8dc63f',
  color: 'white',
  '&:hover': {
    backgroundColor: '#7ab32e'
  }
}))

const LoginPage = () => {
  const { setUser, setRole } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState(null)
  const [openToast, setOpenToast] = useState(false) // For Snackbar
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success') // 'success' | 'error' | 'info' | 'warning'
  const navigate = useNavigate()

  // Handle input change
  const handleInputChange = event => {
    const { name, value, checked } = event.target
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    })
  }

  // Handle Snackbar close
  const handleCloseToast = () => {
    setOpenToast(false)
  }

  // Handle form submit
  const handleSubmit = async event => {
    event.preventDefault()
    setError(null)

    try {
      const response = await api.post(
        '/users/login',
        {
          ...formData,
          rememberMe: formData.rememberMe
        },
        { withCredentials: true }
      )

      const { token, user } = response.data // Assuming the response contains user info
      const { accountType } = user // Extract accountType from user object
      localStorage.setItem('token', token)
      // Save token to localStorage

      // Set user and role in AuthContext
      setUser({ id: user.id, fullName: user.fullName }) // Adjust as needed based on the user object
      setRole(accountType)

      // Show success toast notification
      setToastMessage('Login successful!')
      setToastSeverity('success')
      setOpenToast(true)

      // Redirect based on role
      if (accountType === 'Admin') {
        navigate('/admin/dashboard')
      } else if (accountType === 'Vendor') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      // Show error toast notification
      setToastMessage('Invalid email or password')
      setToastSeverity('error')
      setOpenToast(true)
      setError('Invalid email or password')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper elevation={3} sx={{ mt: 8, p: 4, backgroundColor: '#f7f8fa' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            component='h1'
            variant='h5'
            sx={{ color: '#253D4E', mb: 2 }}
          >
            Login
          </Typography>

          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={formData.password}
              onChange={handleInputChange}
              sx={{ backgroundColor: 'white' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value='remember'
                  color='primary'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
              }
              label='Remember me'
            />
            <GreenButton
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </GreenButton>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href='#' variant='body2'>
                Forgot your password?
              </Link>
              <Link href='/register' variant='body2'>
                Sign up for an account
              </Link>
            </Box>
            <Box sx={{mt:2}}>
              <Typography variant='h6' gutterBottom>
                User: user01@gmail.com
              </Typography>
              <Typography variant='h6' gutterBottom>
                Vendor: Vendor02@gmail.com
              </Typography>
              <Typography variant='h6' gutterBottom>
                Admin: admin01@gmail.com
              </Typography>
              <Typography variant='body1' gutterBottom>
                Password for all: password123
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default LoginPage
