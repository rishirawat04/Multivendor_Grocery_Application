import express from 'express'
const router = express.Router()

// Import Routes
import authRoutes from './userRoute.js'
import adminRoutes from './adminRoute.js'
import vendorRoutes from './vendorRoutes.js'
import productRoutes from './productRoute.js'
import cartRoutes from './cartRoutes.js'
import favoriteRoutes from './FavoriteRoutes.js'
import categoryRoutes from './categoryRoute.js'
import subCategoryRoutes from './subCategoryRoute.js'
import searchRoutes from "./searchRoute.js"
import orderRoutes from './orderRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import discountRoutes from './discountRoute.js'
import brandRoutes from './BrandRoutes.js'




router.use('/users', authRoutes )
router.use('/admin', adminRoutes)
router.use('/vendor', vendorRoutes)
router.use('/products', productRoutes)
router.use('/', cartRoutes)
router.use('/', favoriteRoutes)
router.use('/', categoryRoutes)
router.use('/',subCategoryRoutes)
router.use('/', searchRoutes )
router.use('/orders', orderRoutes )
router.use('/review', reviewRoutes )
router.use('/coupon', discountRoutes )
router.use('/', brandRoutes )



export default router;