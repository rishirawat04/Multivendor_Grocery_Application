import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  IconButton,
  FormControl,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Chip
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import api from '../../API/api'

const CategoriesTable = () => {
  const { subcategoryName } = useParams()

  const [rows, setRows] = useState([])
  const [categoryData, setCategoryData] = useState([]) // Added categoryData state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filter, setFilter] = useState({
    text: '',
    category: '',
    subcategory: '',
    stockStatus: ''
  })
  const [subcategories, setSubcategories] = useState([])

  const getCategoryProduct = async () => {
    try {
      const response = await api.get(`/products/category/${subcategoryName}`, {
        withCredentials: true
      })
      //console.log(response.data)

      const products = response.data.map(product => ({
        id: product._id,
        image: product.image[0], // Taking the first image
        product: product.name,
        category: product.category.name,
        subcategory: product.subcategory.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        stockStatus: product.stock > 0 ? 'In Stock' : 'Out of Stock',
        quantity: product.stock
      }))
      setRows(products)
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch categories data
  const getCategories = async () => {
    try {
      const response = await api.get('/category', {
        withCredentials: true
      })
     // console.log(response.data)

      setCategoryData(response.data) // Assuming the response contains an array of categories
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // Fetch products and categories when component mounts
    getCategoryProduct()
    getCategories()
  }, [subcategoryName])

  useEffect(() => {
    // Update subcategories when category changes
    const selectedCategory = categoryData.find(
      cat => cat.name === filter.category
    )
    setSubcategories(selectedCategory ? selectedCategory.subcategories : [])
  }, [filter.category, categoryData])

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value })
  }

  const filteredRows = rows.filter(row => {
    let matches = true

    // Product name filter
    if (
      filter.text &&
      !row.product.toLowerCase().includes(filter.text.toLowerCase())
    ) {
      matches = false
    }

    // Category filter
    if (filter.category && row.category !== filter.category) {
      matches = false
    }

    // Subcategory filter
    if (filter.subcategory && row.subcategory !== filter.subcategory) {
      matches = false
    }

    return matches
  })

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleDelete = id => {
    setRows(rows.filter(row => row.id !== id))
  }

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Grid
        container
        alignItems='center'
        marginBottom={4}
        sx={{ backgroundColor: '#fff', p: 4, gap: 2 }}
      >
        {/* Responsive Search Bar */}
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label='Search by Product Name'
              variant='outlined'
              fullWidth
              value={filter.text}
              onChange={e => handleFilterChange('text', e.target.value)}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filter.category}
                onChange={e => handleFilterChange('category', e.target.value)}
                label='Category'
              >
                <MenuItem value=''>All Categories</MenuItem>
                {categoryData.map(category => (
                  <MenuItem key={category._id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Subcategory Filter */}
          {filter.category && (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={filter.subcategory}
                  onChange={e =>
                    handleFilterChange('subcategory', e.target.value)
                  }
                  label='Subcategory'
                >
                  <MenuItem value=''>All Subcategories</MenuItem>
                  {subcategories.map(subcat => (
                    <MenuItem key={subcat._id} value={subcat.name}>
                      {subcat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} mt={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Status</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <img
                    src={row.image}
                    alt={row.product}
                    style={{ width: '50px', height: '50px' }}
                  />
                </TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.subcategory}</TableCell>
                <TableCell>${row.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.stockStatus}
                    color={row.stockStatus === 'In Stock' ? 'success' : 'error'}
                    variant='outlined'
                  />
                </TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton color='primary'>
                    <Link to={`/admin/product-info/${row.id}`}>
                      <Edit />
                    </Link>
                  </IconButton>
                  <IconButton
                    color='secondary'
                    onClick={() => handleDelete(row.id)}
                  >
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
        component='div'
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={event =>
          setRowsPerPage(parseInt(event.target.value, 10))
        }
      />
    </Box>
  )
}

export default CategoriesTable
