const {Router} = require('express')
const User = require('../models/User')

const router = Router()

// /api/profile/data
router.get(
  '/data',
  async (req, res) => {
    const {id} = req.query

    try {
      const user = await User.findOne({_id: id})
      const {firstName, lastName, email, orders} = user

      res.json({firstName, lastName, email, orders})
      
    } catch (error) {
      res.status(500).json({message: 'Что-то пошло не так, пожалуйста, повторите попытку позже'})
    }
  }
)

module.exports = router