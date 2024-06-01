const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' })

const port = process.env.PORT || 8000

// database url
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

// database connection
mongoose.connect(DB).then(() => console.log('DB Connection Successful!'))

// tours schema
const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
})

const Tour = mongoose.model('Tour', toursSchema)

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.6,
  price: 997,
})

testTour
  .save()
  .then((doc) => {
    console.log(doc)
  })
  .catch((err) => {
    console.log('Error:', err)
  })

app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port:${port}`)
})
