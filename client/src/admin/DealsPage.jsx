import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import { Edit, Delete, Add, LocalOffer } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../API/api';
import uploadImageToCloudinary from '../cloudinary/cloudinary';

const DealsPage = () => {
  // State for deals list and loading
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create' or 'edit'
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discountPercentage: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true
  });
  
  // Form validation
  const [formErrors, setFormErrors] = useState({});
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch deals on component mount
  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  // Fetch all deals
  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/deals');
      setDeals(response.data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      showSnackbar('Failed to load deals', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch product list for the select dropdown
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Failed to load products', 'error');
    }
  };

  // Show snackbar helper
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Handle date change
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData({
        ...formData,
        image: imageUrl
      });
      
      // Clear error for this field if it exists
      if (formErrors.image) {
        setFormErrors({
          ...formErrors,
          image: ''
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar('Failed to upload image', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.image) errors.image = 'Image is required';
    if (!formData.discountPercentage) {
      errors.discountPercentage = 'Discount percentage is required';
    } else if (formData.discountPercentage < 1 || formData.discountPercentage > 99) {
      errors.discountPercentage = 'Discount must be between 1 and 99';
    }
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      errors.endDate = 'End date must be after start date';
    }
    if (!selectedProducts.length) errors.products = 'At least one product is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const dealData = {
        ...formData,
        products: selectedProducts.map(p => p._id)
      };
      
      if (dialogType === 'create') {
        await api.post('/deals', dealData);
        showSnackbar('Deal created successfully');
      } else {
        await api.put(`/deals/${selectedDeal._id}`, dealData);
        showSnackbar('Deal updated successfully');
      }
      
      // Refresh the deals list
      fetchDeals();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving deal:', error);
      showSnackbar('Failed to save deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete deal
  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/deals/${dealId}`);
      showSnackbar('Deal deleted successfully');
      
      // Refresh the deals list
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      showSnackbar('Failed to delete deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for creating new deal
  const handleOpenCreateDialog = () => {
    setDialogType('create');
    setSelectedDeal(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      discountPercentage: '',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      isActive: true
    });
    setSelectedProducts([]);
    setFormErrors({});
    setOpenDialog(true);
  };

  // Open dialog for editing deal
  const handleOpenEditDialog = (deal) => {
    setDialogType('edit');
    setSelectedDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description,
      image: deal.image,
      discountPercentage: deal.discountPercentage,
      startDate: new Date(deal.startDate),
      endDate: new Date(deal.endDate),
      isActive: deal.isActive
    });
    setSelectedProducts(deal.products || []);
    setFormErrors({});
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Check if a deal has expired
  const isExpired = (deal) => {
    return new Date(deal.endDate) < new Date();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Deals of the Day
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Create New Deal
        </Button>
      </Box>

      {loading && !openDialog ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : deals.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <LocalOffer sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No deals available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first special offer to attract more customers
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
          >
            Create Deal
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="img"
                        sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover', borderRadius: 1 }}
                        src={deal.image}
                        alt={deal.title}
                      />
                      <Typography variant="body1">{deal.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{deal.discountPercentage}%</TableCell>
                  <TableCell>{deal.products?.length || 0} items</TableCell>
                  <TableCell>{formatDate(deal.startDate)}</TableCell>
                  <TableCell>{formatDate(deal.endDate)}</TableCell>
                  <TableCell>
                    {isExpired(deal) ? (
                      <Chip label="Expired" color="error" size="small" />
                    ) : deal.isActive ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Inactive" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(deal)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(deal._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Deal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {dialogType === 'create' ? 'Create New Deal' : 'Edit Deal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Percentage"
                name="discountPercentage"
                type="number"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                error={!!formErrors.discountPercentage}
                helperText={formErrors.discountPercentage}
                InputProps={{ inputProps: { min: 1, max: 99 } }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mr: 2 }}
                  disabled={imageUploading}
                >
                  {imageUploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {imageUploading && <CircularProgress size={24} />}
                {formData.image && (
                  <Box
                    component="img"
                    sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    src={formData.image}
                    alt="Deal"
                  />
                )}
              </Box>
              {formErrors.image && (
                <FormHelperText error>{formErrors.image}</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.startDate}
                      helperText={formErrors.startDate}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formErrors.endDate}
                      helperText={formErrors.endDate}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.products}>
                <Autocomplete
                  multiple
                  id="products-autocomplete"
                  options={products}
                  value={selectedProducts}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, newValue) => {
                    setSelectedProducts(newValue);
                    if (formErrors.products) {
                      setFormErrors({
                        ...formErrors,
                        products: ''
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Products"
                      placeholder="Select products"
                      error={!!formErrors.products}
                      helperText={formErrors.products}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {option.image && option.image[0] && (
                          <Box
                            component="img"
                            sx={{ width: 40, height: 40, mr: 2, objectFit: 'cover' }}
                            src={option.image[0]}
                            alt={option.name}
                          />
                        )}
                        <Box>
                          <Typography variant="body1">{option.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${option.price}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : dialogType === 'create' ? (
              'Create Deal'
            ) : (
              'Update Deal'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DealsPage; 