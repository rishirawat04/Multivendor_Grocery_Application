import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  InputAdornment,
  Checkbox,
  Divider
} from '@mui/material'
import { CloudUpload, Save, ExitToApp } from '@mui/icons-material'

const  VendorProductEdit = () => {
  const [images, setImages] = useState([])
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])

  const handleImageUpload = event => {
    const newImages = Array.from(event.target.files)
    setImages([...images, ...newImages])
  }

  const handleSubmit = event => {
    event.preventDefault()
    // Handle form submission
  }

  const categories = ['Category 1', 'Category 2', 'Category 3']
  const subcategories = ['Subcategory 1', 'Subcategory 2', 'Subcategory 3']

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap:3,
          maxWidth: '100%',
          margin: 'auto',
          py: { xs: 1, sm: 2 },
          mt: 2
        }}
      >
        {/* Left Box (Form for Add/Edit Product) */}
        <Box component='form' onSubmit={handleSubmit} sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant='h4' gutterBottom>
              Add/Edit Product
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label='Product Name'
                  variant='outlined'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Permalink' variant='outlined' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={['Store 1', 'Store 2', 'Store 3']}
                  renderInput={params => (
                    <TextField {...params} label='Store' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={['Brand 1', 'Brand 2', 'Brand 3']}
                  renderInput={params => (
                    <TextField {...params} label='Brand' variant='outlined' />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Vendor Name' variant='outlined' />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  component='label'
                  startIcon={<CloudUpload />}
                >
                  Upload Images
                  <input
                    type='file'
                    hidden
                    multiple
                    onChange={handleImageUpload}
                    accept='image/*'
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
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Price'
                  variant='outlined'
                  type='number'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>$</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Discount'
                  variant='outlined'
                  type='number'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>%</InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='SKU' variant='outlined' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Barcode' variant='outlined' />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch color='primary' />}
                  label='Is Popular?'
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Right Box (Categories and Subcategories) */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            {/* Categories Section */}
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}
            >
              <Typography variant='subtitle1'>Categories</Typography>
              <Divider />
              {categories.map(category => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category
                          ])
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter(c => c !== category)
                          )
                        }
                      }}
                    />
                  }
                  label={category}
                />
              ))}
            </Box>

            {/* Subcategories Section */}
          </Paper>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 200,
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0
              }}
            >
              <Typography variant='subtitle1'>Subcategories</Typography>
              <Divider />
              {subcategories.map(subcategory => (
                <FormControlLabel
                  key={subcategory}
                  control={
                    <Checkbox
                      checked={selectedSubcategories.includes(subcategory)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedSubcategories([
                            ...selectedSubcategories,
                            subcategory
                          ])
                        } else {
                          setSelectedSubcategories(
                            selectedSubcategories.filter(s => s !== subcategory)
                          )
                        }
                      }}
                    />
                  }
                  label={subcategory}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Grid item xs={12} sx={{ padding: { xs: 1, sm: 2 },}} >
        <Box sx={{ display: 'flex', justifyContent: 'flex-center', gap: 2 }}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Save />}
            type='submit'
          >
            Save
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
    </>
  )
}

export default VendorProductEdit
