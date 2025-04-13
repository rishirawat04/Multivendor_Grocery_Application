import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import {
  MdShoppingCart,
  MdPeople,
  MdRateReview,
  MdProductionQuantityLimits
} from 'react-icons/md'
import IndiaMap from '../common/IndiaMap'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import api from '../API/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Updated working India GeoJson URL



const data = {
  labels: ['1 Day', '1 Week', '1 Month', '1 Year'],
  datasets: [
    {
      label: 'Product A Sales',
      data: [150, 1000, 5000, 30000], 
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)'
    },
    {
      label: 'Product B Sales',
      data: [100, 800, 4000, 25000], 
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)'
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  }
}

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('Today')
  const [vendorStartDate, setVendorStartDate] = useState(null)
  const [vendorEndDate, setVendorEndDate] = useState(null)
  const [vendorsData, setVendorsData] = useState([])
  const [productStartDate, setProductStartDate] = useState(null)
  const [productEndDate, setProductEndDate] = useState(null)
  const [orderValue, setOrderValue] = useState(null)
  const [productValue, setProductValue] = useState(null)
  const [customerValue, setCustomerValue] = useState(null)
  const [reviewValue, setReviewValue] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  

  ////////////////////////START////////////////////////////

  // get all the cards data
  const getOrdersDetails = async () => {
    try {
      const response = await api.get('/admin/orders', {
        withCredentials: true
      })
      console.log(response.data);
      
      setOrderValue(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProductDetails = async () => {
    try {
      const response = await api.get('/admin/products', {
        withCredentials: true
      })
      setProductValue(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCustomersDetails = async () => {
    try {
      const response = await api.get('admin/users-count', {
        withCredentials: true
      })
      setCustomerValue(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getReviewsDetails = async () => {
    try {
      const response = await api.get('/admin/reviews', {
        withCredentials: true
      })
      setReviewValue(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //////////// //END //////////////////

  // Fetch vendor report on date change
  const getVendorReport = async () => {
    try {
      const response = await api.get(
        `admin/vendor-report?startDate=${vendorStartDate}&endDate=${vendorEndDate}`,
        {
          withCredentials: true
        }
      )
      // console.log(response)
      setVendorsData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (vendorStartDate && vendorEndDate) {
      getVendorReport()
    }
  }, [vendorStartDate, vendorEndDate])

  // Function to fetch top-selling products
  const getTopProduct = async () => {
    try {
      const response = await api.get(
        `admin/top-product?startDate=${productStartDate}&endDate=${productEndDate}`,
        {
          withCredentials: true
        }
      )
      console.log(response)
      if (response.data.success) {
        setTopProducts(response.data.topProducts)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch top products when the component mounts or when dates change
  useEffect(() => {
    getTopProduct()
  }, [productStartDate, productEndDate]) // Call API on date change

  useEffect(() => {
    getOrdersDetails()
    getProductDetails()
    getCustomersDetails()
    getReviewsDetails()
  }, [])

  const cardData = [
    {
      title: 'Orders',
      value: orderValue?.totalOrders,
      color: '#1abc9c',
      icon: <MdShoppingCart size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Products',
      value: productValue?.totalCount,
      color: '#3498db',
      icon: <MdProductionQuantityLimits size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Customers',
      value: customerValue?.userCount,
      color: '#5DADE2',
      icon: <MdPeople size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Reviews',
      value: reviewValue?.totalReviews,
      color: '#1F618D',
      icon: <MdRateReview size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Total Revenue',
      value: orderValue?.totalRevenue ? `$${(orderValue.totalRevenue / 100).toFixed(2)}` : '$0.00',
      color: '#2E86C1',
      icon: <MdRateReview size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Paid Orders',
      value: orderValue?.totalPaidAmount ? `$${(orderValue.totalPaidAmount / 100).toFixed(2)}` : '$0.00',
      color: '#27AE60',
      icon: <MdShoppingCart size={50} style={{ opacity: 0.2 }} />
    },
    {
      title: 'Pending Payments',
      value: orderValue?.totalPendingAmount ? `$${(orderValue.totalPendingAmount / 100).toFixed(2)}` : '$0.00',
      color: '#F39C12',
      icon: <MdShoppingCart size={50} style={{ opacity: 0.2 }} />
    }
  ]

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid container spacing={4}>
        {/* Cards */}
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: card.color,
                padding: 2,
                color: 'white',
                height: '150px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant='h3' sx={{ fontWeight: 'bold' }}>
                  {card.value}
                </Typography>
              </Box>
              <Box sx={{ position: 'absolute', right: 10, bottom: 10 }}>
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Flexbox Layout for Site Analytics and Map */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          flexWrap: { xs: 'wrap', lg: 'nowrap' }
        }}
      >
        {/* Site Analytics */}
        <Paper
          elevation={3}
          sx={{
            flex: { xs: '1 1 100%', lg: '1 1 70%' },
            padding: '20px'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Sales Analytics
          </Typography>
          <Select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            sx={{ float: 'right', marginTop: '-40px' }}
          >
            <MenuItem value='1 Day'>1 Day</MenuItem>
            <MenuItem value='1 Week'>1 Week</MenuItem>
            <MenuItem value='1 Month'>1 Month</MenuItem>
            <MenuItem value='1 Year'>1 Year</MenuItem>
          </Select>
          <Line data={data} options={options} />
        </Paper>

        {/* India Map */}
        <Paper
          elevation={2}
          sx={{
            flex: { xs: '1 1 100%', lg: '1 1 30%' },
            padding: '20px',
            height: '600px'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Map of India (Usage Distribution)
          </Typography>
          <IndiaMap />
        </Paper>
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
              <Typography variant='subtitle1'>Sessions</Typography>
              <Typography variant='h5'>316</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
              <Typography variant='subtitle1'>Visitors</Typography>
              <Typography variant='h5'>270</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
              <Typography variant='subtitle1'>Pageviews</Typography>
              <Typography variant='h5'>1,240</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: '20px' }}>
              <Typography variant='subtitle1' sx={{ whiteSpace: 'nowrap' }}>
                Bounce Rate
              </Typography>
              <Typography variant='h5'>63%</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            py: 2,
            mt: 2
          }}
        >
          {/* Top Vendors Table */}
          <Box sx={{ flex: 1, px: 1, bgcolor: '#fff' }}>
            <Typography variant='h6' gutterBottom>
              Top Vendors
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label='Start Date'
                value={vendorStartDate}
                onChange={newValue => setVendorStartDate(newValue)}
                renderInput={params => <TextField {...params} size='small' />}
              />
              <DatePicker
                label='End Date'
                value={vendorEndDate}
                onChange={newValue => setVendorEndDate(newValue)}
                renderInput={params => <TextField {...params} size='small' />}
              />
            </Box>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell align='right'>Products Sold</TableCell>
                    <TableCell align='right'>Total Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendorsData.length > 0 ? (
                    vendorsData.map((vendor, index) => (
                      <TableRow
                        key={vendor._id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {vendor.vendorName}
                        </TableCell>
                        <TableCell align='center'>
                          {vendor.totalProductsSold}
                        </TableCell>
                        <TableCell align='center'>
                          ${vendor.totalRevenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align='center'>
                        No data available for the selected date range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Top Products Table */}
          <Box sx={{ flex: 1, px: 1, bgcolor: '#fff' }}>
            <Typography variant='h6' gutterBottom>
              Top 10 Selling Products
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <DatePicker
                label='Start Date'
                value={productStartDate}
                onChange={newValue => setProductStartDate(newValue)}
                renderInput={params => <TextField {...params} size='small' />}
              />
              <DatePicker
                label='End Date'
                value={productEndDate}
                onChange={newValue => setProductEndDate(newValue)}
                renderInput={params => <TextField {...params} size='small' />}
              />
            </Box>
            <TableContainer component={Paper}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align='left'>Units Sold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.length > 0 ? 
                  ( topProducts.map((product, index) => (
                    <TableRow
                      key={product.productId}
                      style={{
                        backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                      }}
                    >
                      <TableCell component='th' scope='row'>
                        {product.name}
                      </TableCell>
                      <TableCell align='left'>{product.totalSold}</TableCell>
                    </TableRow>
                  ))): (
                    <TableRow>
                      <TableCell colSpan={3} align='center'>
                        No data available for the selected date range
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </LocalizationProvider>
    </Box>
  )
}

export default AdminDashboard
