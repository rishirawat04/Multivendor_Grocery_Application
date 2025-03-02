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
  InputBase,
  Avatar,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
// Import icons from react-icons
import {
  MdDashboard,
  MdShoppingCart,
  MdStore,
  MdArticle,
  MdPayment
} from 'react-icons/md'
import {
  FaShippingFast,
  FaUsers,
  FaTags,
  FaCog,
  FaCommentAlt,
  FaBell
} from 'react-icons/fa'

import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { AuthContext } from '../auth/AuthContext'

const navLinks = [
  {
    text: 'Dashboard',
    icon: <MdDashboard size={30} />,
    link: '/admin/dashboard',
    iconColor: '#f39c12'
  }, // Orange
  {
    text: 'Report',
    icon: <MdShoppingCart size={30} />,
    link: '/admin/report',
    iconColor: '#1abc9c'
  }, // Greenish
  {
    text: 'Orders',
    icon: <MdStore size={30} />,
    link: '/admin/orders',
    iconColor: '#3498db'
  }, // Blue
  {
    text: 'Shipments',
    icon: <FaShippingFast size={30} />,
    link: '/admin/shipments',
    iconColor: '#9b59b6'
  }, // Purple
  {
    text: 'Products',
    icon: <MdArticle size={30} />,
    link: '/admin/products',
    iconColor: '#2ecc71'
  }, // Green
  {
    text: 'Product Prices',
    icon: <MdArticle size={30} />,
    link: '/admin/product-prices',
    iconColor: '#e67e22'
  }, // Orange
  {
    text: 'Products Categories',
    icon: <MdArticle size={30} />,
    link: '/admin/categories',
    iconColor: '#2c3e50'
  }, // Dark blue
  {
    text: 'Brands',
    icon: <MdArticle size={30} />,
    link: '/admin/brands',
    iconColor: '#8e44ad'
  }, // Violet
  {
    text: 'Reviews',
    icon: <FaCommentAlt size={30} />,
    link: '/admin/reviews',
    iconColor: '#27ae60'
  }, // Green
  {
    text: 'Discounts',
    icon: <FaTags size={30} />,
    link: '/admin/discounts',
    iconColor: '#e74c3c'
  }, // Red
  {
    text: 'Customers',
    icon: <FaUsers size={30} />,
    link: '/admin/customers',
    iconColor: '#16a085'
  }, // Teal
  {
    text: 'Vendors',
    icon: <MdStore size={30} />,
    link: '/admin/vendors',
    iconColor: '#c0392b'
  }, // Red
  {
    text: 'Transactions',
    icon: <MdPayment size={30} />,
    link: '/admin/transactions',
    iconColor: '#e74c3c'
  }, // Red
  {
    text: 'Payment Methods',
    icon: <MdPayment size={30} />,
    link: '/admin/payments',
    iconColor: '#2c3e50'
  }, // Dark blue

  {
    text: 'Settings',
    icon: <FaCog size={30} />,
    link: '/admin/settings',
    iconColor: '#2ecc71'
  } // Green
]


// Loading fallback for lazy loading
export const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const Layout = () => {
  const {user, logout } = useContext(AuthContext)
  console.log(user);
  
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [currentRoute, setCurrentRoute] = useState('Dashboard')
  const drawerWidth = sidebarOpen ? 270 : 80
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout;

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

  const handleLogout = () => {
    navigate("/login")
    logout()
  }

  const handleMouseEnter = () => {
    // Set a delay before showing the dropdown
    hoverTimeout = setTimeout(() => setIsHovered(true), 300); // 300ms delay
  };

  const handleMouseLeave = () => {
    // Clear timeout and hide the dropdown
    clearTimeout(hoverTimeout);
    setIsHovered(false);
  };

  const drawer = (
    <div>
      <Toolbar />
      {/* Profile section for mobile screens */}
      <Link to={'/admin/admin-profile'}>
        <Box
          display={{ xs: 'flex', sm: 'none', justifyContent: 'center' }}
          alignItems='center'
          sx={{ mb: 0, color: 'white', mt: 5 }}
        >
          <Avatar
            alt='Profile'
            src='/path-to-image.jpg'
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box display={{ xs: 'flex', sm: 'none' }} flexDirection='column'>
            <Typography variant='body1' sx={{ mt: 1 }}>
              Linda Bashirian
            </Typography>
            <Typography variant='body2'>linda@example.com</Typography>
          </Box>
        </Box>
      </Link>
      <Divider />
      <List sx={{ overflowX: 'none', mt: 2 }}>
        {navLinks.map((link, index) => (
          <ListItem
            button
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index, link.link)}
            sx={{
              color: 'white',
              mt: 1,
              backgroundColor: selectedIndex === index ? '#206bc4' : 'inherit',
              '&:hover': {
                backgroundColor: '#206bc4'
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
                  color: 'white',
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
  // Get the current path and replace '/admin/' with 'admin / '
  let path = window.location.pathname.replace('/admin/', 'admin / ');

  // Remove hyphens and replace them with spaces
  path = path.replace(/-/g, ' ');

  // Convert the path to uppercase
  const uppercaseRoute = path.charAt(0).toUpperCase() + path.slice(1).toUpperCase();

  // If no specific route, default to 'DASHBOARD'
  setCurrentRoute(uppercaseRoute || 'DASHBOARD');
}, [window.location.pathname]);


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          {/* Search bar in the center */}
          <Box
            sx={{
              flexGrow: 1,
              position: 'relative',
              bgcolor: '#151f2c',
              borderRadius: '4px',
              border: '1px solid #fff',
              mr:2
            }}
          >
            <SearchIcon
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                zIndex: 1,
                color: 'white'
              }}
            />
            <InputBase
              placeholder='Search…'
              sx={{
                color: 'white',
                paddingLeft: '30px',
                width: { sm: '250px', md: '400px' },
                borderRadius: '4px',
                padding: '2px 8px',
                bgcolor: '#151f2c'
              }}
            />
          </Box>
          <Box display='flex' alignItems='center'>
      {/* Conditional rendering based on user state */}
      {user ? (
        <>
          {/* Profile section with hover effect and delay */}
          <Box
            display='flex'
            alignItems='center'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Avatar alt='Profile' src='/path-to-image.jpg' />
            <Box ml={2}>
              <Typography variant='body1'>{user.name}</Typography>
            </Box>

            {/* Hover group: Profile details with delay */}
            <Box
              className='profile-details'
              sx={{
                display: isHovered ? 'block' : 'none',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                position: 'absolute',
                top: '100%',
                right: 10, // Positioning the dropdown from the right side
                backgroundColor: '#2e3847',
                boxShadow: 1,
                p: 2,
                borderRadius: 1,
                zIndex: 1,
              }}
            >
              {/* <Typography variant='body2'>{user.fullName}</Typography> */}
              <Link
                to='/admin/admin-profile'
                sx={{  mt: 1, color: 'white', cursor: 'pointer', whiteSpace:"nowrap" }}
              >
                Profile
              </Link>
              <Typography
                onClick={logout}
                sx={{ color: 'white', cursor: 'pointer', mt: 1 }}
              >
                Logout
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Display login link if no user is logged in */}
          <Link to='/login'>
            <Typography variant='body1' sx={{ color: 'white' }}>
              Login
            </Typography>
          </Link>
        </>
      )}
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
        bgcolor: '#2e3847',
        color: 'white',
        overflowX: 'hidden', // Prevent horizontal scrolling
        overflowY: 'auto', // Allow vertical scrolling
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: '#888 transparent', // For Firefox
        '&::-webkit-scrollbar': {
          width: '2px', // Thicker scrollbar
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#555',
          },
        },
      },
      display: { xs: 'none', sm: 'block' },
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
            bgcolor: '#2e3847',
            color: 'white',
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

export default Layout
