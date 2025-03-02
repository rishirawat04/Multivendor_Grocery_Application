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



const CustomerPage = () => {
  const [Users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)


  // get vendors 
  const getVendorData = async () => {
    try {
      const response = await api.get('admin/users?role=User', {
        withCredentials: true,
      });
      console.log("data",response.data);
      
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVendorData();
  }, []);

   // Filter vendors based on search query
   const FilteredUsers = Users.filter((users) =>
    users.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
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
             
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {FilteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((users, index) => (
                <TableRow
                  key={users._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white',
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{users._id}</TableCell>
                  <TableCell>
                    {users.shopLogo ? (
                      <img
                        src={users.shopLogo}
                        alt={users.fullName}
                        width='40'
                        height='40'
                      />
                    ) : (
                      <Avatar>{users.fullName.charAt(0)}</Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/user-profile/${users._id}`}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                  
                          cursor: 'pointer',
                      
                        }}
                      >
                        {users.fullName}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{users.email}</TableCell>
                  <TableCell>{new Date(users.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant='contained' size='small' color='success'>
                      {users.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton color='primary'>
                      <Link to={`/admin/user-profile/${users._id}`}>
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
        count={FilteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default CustomerPage
