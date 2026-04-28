import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number, // 👈 porque usas PostgreSQL para productos
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
})

const cartSchema = new mongoose.Schema({
  userId: {
    type: Number, // 👈 viene de PostgreSQL
    required: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
})

export default mongoose.model('Cart', cartSchema)