import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../../API/api";
import { useParams } from "react-router-dom";
import config from "../../config";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CheckoutForm = () => {
  const { userId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartData, setCartData] = useState([]);
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
  }, [showSnackbar]);

  // Fetch user details for shipping and billing address
  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await api.get(`/users/profile/${userId}`, {
        withCredentials: true,
      });
      const user = response.data.user;

      if (!user.addresses.length) {
        user.addresses = [
          { city: "", state: "", homeNumber: "", pinCode: "", landmark: "" },
        ];
      }

      setUserDetails(user);
    } catch (error) {
      showSnackbar("Failed to load user details", "error");
    }
  }, [userId, showSnackbar]);

  useEffect(() => {
    if (userId) {
      fetchCartData();
      fetchUserDetails();
    }
  }, [userId, fetchCartData, fetchUserDetails]);

  const updateUserProfile = async () => {
    try {
      const updatedData = {
        fullName: userDetails.fullName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        addresses: userDetails.addresses,
      };

      const response = await api.put(`/users/${userId}/profile`, updatedData, {
        withCredentials: true,
      });
      showSnackbar(response.data.message, "success");
    } catch (error) {
      showSnackbar("Failed to update user profile", "error");
    }
  };

  // Wrap createOrder function in useCallback to stabilize it
  const createOrder = useCallback(async () => {
    if (paymentMethod === "cod") {
      showSnackbar("Order placed successfully with COD!", "success");
      return;
    }

    try {
      // Recalculate the total to ensure it's accurate
      const recalculatedTotal = cartData.reduce((acc, item) => {
        return acc + (item?.product?.discountedPrice || 0) * item.quantity;
      }, 0);

      // Check if there's a significant difference between displayed and calculated totals
      if (Math.abs(recalculatedTotal - cartTotal) > 0.01) {
        setCartTotal(recalculatedTotal);
        showSnackbar("Cart total has been updated. Please review before proceeding.", "warning");
        return;
      }

      const response = await api.post("/orders/create-order", {
        userId: userId,
        products: cartData.map((item) => ({
          product: item?.product._id,
          quantity: item.quantity,
        })),
        totalPrice: recalculatedTotal,
      });

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
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
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
      };

      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        showSnackbar("Razorpay SDK not loaded", "error");
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Failed to create order", "error");
    }
  }, [cartData, cartTotal, paymentMethod, showSnackbar, userId, userDetails, verifyPayment]);

  const verifyPayment = useCallback(async (paymentResponse) => {
    try {
      const response = await api.post("/orders/verify-payment", {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      });

      if (response.data.message === "Payment successful") {
        showSnackbar("Payment successful!", "success");
      } else {
        showSnackbar("Payment verification failed", "error");
      }
    } catch (error) {
      showSnackbar("Payment verification failed", "error");
    }
  }, [showSnackbar]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

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
                  fullWidth
                  label="State"
                  variant="outlined"
                  value={userDetails.addresses[0]?.state || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0].state = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  value={userDetails.addresses[0]?.city || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0].city = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  value={userDetails.addresses[0]?.homeNumber || ""}
                  onChange={(e) => {
                    const updatedAddresses = [...userDetails.addresses];
                    updatedAddresses[0].homeNumber = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      addresses: updatedAddresses,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                    />
                  }
                  label="Same as shipping information"
                />
              </Grid>
            </Grid>
            {!sameAsBilling && (
              <Button onClick={updateUserProfile}>Update Profile</Button>
            )}
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
              >
                Place Order
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutForm;
