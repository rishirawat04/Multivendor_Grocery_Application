import React, { useState, useEffect, useCallback, useContext } from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import api from '../../API/api'
import MuiAlert from '@mui/material/Alert'
import { AuthContext } from '../../auth/AuthContext'

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
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  
  // Function to fetch cart data, using useCallback to memoize
  const fetchCartData = useCallback(async () => {
    // If user is not logged in, don't make the API call
    if (!user) {
      setLoading(false)
      return
    }
    
    setLoading(true); 
    try {
      const response = await api.get('/cart', { withCredentials: true });
      
      // Handle empty cart case
      if (!response.data.products || response.data.products.length === 0) {
        setCartItems([]);
        setTotalWithoutDiscount(0);
        setDiscount(0);
        setIsCouponApplied(false);
        setCouponCode('');
        setUserId(response.data.user || "");
        setLoading(false);
        return;
      }
      
      const products = response.data.products;
      setCartItems(products);
      setUserId(response.data.user);
      
      // Calculate initial total without discount
      const total = products?.reduce(
        (total, item) => total + item?.product?.discountedPrice * item?.quantity,
        0
      ) || 0;
      setTotalWithoutDiscount(total);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setSnackbarMessage('Failed to load cart data');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      
      // Set empty cart if there's an error
      setCartItems([]);
      setTotalWithoutDiscount(0);
    } finally {
      setLoading(false); // Stop loading when the async operation is done
    }
  }, [user]); // Include user in dependency array

  useEffect(() => {
    // Check if user is authenticated before fetching cart data
    if (user) {
      fetchCartData();
    } else {
      // User is not logged in, redirect to login page
      setLoading(false);
      setSnackbarMessage('Please login to view your cart');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
      
      // Add a timeout before redirecting to login page
      // This prevents infinite redirect loops while giving time for the message to be seen
      const redirectTimer = setTimeout(() => {
        navigate('/login', { state: { from: '/cart' } });
      }, 1500);
      
      // Clean up timer if component unmounts
      return () => clearTimeout(redirectTimer);
    }
  }, [fetchCartData, user, navigate]);

  // Function to update product quantity in the cart
  const handleQuantityChange = async (productId, newQuantity) => {
    // Check if user is logged in
    if (!user) {
      setSnackbarMessage('Please login to update your cart');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    setLoading(true); // Start loading
    try {
      const response = await api.post(
        '/cart',
        { productId, quantity: newQuantity },
        { withCredentials: true }
      )
      
      // Update cart items and recalculate total in a single update
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        );
        
        // Calculate new total from updated items
        const newTotal = updatedItems.reduce(
          (total, item) => total + item?.product?.discountedPrice * item?.quantity,
          0
        );
        setTotalWithoutDiscount(newTotal);
        
        return updatedItems;
      });

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to update quantity');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  // Function to remove product from the cart
  const removeProductFromCart = async productId => {
    // Check if user is logged in
    if (!user) {
      setSnackbarMessage('Please login to manage your cart');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    setLoading(true); // Start loading
    try {
      const response = await api.delete('/cart/remove', {
        data: { productId },
        withCredentials: true
      })
      
      // Update cart items and recalculate total in a single update
      setCartItems(prevItems => {
        const updatedItems = prevItems.filter(item => item.product._id !== productId);
        
        // Calculate new total from updated items
        const newTotal = updatedItems.reduce(
          (total, item) => total + item?.product?.discountedPrice * item?.quantity,
          0
        );
        setTotalWithoutDiscount(newTotal);
        
        return updatedItems;
      });

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to remove product');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Stop loading
    }
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
  // Check if user is logged in
  if (!user) {
    setSnackbarMessage('Please login to apply coupon codes');
    setSnackbarSeverity('warning');
    setOpenSnackbar(true);
    navigate('/login', { state: { from: '/cart' } });
    return;
  }
  
  if (!couponCode.trim()) {
    setSnackbarMessage('Please enter a valid coupon code');
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    return;
  }

  setLoading(true);
  try {
    const response = await api.post('/cart/apply-coupon', { couponCode }, { withCredentials: true });
    const discountAmount = response.data.discount;
    
    if (discountAmount <= 0) {
      setSnackbarMessage('This coupon provides no discount');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    
    setDiscount(discountAmount);
    setIsCouponApplied(true);
    setSnackbarMessage(`Coupon applied successfully! You saved $${discountAmount.toFixed(2)}`);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  } catch (error) {
    console.error('Coupon error:', error);
    let errorMessage = 'Failed to apply coupon';
    
    // Extract specific error message if available
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    }
    
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  } finally {
    setLoading(false);
  }
}

const finalTotal = totalWithoutDiscount - discount

if (loading) {
  // Display loading spinner while data is being fetched or updated
  return (
    <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
      <CircularProgress />
    </Box>
  );
}

// If user is not logged in, you can simply render a login message instead of making API calls
if (!user) {
  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2, textAlign: 'center', py: 5, mb: 3 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Please log in to view your cart
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You need to be logged in to view and manage your shopping cart.
      </Typography>
      <Link to='/login' state={{ from: '/cart' }}>
        <Button
          variant='contained'
          color='primary'
          sx={{
            mt: 2,
            mr: 2,
            backgroundColor: '#38a169',
            '&:hover': {
              backgroundColor: '#2f855a'
            }
          }}
        >
          Log In
        </Button>
      </Link>
      <Link to='/'>
        <Button
          variant='outlined'
          sx={{
            mt: 2
          }}
        >
          Continue Shopping
        </Button>
      </Link>
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

  {cartItems.length === 0 ? (
    <Box sx={{ textAlign: 'center', py: 5, mb: 3 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Your cart is empty
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Looks like you haven't added any products to your cart yet.
      </Typography>
      <Link to='/'>
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
        >
          Start Shopping
        </Button>
      </Link>
    </Box>
  ) : (
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
              error={couponCode.trim() === '' && !isCouponApplied}
              helperText={couponCode.trim() === '' && !isCouponApplied ? 'Enter coupon code' : ''}
            />
            <Box display="flex" justifyContent="space-between">
              <Button
                variant='contained'
                color='primary'
                sx={{
                  mt: 2,
                  backgroundColor: '#38a169',
                  '&:hover': {
                    backgroundColor: '#2f855a'
                  },
                  flexGrow: 1,
                  mr: isCouponApplied ? 1 : 0
                }}
                onClick={handleApplyCoupon}
                disabled={isCouponApplied || !couponCode.trim()} // Disable if already applied or empty code
              >
                {isCouponApplied ? 'Coupon Applied' : 'Apply Coupon'}
              </Button>
              
              {isCouponApplied && (
                <Button
                  variant='outlined'
                  color='error'
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setIsCouponApplied(false);
                    setDiscount(0);
                    setCouponCode('');
                    setSnackbarMessage('Coupon removed');
                    setSnackbarSeverity('info');
                    setOpenSnackbar(true);
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Box>

          {discount > 0 && (
            <Box display='flex' justifyContent='space-between' mb={1}>
              <Typography>Discount</Typography>
              <Typography color="success.main">-${discount.toFixed(2)}</Typography>
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
  )}

  {cartItems.length > 0 && (
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
  )}

  {/* Snackbar for messages */}
  <Snackbar
    open={openSnackbar}
    autoHideDuration={3000}
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

