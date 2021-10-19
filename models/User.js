const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true, unique: true},
  password:{type: String, required: true},
  orders: [Types.ObjectId]
})

module.exports = model('User', schema)