import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Typography,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  CircularProgress,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  Close,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../API/api'
import axios from 'axios'
import uploadImageToCloudinary from '../../cloudinary/cloudinary'



const CategoryPage = () => {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    imgUrl: ''
  })
  const [itemType, setItemType] = useState('category') // Default to 'category'
  const [newSubcategory, setNewSubcategory] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [page, setPage] = useState(0) // For pagination
  const [rowsPerPage, setRowsPerPage] = useState(5) // Default rows per page
  const [isCreatingCategory, setIsCreatingCategory] = useState(true) // true = Category, false = Subcategory
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarType, setSnackbarType] = useState('success') // 'success' or 'error'

  // State to manage confirmation modal
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState(null) // Store category id for deletion

  const navigate = useNavigate()

  // State to handle the image file
  const [imageFile, setImageFile] = useState(null)

  // Handle image file change
  const handleImageChange = e => {
    setImageFile(e.target.files[0]) // Store the selected image file in state
  }


  //////////////API INTEGRATION FOR CATEGORIES///////////////////

  const createCategory = async () => {
    try {
      // First, upload the image to Cloudinary
      const imageUrl = imageFile
        ? await uploadImageToCloudinary(imageFile)
        : null

      // Then, make the API request to create the category
      const response = await api.post(
        '/category',
        {
          name: newCategory.name,
          imageUrl // Send the Cloudinary image URL to your backend
        },
        {
          withCredentials: true
        }
      )

      return response.data // Return server response
    } catch (error) {
      throw (
        error.response?.data?.message ||
        'An error occurred while creating the category'
      ) // Catch server-side error message
    }
  }

  const getAllCategory = async categoryId => {
    try {
      const response = await api.get(`/category`, {
        withCredentials: true
      })

      setCategories(response?.data)
    } catch (error) {
      console.log(error)
    }
  }

  //////////////API INTEGRATION FOR SUBCATEGORIES///////////////////

  const createSubCategory = async () => {
    try {
      console.log(newSubcategory, 'catID', selectedCategory)

      // Then, make the API request to create the subcategory
      const response = await api.post(
        '/subCategory',
        {
          name: newSubcategory,
          category: selectedCategory // Assuming selectedCategory is stored somewhere in state
        },
        {
          withCredentials: true
        }
      )

      return response.data
    } catch (error) {
      throw (
        error.response?.data?.message ||
        ' An error occurred while creating the subcategory!!'
      ) // Catch server-side error message
    }
  }

  const handleSaveCategory = async () => {
    setLoading(true)
    try {
      let responseMessage = ''

      if (isCreatingCategory) {
        const response = await createCategory()
        responseMessage = response.message || 'Category created successfully!'
      } else {
        if (!selectedCategory) {
          throw 'Please select a category for the subcategory.'
        }
        const response = await createSubCategory()
        responseMessage =
          response.message || 'Subcategory created successfully!'
      }

      setSnackbarType('success')
      setSnackbarMessage(responseMessage)
      handleCloseModal()
    } catch (error) {
      setSnackbarType('error')
      setSnackbarMessage(error)
    } finally {
      setLoading(false)
      setSnackbarOpen(true) // Show snackbar regardless of success or failure
    }
  }

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle opening the modal
  const handleOpenModal = itemType => {
    setModalMode(itemType)
    setIsCreatingCategory(itemType === 'category')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewCategory({ name: '' })
    setNewSubcategory('')
    setSelectedCategory('')
  }

  const handleOpenConfirmDelete = category => {
    setCategoryToDelete(category)
    setConfirmDeleteOpen(true)
  }

  // Function to handle deletion
  const handleDelete = async () => {
    if (confirmName === categoryToDelete.name) {
      try {
        const response = await api.delete(`/category/${categoryToDelete._id}`, {
          withCredentials: true
        })
        console.log(response.data)

        setSnackbarMessage(
          response?.data?.message || 'Category deleted successfully!'
        ) // Use message from response
        setSnackbarType('success')
      } catch (error) {
        console.error(error)
        setSnackbarMessage(
          error.response?.data?.message ||
            'Error occurred while deleting the category.'
        ) // Use error message from response
        setSnackbarType('error')
      } finally {
        setConfirmDeleteOpen(false)
        setSnackbarOpen(true) // Show snackbar message
      }
    } else {
      alert('Please type the category name correctly to confirm deletion.')
    }
  }

  const handleSubcategoryClick = subcategoryName => {
    navigate(`/admin/products/subcategory/${subcategoryName}`)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, mt: 2 }}>
      <Box sx={{ p: 4, backgroundColor: '#fff', mb: 2 }}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search categories or subcategories'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl variant='outlined' sx={{ mb: 2, minWidth: 120 }}>
          <InputLabel>Select Type</InputLabel>
          <Select
            value={itemType}
            onChange={e => setItemType(e.target.value)}
            label='Select Type'
          >
            <MenuItem value='category'>Category</MenuItem>
            <MenuItem value='subcategory'>Subcategory</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant='contained'
          color='primary'
          startIcon={<Add />}
          onClick={() => handleOpenModal(itemType)}
          sx={{ ml: 2, py: 1.8 }}
        >
          Create {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Subcategories Count</TableCell>
              <TableCell>Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate
              ?.map((category, index) => (
                <React.Fragment key={category.id}>
                  <TableRow
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f6f8fb' : 'white'
                    }}
                  >
                    <TableCell
                      onClick={() => handleSubcategoryClick(category?._id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {category?.name}
                    </TableCell>
                    <TableCell>
                      {category?.subcategoryCount}
                      <IconButton
                        onClick={() =>
                          setExpandedCategory(
                            expandedCategory === category?._id
                              ? null
                              : category._id
                          )
                        }
                      >
                        {expandedCategory === category._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Link to={`/admin/product-info/${category}`}>
                        <IconButton color='primary'>
                          <Edit />
                        </IconButton>
                      </Link>
                      <IconButton
                        color='error'
                        onClick={() => handleOpenConfirmDelete(category)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={3}
                    >
                      <Collapse
                        in={expandedCategory === category._id}
                        timeout='auto'
                        unmountOnExit
                      >
                        <List>
                          {category?.subcategories?.map(
                            (subcategory, subIndex) => (
                              <ListItem
                                key={subIndex}
                                onClick={() =>
                                  handleSubcategoryClick(category?._id)
                                }
                                sx={{ cursor: 'pointer' }}
                              >
                                <ListItemText
                                  primary={
                                    <>
                                      {subcategory?.name}
                                      <span
                                        style={{
                                          marginLeft: '8px',
                                          fontWeight: 'bold'
                                        }}
                                      >
                                        ({subcategory?.productCount}){' '}
                                        {/* Placeholder for product count */}
                                      </span>
                                    </>
                                  }
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>

        {/* Add TablePagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal for creating/editing category */}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <IconButton
            aria-label='close'
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
          <Typography variant='h6'>
            {isCreatingCategory ? 'Create Category' : 'Create Subcategory'}
          </Typography>

          {isCreatingCategory ? (
            <>
              <TextField
                fullWidth
                label='Category Name'
                value={newCategory.name}
                onChange={e =>
                  setNewCategory(prev => ({ ...prev, name: e.target.value }))
                }
                sx={{ my: 2 }}
              />
              <input
                type='file'
                onChange={handleImageChange}
                accept='image/*'
                style={{ margin: '16px 0' }}
              />
            </>
          ) : (
            <>
              <Select
                fullWidth
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                displayEmpty
                sx={{ my: 2 }}
              >
                <MenuItem value='' disabled>
                  Select Category
                </MenuItem>
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                label='Subcategory Name'
                value={newSubcategory}
                onChange={e => setNewSubcategory(e.target.value)}
                sx={{ my: 2 }}
              />
            </>
          )}

          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleSaveCategory}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isCreatingCategory ? (
              'Create Category'
            ) : (
              'Create Subcategory'
            )}
          </Button>
        </Box>
      </Modal>

      <Modal
        open={isConfirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant='h6'>
            Are you sure you want to delete the category "
            {categoryToDelete?.name}"?
          </Typography>
          <Typography color='textSecondary'>
            This action will delete all products and subcategories within this
            category.
          </Typography>
          <TextField
            fullWidth
            label='Type category name to confirm'
            value={confirmName}
            onChange={e => setConfirmName(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleDelete}
          >
            Delete Category
          </Button>
          <Button
            fullWidth
            variant='outlined'
            onClick={() => setConfirmDeleteOpen(false)}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CategoryPage
