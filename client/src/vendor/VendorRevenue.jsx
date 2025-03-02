import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Paper, TextField, Divider,
  TableContainer, Table, TableHead, TableRow, TableCell, Chip,
  TableBody, TablePagination
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon
} from '@mui/icons-material';
import api from '../API/api';

// Status Chip component
const StatusChip = ({ status }) => {
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

const VendorRevenue = () => {
  const [orderBy, setOrderBy] = useState('orderId');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [orderData, setOrderData] = useState({
    totalPaidRevenue: 0,
    totalPendingRevenue: 0,
  });

  // Get orders API
  const getOrderData = async () => {
    try {
      const response = await api.get('/vendor/orders', { withCredentials: true });
      setOrders(response.data.orders || []); // Ensure orders is an array
      setOrderData({
        totalPaidRevenue: response.data.totalPaidRevenue || 0,
        totalPendingRevenue: response.data.totalPendingRevenue || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Sorting logic
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  // Pagination logic
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getOrderData();
  }, []);

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      {/* Revenue Summary */}
      <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Total Revenue */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '50%',
                  marginRight: '1rem',
                }}
              >
                <AttachMoneyIcon style={{ fontSize: '2rem' }} />
              </Box>
              <Box>
                <Typography variant='h6' color='textSecondary'>
                  Total Revenue
                </Typography>
                <Typography variant='h5'>
                  ${orderData.totalPaidRevenue + orderData.totalPendingRevenue || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Paid Amount */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: '#388e3c',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '50%',
                  marginRight: '1rem',
                }}
              >
                <TrendingUpIcon style={{ fontSize: '2rem' }} />
              </Box>
              <Box>
                <Typography variant='h6' color='textSecondary'>
                  Paid Amount
                </Typography>
                <Typography variant='h5'>
                  ${orderData.totalPaidRevenue || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Revenue */}
        <Grid item xs={12} md={8} lg={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: '#f57c00',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '50%',
                  marginRight: '1rem',
                }}
              >
                <StarIcon style={{ fontSize: '2rem' }} />
              </Box>
              <Box>
                <Typography variant='h6' color='textSecondary'>
                  Pending Revenue
                </Typography>
                <Typography variant='h5'>
                  ${orderData.totalPendingRevenue || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                .map(row => (
                  <TableRow key={row.orderId || 'N/A'}>
                    <TableCell>{row.orderId || 'N/A'}</TableCell>
                    <TableCell>{row.user?.name || 'N/A'}</TableCell>
                    <TableCell>${row.totalPrice?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell><StatusChip status={row.paymentStatus} /></TableCell>
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
    </Box>
  );
};

export default VendorRevenue;
