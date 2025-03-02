import React, { useEffect, useState } from 'react';
import {
  Box, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, InputAdornment,
  Button, IconButton, Paper
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../API/api';

function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get('/brands');
        setBrands(response.data);
      } catch (error) {
        console.error('Failed to fetch brands', error);
      }
    };
    fetchBrands();
  }, []);

  // Handle search
  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  // Handle delete brand
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/brands/${id}`);
      setBrands(brands.filter(brand => brand._id !== id));
    } catch (error) {
      console.error('Failed to delete brand', error);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter rows based on search input

  const filteredRows = brands.filter(row => 
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row._id.toString().toLowerCase().includes(search.toLowerCase())  // Check for ID match
  );

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py:4, px:2, backgroundColor: '#fff' }}>
      <TextField
          variant='outlined'
          size='small'
          placeholder='Search by brands name'
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Box>
          <Link to={'/admin/product-info/create'}>
            <Button variant='contained'>Create</Button>
          </Link>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Sr No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Is Featured</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row._id} style={{ backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Chip label={row.isFeatured ? 'Yes' : 'No'} color='success' />
                  </TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={row.status} color='success' />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <IconButton color='primary'>
                      <Link to={`/admin/product-info/${row._id}`}>
                        <Edit />
                      </Link>
                    </IconButton>
                    <IconButton color='error' onClick={() => handleDelete(row._id)}>
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
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default BrandsPage;
