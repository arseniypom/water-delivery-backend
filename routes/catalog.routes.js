const {Router} = require('express')
const Product = require('../models/Product')

const router = Router()


// /api/products
router.get(
  '/products',
  async (req, res) => {
    try {
      const products = await Product.find({available: true})
      res.json(products)
    } catch (error) {
      res.status(500).json({message: 'Что-то пошло не так, пожалуйста, повторите попытку позже'})
    }
  }
)


module.exports = router