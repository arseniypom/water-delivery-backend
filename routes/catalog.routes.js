const {Router} = require('express')
const Product = require('../models/Product')

const router = Router()


// /api/products
router.get(
  '/products',
  async (req, res) => {
    const volume = req.query.volume;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.order;

    try {
      const query = Product.find({available: true})
      if (volume) {
        query.find({volume})
      }
      if (minPrice || maxPrice) {
        query.find({
          $and: [
            {currentPrice: { $gte: minPrice }},
            {currentPrice: { $lte: maxPrice }}
          ]
        })
      }
      if (sortBy === 'price') {
        switch (sortOrder) {
          case 'asc':
            query.sort({currentPrice: 'asc'})
            break;
          case 'desc':
            query.sort({$sort: {currentPrice: -1}})
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