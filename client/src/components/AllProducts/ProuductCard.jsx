import React, { useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import api from '../../API/api'
import { Link } from 'react-router-dom'

// Snackbar Alert component
const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const ProductCard = ({ product }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success') // 'success', 'error', etc.

  // Calculate discount percentage if the product has a discountedPrice
  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : null

  // Add to cart function
  const handleAddToCart = async () => {
    try {
      const response = await api.post(
        '/cart',
        {
          productId: product._id,
          quantity: 1
        },
        {
          withCredentials: true
        }
      )
      setSnackbarSeverity('success')
      setSnackbarMessage(response.data.message)
    } catch (error) {
      setSnackbarSeverity('error')
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to add to cart'
      )
    } finally {
      setSnackbarOpen(true)
    }
  }

  // Add to Fav function
  const handleAddToFav = async () => {
    try {
      const response = await api.post(
        '/favorites',
        {
          productId: product._id
        },
        {
          withCredentials: true
        }
      )
      setSnackbarSeverity('success')
      setSnackbarMessage(response.data.message)
    } catch (error) {
      setSnackbarSeverity('error')
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to add to cart'
      )
    } finally {
      setSnackbarOpen(true)
    }
  }

  // Close snackbar handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <div className='border rounded-lg p-4 flex flex-col'>
      {discountPercentage && (
        <span className='bg-green-500 text-white px-2 py-1 rounded-full text-sm self-start'>
          {discountPercentage}% OFF
        </span>
      )}
      <img
        src={product.image[0]} // Display the first image
        alt={product.name}
        className='w-full h-40 object-cover my-4 transition-transform duration-300 ease-in-out transform hover:scale-110'
      />
      <h3 className='font-bold'>{product.name}</h3>
      <div className='flex items-center mb-2'>
        <span className='text-yellow-400'>{'★'.repeat(product.rating)}</span>
        <span className='text-gray-400 ml-1'>({product.numReviews})</span> 
      </div>
      <div className='flex justify-between items-center mb-2'>
        <span className='font-bold text-[21px]'>
          ${product.discountedPrice.toFixed(2)}
        </span>
        {product.price !== product.discountedPrice && (
          <span className='line-through text-gray-400'>
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>
      <div className='flex items-center justify-between'>
        <button
          className='bg-green-100 text-green-500 px-4 py-1 rounded hover:bg-green-600 hover:text-white ease-in-out  duration-300'
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <div className='flex items-center space-x-2'>
          <FavoriteBorderIcon
            className='hover:text-green-500 hover:text-[25px] ease-in-out duration-300 cursor-pointer'
            onClick={() => handleAddToFav()}
          />
          <Link to={`/product/${product._id}`}>
          <VisibilityIcon className='hover:text-green-500 hover:text-[25px] ease-in-out duration-100 cursor-pointer'   />
          </Link>
        </div>
      </div>

      {/* MUI Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={900}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProductCard
