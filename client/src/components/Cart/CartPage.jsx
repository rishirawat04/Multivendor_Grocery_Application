import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Snackbar,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import api from '../../API/api'
import MuiAlert from '@mui/material/Alert'

// Snackbar Alert component
const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success') // success or error
  const [couponCode, setCouponCode] = useState('') // State for coupon code input
  const [discount, setDiscount] = useState(0) // Store discount amount
  const [isCouponApplied, setIsCouponApplied] = useState(false) // Coupon applied state
  const [userId, setUserId] = useState("")
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(0) // Store total before discount
  const [loading, setLoading] = useState(true); 

 

  // Function to fetch cart data
  const fetchCartData = async () => {
    setLoading(true); 
    try {
      const response = await api.get('/cart', { withCredentials: true })
      const products = response.data.products
      setCartItems(products)
      setUserId(response.data.user)
      
      

       // Calculate initial total without discount
       const total = products?.reduce(
        (total, item) => total + item?.product?.discountedPrice * item?.quantity,
        0
      )
      setTotalWithoutDiscount(total)

      
    } catch (error) {
      showSnackbar('Failed to load cart data', 'error')
    } finally {
      setLoading(false); // Stop loading when the async operation is done
    }
  }

  // Function to update product quantity in the cart
  const handleQuantityChange = async (productId, newQuantity) => {
    setLoading(true); // Start loading
    try {
      const response = await api.post(
        '/cart',
        { productId, quantity: newQuantity },
        { withCredentials: true }
      )
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      )

      // Recalculate total after updating quantity
      const updatedTotal = cartItems?.reduce(
        (total, item) => total + item?.product?.price * item?.quantity,
        0
      )
      setTotalWithoutDiscount(updatedTotal)

      showSnackbar(response.data.message, 'success')
    } catch (error) {
      showSnackbar('Failed to update quantity', 'error')
    } finally {
      setLoading(false); // Stop loading
    }
  }

  // Function to remove product from the cart
  const removeProductFromCart = async productId => {
    setLoading(true); // Start loading
    try {
      const response = await api.delete('/cart/remove', {
        data: { productId },
        withCredentials: true
      })
      setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId))
      showSnackbar(response.data.message, 'success')


      // Recalculate total after removing product
      const updatedTotal = cartItems?.reduce(
        (total, item) => total + item?.product?.price * item?.quantity,
        0
      )
      setTotalWithoutDiscount(updatedTotal)
    } catch (error) {
      showSnackbar('Failed to remove product', 'error')
    }  finally {
      setLoading(false); // Stop loading
    }
  }

  // Function to show the Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  
// Handle applying a coupon code
const handleApplyCoupon = async () => {


  if (!couponCode) {
    showSnackbar('Please enter a valid coupon code', 'error')
    return
  }

  try {
    const response = await api.post('/cart/apply-coupon', { couponCode }, { withCredentials: true })
    const discountAmount = response.data.discount
    setDiscount(discountAmount)
    setIsCouponApplied(true)
    showSnackbar('Coupon applied successfully!', 'success')

  } catch (error) {
    showSnackbar('Failed to apply coupon', 'error')
  }
}

const finalTotal = totalWithoutDiscount - discount



useEffect(() => {
  fetchCartData()
}, [])

if (loading) {
  // Display loading spinner while data is being fetched or updated
  return (
    <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
      <CircularProgress />
    </Box>
  );
}

  

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
  <Typography variant='h4' gutterBottom>
    Your Cart
  </Typography>
  <Typography variant='body1' gutterBottom>
    There are {cartItems.length} products in your cart
  </Typography>

  <Grid container spacing={3}>
    <Grid item xs={12} md={8}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align='right'>Unit Price</TableCell>
              <TableCell align='right'>Quantity</TableCell>
              <TableCell align='right'>Subtotal</TableCell>
              <TableCell align='right'>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map(item => {
              // Error handling
              const product = item.product || {};
              const image = Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : 'default-image-url';
              const productName = product.name || 'Unnamed Product';
              const productPrice = product.price || 0;
              const itemQuantity = item.quantity || 0;
              const discountedPrice = product.discountedPrice || 0;

              return (
                <TableRow key={product._id}>
                  <TableCell component='th' scope='row'>
                    <Box display='flex' alignItems='center'>
                      <img
                        src={image}
                        alt={productName}
                        style={{ width: 50, marginRight: 10 }}
                      />
                      <Box>
                        <Typography variant='subtitle1'>
                          {productName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='right'>
                    ${discountedPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align='right'>
                    <TextField
                      type='number'
                      InputProps={{ inputProps: { min: 1 } }}
                      value={itemQuantity}
                      onChange={e => handleQuantityChange(product._id, parseInt(e.target.value))}
                      size='small'
                      sx={{ width: '70px' }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    ${(discountedPrice * itemQuantity).toFixed(2)}
                  </TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={() => removeProductFromCart(product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>

    <Grid item xs={12} md={4}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant='h6' gutterBottom>
          Order Summary
        </Typography>
        <Box display='flex' justifyContent='space-between' mb={1}>
          <Typography>Tax</Typography>
          <Typography>$0.00</Typography>
        </Box>
        <Box display='flex' justifyContent='space-between' mb={1}>
          <Typography variant='h6'>Total</Typography>
          <Typography variant='h6'>
            ${totalWithoutDiscount.toFixed(2)}
          </Typography>
        </Box>

        {/* Apply Coupon Section */}
        <Box display='flex' flexDirection='column' mb={2}>
          <TextField
            label='Coupon Code'
            variant='outlined'
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            disabled={isCouponApplied} // Disable if already applied
            fullWidth
            margin='dense'
          />
          <Button
            variant='contained'
            color='primary'
            sx={{
              mt: 2,
              backgroundColor: '#38a169',
              '&:hover': {
                backgroundColor: '#2f855a'
              }
            }}
            onClick={handleApplyCoupon}
            disabled={isCouponApplied} // Disable if already applied
          >
            {isCouponApplied ? 'Coupon Applied' : 'Apply Coupon'}
          </Button>
        </Box>

        {discount > 0 && (
          <Box display='flex' justifyContent='space-between' mb={1}>
            <Typography>Discount</Typography>
            <Typography>-${discount.toFixed(2)}</Typography>
          </Box>
        )}

        <Box display='flex' justifyContent='space-between' mb={1}>
          <Typography variant='h6'>Final Total</Typography>
          <Typography variant='h6'>
            ${finalTotal.toFixed(2)}
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' mb={2}>
          (Shipping fees not included)
        </Typography>
        <Link to={`/checkout/${userId}`}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{
              backgroundColor: '#38a169',
              '&:hover': {
                backgroundColor: '#2f855a'
              }
            }}
          >
            Proceed To Checkout
          </Button>
        </Link>
      </Paper>
    </Grid>
  </Grid>

  <Link to='/'>
    <Button
      startIcon={<ArrowBackIcon />}
      sx={{
        marginTop: 2,
        backgroundColor: '#38a169',
        '&:hover': {
          backgroundColor: '#2f855a'
        }
      }}
      variant='contained'
    >
      Continue Shopping
    </Button>
  </Link>

  {/* Snackbar for messages */}
  <Snackbar
    open={openSnackbar}
    autoHideDuration={900}
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
      {snackbarMessage}
    </Alert>
  </Snackbar>
</Box>

  )
}

export default CartPage

