import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Tabs,
  Tab,
  Paper,
  Snackbar
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import MuiAlert from '@mui/material/Alert'
import api from '../../API/api'
import { useParams } from 'react-router-dom'

// Snackbar Alert component
const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const SingleProduct = () => {
  const { productId } = useParams() // get productId from route
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null) // Store the product details here
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success') // 'success', 'error', etc.


  console.log("details",product);
  

  // Function to fetch product by ID
  const getProductById = async () => {
    try {
      const response = await api.get(`/products/${productId}`)
      setProduct(response.data) // Set the product data
    } catch (error) {
      setSnackbarSeverity('error')
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to fetch product'
      )
      setSnackbarOpen(true)
    }
  }

  // Add to cart function
  const handleAddToCart = async () => {
    try {
      const response = await api.post(
        '/cart',
        {
          productId: product._id,
          quantity: quantity
        },
        { withCredentials: true }
      )

      // Use the message returned from the server
      setSnackbarSeverity('success')
      setSnackbarMessage(response.data.message) // Use server response message
    } catch (error) {
      setSnackbarSeverity('error')
      // Set the snackbar message based on server response or default
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to add to cart'
      )
    } finally {
      setSnackbarOpen(true)
    }
  }

  // Add to Fav function
  const handleAddToFav = async () => {
    try {
      const response = await api.post(
        '/favorites',
        {
          productId: product._id
        },
        { withCredentials: true }
      )

      // Use the message returned from the server
      setSnackbarSeverity('success')
      setSnackbarMessage(response.data.message) // Use server response message
    } catch (error) {
      setSnackbarSeverity('error')
      // Set the snackbar message based on server response or default
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to add to favorites'
      )
    } finally {
      setSnackbarOpen(true)
    }
  }

  // Close snackbar handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Fetch product data when component mounts
  useEffect(() => {
    getProductById()
  }, [productId])

  if (!product) {
    return <Typography>Loading...</Typography>
  }

  const productImages = product.image || [] // Use product images from API

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
  <img
    src={productImages[selectedImage]}
    alt='Product'
    style={{
      width: '100%', // Responsive width
      height: '400px', // Fixed height for the main image
      objectFit: 'cover', // Cover the area without stretching
      border: '1px solid #e0e0e0' // Optional: Add a border to the main image
    }}
  />
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    {productImages.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Thumbnail ${index + 1}`}
        style={{
          width: '70px', // Fixed width for thumbnails
          height: '70px', // Fixed height for thumbnails
          margin: '0 5px',
          cursor: 'pointer',
          border: index === selectedImage ? '2px solid green' : '1px solid #e0e0e0', // Add border to thumbnails
          borderRadius: '4px', // Optional: Add border radius for thumbnails
          objectFit: 'cover' // Cover the area without stretching
        }}
        onClick={() => setSelectedImage(index)}
      />
    ))}
  </Box>
</Grid>

      

        <Grid item xs={12} md={6}>
          <Typography variant='h4' gutterBottom>
            {product.name}
          </Typography>
          <Typography variant='subtitle1' gutterBottom>
            {product.description}
          </Typography>
          <Typography variant='h5' sx={{ color: '#2e7d32' }} gutterBottom>
            ${product.discountedPrice}{' '}
            <Typography
              variant='caption'
              sx={{ textDecoration: 'line-through' }}
            >
              ${product.price}
            </Typography>{' '}
            <Typography variant='caption' color='error'>
              -
              {Math.floor(
                ((product.price - product.discountedPrice) / product.price) *
                  100
              )}
              %
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography variant='subtitle1' sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type='number'
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{
                width: 60,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'grey' // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#2e7d32' // Green border on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2e7d32' // Green border when focused
                  },
                  '& input': {
                    color: '#2e7d32' // Green color for the input value
                  }
                }
              }}
            />
          </Box>
          <Button
            variant='contained'
            startIcon={<ShoppingCartIcon />}
            sx={{
              mr: 2,
              background: '#2e7d32', // Original button background color
              '&:hover': {
                backgroundColor: '#1b5e20', // Darker green on hover
                borderColor: '#1b5e20' // Optional: Maintain the border color on hover
              },
              '&:active': {
                backgroundColor: '#1b5e20', // Darker green when button is clicked
                borderColor: '#1b5e20' // Optional: Maintain the border color when clicked
              }
            }}
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>

          <Button
            variant='outlined'
            sx={{
              borderColor: '#2e7d32', // Set border color
              color: '#2e7d32', // Set text color
              '&:hover': {
                borderColor: '#2e7d32', // Maintain border color on hover
                backgroundColor: 'rgba(46, 125, 50, 0.1)' // Optional: light green background on hover
              }
            }}
          >
            Buy Now
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant='body2'>
              Availability: {product.stock} in stock
            </Typography>
            <Typography variant='body2'>
              Category: {product.category.name}
            </Typography>
            <Typography variant='body2'>
              Vendor: {product.vendorShop}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              startIcon={<FavoriteIcon sx={{ color: '#2e7d32' }} />}
              sx={{ color: '#2e7d32', mr: 1 }}
              onClick={handleAddToFav}
            >
              Favorite
            </Button>

            <Button
              startIcon={<ShareIcon sx={{ color: '#2e7d32' }} />}
              sx={{ color: '#2e7d32' }}
            >
              Share
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: '#2e7d32' } }} // Set the bottom border for the active tab
        >
          <Tab
            label='Description'
            sx={{
              color: activeTab === 0 ? '#2e7d32' : 'inherit',
              '&.Mui-selected': { color: '#2e7d32' } // Set the text color for the selected tab
            }}
          />
          <Tab
            label={`Reviews (${product.numReviews})`}
            sx={{
              color: activeTab === 1 ? '#2e7d32' : 'inherit',
              '&.Mui-selected': { color: '#2e7d32' }
            }}
          />
          <Tab
            label='Vendor'
            sx={{
              color: activeTab === 2 ? '#2e7d32' : 'inherit',
              '&.Mui-selected': { color: '#2e7d32' }
            }}
          />
        </Tabs>

        <Paper sx={{ p: 2, mt: 2 }}>
          {activeTab === 0 && <Typography>{product.description}</Typography>}
          {activeTab === 1 && (
            <Typography>Customer reviews would go here.</Typography>
          )}
          {activeTab === 2 && (
            <Typography>Vendor information would go here.</Typography>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
  )
}

export default SingleProduct
