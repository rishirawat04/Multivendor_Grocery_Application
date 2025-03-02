import React, { useEffect, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Autocomplete,
  Snackbar,
  CircularProgress
} from '@mui/material'
import {
  CloudUpload,
  Save,
  ExitToApp,
  Cancel,
  ExitToAppSharp
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../API/api'
import uploadImageToCloudinary from '../cloudinary/cloudinary'

const ProductInfo = () => {
  const { productId } = useParams()
  const navigate = useNavigate()

  // State management for product fields
  const [product, setProduct] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [stock, setStock] = useState(0)
  const [rating, setRating] = useState(0)
  const [numReviews, setNumReviews] = useState(0)
  const [vendorShop, setVendorShop] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [selectedBrand, setSelectedBrand] = useState([])
  const [loading, setLoading] = useState(false)


  const [existingImages, setExistingImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  // State for category, subcategory, and brand options (dropdowns)
  const [allCategories, setAllCategories] = useState([])
  const [allSubcategories, setAllSubcategories] = useState([])
  const [allBrands, setAllBrands] = useState([])

  // Snackbar state for success/error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const getProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`)
      const productData = response.data

      console.log(response.data)

      // Set product fields
      setProduct(productData)
      setName(productData.name)
      setDescription(productData.description)
      setPrice(productData.price)
      setDiscountedPrice(productData.discountedPrice || '')
      setStock(productData.stock)
      setRating(productData.rating)
      setNumReviews(productData.numReviews)
      setVendorShop(productData.vendorShop)
      setSelectedCategories([productData.category])
      setSelectedSubcategories([productData.subcategory])
      setSelectedBrand(productData.brand)
      setExistingImages(productData?.image)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, brandsRes] = await Promise.all([
        api.get('/category'),
        api.get('/subcategory'),
        api.get('/brands')
      ])
      setAllCategories(categoriesRes?.data)
      setAllSubcategories(subcategoriesRes?.data)
      setAllBrands(brandsRes?.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Handle image upload
  const handleImageSelect = e => {
    const files = Array.from(e.target.files)

    // Limit total images (existing + new) to 4
    if (existingImages?.length + selectedFiles?.length + files?.length > 4) {
      alert('You can only upload a total of 4 images.')
      return
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...files])
  }

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prevImages => prevImages.filter((_, i) => i !== index))
    } else {
      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true) // Start loader

    try {
      // Upload only if new files are selected
      let uploadImages = []
      if (selectedFiles.length > 0) {
        uploadImages = await Promise.all(
          selectedFiles.map(file => uploadImageToCloudinary(file))
        )
      }

      const updatedProductData = {
        name,
        description,
        price,
        discountedPrice,
        stock,
        rating,
        numReviews,
        vendorShop,
        category: selectedCategories[0]?._id,
        subcategory: selectedSubcategories[0]?._id,
        brand: selectedBrand?._id,
        image: [...existingImages, ...uploadImages] // Assuming images are URLs or uploaded to Cloudinary
      }

      

      // Determine whether to create or update the product
      let response
      if (productId) {
        response = await api.put(`/products/${productId}`, updatedProductData, {
          withCredentials: true
        })
        setSnackbarMessage(
          response.data.message || 'Product updated successfully!'
        )
      } else {
        response = await api.post(
          `/products/addProduct`,
          {
            name,
            description,
            price,
            discountedPrice,
            stock,
            rating,
            numReviews,
            vendorShop,
            categoryName: selectedCategories[0]?._id,
            subcategoryName: selectedSubcategories[0]?._id,
            brand: selectedBrand?._id,
            image: [ ...uploadImages]
          },

          { withCredentials: true }
        )
        setSnackbarMessage(
          response.data.message || 'Product created successfully!'
        )
      }
      

      setSnackbarOpen(true)

      // Introduce a delay of 2 seconds before navigating
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000) // Delay of 2000 milliseconds (2 seconds)
    } catch (error) {
      console.log('new error ', error)
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to update product.'
      )
      setSnackbarOpen(true)
    } finally {
      setLoading(false) // Stop loader
    }
  }

  useEffect(() => {
    getProduct()
    getAllData()
  }, [productId])

  return (
    <>
      <Box component='form' onSubmit={handleSubmit} sx={{ flex: 1 }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant='h4' gutterBottom>
            {productId ? 'Update Product' : 'Create New Product'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Product Name'
                variant='outlined'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Price'
                variant='outlined'
                type='number'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Discounted Price'
                variant='outlined'
                type='number'
                value={discountedPrice}
                onChange={e => setDiscountedPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Stock'
                variant='outlined'
                type='number'
                value={stock}
                onChange={e => setStock(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Rating'
                variant='outlined'
                type='number'
                value={rating}
                onChange={e => setRating(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label='Vendor Shop'
                variant='outlined'
                value={vendorShop}
                onChange={e => setVendorShop(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={allCategories}
                getOptionLabel={option => option?.name || 'Unnamed Category'}
                value={selectedCategories[0] || null}
                onChange={(e, newValue) => setSelectedCategories([newValue])}
                renderInput={params => (
                  <TextField {...params} label='Category' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={allSubcategories}
                getOptionLabel={option => option?.name || 'Unnamed Subcategory'}
                value={selectedSubcategories[0] || null}
                onChange={(e, newValue) => setSelectedSubcategories([newValue])}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Subcategory'
                    variant='outlined'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={allBrands}
                getOptionLabel={option => option?.name || 'Unnamed Brand'}
                value={selectedBrand || null}
                onChange={(e, newValue) => setSelectedBrand(newValue)}
                renderInput={params => (
                  <TextField {...params} label='Brand' variant='outlined' />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant='contained'
                component='label'
                startIcon={<CloudUpload />}
                disabled={existingImages?.length + selectedFiles?.length >= 4} // Disable if 4 images
              >
                Upload Images
                <input
                  type='file'
                  hidden
                  multiple
                  onChange={handleImageSelect}
                  accept='image/*'
                  disabled={existingImages?.length + selectedFiles?.length >= 4} // Prevent selection if 4 images
                />
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  marginTop: 2
                }}
              >
                {/* Display existing images */}
                {existingImages?.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={image}
                      alt={`Existing Product ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <Button
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 'unset',
                        padding: 0
                      }}
                      onClick={() => removeImage(index, true)} // Remove existing image
                    >
                      <Cancel color='error' />
                    </Button>
                  </Box>
                ))}

                {/* Display newly selected images */}
                {selectedFiles.map((file, index) => (
                  <Box
                    key={index + existingImages?.length}
                    sx={{ position: 'relative' }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected Product ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <Button
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 'unset',
                        padding: 0
                      }}
                      onClick={() => removeImage(index)} // Remove newly selected image
                    >
                      <Cancel color='error' />
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                multiline
                rows={4}
                variant='outlined'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
        <Grid item xs={12} sx={{ padding: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : productId
                ? 'Update Product'
                : 'Create Product'}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              startIcon={<ExitToApp />}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  )
}

export default ProductInfo
