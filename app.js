const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({extended: true}))

const PORT = config.get('port') || 5000

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/order', require('./routes/order.routes'))
app.use('/api', require('./routes/catalog.routes'))


async function start() {
  try {
    await mongoose.connect(
      config.get('mongoUri'),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    )
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (error) {
    console.log('Server Error', error.message);
    process.exit(1)
  }
}

start()