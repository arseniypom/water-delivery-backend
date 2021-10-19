const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  customerId: {type: Types.ObjectId, required: true},
  orderItems: [{
    productId: Types.ObjectId,
    productQuantity: Number
  }],
  orderInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    address: String,
    postalCode: String
  },
  date: {type: Date, default: Date.now, required: true},
})

module.exports = model('Order', schema)