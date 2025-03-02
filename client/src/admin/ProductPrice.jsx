import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, IconButton, InputAdornment, Box, Button, TablePagination, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Search, Save } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../API/api';

const ProductPrice = () => {
  const [products, setProducts] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to fetch products from the API
  const getProduct = async () => {
    try {
      const response = await api.get(`/products`);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update product data in the backend
  const updateProduct = async (id, price, discountedPrice) => {
    try {
      await api.put(`/products/${id}`, { price, discountedPrice }, { withCredentials: true });
      setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
      setEditingRow(null); // Close editing mode
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update product', severity: 'error' });
      console.log(error);
    }
  };

  // Handle saving a product row after editing
  const handleSaveRow = (id) => {
    const product = products.find((p) => p._id === id);
    updateProduct(id, product.price, product.discountedPrice);
  };

  // Handle deleting a product row
  const handleDeleteRow = (id) => {
    setProducts((prev) => prev.filter((row) => row._id !== id));
    // You can also call an API to delete the product here.
  };

  // Handle search query input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Handle page change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle input changes for price and discount price
  const handleInputChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const filteredProducts = products.filter((product) =>
    product?._id.toLowerCase().includes(searchQuery)
    );

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      {/* Search and Add New Button */}
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff' }}>
        <TextField
          fullWidth
          label="Search by product name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" sx={{ whiteSpace: 'nowrap', px: 6, ml: 4 }}>
          <Link to="/admin/product-add" style={{ textDecoration: 'none', color: 'inherit' }}>
            Add New Product
          </Link>
        </Button>
      </Box>

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row._id} style={{ backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white' }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row._id}</TableCell>
                <TableCell><img src={row?.image} alt={row?.name} width={50} /></TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <TextField
                    value={row.price}
                    onChange={(e) => handleInputChange(row._id, 'price', e.target.value)}
                    disabled={editingRow !== row._id}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.discountedPrice}
                    onChange={(e) => handleInputChange(row._id, 'discountedPrice', e.target.value)}
                    disabled={editingRow !== row._id}
                  />
                </TableCell>
                <TableCell>
                  {editingRow === row._id ? (
                    <IconButton color="primary" onClick={() => handleSaveRow(row._id)}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton color="primary" onClick={() => setEditingRow(row._id)}>
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton color="secondary" onClick={() => handleDeleteRow(row._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductPrice;
