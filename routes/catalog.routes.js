const {Router} = require('express')

const router = Router()


// /api/products
router.get(
  '/products',
  async (req, res) => {
    try {
      res.json({
        onetwo: 'Some data here!'
      })
    } catch (error) {
      res.status(500).json({message: 'Something went wrong, please try again'})
    }
  }
)


module.exports = router