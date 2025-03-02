import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  TextField,
  Snackbar,
  Alert
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddressIcon from '@mui/icons-material/LocationOn'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import api from '../API/api'
import { useNavigate, useParams } from 'react-router-dom'
import { green } from '@mui/material/colors'
import { AuthContext } from '../auth/AuthContext'

const UserProfile = () => {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const { userId } = useParams()
  const [userDetails, setUserDetails] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  
  
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    homeNumber: '',
    pinCode: '',
    landmark: ''
  })

  

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/users/profile/${userId}`, {
        withCredentials: true
      })
      const user = response?.data.user
      setUserDetails(user)
      setUpdatedUserDetails({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || ''
       
      })
    } catch (error) {
      console.log('Failed to load user details', error)
    }
  }

  const updateUserDetails = async () => {
    try {
      await api.put(`/users/${userId}/profile`, updatedUserDetails, {
        withCredentials: true
      })
      fetchUserDetails()
      setSnackbarMessage('User details updated successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.log('Failed to update user details', error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const handleInputChange = e => {
    const { name, value } = e.target
    setUpdatedUserDetails({
      ...updatedUserDetails,
      [name]: value
    })
  }

  const [selectedTab, setSelectedTab] = useState('overview')

  const handleLogout = () => {
    logout()
    navigate('/login') // Redirect to login after logout
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            p={3}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: 2
            }}
          >
            <Avatar
              alt={userDetails?.fullName || 'User Avatar'}
              src='https://i.pravatar.cc/150?img=12'
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant='h5' gutterBottom>
              {userDetails?.fullName || 'Full Name'}
            </Typography>
            <Typography variant='body1' color='textSecondary'>
              {userDetails?.email || 'Email not provided'}
            </Typography>
            <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
              Phone: {userDetails?.phoneNumber || 'N/A'}
            </Typography>
            <Box
              display='flex'
              justifyContent='space-around'
              width='100%'
              mt={3}
            >
              <Box textAlign='center'>
                <Typography variant='h6'  sx={{color:'#45bf4c'}}>
                  Orders
                </Typography>
                <Typography variant='h6'>
                  {userDetails?.orders?.length || 0}
                </Typography>
              </Box>
              <Box textAlign='center'>
                <Typography variant='h6' sx={{color:'#45bf4c'}}>
                  Wishlist
                </Typography>
                <Typography variant='h6' >
                  {userDetails?.wishlist?.length || 0}
                </Typography>
              </Box>
              <Box textAlign='center' >
                <Typography variant='h6' sx={{color:'#45bf4c'}}>
                  Cart
                </Typography>
                <Typography variant='h6'>
                  {userDetails?.reviews?.length || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        )
      case 'orders':
        return userDetails?.orders?.length ? (
          userDetails.orders.map(order => (
            <Box
              key={order._id}
              mb={2}
              p={2}
              bgcolor='white'
              sx={{ borderRadius: '8px', boxShadow: 1 }}
            >
              <Typography variant='h6' gutterBottom>
                <strong>Order Date:</strong>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant='body1' gutterBottom>
                <strong>Total Price:</strong> ${order.totalPrice}
              </Typography>
              <Typography variant='body1' gutterBottom>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </Typography>
              <Box mt={2}>
                <Typography variant='h6' gutterBottom>
                  <strong>Delivery Address:</strong>
                </Typography>
                <Typography>
                  Home Number: {order.deliveryAddress.homeNumber}
                </Typography>
                <Typography>
                  Landmark: {order.deliveryAddress.landmark}
                </Typography>
                <Typography>
                  City: {order.deliveryAddress.city}, State:{' '}
                  {order.deliveryAddress.state} -{' '}
                  {order.deliveryAddress.pinCode}
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant='h6' gutterBottom>
                  <strong>Products:</strong>
                </Typography>
                {order.products.map(item => (
                  <Box
                    key={item._id}
                    display='flex'
                    alignItems='center'
                    mb={2}
                    p={2}
                    sx={{
                      borderRadius: '8px',
                      boxShadow: 1,
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Box
                      component='img'
                      src={item.product.image[0]}
                      alt={item.product.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginRight: '16px'
                      }}
                    />
                    <Box>
                      <Typography>
                        <strong>Name:</strong> {item.product.name}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> ${item.product.price}
                      </Typography>
                      <Typography>
                        <strong>Quantity:</strong> {item.quantity}
                      </Typography>
                      <Typography>
                        <strong>Total:</strong> $
                        {item.product.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No orders available.</Typography>
        )
      case 'addresses':
        return userDetails?.addresses?.length ? (
          userDetails.addresses.map((address, index) => (
            <Box
              key={index}
              mb={2}
              p={2}
              bgcolor='white'
              sx={{ borderRadius: '8px', boxShadow: 1 }}
            >
              <Typography>
                <strong>Address:</strong> {address?.city}
              </Typography>
              <Typography>
                <strong>Home number:</strong> {address?.homeNumber}
              </Typography>
              <Typography>
                <strong>Landmark:</strong> {address?.landmark}
              </Typography>
              <Typography>
                <strong>Pincode:</strong> {address?.pinCode}
              </Typography>
              <Typography>
                <strong>State:</strong> {address?.state}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No addresses available.</Typography>
        )
      case 'settings':
        return (
          <Box
            mb={2}
            p={2}
            bgcolor='white'
            sx={{ borderRadius: '8px', boxShadow: 1 }}
          >
            <Typography variant='h6' gutterBottom>
              Update Account Details
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault()
                updateUserDetails()
              }}
            >
              <TextField
                label='Full Name'
                name='fullName'
                value={updatedUserDetails.fullName}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Email'
                name='email'
                value={updatedUserDetails.email}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Phone Number'
                name='phoneNumber'
                value={updatedUserDetails.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='City'
                name='city'
                value={updatedUserDetails.city}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='State'
                name='state'
                value={updatedUserDetails.state}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Home Number'
                name='homeNumber'
                value={updatedUserDetails.homeNumber}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Pin Code'
                name='pinCode'
                value={updatedUserDetails.pinCode}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <TextField
                label='Landmark'
                name='landmark'
                value={updatedUserDetails.landmark}
                onChange={handleInputChange}
                fullWidth
                margin='normal'
              />
              <Button type='submit' variant='contained' color='success'>
                Update Details
              </Button>
            </form>
          </Box>
        )
      default:
        return (
          <Typography>
            Select an option from the menu to view details.
          </Typography>
        )
    }
  }

  return (
    <Box
      display='flex'
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={2}
      p={2}
    >
      {/* Left Sidebar */}
      <Box
        width={{ xs: '100%', md: '250px' }}
        bgcolor='#f0fdf4'
        p={2}
        sx={{ borderRadius: '8px', boxShadow: 1 }}
      >
        <List>
          <ListItem
            button
            onClick={() => setSelectedTab('overview')}
            sx={{ '&:hover': { backgroundColor: green[100] } }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Overview' />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('orders')}
            sx={{ '&:hover': { backgroundColor: green[100] } }}
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary='Orders' />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('addresses')}
            sx={{ '&:hover': { backgroundColor: green[100] } }}
          >
            <ListItemIcon>
              <AddressIcon />
            </ListItemIcon>
            <ListItemText primary='Addresses' />
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedTab('settings')}
            sx={{ '&:hover': { backgroundColor: green[100] } }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Account Settings' />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => handleLogout()}
            sx={{ '&:hover': { backgroundColor: green[100] } }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        flexGrow={1}
        p={2}
        bgcolor='#f0fdf4'
        sx={{ borderRadius: '8px', boxShadow: 1 }}
      >
        {renderContent()}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={900}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default UserProfile
