const {Router} = require('express')
const config = require('config')
const Order = require('../models/Order')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

// /api/order/checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const {products, orderInfo, totalSum, date} = req.body
    const orderItems = await Object.entries(products).map((entriesArray) => {
      return {
        productId: entriesArray[0],
        productQuantity: entriesArray[1].itemQuantity
      }
    })

    const orderNumber = await Order.countDocuments({})
    const order = new Order({
      customerId: req.user.userId, orderItems, orderInfo, orderNumber, totalSum, date
    })

    await order.save()

    await User.findByIdAndUpdate(req.user.userId, { $push: {orders: order._id} }, {useFindAndModify: false})
    // await order.save().then(async () => {
    //   return await User.findByIdAndUpdate(req.user.userId, { $push: {orders: order._id} }, {useFindAndModify:false})
    // })

    res.status(201).json({order})

  } catch (error) {
    res.status(500).json({message: 'Something went wrong, please try again'})
  }
})

// /api/order/list
router.get('/list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    const {orders} = user

    const getOrderInfo = async (orderId) => {
      const order = await Order.findById(orderId)
      return order.orderItems
    }
    const getAllOrders = async () => {
      return Promise.all(orders.map(orderId => getOrderInfo(orderId)))
    }

    getAllOrders().then(ordersArray => {
      res.status(201).json(ordersArray)
    })

  } catch (error) {
    res.status(500).json({message: 'Something went wrong, please try again'})
  }
})

module.exports = router