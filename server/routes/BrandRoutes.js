import express from 'express';
import { createBrand, deleteBrand, getAllBrands, updateBrand } from '../controllers/Brand/BrandContoller.js';


const router = express.Router();

router.get('/brands', getAllBrands);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);

export default router;
