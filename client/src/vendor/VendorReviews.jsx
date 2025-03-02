import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Box, TablePagination,
  Paper,
  Chip
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import api from '../API/api';

const VendorReview = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch reviews from the API
  const getReviewData = async () => {
    try {
      const response = await api.get('/vendor/reviews', {
        withCredentials: true
      });
      console.log(response.data);
      
      if (response.data.success) {
        setReviewsData(response.data.reviews);
        setTotalReviews(response.data.totalReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    getReviewData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter reviews based on the search term
  const filteredReviews = reviewsData.filter((review) =>
    review.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate displayed reviews
  const displayedReviews = filteredReviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Box sx={{ p: 4, backgroundColor: 'white' }}>
        <TextField
          label="Search by User Email"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          margin="normal"
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Sr No</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedReviews.map((review, index) => (
              <TableRow key={review._id} style={{ backgroundColor: review._id % 2 === 0 ? '#f6f8fb' : 'white' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{review._id}</TableCell>
                <TableCell>{review.product}</TableCell>
                <TableCell>{review.user.email}</TableCell>
                <TableCell>
                  <Rating name="read-only" value={review.rating} readOnly />
                </TableCell>
                <TableCell>{review.comment}</TableCell>
              <TableCell>
              <Chip
                    label={review.status || 'Published'}
                    color={review.status === 'Pending' ? 'warning' : 'success'}
                  />
              </TableCell>
                <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton aria-label="view">
                    <Visibility />
                  </IconButton>
                  <IconButton aria-label="delete" color="error">
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
        component="div"
        count={totalReviews}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

export default VendorReview;
