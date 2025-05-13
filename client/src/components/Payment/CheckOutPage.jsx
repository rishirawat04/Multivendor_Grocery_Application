import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  Button,
  Paper,
  Grid,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../../API/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import config from "../../config";
import { AuthContext } from "../../auth/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CheckoutForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderSuccessDialog, setOrderSuccessDialog] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addresses: [
      { city: "", state: "", homeNumber: "", pinCode: "", landmark: "" },
    ],
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
  // Define showSnackbar before using it in useCallback functions, wrapped in useCallback
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }, []);
  
  // Use useCallback to memoize the functions for useEffect dependencies
  const fetchCartData = useCallback(async () => {
    // Don't fetch cart data if user isn't logged in
    if (!user) {
      return;
    }
    
    try {
      const response = await api.get("/cart", { withCredentials: true });
      const products = response.data.products;
      setCartData(products);

      const subtotal = products.reduce((acc, item) => {
        return acc + item.product.discountedPrice * item.quantity;
      }, 0);

      setCartTotal(subtotal);
    } catch (error) {
      showSnackbar("Failed to load cart details", "error");
    }
  }, [showSnackbar, user]);

  // Fetch user details for shipping and billing address
  const fetchUserDetails = useCallback(async () => {
    // Don't fetch user details if user isn't logged in
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/users/profile/${userId}`, {
        withCredentials: true,
      });
      const user = response.data.user;

      // Ensure addresses array and default address object exist
      if (!user.addresses || !Array.isArray(user.addresses) || user.addresses.length === 0) {
        user.addresses = [
          { city: "", state: "", homeNumber: "", pinCode: "", landmark: "" },
        ];
        setHasAddress(false);
      } else {
        // Check if user has complete address
        const address = user.addresses[0];
        const hasValidAddress = address &&
          address.city && 
          address.state && 
          address.homeNumber && 
          address.pinCode;
        
        setHasAddress(hasValidAddress);
      }

      setUserDetails(user);
    } catch (error) {
      console.error("User profile fetch error:", error);
      showSnackbar("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, showSnackbar, user]);

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!user) {
      setLoading(false);
      showSnackbar("Please login to access checkout", "info");
      
      // Add a timeout before redirecting to login page
      // This prevents infinite redirect loops while giving time for the message to be seen
      const redirectTimer = setTimeout(() => {
        navigate('/login', { state: { from: `/checkout/${userId}` } });
      }, 1500);
      
      // Clean up timer if component unmounts
      return () => clearTimeout(redirectTimer);
    }
    
    // Only fetch data if the user is logged in and there's a userId
    if (user && userId) {
      fetchCartData();
      fetchUserDetails();
    }
  }, [userId, fetchCartData, fetchUserDetails, user, navigate, showSnackbar]);

  // Display address dialog if user doesn't have a valid address
  useEffect(() => {
    if (!loading && !hasAddress && user) {
      setAddressDialogOpen(true);
    }
  }, [loading, hasAddress, user]);

  const validateAddress = () => {
    const address = userDetails.addresses[0];
    
    // Validate basic required fields
    if (!address.city || !address.state || !address.homeNumber || !address.pinCode) {
      return { valid: false, message: "Please fill in all address fields" };
    }
    
    // Validate PIN code format (numbers only, appropriate length)
    const pinCodePattern = /^\d{5,6}$/;
    if (!pinCodePattern.test(address.pinCode)) {
      return { valid: false, message: "Please enter a valid PIN code (5-6 digits)" };
    }
    
    // Validate phone number (at least 10 digits)
    const phonePattern = /^\d{10,15}$/;
    if (!phonePattern.test(userDetails.phoneNumber.replace(/\D/g, ''))) {
      return { valid: false, message: "Please enter a valid phone number (10-15 digits)" };
    }
    
    return { valid: true };
  };

  const updateUserProfile = async () => {
    if (!user) {
      showSnackbar("Please login to update your profile", "warning");
      navigate('/login', { state: { from: `/checkout/${userId}` } });
      return;
    }
    
    const validation = validateAddress();
    if (!validation.valid) {
      showSnackbar(validation.message, "error");
      return;
    }
    
    setLoading(true);
    try {
      // Ensure all required address fields are present and valid
      const address = userDetails.addresses[0];
      if (!address.city || !address.state || !address.homeNumber || !address.pinCode) {
        throw new Error("Complete address information is required");
      }
      
      const updatedData = {
        fullName: userDetails.fullName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        addresses: [{
          city: address.city,
          state: address.state,
          homeNumber: address.homeNumber,
          pinCode: address.pinCode,
          landmark: address.landmark || ""
        }]
      };

      console.log("Sending address update:", updatedData);

      const response = await api.put(`/users/${userId}/profile`, updatedData, {
        withCredentials: true,
      });
      
      if (response.data && response.data.user) {
        setUserDetails(response.data.user);
        setHasAddress(true);
      }
      
      showSnackbar(response.data.message || "Profile updated successfully", "success");
      setAddressDialogOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      showSnackbar(error.response?.data?.message || "Failed to update user profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Wrap verifyPayment function in useCallback to stabilize it
  const verifyPayment = useCallback(async (paymentResponse) => {
    if (!user) {
      showSnackbar("Please login to complete payment", "warning");
      navigate('/login', { state: { from: `/checkout/${userId}` } });
      return;
    }
    
    setOrderProcessing(true);
    try {
      const response = await api.post("/orders/verify-payment", {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
        deliveryAddress: paymentResponse.deliveryAddress
      });

      if (response.data.message === "Payment successful") {
        showSnackbar("Payment successful!", "success");
        setOrderSuccessDialog(true);
        
        // Clear cart after successful payment
        try {
          await api.post('/cart/clear', {}, { withCredentials: true });
        } catch (clearError) {
          console.error("Failed to clear cart:", clearError);
        }
      } else {
        showSnackbar("Payment verification failed", "error");
      }
    } catch (error) {
      console.error("Payment verification error:", error.response?.data);
      showSnackbar(error.response?.data?.message || "Payment verification failed", "error");
    } finally {
      setOrderProcessing(false);
    }
  }, [showSnackbar, user, navigate, userId]);

  // Create the delivery address object from user details
  const getDeliveryAddress = () => {
    const address = userDetails.addresses[0];
    return {
      city: address.city,
      state: address.state,
      homeNumber: address.homeNumber,
      pinCode: address.pinCode,
      landmark: address.landmark || ""
    };
  };

  // Wrap createOrder function in useCallback to stabilize it
  const createOrder = useCallback(async () => {
    if (!user) {
      showSnackbar("Please login to place an order", "warning");
      navigate('/login', { state: { from: `/checkout/${userId}` } });
      return;
    }
    
    // Validate address first
    if (!hasAddress) {
      const validation = validateAddress();
      if (!validation.valid) {
        showSnackbar(validation.message, "error");
        setAddressDialogOpen(true);
        return;
      }
    }

    // Get the delivery address
    const deliveryAddress = getDeliveryAddress();

    if (paymentMethod === "cod") {
      setOrderProcessing(true);
      try {
        // For COD, directly create the order without payment processing
        const response = await api.post("/orders/create-order", {
          userId: userId,
          paymentMethod: "cod",
          products: cartData.map((item) => ({
            product: item?.product._id,
            quantity: item.quantity,
          })),
          totalPrice: cartTotal,
          deliveryAddress: deliveryAddress
        });
        
        console.log("Order created:", response.data);
        showSnackbar("Order placed successfully with COD!", "success");
        setOrderSuccessDialog(true);
        
        // Clear cart after successful order
        try {
          await api.post('/cart/clear', {}, { withCredentials: true });
        } catch (clearError) {
          console.error("Failed to clear cart:", clearError);
        }
      } catch (error) {
        console.error("Order error:", error.response?.data);
        showSnackbar(error.response?.data?.message || "Failed to create order", "error");
      } finally {
        setOrderProcessing(false);
      }
      return;
    }

    setOrderProcessing(true);
    try {
      // Recalculate the total to ensure it's accurate
      const recalculatedTotal = cartData.reduce((acc, item) => {
        return acc + (item?.product?.discountedPrice || 0) * item.quantity;
      }, 0);

      // Check if there's a significant difference between displayed and calculated totals
      if (Math.abs(recalculatedTotal - cartTotal) > 0.01) {
        setCartTotal(recalculatedTotal);
        showSnackbar("Cart total has been updated. Please review before proceeding.", "warning");
        setOrderProcessing(false);
        return;
      }

      const response = await api.post("/orders/create-order", {
        userId: userId,
        paymentMethod: "razorpay",
        products: cartData.map((item) => ({
          product: item?.product._id,
          quantity: item.quantity,
        })),
        totalPrice: recalculatedTotal,
        deliveryAddress: deliveryAddress
      });

      console.log("Order created for razorpay:", response.data);
      const { razorpayOrderId } = response.data;

      const options = {
        key: config.RAZORPAY_KEY_ID,
        amount: recalculatedTotal * 100,
        currency: "INR",
        name: "RawatTech 04",
        description: "rawattech04: Innovative, Creative, Dynamic",
        image: "/images/rawattech04.png",
        order_id: razorpayOrderId,
        handler: async (response) => {
          console.log("Razorpay payment response:", response);
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            deliveryAddress: deliveryAddress
          });
        },
        prefill: {
          name: userDetails.fullName,
          email: userDetails.email,
          contact: userDetails.phoneNumber,
        },
        theme: {
          color: "#528ac4",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            showSnackbar("Payment canceled", "warning");
            setOrderProcessing(false);
          }
        }
      };

      // Check if Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        console.log("Loading Razorpay script");
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log("Razorpay script loaded");
          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          showSnackbar("Failed to load payment gateway", "error");
          setOrderProcessing(false);
        };
        document.body.appendChild(script);
      } else {
        console.log("Razorpay already loaded, opening payment form");
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Order creation error:", error.response?.data);
      showSnackbar(error.response?.data?.message || "Failed to create order", "error");
      setOrderProcessing(false);
    }
  }, [cartData, cartTotal, paymentMethod, showSnackbar, userId, userDetails, verifyPayment, hasAddress, validateAddress, user, navigate]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleOrderSuccess = () => {
    setOrderSuccessDialog(false);
    
    // Navigate back to home page without showing cart page
    navigate('/homepage');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // If user is not logged in, show login message
  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2, textAlign: 'center', py: 5, mb: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Please log in to access checkout
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You need to be logged in to complete your order.
        </Typography>
        <Link to='/login' state={{ from: `/checkout/${userId}` }}>
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
    <Box sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipping information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={userDetails.fullName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, fullName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  value={userDetails.phoneNumber}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  variant="outlined"
                  value={userDetails.addresses[0]?.state || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0] = {
                      ...updatedAddresses[0],
                      state: e.target.value
                    };
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                  error={!userDetails.addresses[0]?.state && !hasAddress}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  variant="outlined"
                  value={userDetails.addresses[0]?.city || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0] = {
                      ...updatedAddresses[0],
                      city: e.target.value
                    };
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                  error={!userDetails.addresses[0]?.city && !hasAddress}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Address Line"
                  variant="outlined"
                  value={userDetails.addresses[0]?.homeNumber || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0] = {
                      ...updatedAddresses[0],
                      homeNumber: e.target.value
                    };
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                  error={!userDetails.addresses[0]?.homeNumber && !hasAddress}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="PIN Code"
                  variant="outlined"
                  value={userDetails.addresses[0]?.pinCode || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0] = {
                      ...updatedAddresses[0],
                      pinCode: e.target.value
                    };
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                  error={!userDetails.addresses[0]?.pinCode && !hasAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark (Optional)"
                  variant="outlined"
                  value={userDetails.addresses[0]?.landmark || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0] = {
                      ...updatedAddresses[0],
                      landmark: e.target.value
                    };
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                />
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={updateUserProfile}
              sx={{ mt: 2 }}
            >
              Update Address
            </Button>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="cod" control={<Radio />} label="COD" />
              <FormControlLabel
                value="razorpay"
                control={<Radio />}
                label="Razorpay"
              />
            </RadioGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cart Summary
            </Typography>
            <Typography>Subtotal: ₹{cartTotal.toFixed(2)}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={createOrder}
                disabled={!hasAddress || orderProcessing}
                fullWidth
              >
                {orderProcessing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Processing...
                  </Box>
                ) : (
                  'Place Order'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Address dialog for users without address */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)}>
        <DialogTitle>Address Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update your shipping address before proceeding with checkout.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Order success dialog */}
      <Dialog 
        open={orderSuccessDialog} 
        onClose={handleOrderSuccess}
      >
        <DialogTitle>Order Placed Successfully!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your order has been placed successfully and your cart has been cleared. Thank you for shopping with us!
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="h6">
              Order Total: ₹{cartTotal.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOrderSuccess} variant="contained" color="primary">
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutForm;
