const {Router} = require('express')
const Product = require('../models/Product')

const router = Router()


// /api/products
router.get(
  '/products',
  async (req, res) => {
    
    const {volume, minPrice, maxPrice, sortBy, sortOrder} = req.query

    try {
      const query = Product.find({available: true})
      if (volume) {
        query.find({volume})
      }
      if (minPrice) {
        query.find({currentPrice: { $gte: minPrice }})
      }
      if (maxPrice) {
        query.find({currentPrice: { $lte: maxPrice }})
      }
      if (sortBy === 'price') {
        switch (sortOrder) {
          case 'asc':
            query.sort({currentPrice: 'asc'})
            break;
          case 'desc':
            query.sort({currentPrice: 'desc'})
            break;
          default:
            break;
        }
      }
      const products = await query.exec()
      res.json(products)
    } catch (error) {
      res.status(500).json({message: 'Что-то пошло не так, пожалуйста, повторите попытку позже'})
    }
  }
)


module.exports = router