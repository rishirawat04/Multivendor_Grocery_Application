import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableSortLabel,
  Divider,
  Chip,
  Card
} from '@mui/material'

import {
  MdShoppingCart,
  MdRateReview,
  MdProductionQuantityLimits
} from 'react-icons/md'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

import 'chart.js/auto'
import { DateRangePicker } from '@mui/x-date-pickers-pro'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import api from '../API/api'
import { Try } from '@mui/icons-material'

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

const data = [
  { name: 'Revenue', value: 6768 },
  { name: 'Fees', value: 2000 }
]

const COLORS = ['#FFBB28', '#FF8042', '#00C49F', '#0088FE', '#FF00FF']





const StatusChip = ({ status }) => {
  const color = status === 'Completed' ? 'success' : 'warning'
  return <Chip label={status} color={color} size='small' />
}

// Status Chip component
const StatusChip2 = ({ status }) => {
  let color;
  switch (status) {
    case 'Paid':
      color = 'success';
      break;
    case 'Pending':
      color = 'warning';
      break;
    case 'Failed':
      color = 'error';
      break;
    case 'Completed':
      color = 'primary';
      break;
    case 'Processing':
      color = 'info';
      break;
    case 'Shipped':
      color = 'secondary';
      break;
    default:
      color = 'default';
  }
  return <Chip label={status || 'Unknown'} color={color} />;
};



// Sample data
const initialLineData = {
  labels: [
    '08 Aug',
    '11 Aug',
    '14 Aug',
    '17 Aug',
    '20 Aug',
    '23 Aug',
    '26 Aug',
    '29 Aug',
    'Sep 04'
  ],
  datasets: [
    {
      label: 'Items Earning Sales',
      data: [0, 0, 0, 140357, 0, 0, 0, 0, 0],
      fill: true,
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: '#FFBB28',
      borderWidth: 2,
      tension: 0.4,
      pointStyle: 'circle',
      pointRadius: 5
    }
  ]
}





const VendorDashboard = ({ sidebarOpen }) => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('customer')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  
  const [searchQuery, setSearchQuery] = useState('');
  const [orders,  setOrders] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState([null, null])
  const [filteredLineData, setFilteredLineData] = useState(initialLineData)
  const [topProducts, setTopProducts] = useState([]); // State for storing product data
  const [searchId, setSearchId] = useState('');

  

  // dashboard states 
  const [orderData, setOrderData ] = useState()
  const [productData, setProductData ] = useState([])


  const getOrders = async() => {
         try {
          const response = await api.get('/vendor/orders', 
            {
              withCredentials: true
            }
            
          )
          // console.log(response.data);
          setOrders(response.data.orders || []);
          setOrderData(response.data)
          
         } catch (error) {
          console.log(error);
          
         }
  }


  const getProducts = async() => {
    try {
     const response = await api.get('/vendor/products', 
       {
         withCredentials: true
       }
       
     )
    // console.log("data",response.data);
     setProductData(response.data)
     
    } catch (error) {
     console.log(error);
     
    }
}




  useEffect(() => {
    // Function to filter data based on date range
    const filterDataByDateRange = () => {
      // Assuming `lineData` contains data to be filtered
      const [startDate, endDate] = selectedDateRange

      if (startDate && endDate) {
        // Implement your filtering logic here
        // For demonstration, we'll just use `initialLineData`
        setFilteredLineData(initialLineData)
      } else {
        setFilteredLineData(initialLineData)
      }
    }

    filterDataByDateRange()
  }, [selectedDateRange])






const cardData = [
  {
    title: 'Orders',
    value: orderData?.totalOrders,
    color: '#1abc9c',
    icon: <MdShoppingCart size={50} style={{ opacity: 0.2 }} />
  },
  {
    title: 'Products',
    value: productData?.length,
    color: '#3498db',
    icon: <MdProductionQuantityLimits size={50} style={{ opacity: 0.2 }} />
  },
  {
    title: 'Revenue',
    value: `$${orderData?.totalPaidRevenue + orderData?.totalPendingRevenue}`,
    color: '#1F618D',
    icon: <MdRateReview size={50} style={{ opacity: 0.2 }} />
  }
]


  // Sorting orders based on selected column
  const sortedOrders = orders.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  // Search logic: filter data based on the search query
  const filteredOrders = sortedOrders.filter(row => {
    const searchStr = searchQuery.toLowerCase();
    return (
      (row.orderId?.toString().includes(searchStr)) || // Check if the orderId matches
      (row.user?.name || '').toLowerCase().includes(searchStr) ||
      (row.paymentStatus || '').toLowerCase().includes(searchStr)
    );
  });

 


  const columns = [
    { id: 'sn', label: 'Sr No.' },
    { id: 'id', label: 'Product ID' },
    { id: 'name', label: 'Product Name' },
    { id: 'amount', label: 'Total Amount' },
    { id: 'status', label: 'Payment Status' },
    { id: 'createdAt', label: 'Last Sold' },
  ];

  // Fetch top selling products
  const getTopSellingProduct = async () => {
    try {
      const response = await api.get('vendor/top-products', { withCredentials: true });
      setTopProducts(response.data.topSellingProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopSellingProduct();
  }, []);

  // Handle search functionality
  const filteredData = topProducts.filter(product =>
    product.id.toString().includes(searchId) // Filter by product ID
  );

  // Sorting (if required)
  const handleRequestSort = (property) => {
    // Sorting logic here if needed
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };




useEffect(() => {
  getProducts()
  getOrders()
  getTopSellingProduct()
}, [])

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Cards */}
        {cardData.map((card, index) => (
          <Grid xs={12} sm={6} md={6} lg={4}
            item
            key={index}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              elevation={3}
              sx={{
                backgroundColor: card.color,
                px: 2,
                py:1,
                color: 'white',
               width: '250px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '@media (max-width: 600px)': {
                  width: '90vw', // Full viewport width on mobile
                  maxWidth: 'none' // Remove the max width constraint on mobile
                },
                '@media (min-width:900px)': {
                  width: '100vw', // Full viewport width on mobile
                  maxWidth: 'none' // Remove the max width constraint on mobile
                }
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
            </Card>
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
        {/* Line Chart */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Paper
            elevation={3}
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 70%', lg: '1 1 70%' },
              padding: '20px'
            }}
          >
            <Typography variant='h6' gutterBottom>
              Sales Reports
            </Typography>

            {/* Date Range Picker */}
            <DateRangePicker
              
              startText='Start'
              endText='End'
              value={selectedDateRange}
              onChange={newValue => setSelectedDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2  }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
            />

            <Box sx={{ height: '400px' }}>
              <Line
                data={filteredLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 160000
                    }
                  }
                }}
              />
            </Box>
            <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
              <span style={{ color: '#FFBB28' }}>●</span> Items Earning Sales:
              {`$${orderData?.totalPaidRevenue + orderData?.totalPendingRevenue}`}
            </Typography>
          </Paper>
        </LocalizationProvider>
        {/* Pie Chart */}
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
          <Typography variant='h5' gutterBottom>
            Earnings
          </Typography>
          <Typography variant='subtitle1' gutterBottom>
            Earnings in Last 30 days
          </Typography>

          <Box sx={{ height: "400px" }}>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={data}
                  cx='50%'
                  cy='50%'
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                EARNINGS
              </Typography>
              <Typography variant='h6' color='primary'>
                {`$${orderData?.totalPaidRevenue + orderData?.totalPendingRevenue}`}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                REVENUE
              </Typography>
              <Typography variant='h6'>{`$${orderData?.totalPaidRevenue + orderData?.totalPendingRevenue}`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                WITHDRAWALS
              </Typography>
              <Typography variant='h6' color='error'>
                $3,151.00
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                FEES
              </Typography>
              <Typography variant='h6'>$0.00</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

          {/* Orders Table */}
          <Paper elevation={3} sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom sx={{ p: 2 }}>
          Recent Payments
        </Typography>

        {/* Search Box */}
        <Box sx={{ px: 4 }}>
          <TextField
            fullWidth
            size='small'
            label='Search by Order ID or Customer Name'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
        </Box>

        <Divider sx={{ mt: 4 }} />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Sr No.</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.orderId || 'N/A'}>
                      
                    
                     <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.orderId || 'N/A'}</TableCell>
                    <TableCell>{row.user?.name || 'N/A'}</TableCell>
                    <TableCell>${row.totalPrice?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell><StatusChip2 status={row.paymentStatus} /></TableCell>
                    <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{row.deliveryAddress?.city || 'N/A'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Paper elevation={3} sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ p: 2 }}>
        Top Selling Product
      </Typography>
      <Box sx={{ px: 4 }}>
        <TextField
          fullWidth
          size='small'
          label='Search by Product ID'
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
      </Box>
      <Divider sx={{ mt: 4 }} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={false} // Adjust this if sorting is implemented
                    direction={'asc'} // Adjust this if sorting is implemented
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredData.length} // Count of filtered items
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </Box>
  )
}

export default VendorDashboard
