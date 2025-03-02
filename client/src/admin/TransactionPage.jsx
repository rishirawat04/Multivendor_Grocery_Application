import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  Button
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import api from '../API/api'

const TransactionsPage = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [transactions, setTransactions] = useState([])

  // Fetch transactions from API
  const getTransactions = async () => {
    try {
      const response = await api.get('admin/orders', { withCredentials: true })
      const fetchedTransactions = response.data.orders.map((order) => ({
        id: order._id,
        chargeId: order.razorpayOrderId || 'N/A',
        payerName: order.user?.fullName || 'N/A',
        amount: `$${(order.totalPrice / 100).toFixed(2)} USD` || 'N/A',
        paymentChannel: order.paymentMethod || 'N/A',
        status: order.paymentStatus || 'N/A',
        createdAt: new Date(order.createdAt).toLocaleDateString()
      }))
      setTransactions(fetchedTransactions)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [])

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <>
      {/* Search Bar */}
      <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2, backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: 2 }}>
        <TextField placeholder="Search by Payer Name" variant="outlined" size="small" sx={{ width: 400 }} />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Sr No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Charge ID</TableCell>
              <TableCell>Payer Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Channel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
              <TableRow key={transaction.id} style={{ backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.chargeId}</TableCell>
                <TableCell>{transaction.payerName}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.paymentChannel}</TableCell>
                <TableCell>
                  <Button variant="contained" size="small" color={transaction.status === 'Paid' ? 'success' : 'warning'}>
                    {transaction.status}
                  </Button>
                </TableCell>
                <TableCell>{transaction.createdAt}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton color="primary"><EditIcon /></IconButton>
                  <IconButton color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={transactions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default TransactionsPage
