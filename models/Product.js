const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  title: {type: String, required: true},
  volume: {type: Number, required: true},
  quantityInPack: {type: Number, required: true},
  currentPrice: {type: Number, required: true},
  previousPrice: {type: Number},
  imageName: {type: String, required: true},
  available: {type: Boolean, required: true}
})

module.exports = model('Product', schema)