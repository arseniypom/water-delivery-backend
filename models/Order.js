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
  orderNumber: {type: Number, required: true},
  totalSum: {type: Number, required: true},
  status: {type: String, default: 'В обработке', required: true},
  date: {type: Date, default: Date.now, required: true},
})

module.exports = model('Order', schema)