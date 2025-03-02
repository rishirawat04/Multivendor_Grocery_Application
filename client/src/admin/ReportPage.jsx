import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
  TableRow
} from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import StorageIcon from '@mui/icons-material/Storage'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableSortLabel,
  TextField,
  Chip,
  Divider
} from '@mui/material'

import { Line } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import api from '../API/api'

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const columns = [
  { id: 'sr no.', label: 'Sr No.' },
  { id: 'id', label: 'Order #' },
  { id: 'customer', label: 'Customer' },
  { id: 'amount', label: 'Amount' },
  { id: 'paymentStatus', label: 'Payment Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'address', label: 'Delivery Address' },
  { id: 'store', label: 'Store' }
]

// Line Chart Data
const lineData = {
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
      data: [0, 0, 0, 0, 0, 0, 0, 0, 140357],
      fill: true,
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: '#FFBB28',
      borderWidth: 2,
      tension: 0.4, // This smoothens the curve while retaining a sharp peak
      pointStyle: 'circle',
      pointRadius: 5
    }
  ]
}



const ReportPage = () => {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [orderBy, setOrderBy] = useState('createdAt')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // store api date in useStates

  const [revenue, setRevenue] = useState()
  const [customerValue, setCustomerValue] = useState()
  const [pieData, setPieData] = useState({
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Total Earnings',
        data: [0, 0], // Default values
        backgroundColor: ['#00C49F', '#FF6384'], // Matching green and red
        hoverOffset: 4
      }
    ]
  });


  // ////////////////Get the  API for cards////////////////

  // get the total revenue and orders
  const getTotalRevenue = async () => {
    try {
      const response = await api.get('admin/total-profit', {
        withCredentials: true
      })

      setRevenue(response.data.overallStats)
    } catch (error) {
      console.log(error)
    }
  }

  //  get the vendor and customers count
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

  // get recent orders
  const getOrderData = async () => {
    try {
      const response = await api.get('admin/orders', { withCredentials: true })
      

      setOrders(response.data.orders) // Store the API data in state
      calculatePieData(response.data.orders);
    } catch (error) {
      console.log(error)
    }
  }

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredOrders = orders.filter(
    order =>
      order?._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     
      order.deliveryAddress.city
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  const sortedData = filteredOrders.sort((a, b) => {
    const isAsc = order === 'asc'
    if (orderBy === 'totalPrice') {
      return isAsc ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
    } else {
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy])
    }
  })

  const paginatedOrders = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    getTotalRevenue()
    getCustomersDetails()
    getOrderData()
  }, [])

  const statsData = [
    {
      label: 'Revenue',
      value: revenue?.totalRevenue,
      change: `+ ${revenue?.totalProfitLoss}`,
      changeType: 'increase',
      icon: <MonetizationOnIcon fontSize='large' style={{ color: '#f06292' }} />
    },
    {
      label: 'Vendors',
      value: customerValue?.vendorCount,
      change: '-49',
      changeType: 'decrease',
      icon: <StorageIcon fontSize='large' style={{ color: '#42a5f5' }} />
    },
    {
      label: 'Customers',
      value: customerValue?.userCount,
      change: '-10',
      changeType: 'decrease',
      icon: <PeopleIcon fontSize='large' style={{ color: '#66bb6a' }} />
    },
    {
      label: 'Orders',
      value: revenue?.totalOrders,
      change: '+33',
      changeType: 'increase',
      icon: <ShoppingCartIcon fontSize='large' style={{ color: '#ffb74d' }} />
    }
  ]

  const getPaymentStatusChip = (status) => {
    const color = status === 'Paid' ? 'success' : status === 'Pending' ? 'warning' : 'error';
    return <Chip label={status} color={color} />;
  };


   // Function to calculate the Pie Chart data based on the orders
  const calculatePieData = (orders) => {
    let completed = 0;
    let pending = 0;

    // Loop through orders to count paymentStatus
    orders.forEach((order) => {
      console.log(orders);
      
      if (order.paymentStatus === 'Paid') {
        console.log("completed",order.totalPrice);
        
        completed += order.totalPrice; // Sum the totalPrice for completed orders
      } else if (order.paymentStatus === 'Pending') {
        console.log("incomplete",order.totalPrice);
        pending += order.totalPrice; // Sum the totalPrice for pending orders
      }
    });

    // Update Pie Chart data
    setPieData({
      labels: [ 'Completed','Pending' ],
      datasets: [
        {
          label: 'Total Earnings',
          data: [completed, pending], // Update with calculated data
          backgroundColor: ['#00C49F', '#FF6384',], // Green for completed, red for pending
          hoverOffset: 4
        }
      ]
    });
  };

  

  
  const totalPaidSales = orders
  .filter(order => order.paymentStatus === 'Paid')  // Filter only Paid orders
  .reduce((acc, order) => acc + order.totalPrice, 0);  // Sum the totalPrice of Paid orders


  



  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid container spacing={2}>
        {statsData.map((stat, index) => (
          <Grid
            item
            xs={12} // Full width on extra small screens
            sm={6} // 50% width on small screens
            md={6} // 50% width on medium screens
            lg={3} // 25% width on large screens
            key={index}
          >
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' } // Stack on small screens
              }}
            >
              <Box sx={{ padding: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                {stat.icon}
              </Box>
              <CardContent>
                <Typography variant='h6' component='div'>
                  {stat.label}
                </Typography>
                <Typography variant='h5' component='div'>
                  {stat.value}
                </Typography>
                <Typography
                  color={stat.changeType === 'increase' ? 'green' : 'red'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {stat.changeType === 'increase' ? (
                    <TrendingUp fontSize='small' />
                  ) : (
                    <TrendingDown fontSize='small' />
                  )}
                  {stat.change}{' '}
                  {stat.changeType === 'increase' ? 'increase' : 'decrease'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          flexWrap: { xs: 'wrap', lg: 'nowrap' }
        }}
      >
        {/* Line Chart */}
        <Paper
          elevation={3}
          sx={{
            flex: { xs: '1 1 100%', lg: '1 1 70%' },
            padding: '20px'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Sales Reports
          </Typography>
          <Box sx={{ height: '400px' }}>
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 160000 // Set max to show spike correctly
                  }
                }
              }}
            />
          </Box>
          <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
            <span style={{ color: '#FFBB28' }}>●</span> Items Earning Sales:
            ${totalPaidSales.toFixed(2)}
          </Typography>
        </Paper>

        {/* Pie Chart */}
        <Paper
          elevation={2}
          sx={{
            flex: { xs: '1 1 100%', lg: '1 1 30%' },
            padding: '20px',
            height: '600px'
          }}
        >
          <Typography variant='h6' gutterBottom>
            Total Earnings
          </Typography>
          <Box sx={{ height: '380px' }}>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' // Legend on the right to match your layout
                  }
                }
              }}
            />
          </Box>
          <Typography variant='h5' align='center'>
          ${totalPaidSales.toFixed(2)}
          </Typography>
          <Typography variant='body2' color='textSecondary' align='center'>
            Total Earnings
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom sx={{ p: 2 }}>
          Recent Orders
        </Typography>

        <Box sx={{ px: 4 }}>
          <TextField
            fullWidth
            size='small'
            label='Search'
            sx={{ marginBottom: '20px' }}
            value={searchQuery}
            onChange={handleSearchChange}
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
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrders.map((row, index) => (
                <TableRow
                  key={row._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.user.fullName}</TableCell>
                  <TableCell>{row.totalPrice}</TableCell>
                  <TableCell>{getPaymentStatusChip(row.paymentStatus)}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.deliveryAddress.city}</TableCell>
                  <TableCell>
                    {/* Loop through the products array and extract vendorShop */}
                    {row?.products?.map((item, index) => (
                      <span key={index}>
                        {item?.product?.vendorShop}
                     
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={event =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </Paper>
    </Box>
  )
}

export default ReportPage
