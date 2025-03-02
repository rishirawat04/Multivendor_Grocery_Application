import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  MenuItem,
  Select,
  Divider,
  TablePagination,
  IconButton,
  Tooltip,
  Modal,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { Delete, Edit, FilterList as FilterListIcon } from '@mui/icons-material'
import api from '../API/api'
import { AuthContext } from '../auth/AuthContext'


const VendorProfiles = () => {
  const {user} = useContext(AuthContext)
 
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filter, setFilter] = useState({
    text: '',
    priceCondition: '',
    priceValue: '',
    quantityCondition: '',
    quantityValue: '',
  
  })
  const [error, setError] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('id')
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [products, setProducts] = useState([])


  //handle product delete 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState('')
  const [enteredProductId, setEnteredProductId] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')


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
        const response = await api.get(`/users/profile/${user.id}`);
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

  // GET ALL PRODUCTS 
  const getProduct = async () => {
    try {
      const response = await api.get(`/vendor/products`, 
        {
          withCredentials: true
        })
      console.log(response.data)

      // Set product fields
      setProducts(response.data)
    
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value })
  }

  const handleSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredRows = products?.filter(data => {
    let matches = true

     // Search by product name or ID
     if (filter.text) {
      const lowerCaseSearchText = filter.text.toLowerCase()
      const matchesId = data._id.toLowerCase().includes(lowerCaseSearchText)
      const matchesName = data.name.toLowerCase().includes(lowerCaseSearchText)

      if (!matchesId && !matchesName) {
        matches = false
      }
    }

     // Price filter
     if (filter.priceCondition && filter.priceValue) {
      if (
        filter.priceCondition === 'greater' &&
        data.price <= parseFloat(filter.priceValue)
      ) {
        matches = false
      }
    }

     // Quantity filter
     if (filter.quantityCondition && filter.quantityValue) {
      if (
        filter.quantityCondition === 'greater' &&
        data.stock <= parseInt(filter.quantityValue)
      ) {
        matches = false
      }
    }

     // Date range filter
     if (startDate && endDate) {
      const rowDate = new Date(data.createdAt)
      if (rowDate < startDate || rowDate > endDate) {
        matches = false
      }
    }

    return matches
  })

  const sortedRows = filteredRows?.sort((a, b) => {
    const isNumericField = field => ['price', 'quantity'].includes(field)

    if (isNumericField(orderBy)) {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
    } else {
      return order === 'asc'
        ? a[orderBy]?.toString().localeCompare(b[orderBy].toString())
        : b[orderBy]?.toString().localeCompare(a[orderBy].toString())
    }
  })

  const paginatedRows = sortedRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )



  useEffect(() => {
    getProduct()
  }, [])

   // Handle opening the delete confirmation modal
   const openDeleteModal = id => {
    setDeleteProductId(id)
    setDeleteModalOpen(true)
  }

  // Handle closing the delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeleteProductId('')
    setEnteredProductId('')
    setError('')
  }


   // Handle deletion of the product
   const handleDelete = async () => {
    if (enteredProductId !== deleteProductId) {
      setError('Product ID does not match. Please enter the correct ID.')
      return
    }

    try {
      await api.delete(`/products/${deleteProductId}`, 
        {
          withCredentials: true
        })
      setProducts(products.filter(data => data._id !== deleteProductId))
      setDeleteModalOpen(false)
      setEnteredProductId('')
      setSnackbarMessage('Product deleted successfully.')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
    } catch (error) {
      setError('Failed to delete the product. Please try again.')
      setSnackbarMessage('Failed to delete the product.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }


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
          <Link to={'/vendor/setting'}>
            <Button variant='outlined' sx={{ mt: 2 }}>
              + New Address
            </Button>
          </Link>
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
  

      
      <Grid
        container
        alignItems='center'
        marginBottom={4}
        sx={{ backgroundColor: '#fff', p: 4, gap: 2 }}
      >
        {/* Responsive Search Bar */}
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={8} md={9} lg={10}>
            <TextField
              label='Search by Product Name'
              variant='outlined'
              fullWidth
              value={filter.text}
              onChange={e => handleFilterChange('text', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3} lg={2}>
            <Link to={'/vendor/products-info'}>
              <Button variant='contained' color='primary' fullWidth>
                Create
              </Button>
            </Link>
          </Grid>
        </Grid>

        {/* Responsive Filter Button */}
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          lg={2}
          container
          justifyContent='flex-start'
        >
          <Box
            sx={{
              color: 'blue',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={handleOpen}
          >
            <FilterListIcon sx={{ mr: 1  }} />
            <Typography variant='body2' sx={{ whiteSpace: 'nowrap', fontSize:"1.3rem" }}>
              Advanced Filter
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {error && (
        <Typography color='error' variant='body2' gutterBottom>
          {error}
        </Typography>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: 'none', // Remove the border
              outline: 'none', // Remove the outline
              boxShadow: 24,
              p: 4
            }}
          >
            {/* Close Button */}
            <Button
              onClick={handleClose}
              color='error'
              sx={{ position: 'absolute', top: 2, right: -8 }}
            >
              <IoCloseCircleOutline size={24} />
            </Button>

            {/* Price Condition */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Price Condition</InputLabel>
              <Select
                value={filter.priceCondition}
                onChange={e =>
                  handleFilterChange('priceCondition', e.target.value)
                }
                label='Price Condition'
              >
                <MenuItem value=''>None</MenuItem>
                <MenuItem value='greater'>Greater than</MenuItem>
              </Select>
              <TextField
                type='number'
                label='Price Value'
                variant='outlined'
                fullWidth
                value={filter.priceValue}
                onChange={e => handleFilterChange('priceValue', e.target.value)}
                sx={{ mt: 2 }}
              />
            </FormControl>

            {/* Quantity Condition */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Quantity Condition</InputLabel>
              <Select
                value={filter.quantityCondition}
                onChange={e =>
                  handleFilterChange('quantityCondition', e.target.value)
                }
                label='Quantity Condition'
              >
                <MenuItem value=''>None</MenuItem>
                <MenuItem value='greater'>Greater than</MenuItem>
              </Select>
              <TextField
                type='number'
                label='Quantity Value'
                variant='outlined'
                fullWidth
                value={filter.quantityValue}
                onChange={e =>
                  handleFilterChange('quantityValue', e.target.value)
                }
                sx={{ mt: 2 }}
              />
            </FormControl>

            {/* Date Filter */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label='Start Date'
                  value={startDate}
                  onChange={newDate => setStartDate(newDate)}
                  renderInput={params => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label='End Date'
                  value={endDate}
                  onChange={newDate => setEndDate(newDate)}
                  renderInput={params => <TextField {...params} fullWidth />}
                />
              </Box>
            </FormControl>

           
          </Box>
        </Modal>
      </LocalizationProvider>

       {/* Delete Confirmation Modal */}
       <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          {/* Close Button */}
          <Button
            onClick={closeDeleteModal}
            color='error'
            sx={{ position: 'absolute', top: 2, right: -8 }}
          >
            <IoCloseCircleOutline size={24} />
          </Button>

          <Typography variant='h6' gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography variant='body2' gutterBottom>
            Are you sure you want to delete this product with ID: {deleteProductId}? Please type the ID to confirm:
          </Typography>
          <TextField
            label='Enter Product ID'
            variant='outlined'
            fullWidth
            value={enteredProductId}
            onChange={e => setEnteredProductId(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='outlined' color='error' onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      <TableContainer component={Paper} mt={2}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell onClick={() => handleSort('id')}>
                <Typography fontWeight='bold'>Sr No.</Typography>
              </TableCell>
              <TableCell onClick={() => handleSort('id')}>
                <Typography fontWeight='bold'>ID</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight='bold'>Image</Typography>
              </TableCell>
              <TableCell onClick={() => handleSort('product')}>
                <Typography fontWeight='bold'>Product</Typography>
              </TableCell>
              <TableCell onClick={() => handleSort('price')}>
                <Typography fontWeight='bold'>Price</Typography>
              </TableCell>
            
              <TableCell onClick={() => handleSort('quantity')}>
                <Typography fontWeight='bold'>Quantity</Typography>
              </TableCell>
            
              <TableCell>
                <Typography fontWeight='bold'>Created At</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight='bold'>Operations</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((data, index) => (
              <TableRow
                key={data.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data?._id}</TableCell>
                <TableCell>
                {data.image && data.image.length > 0 ? (
                  <img src={data?.image[0]} alt={data.name} style={{ width: '50px', height: '50px' }} />
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
                <TableCell sx={{ cursor: 'pointer' }}>
               
                    {data?.name}
                 
                </TableCell>
                <TableCell>${data.price.toFixed(2)}</TableCell>
              
                <TableCell>{data.stock}</TableCell>
               
                <TableCell>
                {new Date(data.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </TableCell>
                <TableCell sx={{whiteSpace:"nowrap"}}>
                  <IconButton color='primary'>
                    <Link to={`/vendor/products-info/${data._id}`}>
                    <Edit />
                    </Link>
                   
                  </IconButton>
                  <IconButton
                    color='secondary'
                    onClick={() => openDeleteModal(data._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
       {/* Snackbar for notifications */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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

export default VendorProfiles
