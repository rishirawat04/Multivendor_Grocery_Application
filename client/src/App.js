import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutPage from './common/layout/LayoutPage';
import ProtectedRoute from './auth/ProtectedRoutes';
import { Box, CircularProgress } from '@mui/material';


import RedirectIfAuthenticated from './auth/GuestRoute';
import UserProfile from './components/Userprofile';
import SingleProduct from './components/AllProducts/SingleProduct';



// Lazy load components for public, admin, and vendor sections
// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./components/Auth/RegisterPage'));
const LoginPage = lazy(() => import('./components/Auth/LoginPage'));
const CartPage = lazy(() => import('./components/Cart/CartPage'));
const CheckoutForm = lazy(() => import('./components/Payment/CheckOutPage'));

// Admin Pages
const Layout = lazy(() => import('./admin/LayoutPage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const ReportPage = lazy(() => import('./admin/ReportPage'));
const OrderPage = lazy(() => import('./admin/OrderPage'));
const ProductPage = lazy(() => import('./admin/ProductPage'));
const ShipmentPage = lazy(() => import('./admin/ShipmentPage'));
const ProductPrice = lazy(() => import('./admin/ProductPrice'));
const CategoryPage = lazy(() => import('./admin/Cateogories/CategoryPage'));
const BrandsPage = lazy(() => import('./admin/BrandsPage'));
const ReviewsPage = lazy(() => import('./admin/ReviewsPage'));
const CustomerPage = lazy(() => import('./admin/CustomerPage'));
const DiscountPage = lazy(() => import('./admin/DiscountPage'));
const VendorsPage = lazy(() => import('./admin/VendorsPage'));
const TransactionsPage = lazy(() => import('./admin/TransactionPage'));
const PaymentMethods = lazy(() => import('./admin/PaymentMethod'));
const SettingsPage = lazy(() => import('./admin/SettingsPage'));
const ProductInfo = lazy(() => import('./admin/ProductInfo'));
const CustomerProfile = lazy(() => import('./admin/CustomerProfile'));
const VendorProfile = lazy(() => import('./admin/VendorProfile'));
const AdminProfile = lazy(() => import('./admin/AdminProfile'));
const CategoriesTable = lazy(() => import('./admin/Cateogories/CategoriesTables'));

// Vendor Pages
const VendorLayout = lazy(() => import('./vendor/VendorLayout'));
const VendorDashboard = lazy(() => import('./vendor/VendorDashboard'));
const VendorProducts = lazy(() => import('./vendor/VendorProuducts'));

const VendorProductInfo = lazy(() => import('./vendor/VendorProductInfo'));
const VendorRevenue = lazy(() => import('./vendor/VendorRevenue'));
const VendorOrder = lazy(() => import('./vendor/VendorOrder'));
const VendorCategory = lazy(() => import('./vendor/VendorCateogories/VendorCategory'));
const VendorCategoriesTable = lazy(() => import('./vendor/VendorCateogories/VendorCategoriesTable'));
const VendorReviews = lazy(() => import('./vendor/VendorReviews'));
const VendorDiscount = lazy(() => import('./vendor/VendorDiscount'));
const VendorSetting = lazy(() => import('./vendor/VendorSetting'));
const VendorProfiles = lazy(() => import('./vendor/VendorProfiles'));

// Error Pages
const PageNotFound = lazy(() => import('./Errors/PageNotFound'));

// Loading fallback for lazy loading
export const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);




const App = () => {



  return (


  
      <Routes>
       <Route path="/" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><HomePage /></Suspense></LayoutPage>} />
      <Route path="/homepage" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><HomePage /></Suspense></LayoutPage>} />
      <Route path="/product/:productId" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><SingleProduct /></Suspense></LayoutPage>} />
      
      {/* Protected routes that require login */}
      <Route element={<ProtectedRoute allowedRoles={['User']} />}>
        <Route path="/cart" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><CartPage /></Suspense></LayoutPage>} />
        <Route path="/checkout/:userId" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><CheckoutForm /></Suspense></LayoutPage>} />
        <Route path="/userProfile/:userId" element={<LayoutPage><Suspense fallback={<LoadingFallback />}><UserProfile /></Suspense></LayoutPage>} />
      </Route>

      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LayoutPage>
              <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense>
            </LayoutPage>
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/register"
        element={
          <RedirectIfAuthenticated>
            <LayoutPage>
              <Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense>
            </LayoutPage>
          </RedirectIfAuthenticated>
        }
      />

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<Layout />} >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="shipments" element={<ShipmentPage />} />
            <Route path="product-prices" element={<ProductPrice />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="discounts" element={<DiscountPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="payments" element={<PaymentMethods />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="product-add" element={<ProductInfo />} />
            <Route path="product-info/:productId" element={<ProductInfo />} />
            <Route path="user-profile/:userId" element={<CustomerProfile />} />
            <Route path="vendor-profile/:userId" element={<VendorProfile />} />
            <Route path="admin-profile" element={<AdminProfile />} />
           
            <Route path="products/subcategory/:subcategoryName" element={<CategoriesTable />} />
          </Route>
        </Route>

        {/* Vendor protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
          <Route path="/vendor" element={<VendorLayout />} >
            <Route index element={<VendorDashboard />} />
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products-info" element={<VendorProductInfo />} />
            <Route path="products-info/:productId" element={<VendorProductInfo />} />
            <Route path="revenues" element={<VendorRevenue />} />
            <Route path="orders" element={<VendorOrder />} />
            <Route path="categories" element={<VendorCategory />} />
            <Route path="category/:categoryName" element={<VendorCategoriesTable />} />
            <Route path="subcategories/:subcategoryName" element={<VendorCategoriesTable />} />
            <Route path="reviews" element={<VendorReviews />} />
            <Route path="discounts" element={<VendorDiscount />} />
            <Route path="setting" element={<VendorSetting />} />
            <Route path="profile" element={<VendorProfiles />} />
          </Route>
        </Route>

        {/* Catch all - 404 */}
        <Route path="/404" element={<Suspense fallback={<LoadingFallback />}><PageNotFound /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<LoadingFallback />}><PageNotFound /></Suspense>} />
      </Routes>
    

  );
};

export default App;






