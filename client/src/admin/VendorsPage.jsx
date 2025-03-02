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
  Typography,
  Button,
  Avatar
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import api from '../API/api'

// Dummy data
const rows = [
  {
    id: 9,
    name: 'Amie Wiza PhD',
    email: 'delia27@example.com',
    createdAt: '2024-07-22',
    status: 'Activated',
    store: "Robert's Store"
  },
  {
    id: 6,
    name: 'Miss Magdalena Hoeger Jr.',
    email: 'electa73@example.net',
    createdAt: '2024-07-22',
    status: 'Activated',
    store: 'Global Store'
  },
  {
    id: 4,
    name: 'Garland Kautzer',
    email: 'josinski@example.net',
    createdAt: '2024-07-22',
    status: 'Activated',
    store: 'Young Shop'
  },
  {
    id: 3,
    name: 'Dr. Marquis Schmeler',
    email: 'nwill@example.net',
    createdAt: '2024-07-22',
    status: 'Activated',
    store: 'Global Office'
  },
  {
    id: 2,
    name: 'Mae West',
    email: 'vendor@botble.com',
    createdAt: '2024-07-22',
    status: 'Activated',
    store: 'GoPro'
  }
]

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)


  // get vendors 
  const getVendorData = async () => {
    try {
      const response = await api.get('admin/users?role=Vendor', {
        withCredentials: true,
      });
      console.log("data",response.data);
      
      setVendors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVendorData();
  }, []);

   // Filter vendors based on search query
   const filteredVendors = vendors.filter((vendor) =>
    vendor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  return (
    <>
      {/* Search Bar */}
      <Box
        sx={{
          py: { xs: 1, sm: 2 },
          mt: 2,
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          px: 2
        }}
      >
        <TextField
          placeholder='Search by name'
          variant='outlined'
          size='small'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 400 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vendor, index) => (
                <TableRow
                  key={vendor._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white',
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{vendor._id}</TableCell>
                  <TableCell>
                    {vendor.shopLogo ? (
                      <img
                        src={vendor.shopLogo}
                        alt={vendor.fullName}
                        width='40'
                        height='40'
                      />
                    ) : (
                      <Avatar>{vendor.fullName.charAt(0)}</Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/vendor-profile/${vendor._id}`}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                       
                          cursor: 'pointer',
                         
                        }}
                      >
                        {vendor.fullName}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant='contained' size='small' color='success'>
                      {vendor.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {vendor.shopName}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton color='primary'>
                      <Link to={`/admin/vendor-profile/${vendor._id}`}>
                        <EditIcon />
                      </Link>
                    </IconButton>
                    <IconButton color='error'>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component='div'
        count={filteredVendors.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default VendorsPage
