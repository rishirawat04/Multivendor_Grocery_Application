import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
  Avatar
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Search as SearchIcon,
  AccountCircle,
  FavoriteBorder,
  CompareArrows,
  Menu as MenuIcon,
  Call as CallIcon,
  Widgets as WidgetsIcon
} from '@mui/icons-material'
import PromoBanner from '../../components/Layout/PromoBanner'
import CategoryButton from '../../components/Layout/CategoryButton'
import './layout.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CloseIcon from '@mui/icons-material/Close'
import api from '../../API/api'
import { AuthContext } from '../../auth/AuthContext'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
const HeaderPage = () => {
  const { user, logout } = useContext(AuthContext)

  const [categories, setCategories] = useState([])
  const [showCategories, setShowCategories] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const [cart, setCart] = useState([])
 
  const [favorites, setFavorites] = useState([])

  //Hover for dealy for dropdown
  const [isFavoritesHovered, setIsFavoritesHovered] = useState(false)
  const [isCartHovered, setIsCartHovered] = useState(false)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const hoverTimeouts = {}

  // Common delay duration (in milliseconds)
  const delayDuration = 250

  // Handlers for Favorites
  const handleFavoritesMouseEnter = () => {
    clearTimeout(hoverTimeouts['favorites'])
    setIsFavoritesHovered(true)
  }

  const handleFavoritesMouseLeave = () => {
    hoverTimeouts['favorites'] = setTimeout(() => {
      setIsFavoritesHovered(false)
    }, delayDuration)
  }

  // Handlers for Cart
  const handleCartMouseEnter = () => {
    clearTimeout(hoverTimeouts['cart'])
    setIsCartHovered(true)
  }

  const handleCartMouseLeave = () => {
    hoverTimeouts['cart'] = setTimeout(() => {
      setIsCartHovered(false)
    }, delayDuration)
  }

  // Handlers for Profile
  const handleProfileMouseEnter = () => {
    clearTimeout(hoverTimeouts['profile'])
    setIsProfileHovered(true)
  }

  const handleProfileMouseLeave = () => {
    hoverTimeouts['profile'] = setTimeout(() => {
      setIsProfileHovered(false)
    }, delayDuration)
  }

  //Logout and profile
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login') // Redirect to login after logout
  }

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          // if scroll down hide the navbar
          setIsHeaderVisible(false)
        } else {
          // if scroll up show the navbar
          setIsHeaderVisible(true)
        }
        // remember current page location to use in the next move
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader)

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlHeader)
      }
    }
  }, [lastScrollY])

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setIsDrawerOpen(open)
  }

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Link to={'/'}>
          <img
            src={logo}
            alt='Nest'
            style={{ width: '120px', marginRight: '8px' }}
          />
        </Link>
      </Box>
      <Divider />
      <List>
        {['Home', 'Stores', 'Product', 'Brand', 'Contact'].map(text => (
          <ListItem
            button
            key={text}
            component={Link}
            to={'/' + text.toLowerCase()}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button>
          <Badge badgeContent={0} color='secondary'>
            <CompareArrows />
          </Badge>
          <ListItemText primary='Compare' sx={{ ml: 2 }} />
        </ListItem>
        <ListItem button>
          <Badge
            badgeContent={favorites.length}
            color='primary'
            sx={{
              '& .MuiBadge-dot': {
                backgroundColor: '#38a169'
              },
              '& .MuiBadge-standard': {
                backgroundColor: '#38a169'
              },
              '& .MuiBadge-dot, & .MuiBadge-standard': {
                color: 'white'
              }
            }}
          >
            <FavoriteBorder />
          </Badge>
          <ListItemText primary='Wishlist' sx={{ ml: 2 }} />
        </ListItem>
      </List>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <CallIcon sx={{ fontSize: 40, color: '#38a169', mr: 1 }} />
        <Box>
          <Typography
            variant='subtitle1'
            sx={{ color: '#38a169', lineHeight: 1 }}
          >
            1900-800
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            24/7 Support Center
          </Typography>
        </Box>
      </Box>
      {user ? (
        <Box
          sx={{
            mt: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <Avatar sx={{ bgcolor: '#38a169', mr: 2 }}>P</Avatar>
          <Link to={`/userProfile/${user?.id}`}>
            {' '}
            <Typography variant='body1'>Profile</Typography>
          </Link>
        </Box>
      ) : (
        ''
      )}

      {user ? (
        <Box
          sx={{
            mt: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <LogoutIcon sx={{ fontSize: 40, color: '#38a169', mr: 1 }} />

          <Typography variant='body1' onClick={handleLogout}>
            Logout
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 'auto',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderTop: '1px solid #e0e0e0'
          }}
        >
          <LoginIcon sx={{ fontSize: 40, color: '#38a169', mr: 1 }} />

          <Typography variant='body1' onClick={handleLogout}>
            Login
          </Typography>
        </Box>
      )}
    </Box>
  )

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/category')
      setCategories(response.data) // Set categories from response
      setLoading(false) // Set loading to false after fetching
    } catch (err) {
      setError(err.message) // Set error message
      setLoading(false) // Set loading to false even if there's an error
    }
  }

  // Function to fetch cart data
  const fetchCartData = async () => {
    try {
      const response = await api.get('/cart', {
        withCredentials: true
      })

      const products = response.data.products
      setCart(products) // Set cart items from response
      // console.log('products', products)
    } catch (error) {
      console.error('Failed to fetch cart data:', error)
    }
  }

  // Remove the cart items
  const removeProductFromCart = async productId => {
    try {
      const response = await api.delete('/cart/remove', {
        data: { productId },
        withCredentials: true
      })
      console.log(response.data.message) // Handle success message
    } catch (error) {
      console.error('Failed to remove product from cart:', error)
    }
  }

  // Function to fetch Fav data
  const fetchFavData = async () => {
    try {
      const response = await api.get('/favorites', {
        withCredentials: true
      })

      setFavorites(response.data.products) // Store the products in state
      // console.log('products', response.data.products)
    } catch (error) {
      console.error('Failed to fetch cart data:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchCartData()
    fetchFavData()
  }, []) // Fetch cart data once on mount

  return (
    <>
      <PromoBanner />
      <AppBar
        position='sticky'
        color='default'
        elevation={1}
        sx={{
          top: isHeaderVisible ? '0' : '-200px',
          transition: 'top 0.3s'
        }}
      >
        <Toolbar className='bg-white' sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!isMobile && (
              <Link to={'/homepage'}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={logo}
                    alt='Nest'
                    style={{ width: '130px', marginRight: '8px' }}
                  />
                </Box>
              </Link>
            )}
          </Box>

          {/* Search Bar */}
          <div className='flex items-center bg-green-50 w-[300px] md:w-[300px] border-green-400 hover:border-green-600 border lg:w-[500px] '>
            <input
              type='search'
              className='flex-grow p-2 outline-none text-black '
              placeholder='Search Products..'
            />
            <SearchIcon className='text-green-500  ml-2' />
          </div>

          {/* cart for mobile screen  */}

          {isMobile && (
            <div className='relative group'>
              <button className='p-2 text-gray-600 hover:text-gray-800'>
                <div className='relative'>
                  <ShoppingCartIcon size={24} />

                  <span className='absolute -top-2 -right-2 bg-[#38a169] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    {cart.length} {/* Display number of items in cart */}
                  </span>
                </div>
              </button>

              <div className='absolute right-0 mt-2 w-[300px] bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10'>
                <div className='p-4 max-h-96 scrollbar-hide overflow-y-auto'>
                  {cart.length === 0 ? ( // Check if the cart is empty
                    <p className='text-center text-gray-500'>
                      No items in cart
                    </p> // Display message if cart is empty
                  ) : (
                    cart.map(item => (
                      <div
                        key={item?._id}
                        className='flex items-center mb-4 last:mb-0'
                      >
                        <img
                          src={
                            item?.product?.image?.length > 0
                              ? item.product.image[0]
                              : 'default-image-url'
                          } // Check if the image array exists and has elements
                          alt={item?.product?.name || 'Product Image'} // Add a fallback for the alt attribute
                          className='w-12 h-12 object-cover mr-3'
                        />
                        <div className='flex-grow'>
                          <p className='text-sm font-medium'>
                            {item?.product?.name || 'Unnamed Product'}{' '}
                            {/* Fallback if name is missing */}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {item?.quantity} x $
                            {item?.product?.discountedPrice
                              ? item.product.discountedPrice.toFixed(2)
                              : '0.00'}{' '}
                            {/* Fallback if price is missing */}
                          </p>
                        </div>
                        <button
                          className='text-gray-400 hover:text-gray-600'
                          onClick={() =>
                            removeProductFromCart(item?.product?._id)
                          }
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className='p-4 border-t'>
                  <Link to={'/cart'}>
                    <button className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-150'>
                      View Cart
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* compare  */}
              <IconButton color='inherit'>
                <Badge
                  badgeContent={0}
                  color='primary'
                  sx={{
                    '& .MuiBadge-dot': {
                      backgroundColor: '#38a169' // Green color
                    },
                    '& .MuiBadge-standard': {
                      backgroundColor: '#38a169' // Green color
                    },
                    '& .MuiBadge-dot, & .MuiBadge-standard': {
                      color: 'white'
                    }
                  }}
                >
                  <CompareArrows />
                </Badge>
              </IconButton>

              <div className='flex space-x-6'>
                {/* Favorites */}
                <div
                  className='relative group'
                  onMouseEnter={handleFavoritesMouseEnter}
                  onMouseLeave={handleFavoritesMouseLeave}
                >
                  <IconButton color='inherit'>
                    <Badge
                      badgeContent={favorites.length}
                      color='primary'
                      sx={{
                        '& .MuiBadge-dot': {
                          backgroundColor: '#38a169'
                        },
                        '& .MuiBadge-standard': {
                          backgroundColor: '#38a169'
                        },
                        '& .MuiBadge-dot, & .MuiBadge-standard': {
                          color: 'white'
                        }
                      }}
                    >
                      <FavoriteBorder />
                    </Badge>
                  </IconButton>

                  <div
                    className={`absolute right-0 mt-2 w-[300px] bg-white rounded-md shadow-lg transition-opacity duration-500 z-10 ${
                      isFavoritesHovered
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className='p-4 max-h-96 scrollbar-hide overflow-y-auto'>
                      {favorites.length === 0 ? (
                        <p className='text-center text-gray-500'>
                          No items in favorites
                        </p>
                      ) : (
                        favorites.map(item => (
                          <div
                            key={item._id}
                            className='flex items-center mb-4 last:mb-0'
                          >
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className='w-12 h-12 object-cover mr-3'
                            />
                            <div className='flex-grow'>
                              <p className='text-sm font-medium'>{item.name}</p>
                              <p className='text-xs text-gray-500'>
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Cart */}
                <div
                  className='relative group'
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                >
                  <button className='p-2 text-gray-600 hover:text-gray-800'>
                    <div className='relative'>
                      <Link to={'/cart'}>
                        <ShoppingCartIcon size={24} />
                      </Link>
                      <span className='absolute -top-2 -right-2 bg-[#38a169] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                        {cart.length}
                      </span>
                    </div>
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-[300px] bg-white rounded-md shadow-lg transition-opacity duration-500 z-10 ${
                      isCartHovered
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className='p-4 max-h-96 scrollbar-hide overflow-y-auto'>
                      {cart.length === 0 ? ( // Check if the cart is empty
                        <p className='text-center text-gray-500'>
                          No items in cart
                        </p> // Display message if cart is empty
                      ) : (
                        cart.map(item => (
                          <div
                            key={item?._id}
                            className='flex items-center mb-4 last:mb-0'
                          >
                            <img
                              src={
                                item?.product?.image?.length > 0
                                  ? item.product.image[0]
                                  : 'default-image-url'
                              } // Check if the image array exists and has elements
                              alt={item?.product?.name || 'Product Image'} // Add a fallback for the alt attribute
                              className='w-12 h-12 object-cover mr-3'
                            />
                            <div className='flex-grow'>
                              <p className='text-sm font-medium'>
                                {item?.product?.name || 'Unnamed Product'}{' '}
                                {/* Fallback if name is missing */}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {item?.quantity} x $
                                {item?.product?.discountedPrice
                                  ? item.product.discountedPrice.toFixed(2)
                                  : '0.00'}{' '}
                                {/* Fallback if price is missing */}
                              </p>
                            </div>
                            <button
                              className='text-gray-400 hover:text-gray-600'
                              onClick={() =>
                                removeProductFromCart(item?.product?._id)
                              }
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className='p-4 border-t'>
                      <Link to={'/cart'}>
                        <button className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-150'>
                          View Cart
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <nav>
                  <ul className='flex p-2 items-center space-x-4'>
                    <li
                      className='relative group'
                      onMouseEnter={handleProfileMouseEnter}
                      onMouseLeave={handleProfileMouseLeave}
                    >
                      <button className='focus:outline-none'>
                        <AccountCircle size={24} className='text-md' />
                      </button>
                      <div
                        className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transition-opacity duration-500 z-10 ${
                          isProfileHovered
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className='py-1'>
                          {user ? (
                            <>
                              <Link
                                to={`/userProfile/${user?.id}`}
                                className='block px-4 py-2 text-gray-800 hover:bg-green-100'
                              >
                                Profile
                              </Link>
                              <button
                                onClick={handleLogout}
                                className='block w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100'
                              >
                                Logout
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                to='/login'
                                className='block px-4 py-2 text-gray-800 hover:bg-green-100'
                              >
                                Login
                              </Link>
                              <Link
                                to='/register'
                                className='block px-4 py-2 text-gray-800 hover:bg-green-100'
                              >
                                Register
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </Box>
          )}
        </Toolbar>
        <Divider />

        {/* Browse categories */}
        {!isMobile && (
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              bgcolor: 'background.paper'
            }}
          >
            <div className='flex items-center mr-2'>
              <div className='relative group'>
                <button
                  className='text-nowrap bg-[#38a169] text-white py-1 px-4 rounded-lg'
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <WidgetsIcon className='mr-1' />
                  Browse All Categories
                  <KeyboardArrowDownIcon className='ml-1' />
                </button>
                <div
                  className={`absolute top-full z-50 left-0 mt-2 p-2 bg-white border rounded-lg shadow-lg w-[400px] 
                ${showCategories ? 'block' : 'hidden'} group-hover:block`}
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <div className='grid grid-cols-3 gap-2'>
                    {loading && <p>Loading categories...</p>}{' '}
                    {/* Loading state */}
                    {error && <p>Error fetching categories: {error}</p>}{' '}
                    {/* Error state */}
                    {!loading &&
                      !error &&
                      categories.map(category => (
                        <CategoryButton
                          key={category._id} // Use _id as the key
                          title={category.name} // Change to category.name based on your response
                          imageUrl={category.imageUrl} // Make sure you have imageUrl in your category data
                        />
                      ))}
                  </div>
                </div>
              </div>
              <Box sx={{ display: 'flex', marginLeft: '10px' }}>
                <NavLink
                  to='/homepage'
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: isActive ? '2px solid #38a169' : 'none',
                    paddingBottom: '4px',
                    marginRight: '16px'
                  })}
                >
                  Home
                </NavLink>
                <NavLink
                  to='/stores'
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: isActive ? '2px solid #38a169' : 'none',
                    paddingBottom: '4px',
                    marginRight: '16px'
                  })}
                >
                  Stores
                </NavLink>
                <NavLink
                  to='/product'
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: isActive ? '2px solid #38a169' : 'none',
                    paddingBottom: '4px',
                    marginRight: '16px'
                  })}
                >
                  Product
                </NavLink>
                <NavLink
                  to='/contact'
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: isActive ? '2px solid #38a169' : 'none',
                    paddingBottom: '4px',
                    marginRight: '16px'
                  })}
                >
                  Contact
                </NavLink>
                <NavLink
                  to='/brand'
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: isActive ? '2px solid #38a169' : 'none',
                    paddingBottom: '4px',
                    marginRight: '16px'
                  })}
                >
                  Brand
                </NavLink>
              </Box>
            </div>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center'
              }}
            >
              <CallIcon sx={{ fontSize: 40, color: '#38a169', mr: 1 }} />
              <Box>
                <Typography
                  variant='subtitle1'
                  sx={{ color: '#38a169', lineHeight: 1 }}
                >
                  1900-800
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  24/7 Support Center
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        )}
        {isMobile && (
          <div className='flex items-center justify-between px-3 py-2'>
            <div className='relative group'>
              <button
                className='text-nowrap bg-[#38a169] text-white py-1 px-2 rounded-lg'
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <WidgetsIcon className='mr-1' />
                <span className='text-[14px]'>Browse All Categories</span>
                <KeyboardArrowDownIcon className='ml-1' />
              </button>
              <div
                className={`absolute top-full z-50 left-0 mt-2 p-2 bg-white border rounded-lg shadow-lg w-[400px] 
              ${showCategories ? 'block' : 'hidden'} group-hover:block`}
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <div className='grid grid-cols-3 gap-2'>
                  {loading && <p>Loading categories...</p>}{' '}
                  {/* Loading state */}
                  {error && <p>Error fetching categories: {error}</p>}{' '}
                  {/* Error state */}
                  {!loading &&
                    !error &&
                    categories.map(category => (
                      <CategoryButton
                        key={category._id} // Use _id as the key
                        title={category.name} // Change to category.name based on your response
                        imageUrl={category.imageUrl} // Make sure you have imageUrl in your category data
                      />
                    ))}
                </div>
              </div>
            </div>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <CallIcon sx={{ fontSize: 25, color: '#38a169', mr: 1 }} />
              <Box>
                <Typography
                  variant='subtitle1'
                  sx={{ color: '#38a169', lineHeight: 1 }}
                >
                  1900-800
                </Typography>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  24/7 Support Center
                </Typography>
              </Box>
            </Box>
          </div>
        )}
      </AppBar>

      <Drawer anchor='left' open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  )
}

export default HeaderPage
