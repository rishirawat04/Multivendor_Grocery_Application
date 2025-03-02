import React, { Suspense, useContext, useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import '../index.css'
// Import icons from react-icons
import { MdDashboard, MdShoppingCart, MdStore, MdArticle } from 'react-icons/md'
import { FaTags, FaCog, FaCommentAlt, FaBell } from 'react-icons/fa'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import api from '../API/api'
import { AuthContext } from '../auth/AuthContext'

// Loading fallback for lazy loading
export const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
)
const navLinks = [
  {
    text: 'Dashboard',
    icon: <MdDashboard size={30} />,
    link: '/vendor/dashboard',
    iconColor: '#f39c12'
  }, // Orange
  {
    text: 'Revenues',
    icon: <MdShoppingCart size={30} />,
    link: '/vendor/revenues',
    iconColor: '#3498db'
  }, // Blue
  {
    text: 'Orders',
    icon: <MdStore size={30} />,
    link: '/vendor/orders',
    iconColor: '#3498db'
  }, // Blue
  {
    text: 'Products',
    icon: <MdArticle size={30} />,
    link: '/vendor/products',
    iconColor: '#2ecc71'
  }, // Green
  {
    text: 'Products Categories',
    icon: <MdArticle size={30} />,
    link: '/vendor/categories',
    iconColor: '#2c3e50'
  }, // Dark blue
  {
    text: 'Reviews',
    icon: <FaCommentAlt size={30} />,
    link: '/vendor/reviews',
    iconColor: '#27ae60'
  }, // Green
  {
    text: 'Discounts',
    icon: <FaTags size={30} />,
    link: '/vendor/discounts',
    iconColor: '#e74c3c'
  }, // Red
  {
    text: 'Settings',
    icon: <FaCog size={30} />,
    link: '/vendor/setting',
    iconColor: '#2ecc71'
  } // Green
]

const VendorLayout = () => {
  const { user } = useContext(AuthContext)

  // console.log("user",user);

  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [currentRoute, setCurrentRoute] = useState('Dashboard')
  const [orderData, setOrderData] = useState()
  const [userDetails, setUserDetails] = useState()
  console.log('data', userDetails)

  const drawerWidth = sidebarOpen ? 380 : 0

  // get balance
  const getOrders = async () => {
    try {
      const response = await api.get('/vendor/orders', {
        withCredentials: true
      })
      //  console.log(response.data);

      setOrderData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // get Userdetails
  const getUserDetails = async () => {
    try {
      const response = await api.get(`users/profile/${user.id}`, {
        withCredentials: true
      })
      //  console.log(response.data);
      setUserDetails(response.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleListItemClick = (index, link) => {
    setSelectedIndex(index)
    navigate(link) // Use navigate to route to the appropriate page
  }

  const drawer = (
    <div>
      <Toolbar />
      {/* Profile section for mobile screens */}

      <Box
        display={{
          xs: 'flex',
          sm: 'flex',
          justifyContent: 'center',
          color: 'black'
        }}
        alignItems='center'
        flexDirection='column'
        sx={{ mb: 0, color: 'white', mt: 6 }}
      >
        <Box display={{ xs: 'flex', sm: 'flex' }} flexDirection='column'>
          <Box>
            <img
              src={logo}
              alt='Logo'
              style={{ width: '110px', marginRight: '10px' }}
            />
          </Box>

          <Typography
            variant='body1'
            sx={{
              mt: 2,
              color: '#666666',
              fontWeight: 'bold',
              fontSize: '1.3rem'
            }}
          >
            <Link to={'/vendor/profile'}>Hello, {userDetails?.fullName}</Link>
          </Typography>
          <Typography variant='body2' sx={{ color: 'black', fontSize: '1rem' }}>
            Joined on{' '}
            {new Date(userDetails?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: '#206bc4',
              my: 2,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <AddBusinessIcon />
            <Link to={'/'}>View your store</Link>
          </Typography>
        </Box>
        <Box mb={2} mt={1} mr={9}>
          <Typography sx={{ color: '#666666', fontWeight: 'bold' }}>
            Balance
          </Typography>
          <h1 className='text-3xl  text-black'>
            {' '}
            {`$${orderData?.totalPaidRevenue + orderData?.totalPendingRevenue}`}
          </h1>
        </Box>
      </Box>

      <Divider mt={4} />
      <List sx={{ overflowX: 'none', mt: 1 }}>
        {navLinks.map((link, index) => (
          <ListItem
            button
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index, link.link)}
            sx={{
              color: 'black',
              mt: 1,
              backgroundColor: selectedIndex === index ? '#206bc4' : 'inherit',
              '&:hover': {
                backgroundColor: '#206bc4',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon
              sx={{ minWidth: sidebarOpen ? 60 : 70, color: link.iconColor }}
            >
              {link.icon}
            </ListItemIcon>
            {/* Ensure text visibility when sidebar is open */}
            {sidebarOpen && (
              <ListItemText
                primary={link.text}
                sx={{
                  color: 'black',
                  fontSize: { xs: '16px', sm: '20px' },
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  )

  // Routing logic
  useEffect(() => {
    // Get the current path and replace '/vendor/' with 'vendor / '
    let path = window.location.pathname.replace('/vendor/', 'vendor / ')

    // Remove hyphens and replace them with spaces
    path = path.replace(/-/g, ' ')

    // Convert the path to uppercase
    const uppercaseRoute =
      path.charAt(0).toUpperCase() + path.slice(1).toUpperCase()

    // If no specific route, default to 'DASHBOARD'
    setCurrentRoute(uppercaseRoute || 'DASHBOARD')
  }, [window.location.pathname])

  useEffect(() => {
    getOrders()
    getUserDetails()
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Header for vendor  */}

      <AppBar
        position='fixed'
        sx={{ zIndex: theme => theme.zIndex.drawer + 1, bgcolor: '#182433' }}
      >
        <Toolbar sx={{ height: '10vh' }}>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color='inherit'
            aria-label='toggle sidebar'
            edge='start'
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
          >
            {sidebarOpen ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
          <img
            src={logo}
            alt='Logo'
            style={{ width: '110px', marginRight: '10px' }}
          />
          <Box sx={{ flexGrow: 1 }} />

          <Badge
            badgeContent={5}
            color='secondary'
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#f44336', // Custom badge color
                color: 'white'
                // Badge text color
              }
            }}
          >
            <FaBell
              size={28}
              style={{ color: 'white', cursor: 'pointer', mx: 2 }}
            />
          </Badge>
          {/* Hide profile on small screens */}

          <Box ml={2}>
            <Link to={'/'}>
              <Typography variant='body1' sx={{ cursor: 'pointer' }}>
                Go to home page <ArrowForwardIosIcon />{' '}
              </Typography>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            bgcolor: '#f1f2f6',
            color: 'black',
            overflowX: 'hidden', // Prevent horizontal scrolling
            overflowY: 'auto', // Allow vertical scrolling
            scrollbarWidth: 'thin', // For Firefox
            scrollbarColor: '#888 transparent', // For Firefox
            '&::-webkit-scrollbar': {
              width: '2px' // Thicker scrollbar
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#555'
              }
            }
          },
          display: { xs: 'none', sm: 'block' }
        }}
        open
      >
        {drawer}
      </Drawer>

      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#f1f2f6',
            color: 'black',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '0px'
            },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none'
          }
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component='main'
        className='scrollbar-hide'
        sx={{
          backgroundColor: '#f6f8fb',
          width: { xs: '100%', sm: `calc(100vw - ${drawerWidth}px)` },
          maxWidth: { xs: '100%', sm: `calc(100vw - ${drawerWidth}px)` },
          height: { xs: 'calc(100vh - 10vh)', sm: `calc(100vh - 10vh)` },
          maxHeight: { xs: 'calc(100vh - 10vh)', sm: `calc(100vh- 10vh)` },
          overflowY: 'auto',
          mt: { xs: 12, sm: 10 },
          p: { xs: 1, sm: 2 },
          '&::-webkit-scrollbar': {
            width: '0px'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none'
        }}
      >
        <Typography
          variant='h6'
          sx={{
            mb: 2,
            fontSize: {
              xs: '1rem', // small screen
              sm: '1.25rem', // small to medium screen
              md: '1.5rem', // medium screen
              lg: '2rem' // large screen
            }
          }}
        >
          {currentRoute}
        </Typography>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
}

export default VendorLayout
