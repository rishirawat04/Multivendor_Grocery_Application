import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography,
  Chip,
  TablePagination,
  TableContainer
} from '@mui/material';
import api from '../API/api';

// Payment and Status Chips
const getStatusChip = (status) => {
  const color = status === 'Paid' ? 'success' : 'warning';
  return <Chip label={status} color={color} />;
};

const getPaymentStatusChip = (status) => {
  const color = status === 'Paid' ? 'success' : status === 'Pending' ? 'warning' : 'error';
  return <Chip label={status} color={color} />;
};

const VendorOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({
    field: '',
    value: '',
    paymentStatus: '',
    amountCondition: '',
    amount: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get orders API
  const getOrderData = async () => {
    try {
      const response = await api.get('/vendor/orders', { withCredentials: true });
      console.log(response.data);
      
      setOrders(response.data.orders); // Store the API data in state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderData(); // Fetch order data on component mount
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Get the filtered rows for the current page
  const filteredOrders = orders
    .filter((order) => {
      let valid = true;

      // Filter by field (Name, Email)
      if (filter.field === 'name' && filter.value && !order.user.fullName.toLowerCase().includes(filter.value.toLowerCase())) {
        valid = false;
      }
      if (filter.field === 'email' && filter.value && !order.user.email.toLowerCase().includes(filter.value.toLowerCase())) {
        valid = false;
      }

      // Filter by Payment Status
      if (filter.paymentStatus && order.paymentStatus !== filter.paymentStatus) {
        valid = false;
      }

      // Filter by Amount Condition
      if (filter.amountCondition === 'greater' && order.totalPrice <= parseFloat(filter.amount)) {
        valid = false;
      }
      if (filter.amountCondition === 'less' && order.totalPrice >= parseFloat(filter.amount)) {
        valid = false;
      }

      // Filter by Exact Amount if no condition
      if (!filter.amountCondition && filter.amount && order.totalPrice !== parseFloat(filter.amount)) {
        valid = false;
      }

      return valid;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      {/* Filter Box */}
      <Box mb={4} p={3} sx={{ borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h6" mb={2}>Filters</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Select field</InputLabel>
              <Select
                name="field"
                value={filter.field}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name="value"
              value={filter.value}
              onChange={handleFilterChange}
              fullWidth
              label="Value"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={filter.paymentStatus}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Amount Condition</InputLabel>
              <Select
                name="amountCondition"
                value={filter.amountCondition}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="greater">Greater than</MenuItem>
                <MenuItem value="less">Less than</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name="amount"
              value={filter.amount}
              onChange={handleFilterChange}
              fullWidth
              label="Amount"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button variant="contained" fullWidth sx={{py:1.8}}>Apply</Button>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} mt={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">SR No.</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Order ID</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Email</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Amount</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Payment Method</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Payment Status</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Order Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={order._id} style={{ backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white' }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{getPaymentStatusChip(order.paymentStatus)}</TableCell>
                <TableCell>{getStatusChip(order.paymentStatus)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Records per page"
        labelDisplayedRows={({ from, to, count }) => `Showing from ${from} to ${to} of ${count}`}
      />
    </Box>
  );
};

export default VendorOrder;
